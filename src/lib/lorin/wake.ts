export type WakeListenerState =
  | "disabled"
  | "permission_required"
  | "permission_denied"
  | "preparing"
  | "foreground_listening"
  | "background_listening"
  | "wake_detected"
  | "activating"
  | "command_recognition"
  | "processing"
  | "speaking"
  | "interrupted"
  | "paused"
  | "unavailable"
  | "error";

export type ActivationStage = 0 | 1 | 2 | 3 | 4;

export interface WakePhraseConfig {
  id: string;
  phrase: string;
  enabled: boolean;
  builtIn?: boolean;
}

export const DEFAULT_WAKE_PHRASES: WakePhraseConfig[] = [
  { id: "wp-1", phrase: "Hey LORIN", enabled: true, builtIn: true },
  { id: "wp-2", phrase: "LORIN, are you there?", enabled: true, builtIn: true },
  { id: "wp-3", phrase: "LORIN, let's get to work", enabled: true, builtIn: true },
  { id: "wp-4", phrase: "LORIN, can you check this?", enabled: true, builtIn: true },
  { id: "wp-5", phrase: "LORIN, I need your help", enabled: true, builtIn: true },
];

export type WakeIntentKind =
  | "wake_only"
  | "availability_check"
  | "work_session"
  | "check_request"
  | "help_request"
  | "direct_command";

