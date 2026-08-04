import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

function isMissing(value) {
  return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
}

export function auditContent(requirements, collections, detectedAt = new Date().toISOString()) {
  const opportunities = [];
  const coverage = [];
  let emptyCollectionCount = 0;
  let incompleteRecordCount = 0;

  for (const page of requirements.pages) {
    for (const requirement of page.collections) {
      const records = collections[requirement.id] ?? [];
      const fieldCount = requirement.requiredFields.length;
      let presentFieldCount = 0;
      let completeRecords = 0;

      if (records.length === 0) {
        emptyCollectionCount += 1;
        opportunities.push({
          route: page.route,
          collection: requirement.id,
          dataFile: requirement.dataFile,
          type: "empty_collection",
          recordSlug: null,
          missingFields: requirement.requiredFields,
          captureInstruction: requirement.captureInstruction,
          detectedAt,
          status: "needs_capture",
        });
      }

      for (const record of records) {
        const missingFields = requirement.requiredFields.filter((field) => isMissing(record[field]));
        presentFieldCount += fieldCount - missingFields.length;
        if (missingFields.length === 0) {
          completeRecords += 1;
          continue;
        }
        incompleteRecordCount += 1;
        opportunities.push({
          route: page.route,
          collection: requirement.id,
          dataFile: requirement.dataFile,
          type: "incomplete_record",
          recordSlug: record.slug ?? record.code ?? null,
          missingFields,
          captureInstruction: requirement.captureInstruction,
          detectedAt,
          status: "needs_capture",
        });
      }

      const possibleFieldCount = records.length * fieldCount;
      coverage.push({
        route: page.route,
        collection: requirement.id,
        label: requirement.label,
        dataFile: requirement.dataFile,
        recordCount: records.length,
        completeRecords,
        incompleteRecords: records.length - completeRecords,
        completionPercent: possibleFieldCount ? Math.round((presentFieldCount / possibleFieldCount) * 100) : 0,
      });
    }
  }

  return {
    generatedAt: detectedAt,
    requirementsVersion: requirements.version,
    summary: {
      totalOpportunities: opportunities.length,
      emptyCollectionCount,
      incompleteRecordCount,
      pagesAffected: new Set(opportunities.map((item) => item.route)).size,
    },
    coverage,
    opportunities,
  };
}

function renderCapturePlan(audit) {
  const lines = [
    "# 当前版本游戏内采集计划",
    "",
    `生成时间：${audit.generatedAt}`,
    `受影响页面：${audit.summary.pagesAffected}；空数据集：${audit.summary.emptyCollectionCount}；不完整记录：${audit.summary.incompleteRecordCount}`,
    "",
  ];
  for (const item of audit.opportunities) {
    lines.push(`## ${item.route} · ${item.collection}${item.recordSlug ? ` · ${item.recordSlug}` : ""}`);
    lines.push("");
    lines.push(`- 数据文件：\`${item.dataFile}\``);
    lines.push(`- 缺失字段：${item.missingFields.map((field) => `\`${field}\``).join("、")}`);
    lines.push(`- 采集动作：${item.captureInstruction}`);
    lines.push(`- 当前状态：${item.status}`);
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

function renderCoverageSummary(audit) {
  const lines = [
    "# 内页内容覆盖度",
    "",
    `生成时间：${audit.generatedAt}`,
    "",
    "| 内页 | 数据集 | 记录数 | 完整记录 | 不完整记录 | 字段完成度 |",
    "| --- | --- | ---: | ---: | ---: | ---: |",
    ...audit.coverage.map((item) => `| ${item.route} | ${item.label} | ${item.recordCount} | ${item.completeRecords} | ${item.incompleteRecords} | ${item.completionPercent}% |`),
    "",
    "> 完成度只表示必需字段是否存在，不代表事实已经通过游戏内证据审核。",
    "",
  ];
  return lines.join("\n");
}

export async function writeContentAudit(outputDir, audit) {
  const opportunitiesFile = path.join(outputDir, "content-opportunities.json");
  const capturePlanFile = path.join(outputDir, "capture-plan.md");
  const coverageSummaryFile = path.join(outputDir, "content-coverage-summary.md");
  await Promise.all([
    writeFile(opportunitiesFile, `${JSON.stringify(audit.opportunities, null, 2)}\n`, "utf8"),
    writeFile(capturePlanFile, renderCapturePlan(audit), "utf8"),
    writeFile(coverageSummaryFile, renderCoverageSummary(audit), "utf8"),
  ]);
  return { opportunitiesFile, capturePlanFile, coverageSummaryFile };
}

export async function runContentAudit(root, outputDir, detectedAt) {
  const requirements = JSON.parse(await readFile(path.join(root, "monitoring", "content-requirements.json"), "utf8"));
  const collections = {};
  for (const page of requirements.pages) {
    for (const requirement of page.collections) {
      if (collections[requirement.id]) continue;
      collections[requirement.id] = JSON.parse(await readFile(path.join(root, requirement.dataFile), "utf8"));
    }
  }
  const audit = auditContent(requirements, collections, detectedAt);
  const files = await writeContentAudit(outputDir, audit);
  return { ...audit, files };
}
