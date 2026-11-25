import test from "node:test";
import assert from "node:assert/strict";
import {
  classifyPressure,
  computeMemoryPressurePct,
  createUnavailableBattery,
  DEFAULT_PRESSURE_THRESHOLDS,
  formatBatteryStatus,
  getHardwareInfo,
  sanitizePlatformLabel,
} from "./hardware";

test("classifyPressure classifies normal, elevated, critical, and unknown tiers accurately", () => {
  assert.equal(classifyPressure(null), "unknown");
  assert.equal(classifyPressure(undefined), "unknown");
  assert.equal(classifyPressure(Number.NaN), "unknown");
  assert.equal(classifyPressure(0), "normal");
  assert.equal(classifyPressure(74.9), "normal");
  assert.equal(classifyPressure(DEFAULT_PRESSURE_THRESHOLDS.warning), "elevated");
  assert.equal(classifyPressure(89.9), "elevated");
  assert.equal(classifyPressure(DEFAULT_PRESSURE_THRESHOLDS.critical), "critical");
  assert.equal(classifyPressure(95), "critical");
  assert.equal(classifyPressure(120), "critical");
});

test("computeMemoryPressurePct calculates bounded percentages and guards invalid inputs", () => {
  assert.equal(computeMemoryPressurePct(512, 1024), 50);
  assert.equal(computeMemoryPressurePct(922, 1024), 90);
  assert.equal(computeMemoryPressurePct(2048, 1024), 100);
  assert.equal(computeMemoryPressurePct(0, 1024), 0);
  assert.equal(computeMemoryPressurePct(-10, 1024), null);
  assert.equal(computeMemoryPressurePct(512, 0), null);
  assert.equal(computeMemoryPressurePct(null, 1024), null);
});

test("sanitizePlatformLabel reduces platform strings to broad OS families without identifiers", () => {
  assert.equal(sanitizePlatformLabel("Win32"), "Windows");
  assert.equal(sanitizePlatformLabel("MacIntel"), "macOS");
  assert.equal(sanitizePlatformLabel("Linux x86_64"), "Linux");
  assert.equal(sanitizePlatformLabel("Android 15; Pixel 9"), "Android");
  assert.equal(sanitizePlatformLabel(undefined), "Unknown");
  assert.equal(sanitizePlatformLabel("CustomUnlistedOS"), "Unknown");
});

test("formatBatteryStatus formats charging, discharging, and unavailable states clearly", () => {
  assert.equal(formatBatteryStatus(createUnavailableBattery()), "Unavailable");
  assert.equal(
    formatBatteryStatus({
      supported: true,
      levelPct: 84,
      charging: true,
      chargingTimeSec: 1200,
      dischargingTimeSec: null,
    }),
    "84% · Charging",
  );
  assert.equal(
    formatBatteryStatus({
      supported: true,
      levelPct: 41,
      charging: false,
      chargingTimeSec: null,
      dischargingTimeSec: 7200,
    }),
    "41% · On battery",
  );
});

test("getHardwareInfo returns truthful, sanitized defaults without fabricating unavailable telemetry", () => {
  const info = getHardwareInfo();
  assert.equal(info.verified, false);
  assert.equal(info.source, "browser-safe");
  assert.equal(info.vramGb, "Unknown");
  assert.equal(info.diskFreeGb, "Unknown");
  assert.equal(info.diskTotalGb, "Unknown");
  assert.equal(info.ramFreeGb, "Unknown");
  assert.equal(info.battery.supported, false);
  assert.ok(info.lastCheckedAt.length > 0);
});
