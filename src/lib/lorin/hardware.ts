import { useCallback, useEffect, useState } from "react";

export type PressureLevel = "normal" | "elevated" | "critical" | "unknown";

export interface PressureThresholds {
  warning: number;
  critical: number;
}

export const DEFAULT_PRESSURE_THRESHOLDS: PressureThresholds = {
  warning: 75,
  critical: 90,
};

export interface BatteryInfo {
  supported: boolean;
  levelPct: number | null;
  charging: boolean | null;
  chargingTimeSec: number | null;
  dischargingTimeSec: number | null;
}

export interface HardwareInfo {
  cpu: string;
  cpuCores: number | null;
  cpuUsagePct: number | null;
  ramTotalGb: number | "Unknown";
  ramFreeGb: number | "Unknown";
  ramUsedMb: number | null;
  ramLimitMb: number | null;
  ramUsagePct: number | null;
  gpuAvailable: boolean;
  gpuName: string;
  vramGb: number | "Unknown";
  diskTotalGb: number | "Unknown";
  diskFreeGb: number | "Unknown";
  os: string;
  runtimeVersion: string;
  battery: BatteryInfo;
  verified: boolean;
  source: "browser-safe" | "companion-verified";
  lastCheckedAt: string;
}

interface BatteryManagerLike extends EventTarget {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
}

interface NavigatorWithSafeApis extends Navigator {
  deviceMemory?: number;
  getBattery?: () => Promise<BatteryManagerLike>;
  userAgentData?: {
    platform?: string;
  };
}

interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

/**
 * Classifies a numeric utilization percentage into a semantic pressure tier.
 * Values >= critical (default 90%) trigger critical alert styling;
 * values >= warning (default 75%) trigger elevated/warning styling.
 */
export function classifyPressure(
  percent: number | null | undefined,
  thresholds: PressureThresholds = DEFAULT_PRESSURE_THRESHOLDS,
): PressureLevel {
  if (typeof percent !== "number" || !Number.isFinite(percent)) return "unknown";
  const clamped = Math.max(0, Math.min(100, percent));
  if (clamped >= thresholds.critical) return "critical";
  if (clamped >= thresholds.warning) return "elevated";
  return "normal";
}

/**
 * Safely computes a bounded 0..100 integer percentage from byte figures.
 */
export function computeMemoryPressurePct(
  usedBytes: number | null | undefined,
  limitBytes: number | null | undefined,
): number | null {
  if (
    typeof usedBytes !== "number" ||
    typeof limitBytes !== "number" ||
    !Number.isFinite(usedBytes) ||
    !Number.isFinite(limitBytes) ||
    limitBytes <= 0 ||
    usedBytes < 0
  ) {
    return null;
  }
  return Math.max(0, Math.min(100, Math.round((usedBytes / limitBytes) * 100)));
}

/**
 * Formats a sanitized OS family label without exposing raw User-Agent strings
 * or fingerprinting identifiers.
 */
export function sanitizePlatformLabel(rawPlatform: string | undefined): string {
  if (!rawPlatform) return "Unknown";
  const lower = rawPlatform.toLowerCase();
  if (lower.includes("win")) return "Windows";
  if (lower.includes("mac")) return "macOS";
  if (lower.includes("linux")) return "Linux";
  if (lower.includes("android")) return "Android";
  if (lower.includes("iphone") || lower.includes("ipad") || lower.includes("ios")) return "iOS";
  if (lower.includes("cros")) return "ChromeOS";
  return "Unknown";
}

/**
 * Formats BatteryInfo into a clear human-readable status string.
 */
export function formatBatteryStatus(battery: BatteryInfo): string {
  if (!battery.supported || battery.levelPct === null) {
    return "Unavailable";
  }
  const state =
    battery.charging === true
      ? "Charging"
      : battery.charging === false
        ? "On battery"
        : "Detected";
  return `${battery.levelPct}% · ${state}`;
}

export function createUnavailableBattery(): BatteryInfo {
  return {
    supported: false,
    levelPct: null,
    charging: null,
    chargingTimeSec: null,
    dischargingTimeSec: null,
  };
}

function readSafeMemoryMetrics(): {
  ramTotalGb: number | "Unknown";
  ramUsedMb: number | null;
  ramLimitMb: number | null;
  ramUsagePct: number | null;
} {
  const nav = typeof navigator !== "undefined" ? (navigator as NavigatorWithSafeApis) : undefined;
  const deviceMem =
    nav && typeof nav.deviceMemory === "number" && Number.isFinite(nav.deviceMemory) && nav.deviceMemory > 0
      ? nav.deviceMemory
      : "Unknown";

  const perf = typeof performance !== "undefined" ? (performance as PerformanceWithMemory) : undefined;
  const heap = perf?.memory;
  if (heap && heap.jsHeapSizeLimit > 0 && heap.usedJSHeapSize >= 0) {
    const usedMb = Math.round(heap.usedJSHeapSize / (1024 * 1024));
    const limitMb = Math.round(heap.jsHeapSizeLimit / (1024 * 1024));
    const pct = computeMemoryPressurePct(heap.usedJSHeapSize, heap.jsHeapSizeLimit);
    return {
      ramTotalGb: deviceMem,
      ramUsedMb: usedMb,
      ramLimitMb: limitMb,
      ramUsagePct: pct,
    };
  }

  return {
    ramTotalGb: deviceMem,
    ramUsedMb: null,
    ramLimitMb: null,
    ramUsagePct: null,
  };
}

/**
 * Returns sanitized hardware information safe for frontend UI consumption.
 * Uses only privacy-safe browser APIs (hardwareConcurrency, coarse deviceMemory,
 * WebGPU feature presence, sanitized OS family, optional JS heap bounds).
 * Avoids sensitive device identifiers and never invents companion-only telemetry.
 */
