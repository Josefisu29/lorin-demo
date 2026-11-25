import assert from "node:assert/strict";
import test from "node:test";
import {
  getLivenessReport,
  getPrimaryNodeHealthReport,
  getReadinessReport,
  handleHealthRequest,
} from "./health";

test("getLivenessReport returns healthy Primary Node liveness metrics", () => {
  const fixedNow = new Date("2026-11-25T08:00:00.000Z");
  const report = getLivenessReport(fixedNow);

  assert.equal(report.ok, true);
  assert.equal(report.probe, "liveness");
  assert.equal(report.node, "lorin-primary-node");
  assert.equal(report.timestamp, "2026-11-25T08:00:00.000Z");
  assert.equal(typeof report.uptimeSeconds, "number");
  assert.equal(typeof report.memory.heapUsedBytes, "number");
  assert.ok(report.memory.heapUtilizationPct >= 0 && report.memory.heapUtilizationPct <= 100);
});

test("getReadinessReport truthfully reports required and unconfigured optional subsystems", () => {
  const fixedNow = new Date("2026-11-25T08:00:00.000Z");
  const report = getReadinessReport({ NODE_ENV: "production" }, fixedNow);

  assert.equal(report.ok, true);
  assert.equal(report.ready, true);
  assert.equal(report.probe, "readiness");
  assert.equal(report.environment.nodeEnv, "production");
  assert.equal(report.environment.tenantIsolation, "enforced");
  assert.equal(report.subsystems.primaryNodeCore.status, "ready");
  assert.equal(report.subsystems.localFirstSyncFabric.status, "ready");
  assert.equal(report.subsystems.cloudModelGateway.status, "not_configured");
  assert.equal(report.subsystems.localModelGateway.status, "not_configured");
});

test("getReadinessReport reflects configured database and model gateway environment variables", () => {
  const report = getReadinessReport({
    DATABASE_URL: "postgres://localhost:5432/lorin",
    GEMINI_API_KEY: "test-server-key",
    OLLAMA_HOST: "http://127.0.0.1:11434",
  });

  assert.equal(report.subsystems.relationalStore.status, "ready");
  assert.equal(report.subsystems.cloudModelGateway.status, "ready");
  assert.equal(report.subsystems.localModelGateway.status, "ready");
});

test("handleHealthRequest supports liveness, readiness, full probes, and rejects non-GET/HEAD methods", async () => {
  const livenessRes = handleHealthRequest({
    url: "http://127.0.0.1:8080/api/health?probe=liveness",
    req: { method: "GET" },
  });
  assert.equal(livenessRes.status, 200);
  assert.equal(livenessRes.headers.get("x-lorin-probe"), "liveness");
  const livenessJson = (await livenessRes.json()) as { probe: string; ok: boolean };
  assert.equal(livenessJson.probe, "liveness");
  assert.equal(livenessJson.ok, true);

  const readinessRes = handleHealthRequest({
    url: "http://127.0.0.1:8080/api/health/readiness",
    req: { method: "GET" },
  });
  assert.equal(readinessRes.status, 200);
  assert.equal(readinessRes.headers.get("x-lorin-probe"), "readiness");
  const readinessJson = (await readinessRes.json()) as { probe: string; ready: boolean };
  assert.equal(readinessJson.probe, "readiness");
  assert.equal(readinessJson.ready, true);

  const fullRes = handleHealthRequest({
    url: "http://127.0.0.1:8080/api/health",
    req: { method: "GET" },
  });
  assert.equal(fullRes.status, 200);
  const fullJson = (await fullRes.json()) as ReturnType<typeof getPrimaryNodeHealthReport>;
  assert.equal(fullJson.probe, "full");
  assert.equal(fullJson.live, true);
  assert.equal(fullJson.ready, true);

  const postRes = handleHealthRequest({
    url: "http://127.0.0.1:8080/api/health",
    req: { method: "POST" },
  });
  assert.equal(postRes.status, 405);
});
