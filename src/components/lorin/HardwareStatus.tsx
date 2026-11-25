import {
  AlertTriangle,
  Battery,
  BatteryCharging,
  BatteryWarning,
  CircleAlert,
  Cpu,
  Database,
  HardDrive,
  Laptop,
  RefreshCw,
} from "lucide-react";
import {
  classifyPressure,
  DEFAULT_PRESSURE_THRESHOLDS,
  formatBatteryStatus,
  useHardwareInfo,
  type HardwareInfo,
  type PressureLevel,
} from "@/lib/lorin/hardware";

interface HardwareStatusProps {
  /** Optional snapshot override for deterministic inspection or companion telemetry. */
  overrideInfo?: HardwareInfo;
  /** Compact mode hides the secondary footer note when embedded in tight layouts. */
  compact?: boolean;
}

function pressureCellClass(level: PressureLevel): string {
  if (level === "critical") return "hardware-cell hardware-cell-critical";
  if (level === "elevated") return "hardware-cell hardware-cell-warning";
  return "hardware-cell";
}

function pressureMeterClass(level: PressureLevel): string {
  if (level === "critical") return "audio-meter audio-meter-critical";
  if (level === "elevated") return "audio-meter audio-meter-warning";
  return "audio-meter";
}

function pressureLabel(level: PressureLevel): string | null {
  if (level === "critical") return "Critical pressure (≥ 90%)";
  if (level === "elevated") return "High pressure (≥ 75%)";
  return null;
}