export function getHardwareInfo(battery: BatteryInfo = createUnavailableBattery()): HardwareInfo {
  const hasNavigator = typeof navigator !== "undefined";
  const nav = hasNavigator ? (navigator as NavigatorWithSafeApis) : undefined;

  const rawCores = nav?.hardwareConcurrency;
  const cpuCores =
    typeof rawCores === "number" && Number.isFinite(rawCores) && rawCores > 0
      ? Math.floor(rawCores)
      : null;

  const memory = readSafeMemoryMetrics();
  const gpuAvailable = Boolean(nav && "gpu" in nav);
  const platformRaw = nav?.userAgentData?.platform || nav?.platform;

  return {
    cpu: cpuCores ? `${cpuCores} logical cores` : "Unknown",
    cpuCores,
    cpuUsagePct: null,
    ramTotalGb: memory.ramTotalGb,
    ramFreeGb: "Unknown",
    ramUsedMb: memory.ramUsedMb,
    ramLimitMb: memory.ramLimitMb,
    ramUsagePct: memory.ramUsagePct,
    gpuAvailable,
    gpuName: gpuAvailable ? "WebGPU API detected" : "Unavailable / Unverified",
    vramGb: "Unknown",
    diskTotalGb: "Unknown",
    diskFreeGb: "Unknown",
    os: sanitizePlatformLabel(platformRaw),
    runtimeVersion: "Browser sandbox (Companion disconnected)",
    battery,
    verified: false,
    source: "browser-safe",
    lastCheckedAt: new Date().toISOString(),
  };
}

/**
 * Safely queries the Battery Status API if supported by the current browser.
 * Never throws or exposes hardware identifiers.
 */
export async function getBatteryInfo(): Promise<BatteryInfo> {
  if (typeof navigator === "undefined") return createUnavailableBattery();
  const nav = navigator as NavigatorWithSafeApis;
  if (typeof nav.getBattery !== "function") return createUnavailableBattery();

  try {
    const manager = await nav.getBattery();
    if (!manager || typeof manager.level !== "number" || !Number.isFinite(manager.level)) {
      return createUnavailableBattery();
    }
    const levelPct = Math.max(0, Math.min(100, Math.round(manager.level * 100)));
    return {
      supported: true,
      levelPct,
      charging: typeof manager.charging === "boolean" ? manager.charging : null,
      chargingTimeSec: Number.isFinite(manager.chargingTime) ? manager.chargingTime : null,
      dischargingTimeSec: Number.isFinite(manager.dischargingTime) ? manager.dischargingTime : null,
    };
  } catch {
    return createUnavailableBattery();
  }
}

/**
 * Safe SSR-friendly initial snapshot so server and client first paint match
 * identically before client-side probe hydration runs.
 */
const INITIAL_SSR_HARDWARE_INFO: HardwareInfo = {
  cpu: "Unknown",
  cpuCores: null,
  cpuUsagePct: null,
  ramTotalGb: "Unknown",
  ramFreeGb: "Unknown",
  ramUsedMb: null,
  ramLimitMb: null,
  ramUsagePct: null,
  gpuAvailable: false,
  gpuName: "Unknown",
  vramGb: "Unknown",
  diskTotalGb: "Unknown",
  diskFreeGb: "Unknown",
  os: "Unknown",
  runtimeVersion: "Browser sandbox (Companion disconnected)",
  battery: createUnavailableBattery(),
  verified: false,
  source: "browser-safe",
  lastCheckedAt: "",
};

/**
 * React hook that safely probes browser hardware capabilities and Battery Status API
 * on mount and subscribes to live battery updates where supported.
 */
export function useHardwareInfo() {
  const [info, setInfo] = useState<HardwareInfo>(INITIAL_SSR_HARDWARE_INFO);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const battery = await getBatteryInfo();
      setInfo(getHardwareInfo(battery));
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let batteryManager: BatteryManagerLike | null = null;

    const readFromManager = (manager: BatteryManagerLike): BatteryInfo => ({
      supported: true,
      levelPct: Math.max(0, Math.min(100, Math.round(manager.level * 100))),
      charging: typeof manager.charging === "boolean" ? manager.charging : null,
      chargingTimeSec: Number.isFinite(manager.chargingTime) ? manager.chargingTime : null,
      dischargingTimeSec: Number.isFinite(manager.dischargingTime) ? manager.dischargingTime : null,
    });

    const handleBatteryChange = () => {
      if (cancelled || !batteryManager) return;
      setInfo(getHardwareInfo(readFromManager(batteryManager)));
    };

    // Immediate safe synchronous read first
    setInfo(getHardwareInfo());

    const nav = typeof navigator !== "undefined" ? (navigator as NavigatorWithSafeApis) : undefined;
    if (nav && typeof nav.getBattery === "function") {
      nav
        .getBattery()
        .then((manager) => {
          if (cancelled || !manager) return;
          batteryManager = manager;
          setInfo(getHardwareInfo(readFromManager(manager)));
          manager.addEventListener("levelchange", handleBatteryChange);
          manager.addEventListener("chargingchange", handleBatteryChange);
        })
        .catch(() => {
          // Battery Status API denied or unavailable; leave as unsupported
        });
    }

    return () => {
      cancelled = true;
      if (batteryManager) {
        batteryManager.removeEventListener("levelchange", handleBatteryChange);
        batteryManager.removeEventListener("chargingchange", handleBatteryChange);
      }
    };
  }, []);

  return { info, refresh, isRefreshing };
}

// Backwards-compatible alias
export const getClientHardwareInfo = getHardwareInfo;
