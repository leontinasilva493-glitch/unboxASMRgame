import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";

test("Clarity bootstrap queues events and requests the configured project script", async () => {
  let clarityModule;
  try {
    clarityModule = await import("../lib/clarity.mjs");
  } catch {
    clarityModule = null;
  }
  assert.ok(clarityModule, "Clarity bootstrap module is required");

  const insertedScripts = [];
  const firstScript = { parentNode: { insertBefore(script) { insertedScripts.push(script); } } };
  const sandbox = {
    window: {},
    document: {
      createElement: () => ({}),
      getElementsByTagName: () => [firstScript],
    },
  };

  vm.runInNewContext(clarityModule.buildClarityBootstrap("xwv6r6wgv4"), sandbox);
  sandbox.window.clarity("event", "table_filter_use");

  assert.equal(typeof sandbox.window.clarity, "function");
  assert.equal(JSON.stringify(Array.from(sandbox.window.clarity.q[0])), '["event","table_filter_use"]');
  assert.equal(insertedScripts.length, 1);
  assert.equal(insertedScripts[0].async, true);
  assert.equal(insertedScripts[0].src, "https://www.clarity.ms/tag/xwv6r6wgv4");
});
