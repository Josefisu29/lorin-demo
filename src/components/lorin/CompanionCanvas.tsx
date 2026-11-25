import { useEffect, useRef } from "react";
import { FastForward, Sparkles, Volume2 } from "lucide-react";
import { useLorin } from "@/lib/lorin/store";
import { Face, faceCaption } from "./chrome";

interface CompanionCanvasProps {
  size?: number;
  interactive?: boolean;
}

export function CompanionCanvas({ size = 240, interactive = true }: CompanionCanvasProps) {
  const character = useLorin((s) => s.character);
  const voice = useLorin((s) => s.voice);
  const voiceSource = useLorin((s) => s.voiceSource);
  const quality = useLorin((s) => s.companionQuality);
  const enabled = useLorin((s) => s.companionEnabled);
  const activationStage = useLorin((s) => s.activationStage);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gazeRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled || quality === "2d-fallback") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let rafId = 0;
    let angle = 0;

    const particleCount = quality === "high" ? 36 : 18;
    const points: { theta: number; phi: number; radius: number }[] = [];
    for (let i = 0; i < particleCount; i++) {
      points.push({
        theta: (i / particleCount) * Math.PI * 2,
        phi: Math.acos(1 - (2 * (i + 0.5)) / particleCount),
        radius: size * 0.34,
      });
    }

    const render = () => {
      const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
      if (canvas.width !== size * dpr || canvas.height !== size * dpr) {
        canvas.width = size * dpr;
        canvas.height = size * dpr;
      }
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2 + gazeRef.current.x * 8;
      const cy = size / 2 + gazeRef.current.y * 8;

      const isSpeaking = voice === "speaking" || character === "speaking" || activationStage === 4;
      const isListening = voice === "listening" || character === "listening" || activationStage === 1 || activationStage === 3;
      const isBusy = character === "processing" || character === "researching" || character === "coding" || activationStage === 2;
      const isWarn = character === "error" || character === "offline";

      const primaryColor = isWarn
        ? "#f0a3a3"
        : isSpeaking || isListening
          ? "#66e3cb"
          : isBusy
            ? "#a9b8ff"
            : "#66e3cb";

      const speed = reducedMotion ? 0 : isSpeaking ? 0.032 : isBusy ? 0.025 : isListening ? 0.016 : 0.008;
      angle += speed;

      const pulse = isSpeaking
        ? 1 + Math.sin(angle * 7) * 0.12
        : isListening
          ? 1 + Math.sin(angle * 4) * 0.06
          : 1;

      // Ambient radial aura
      const grad = ctx.createRadialGradient(cx, cy, size * 0.04, cx, cy, size * 0.46);
      grad.addColorStop(0, `${primaryColor}38`);
      grad.addColorStop(0.55, "#a9b8ff14");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.46, 0, Math.PI * 2);
      ctx.fill();

      // 3D projected orbital rings
      const drawRing = (radius: number, tiltX: number, tiltY: number, stroke: string) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(tiltY + angle * 0.6);
        ctx.scale(1, Math.max(0.28, Math.cos(tiltX)));
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.arc(0, 0, radius * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      };

      drawRing(size * 0.36, 0.85, 0.4, `${primaryColor}66`);
      drawRing(size * 0.32, 1.1, -0.7, "#a9b8ff55");
      if (quality === "high") {
        drawRing(size * 0.4, 0.55, 1.2, `${primaryColor}33`);
      }

      // 3D sphere lattice points
      const fov = size * 0.95;
      for (const pt of points) {
        const t = pt.theta + angle;
        const x3d = pt.radius * Math.sin(pt.phi) * Math.cos(t);
        const y3d = pt.radius * Math.cos(pt.phi);
        const z3d = pt.radius * Math.sin(pt.phi) * Math.sin(t);

        const scale = fov / (fov + z3d + size * 0.45);
        const x2d = cx + x3d * scale;
        const y2d = cy + y3d * scale;
        const alpha = Math.max(0.18, Math.min(0.95, (z3d + pt.radius) / (2 * pt.radius)));

        ctx.fillStyle = z3d > 0 ? primaryColor : "#a9b8ff";
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x2d, y2d, Math.max(1.3, 2.6 * scale), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Core presence lens & lip-sync waveform ring
      const coreR = size * 0.145 * pulse;
      ctx.fillStyle = "#0b0f14";
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Gaze-reactive iris / optical focus
      const eyeX = cx + gazeRef.current.x * 6;
      const eyeY = cy + gazeRef.current.y * 6;
      ctx.fillStyle = primaryColor;
      ctx.font = `600 ${Math.round(size * 0.11)}px "Space Grotesk", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("L", eyeX, eyeY);

      ctx.restore();
      if (!reducedMotion) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    render();
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [character, voice, quality, enabled, size, activationStage]);

  const caption = faceCaption(character, voice, voiceSource);

  if (!enabled || quality === "2d-fallback") {
    return <Face state={character} caption={`${caption} · 2D fallback`} size="large" />;
  }

  return (
    <div
      className="flex flex-col items-center gap-3"
      onMouseMove={(e) => {
        if (!interactive) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        gazeRef.current = { x: Math.max(-1, Math.min(1, nx)), y: Math.max(-1, Math.min(1, ny)) };
      }}
      onMouseLeave={() => {
        gazeRef.current = { x: 0, y: 0 };
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="rounded-full"
        aria-label={`LORIN 3D holographic companion (${caption})`}
        role="img"
      />
      <p className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted">
        <span className={`status-dot ${voice === "listening" || voice === "speaking" ? "status-dot-live" : ""}`} />
        <span>{caption} · 3D {quality}</span>
      </p>
    </div>
  );
}

const STAGE_DETAILS: Record<1 | 2 | 3 | 4, { title: string; subtitle: string }> = {
  1: {
    title: "Stage 1 — Wake phrase detected",
    subtitle: "Local wake detector triggered. Validating microphone state and preserving spoken context.",
  },
  2: {
    title: "Stage 2 — Companion emergence",
    subtitle: "Transitioning LORIN visual presence from idle standby into active workspace focus.",
  },
  3: {
    title: "Stage 3 — Presence established",
    subtitle: "Optical gaze aligned and local workspace context synchronized.",
  },
  4: {
    title: "Stage 4 — Greeting & command dispatch",
    subtitle: "Delivering context-aware greeting and executing any preserved wake-phrase instruction.",
  },
};

export function ActivationIntroOverlay() {
  const stage = useLorin((s) => s.activationStage);
  const greeting = useLorin((s) => s.activationGreeting);
  const preserved = useLorin((s) => s.pendingWakeCommand);
  const skip = useLorin((s) => s.skipActivationIntro);

  if (stage === 0) return null;
  const info = STAGE_DETAILS[stage];

  return (
    <div
      className="command-palette-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="LORIN 5-second activation sequence"
      data-testid="activation-intro-overlay"
    >
      <div className="lorin-panel w-full max-w-lg items-center text-center shadow-2xl">
        <div className="flex w-full items-center justify-between gap-2 border-b border-line pb-3">
          <span className="lorin-badge lorin-badge-teal">
            <Sparkles size={11} className="mr-1" /> 5s Companion Activation · Stage {stage} / 4
          </span>
          <button
            type="button"
            className="action-button action-button-secondary"
            onClick={skip}
          >
            <FastForward size={14} />
            <span>Skip introduction</span>
          </button>
        </div>

        <div className="my-4">
          <CompanionCanvas size={190} />
        </div>

        <h2 className="font-display text-xl font-semibold">{info.title}</h2>
        <p className="mt-1.5 max-w-md text-xs leading-relaxed text-muted">{info.subtitle}</p>

        <div className="audio-meter mt-4 w-full">
          <span style={{ transform: `scaleX(${stage / 4})` }} />
        </div>

        {preserved && (
          <div className="mt-4 w-full rounded-control border border-teal/30 bg-bg p-3 text-left text-xs">
            <p className="font-semibold text-teal">Preserved wake command (§2.6):</p>
            <p className="mt-1 font-mono text-fg">“{preserved}”</p>
          </div>
        )}

        {greeting && (
          <div className="mt-3 flex w-full items-start gap-2 rounded-control border border-line bg-elevated p-3 text-left text-xs">
            <Volume2 size={15} className="mt-0.5 shrink-0 text-teal" />
            <p className="leading-relaxed text-fg">{greeting}</p>
          </div>
        )}
      </div>
    </div>
  );
}