export function HardwareStatus({ overrideInfo, compact = false }: HardwareStatusProps) {
  const { info: detectedInfo, refresh, isRefreshing } = useHardwareInfo();
  const info = overrideInfo ?? detectedInfo;

  const cpuPressure = classifyPressure(info.cpuUsagePct, DEFAULT_PRESSURE_THRESHOLDS);
  const ramPressure = classifyPressure(info.ramUsagePct, DEFAULT_PRESSURE_THRESHOLDS);
  const batteryLow =
    info.battery.supported &&
    info.battery.levelPct !== null &&
    info.battery.levelPct <= 20 &&
    info.battery.charging !== true;

  const highAlerts: { label: string; level: PressureLevel; detail: string }[] = [];
  if (cpuPressure === "critical" || cpuPressure === "elevated") {
    highAlerts.push({
      label: "CPU",
      level: cpuPressure,
      detail: `CPU load at ${info.cpuUsagePct}% (${cpuPressure === "critical" ? "exceeds 90% critical threshold" : "exceeds 75% warning threshold"}).`,
    });
  }
  if (ramPressure === "critical" || ramPressure === "elevated") {
    highAlerts.push({
      label: "RAM",
      level: ramPressure,
      detail: `Memory pressure at ${info.ramUsagePct}% (${ramPressure === "critical" ? "exceeds 90% critical threshold" : "exceeds 75% warning threshold"}).`,
    });
  }

  const hasCritical = highAlerts.some((a) => a.level === "critical");
  const ramDisplayValue =
    info.ramTotalGb !== "Unknown"
      ? `${info.ramTotalGb} GB (approx.)`
      : info.ramUsedMb !== null && info.ramLimitMb !== null
        ? `${info.ramUsedMb} / ${info.ramLimitMb} MB heap`
        : "Unknown";

  const ramMeterRatio =
    info.ramUsagePct !== null ? Math.max(0.02, Math.min(1, info.ramUsagePct / 100)) : 0;

  const cpuMeterRatio =
    info.cpuUsagePct !== null ? Math.max(0.02, Math.min(1, info.cpuUsagePct / 100)) : 0;

  const batteryMeterRatio =
    info.battery.supported && info.battery.levelPct !== null
      ? Math.max(0.02, Math.min(1, info.battery.levelPct / 100))
      : 0;

  const BatteryIcon = info.battery.charging
    ? BatteryCharging
    : batteryLow
      ? BatteryWarning
      : Battery;

  return (
    <div className="flex flex-col gap-3" data-testid="hardware-status">
      {highAlerts.length > 0 && (
        <div
          role="alert"
          className={`hardware-alert-banner ${hasCritical ? "is-critical" : "is-warning"}`}
        >
          {hasCritical ? <CircleAlert size={16} className="shrink-0" /> : <AlertTriangle size={16} className="shrink-0" />}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold">
              {hasCritical ? "Critical resource pressure detected" : "Elevated resource pressure detected"}
            </p>
            <p className="mt-0.5 text-xs opacity-90">
              {highAlerts.map((item) => item.detail).join(" ")}
            </p>
          </div>
        </div>
      )}

      <div className="hardware-grid">
        {/* CPU cell */}
        <div className={pressureCellClass(cpuPressure)} data-pressure={cpuPressure}>
          <div className="flex items-center justify-between gap-2">
            <Cpu size={16} className={cpuPressure === "critical" ? "text-danger" : cpuPressure === "elevated" ? "text-signal" : "text-muted"} />
            {cpuPressure !== "unknown" && cpuPressure !== "normal" && (
              <span className={`hardware-status-tag ${cpuPressure === "critical" ? "is-critical" : "is-warning"}`}>
                {cpuPressure === "critical" ? <CircleAlert size={11} /> : <AlertTriangle size={11} />}
                <span>{pressureLabel(cpuPressure)}</span>
              </span>
            )}
          </div>
          <p className="mt-3 text-xs text-muted">Processor (CPU)</p>
          <p className="mt-1 text-sm font-semibold tabular-nums">{info.cpu}</p>
          {info.cpuUsagePct !== null ? (
            <div className="mt-2.5">
              <div className="flex items-center justify-between text-[11px] text-muted tabular-nums">
                <span>CPU utilization</span>
                <span>{info.cpuUsagePct}%</span>
              </div>
              <div
                className={`${pressureMeterClass(cpuPressure)} mt-1.5`}
                role="progressbar"
                aria-label="CPU utilization"
                aria-valuenow={info.cpuUsagePct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span style={{ transform: `scaleX(${cpuMeterRatio})` }} />
              </div>
            </div>
          ) : (
            <p className="mt-1.5 text-[11px] text-muted">
              Live CPU load requires trusted companion probe.
            </p>
          )}
        </div>

        {/* RAM cell with .audio-meter progress bar */}
        <div className={pressureCellClass(ramPressure)} data-pressure={ramPressure}>
          <div className="flex items-center justify-between gap-2">
            <Database size={16} className={ramPressure === "critical" ? "text-danger" : ramPressure === "elevated" ? "text-signal" : "text-muted"} />
            {ramPressure !== "unknown" && ramPressure !== "normal" && (
              <span className={`hardware-status-tag ${ramPressure === "critical" ? "is-critical" : "is-warning"}`}>
                {ramPressure === "critical" ? <CircleAlert size={11} /> : <AlertTriangle size={11} />}
                <span>{pressureLabel(ramPressure)}</span>
              </span>
            )}
          </div>
          <p className="mt-3 text-xs text-muted">System memory (RAM)</p>
          <p className="mt-1 text-sm font-semibold tabular-nums">{ramDisplayValue}</p>
          <div className="mt-2.5">
            <div className="flex items-center justify-between text-[11px] text-muted tabular-nums">
              <span>Memory pressure</span>
              <span>
                {info.ramUsagePct !== null
                  ? `${info.ramUsagePct}%${info.ramUsedMb !== null && info.ramLimitMb !== null ? ` · ${info.ramUsedMb}/${info.ramLimitMb} MB` : ""}`
                  : "Unmeasured"}
              </span>
            </div>
            <div
              className={`${pressureMeterClass(ramPressure)} mt-1.5`}
              role="progressbar"
              aria-label="Memory pressure"
              aria-valuenow={info.ramUsagePct ?? 0}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span style={{ transform: `scaleX(${ramMeterRatio})` }} />
            </div>
          </div>
        </div>

        {/* GPU cell */}
        <div className="hardware-cell">
          <Laptop size={16} className={info.gpuAvailable ? "text-teal" : "text-muted"} />
          <p className="mt-3 text-xs text-muted">Graphics (GPU)</p>
          <p className="mt-1 text-sm font-semibold">{info.gpuName}</p>
          <p className="mt-1.5 text-[11px] text-muted">
            VRAM: <span className="tabular-nums">{info.vramGb === "Unknown" ? "Unknown" : `${info.vramGb} GB`}</span>
          </p>
        </div>

        {/* Operating system & storage cell */}
        <div className="hardware-cell">
          <HardDrive size={16} className="text-muted" />
          <p className="mt-3 text-xs text-muted">Platform &amp; Storage</p>
          <p className="mt-1 text-sm font-semibold">{info.os}</p>
          <p className="mt-1.5 text-[11px] text-muted">
            Free disk: <span className="tabular-nums">{info.diskFreeGb === "Unknown" ? "Unknown (companion required)" : `${info.diskFreeGb} GB`}</span>
          </p>
        </div>

        {/* Battery status row spanning full grid width */}
        <div
          className={`hardware-cell hardware-cell-full ${batteryLow ? "hardware-cell-warning" : ""}`}
          data-testid="hardware-battery-row"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BatteryIcon size={16} className={batteryLow ? "text-signal" : info.battery.charging ? "text-teal" : "text-muted"} />
              <span className="text-xs text-muted">Battery &amp; Power</span>
            </div>
            <span className="text-sm font-semibold tabular-nums">
              {formatBatteryStatus(info.battery)}
            </span>
          </div>
          {info.battery.supported && info.battery.levelPct !== null ? (
            <div className="mt-2.5">
              <div
                className={`audio-meter ${batteryLow ? "audio-meter-warning" : ""}`}
                role="progressbar"
                aria-label="Battery charge level"
                aria-valuenow={info.battery.levelPct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span style={{ transform: `scaleX(${batteryMeterRatio})` }} />
              </div>
              <p className="mt-1.5 text-[11px] text-muted">
                {batteryLow
                  ? "Low battery charge — heavy local model inference may throttle."
                  : info.battery.charging
                    ? "Connected to power via browser Battery Status API."
                    : "Running on battery power via browser Battery Status API."}
              </p>
            </div>
          ) : (
            <p className="mt-1.5 text-[11px] text-muted">
              Battery Status API is not exposed by this browser or device.
            </p>
          )}
        </div>
      </div>

      {!compact && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span>{info.verified ? "Verified companion probe" : "Sanitized browser probe · No device identifiers"}</span>
            {info.lastCheckedAt && (
              <>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums" suppressHydrationWarning>
                  Checked {new Date(info.lastCheckedAt).toLocaleTimeString()}
                </span>
              </>
            )}
          </div>
          <button
            type="button"
            className="action-button action-button-secondary"
            onClick={() => void refresh()}
            disabled={isRefreshing}
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
            <span>{isRefreshing ? "Probing…" : "Refresh probe"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