export interface ParsedWakeInput {
  matched: boolean;
  matchedPhrase: string | null;
  intent: WakeIntentKind;
  preservedCommand: string;
  rawInput: string;
}

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[.,!?;:"'()[\]{}]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parses spoken or typed input against configured wake phrases and preserves
 * any command included after the wake phrase (§2.6).
 */
export function parseWakePhraseInput(
  input: string,
  phrases: WakePhraseConfig[] = DEFAULT_WAKE_PHRASES,
): ParsedWakeInput {
  const raw = input.trim();
  if (!raw) {
    return {
      matched: false,
      matchedPhrase: null,
      intent: "wake_only",
      preservedCommand: "",
      rawInput: raw,
    };
  }

  const normalizedInput = normalizeText(raw);
  const enabledPhrases = phrases
    .filter((p) => p.enabled && p.phrase.trim().length > 0)
    .sort((a, b) => b.phrase.length - a.phrase.length);

  for (const cfg of enabledPhrases) {
    const normPhrase = normalizeText(cfg.phrase);
    if (!normPhrase) continue;
    if (
      normalizedInput === normPhrase ||
      normalizedInput.startsWith(`${normPhrase} `)
    ) {
      const remainderNorm = normalizedInput.slice(normPhrase.length).trim();
      const preservedCommand = extractRawRemainder(raw, cfg.phrase, remainderNorm);
      return {
        matched: true,
        matchedPhrase: cfg.phrase,
        intent: classifyWakeIntent(normPhrase, remainderNorm),
        preservedCommand,
        rawInput: raw,
      };
    }
  }

  // Also check generic "hey lorin" or leading "lorin" prefix so natural commands like
  // "LORIN, can you check the Atlas project?" always retain the trailing command.
  const prefixMatch = /^(?:hey\s+lorin|ok\s+lorin|hi\s+lorin|lorin)\b[\s,.:;!?-]*(.*)$/i.exec(raw);
  if (prefixMatch) {
    const remainder = (prefixMatch[1] ?? "").trim();
    const normRemainder = normalizeText(remainder);
    if (!normRemainder) {
      return {
        matched: true,
        matchedPhrase: "Hey LORIN",
        intent: "wake_only",
        preservedCommand: "",
        rawInput: raw,
      };
    }
    if (/^are you there\b/i.test(normRemainder)) {
      const after = remainder.replace(/^are you there[\s,.:;!?-]*/i, "").trim();
      return {
        matched: true,
        matchedPhrase: "LORIN, are you there?",
        intent: after ? "direct_command" : "availability_check",
        preservedCommand: after,
        rawInput: raw,
      };
    }
    if (/^let s get to work\b|^lets get to work\b/i.test(normRemainder)) {
      const after = remainder.replace(/^let'?s get to work[\s,.:;!?-]*/i, "").trim();
      return {
        matched: true,
        matchedPhrase: "LORIN, let's get to work",
        intent: after ? "direct_command" : "work_session",
        preservedCommand: after,
        rawInput: raw,
      };
    }
    if (/^can you check this\b/i.test(normRemainder)) {
      const after = remainder.replace(/^can you check this[\s,.:;!?-]*/i, "").trim();
      return {
        matched: true,
        matchedPhrase: "LORIN, can you check this?",
        intent: after ? "direct_command" : "check_request",
        preservedCommand: after,
        rawInput: raw,
      };
    }
    if (/^i need your help\b/i.test(normRemainder)) {
      const after = remainder.replace(/^i need your help[\s,.:;!?-]*/i, "").trim();
      return {
        matched: true,
        matchedPhrase: "LORIN, I need your help",
        intent: after ? "direct_command" : "help_request",
        preservedCommand: after,
        rawInput: raw,
      };
    }
    return {
      matched: true,
      matchedPhrase: "LORIN",
      intent: "direct_command",
      preservedCommand: remainder,
      rawInput: raw,
    };
  }

  return {
    matched: false,
    matchedPhrase: null,
    intent: "wake_only",
    preservedCommand: raw,
    rawInput: raw,
  };
}

function extractRawRemainder(raw: string, matchedPhrase: string, fallbackNorm: string): string {
  const escaped = matchedPhrase
    .trim()
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\s+/g, "[\\s,.:;!?-]+");
  const re = new RegExp(`^${escaped}[\\s,.:;!?-]*`, "i");
  const stripped = raw.replace(re, "").trim();
  if (stripped && stripped.toLowerCase() !== raw.toLowerCase()) {
    return stripped;
  }
  return fallbackNorm;
}

function classifyWakeIntent(normPhrase: string, remainderNorm: string): WakeIntentKind {
  if (remainderNorm.length > 0) return "direct_command";
  if (normPhrase.includes("are you there")) return "availability_check";
  if (normPhrase.includes("get to work")) return "work_session";
  if (normPhrase.includes("check this")) return "check_request";
  if (normPhrase.includes("need your help")) return "help_request";
  return "wake_only";
}

export interface GreetingContext {
  parsed: ParsedWakeInput;
  activeProjectName: string;
  pendingTaskCount: number;
  pendingApprovalCount: number;
  hourOfDay?: number;
}

/**
 * Generates a context-aware LORIN greeting or command acknowledgment (§3.1 & §16).
 */
export function generateContextualGreeting(ctx: GreetingContext): string {
  const { parsed, activeProjectName, pendingTaskCount, pendingApprovalCount } = ctx;
  const hour = ctx.hourOfDay ?? new Date().getHours();
  const timeSalutation =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (parsed.intent === "direct_command" && parsed.preservedCommand) {
    return `Acknowledged. Processing your request for ${activeProjectName}: “${parsed.preservedCommand}”`;
  }

  if (parsed.intent === "availability_check") {
    return `I'm here and ready. Active workspace is ${activeProjectName} with ${pendingTaskCount} open tasks and ${pendingApprovalCount} pending approvals.`;
  }

  if (parsed.intent === "work_session") {
    return `Ready. We are in ${activeProjectName} (${pendingTaskCount} active tasks, ${pendingApprovalCount} approvals waiting). Would you like to continue where we left off, or start something new?`;
  }

  if (parsed.intent === "check_request") {
    return `Of course. Send it over, or tell me what you'd like me to inspect in ${activeProjectName}.`;
  }

  if (parsed.intent === "help_request") {
    return `I'm ready to help. Tell me the objective or constraint we're tackling in ${activeProjectName}.`;
  }

  return `${timeSalutation}. I'm here. What are we working on today in ${activeProjectName}?`;
}

export function formatWakeStateLabel(state: WakeListenerState): {
  label: string;
  tone: "teal" | "indigo" | "amber" | "red" | "neutral";
  activeMic: boolean;
} {
  switch (state) {
    case "disabled":
      return { label: "Listener disabled", tone: "neutral", activeMic: false };
    case "permission_required":
      return { label: "Permission required", tone: "amber", activeMic: false };
    case "permission_denied":
      return { label: "Permission denied", tone: "red", activeMic: false };
    case "preparing":
      return { label: "Preparing listener", tone: "indigo", activeMic: false };
    case "foreground_listening":
      return { label: "Foreground listening", tone: "teal", activeMic: true };
    case "background_listening":
      return { label: "Background listening", tone: "teal", activeMic: true };
    case "wake_detected":
      return { label: "Wake phrase detected", tone: "teal", activeMic: true };
    case "activating":
      return { label: "Assistant activating (5s intro)", tone: "indigo", activeMic: true };
    case "command_recognition":
      return { label: "Command recognition", tone: "teal", activeMic: true };
    case "processing":
      return { label: "Processing request", tone: "indigo", activeMic: false };
    case "speaking":
      return { label: "Speaking", tone: "teal", activeMic: false };
    case "interrupted":
      return { label: "Interrupted", tone: "amber", activeMic: false };
    case "paused":
      return { label: "Listener paused", tone: "amber", activeMic: false };
    case "unavailable":
      return { label: "Listener unavailable", tone: "neutral", activeMic: false };
    case "error":
      return { label: "Listener error", tone: "red", activeMic: false };
  }
}

export interface PlatformWakeCapabilities {
  secureContext: boolean;
  mediaDevicesSupported: boolean;
  webSpeechRecognitionSupported: boolean;
  speechSynthesisSupported: boolean;
  foregroundWakeSupported: boolean;
  backgroundWakeSupported: boolean;
  platformNote: string;
}

export function getWakeWordCapabilities(): PlatformWakeCapabilities {
  if (typeof window === "undefined") {
    return {
      secureContext: false,
      mediaDevicesSupported: false,
      webSpeechRecognitionSupported: false,
      speechSynthesisSupported: false,
      foregroundWakeSupported: false,
      backgroundWakeSupported: false,
      platformNote: "Server render — browser audio capabilities will be probed on client mount.",
    };
  }

  const win = window as unknown as Record<string, unknown>;
  const secureContext = Boolean(window.isSecureContext);
  const mediaDevicesSupported = Boolean(navigator.mediaDevices?.getUserMedia);
  const webSpeechRecognitionSupported = Boolean(
    win.SpeechRecognition || win.webkitSpeechRecognition,
  );
  const speechSynthesisSupported = Boolean(window.speechSynthesis);
  const nativeTauri = Boolean(win.__TAURI__ || win.__TAURI_INTERNALS__);

  return {
    secureContext,
    mediaDevicesSupported,
    webSpeechRecognitionSupported,
    speechSynthesisSupported,
    foregroundWakeSupported: secureContext && mediaDevicesSupported,
    backgroundWakeSupported: nativeTauri,
    platformNote: nativeTauri
      ? "Native desktop container detected. Background tray wake listener can be enabled with explicit owner permission."
      : "Browser / PWA runtime: Foreground wake-word detection and tap-to-talk are supported. Permanent background microphone listening when the browser is closed is not advertised on web runtimes.",
  };
}
