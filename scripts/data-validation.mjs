const isValidDate = (value) => Boolean(value) && !Number.isNaN(new Date(value).getTime());

function validateUniqueSlugs(name, records, errors) {
  const seen = new Set();
  for (const record of records) {
    if (!record.slug) continue;
    if (seen.has(record.slug)) errors.push(`${name}: duplicate slug "${record.slug}"`);
    seen.add(record.slug);
  }
}

function validateEvidence(recordLabel, evidence, errors) {
  for (const item of evidence ?? []) {
    if (!isValidDate(item.verifiedAt)) errors.push(`${recordLabel}: evidence has invalid verifiedAt`);
    if (item.sourceUrl) {
      try {
        new URL(item.sourceUrl);
      } catch {
        errors.push(`${recordLabel}: evidence has invalid source URL`);
      }
    }
    if (item.status === "in_game_verified" && !item.screenshot && !item.notes) {
      errors.push(`${recordLabel}: in_game_verified evidence needs a screenshot or explicit notes`);
    }
  }
}

export function validateDataCollections(collections) {
  const errors = [];
  const events = collections.events ?? [];
  const codes = collections.codes ?? [];
  const gamepasses = collections.gamepasses ?? [];
  const crates = collections.crates ?? [];
  const toys = collections.toys ?? [];

  for (const [name, records] of Object.entries({ events, gamepasses, crates, toys })) {
    validateUniqueSlugs(name, records, errors);
  }

  for (const event of events) {
    if (!isValidDate(event.startsAt)) errors.push(`event ${event.slug}: invalid startsAt`);
    if (event.endsAt && !isValidDate(event.endsAt)) errors.push(`event ${event.slug}: invalid endsAt`);
    if (isValidDate(event.startsAt) && isValidDate(event.endsAt) && new Date(event.endsAt) <= new Date(event.startsAt)) {
      errors.push(`event ${event.slug}: ends before it starts`);
    }
    validateEvidence(`event ${event.slug}`, event.evidence, errors);
  }

  for (const code of codes) {
    if (code.status === "active" && (!isValidDate(code.checkedAt) || !(code.evidence?.length))) {
      errors.push(`active code ${code.code}: checkedAt and evidence are required`);
    }
    validateEvidence(`code ${code.code}`, code.evidence, errors);
  }

  for (const pass of gamepasses) {
    const unverified = (pass.evidence ?? []).every((item) => item.status === "unverified");
    if (pass.verdict && unverified) errors.push(`unverified gamepass ${pass.slug}: verdict is not allowed`);
    validateEvidence(`gamepass ${pass.slug}`, pass.evidence, errors);
  }

  const crateSlugs = new Set(crates.map((crate) => crate.slug));
  for (const toy of toys) {
    for (const crateId of toy.sourceCrateIds ?? []) {
      if (!crateSlugs.has(crateId)) errors.push(`toy ${toy.slug}: references unknown crate "${crateId}"`);
    }
    validateEvidence(`toy ${toy.slug}`, toy.evidence, errors);
  }

  for (const crate of crates) validateEvidence(`crate ${crate.slug}`, crate.evidence, errors);
  return errors;
}
