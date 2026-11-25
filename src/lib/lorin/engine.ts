export type Mode = "companion" | "compact" | "immersive" | "workspace" | "ambient";
export type SyncProfile = "balanced" | "privacy-first" | "full-approved" | "manual";
export type View =
  | "home"
  | "companion"
  | "chat"
  | "projects"
  | "tasks"
  | "calendar"
  | "workbench"
  | "intelligence"
  | "knowledge"
  | "vault"
  | "memory"
  | "gideon"
  | "voice"
  | "vision"
  | "sandbox"
  | "automation"
  | "verification"
  | "devices"
  | "connections"
  | "presence"
  | "storage"
  | "sync"
  | "trust"
  | "audit"
  | "owner"
  | "settings";

export type RoutePref = "auto" | "gemini" | "ollama" | "local-only";
export type Risk = "read" | "write" | "critical";
export type JobState =
  | "proposed"
  | "awaiting"
  | "running"
  | "completed"
  | "verified"
  | "failed"
  | "blocked"
  | "cancelled";

export type CharacterState =
  | "idle"
  | "listening"
  | "processing"
  | "speaking"
  | "researching"
  | "coding"
  | "vision"
  | "error"
  | "offline";

export type ProviderId = "ollama-local" | "gemini" | "blocked" | "offline";
export type VoicePhase = "idle" | "listening" | "processing" | "speaking";
export type VoiceSource = "none" | "microphone" | "script" | "typed";

export type Capability = {
  id: string;
  title: string;
  risk: Risk;
  schema: string;
};

export const CAPABILITIES: Capability[] = [
  { id: "vault.index", title: "Index knowledge vault", risk: "read", schema: "No arguments. Reads knowledge titles only." },
  { id: "knowledge.append", title: "Append knowledge document", risk: "write", schema: "Title and body. Knowledge vault only." },
  { id: "private.append", title: "Append private note", risk: "write", schema: "Title and body. Private vault only." },
  { id: "memory.store", title: "Store memory", risk: "write", schema: "One sentence. Kept only after verification." },
  { id: "policy.apply", title: "Apply policy diff", risk: "write", schema: "The one workbench diff. No shell." },
  { id: "shell.exec", title: "Run a shell command", risk: "critical", schema: "Denied. No command is accepted." },
];

export const SPECIALISTS: { name: string; role: string }[] = [
  { name: "Lena", role: "Guardian — security, privacy, identity, permissions and authorization." },
  { name: "Owen", role: "Coordinator — planning, orchestration, scheduling and execution coordination." },
  { name: "Riley", role: "Companion — communication, voice, personalization and adaptive interaction." },
  { name: "Iris", role: "Investigator — research, evidence, retrieval and verification." },
  { name: "Nolan", role: "Strategist — programming, engineering, architecture and troubleshooting." },
  { name: "GIDEON", role: "Continuity — long-term memory, decision history and continuity." },
];

export const POLICY_BEFORE = `function allow(flag: boolean) {\n  return flag;\n}`;
export const POLICY_AFTER = `function allow(digest: string) {\n  return registry.consume(digest);\n}`;

export type Doc = {
  id: string;
  vault: "knowledge" | "private";
  title: string;
  body: string;
  tags: string[];
  indexed: boolean;
  scope: "atlas" | "public";
  topic?: string;
  category?: string;
  provenance?: string;
  version?: string;
  verified?: boolean;
  createdAt?: string;
  checksum?: string;
  relatedIds?: string[];
};

export type Memory = {
  id: string;
  text: string;
  source: string;
  verified: boolean;
  category?: string;
  pinned?: boolean;
  expiresAt?: string;
};

export type Decision = {
  model: ProviderId;
  reason: string;
  specialists: string[];
  sources: string[];
  character: CharacterState;
};

export function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;
}

export function fingerprint(capability: string, scope: string, args: string) {
  const s = `${capability}\n${scope}\n${args}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `fp_${(h >>> 0).toString(16).padStart(8, "0")}`;
}

export function capabilityById(id: string) {
  return CAPABILITIES.find((c) => c.id === id);
}

export function splitArgs(args: string) {
  const idx = args.indexOf("::");
  if (idx === -1) return { title: args.trim() || "Untitled", body: "" };
  return { title: args.slice(0, idx).trim() || "Untitled", body: args.slice(idx + 2).trim() };
}

const PRIVATE_RE = /\b(private|owner note|password|secret|credential|credentials)\b/i;
const RESEARCH_RE = /\b(research|compare|web|latest|papers|public)\b/i;
const MEMORY_RE = /\b(remember|memory|memories)\b/i;
const CODE_RE = /\b(code|diff|policy|implement|digest)\b/i;

export function routeDecision(input: {
  query: string;
  route: RoutePref;
  geminiVerified: boolean;
  online: boolean;
  privateIntent: boolean;
}): Omit<Decision, "sources"> {
  const research = RESEARCH_RE.test(input.query);
  const coding = CODE_RE.test(input.query);
  const { route, geminiVerified, online, privateIntent } = input;

  if (privateIntent) {
    return {
      model: "ollama-local",
      reason: "Private intent stays on this device. Cloud routing was not used.",
      specialists: ["Lena", "Iris"],
      character: "idle",
    };
  }
  if (route === "local-only") {
    return {
      model: "ollama-local",
      reason: "Local-only lock is on. No cloud call was made.",
      specialists: ["Riley", "Iris"],
      character: "idle",
    };
  }
  if (route === "ollama") {
    return {
      model: "ollama-local",
      reason: "Routing preference is the local model.",
      specialists: coding ? ["Nolan", "Iris"] : ["Iris"],
      character: coding ? "coding" : "idle",
    };
  }

  const wantsGemini = route === "gemini" || (route === "auto" && research);

  if (route === "gemini" && !geminiVerified) {
    return {
      model: "blocked",
      reason: "Gemini is configured, not verified. Nothing was sent, and the vault was not used as a stand-in.",
      specialists: ["Lena"],
      character: "error",
    };
  }
  if (route === "gemini" && !online) {
    return {
      model: "offline",
      reason: "Gemini was requested while offline. No cloud reply was invented.",
      specialists: ["Lena"],
      character: "offline",
    };
  }
  if (wantsGemini && route === "auto" && (!online || !geminiVerified)) {
    return {
      model: "ollama-local",
      reason: !online
        ? "Offline, so automatic routing stayed on the local vault."
        : "Research would use Gemini, but that provider is not verified. Answered from the local vault.",
      specialists: ["Iris", "Lena"],
      character: "idle",
    };
  }
  if (wantsGemini && geminiVerified && online) {
    return {
      model: "gemini",
      reason: "Routing selected Gemini. This demo did not call it. Sentences below are copied from the vault.",
      specialists: ["Owen", "Iris"],
      character: "researching",
    };
  }
  return {
    model: "ollama-local",
    reason: "Automatic routing stayed local. No cloud call was made.",
    specialists: coding ? ["Nolan", "Iris"] : ["Riley", "Iris"],
    character: coding ? "coding" : "idle",
  };
}

export function answerQuestion(input: {
  query: string;
  docs: Doc[];
  memories: Memory[];
  projectId: string;
  route: RoutePref;
  geminiVerified: boolean;
  online: boolean;
}): Decision & { text: string } {
  const query = input.query.trim();
  const privateIntent = PRIVATE_RE.test(query);
  const memoryIntent = MEMORY_RE.test(query);

  if (input.projectId === "p2" && (privateIntent || memoryIntent)) {
    return {
      text: "MOSAIRA cannot read the private vault, memories, or devices. Switch to Atlas for that.",
      model: "ollama-local",
      reason: "Project boundary refused private retrieval.",
      specialists: ["Lena"],
      sources: [],
      character: "idle",
    };
  }

  if (memoryIntent && input.projectId !== "p2") {
    const kept = input.memories.filter((m) => m.verified);
    if (!kept.length) {
      return {
        text: "No approved memory matches. I will not invent one.",
        model: "ollama-local",
        reason: "Memory intent, and the approved list is empty.",
        specialists: ["GIDEON"],
        sources: [],
        character: "idle",
      };
    }
    return {
      text: kept.map((m) => m.text).join(" "),
      model: "ollama-local",
      reason: "Answered only from memories you already verified.",
      specialists: ["GIDEON"],
      sources: kept.map((m) => `Memory · ${m.source}`),
      character: "idle",
    };
  }

  const decision = routeDecision({
    query,
    route: input.route,
    geminiVerified: input.geminiVerified,
    online: input.online,
    privateIntent,
  });

  if (decision.model === "blocked" || decision.model === "offline") {
    return { ...decision, text: decision.reason, sources: [] };
  }

  const pool = input.docs.filter((d) => {
    if (privateIntent) return d.vault === "private";
    if (d.vault !== "knowledge") return false;
    if (input.projectId === "p2") return d.scope === "public";
    return true;
  });

  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length >= 3 && !["what", "does", "about", "with", "from", "that", "this", "have", "tell", "how"].includes(w));
  const hits = pool
    .map((d) => {
      const hay = `${d.title} ${d.topic ?? ""} ${d.category ?? ""} ${d.body} ${d.tags.join(" ")}`.toLowerCase();
      const score = terms.reduce((n, w) => n + (hay.includes(w) ? (d.title.toLowerCase().includes(w) ? 3 : 1) : 0), 0);
      return { d, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.d);

  if (!hits.length) {
    return {
      ...decision,
      text: "I don't currently have sufficiently reliable information about that in my available knowledge sources. I can investigate it when an approved research or AI provider is available.",
      sources: [],
      specialists: ["Iris"],
      character: "idle",
    };
  }

  return {
    ...decision,
    text: `[Local Knowledge Lookup · ${hits.length} verified source${hits.length === 1 ? "" : "s"}]\n\n` + hits.map((d) => `${d.title} — ${d.body}`).join("\n\n"),
    sources: hits.map((d) => d.title),
  };
}

export function evidenceFor(job: { capability: string; title: string; args: string }, docs: Doc[]) {
  if (job.capability === "vault.index") {
    const titles = docs.filter((d) => d.vault === "knowledge").map((d) => d.title);
    return `Prepared an index of ${titles.length} knowledge titles: ${titles.join(", ")}. Private vault was not scanned. Nothing is marked indexed until you verify.`;
  }
  if (job.capability === "knowledge.append" || job.capability === "private.append") {
    const { title } = splitArgs(job.args);
    return `Draft “${title}” is ready. It is not written into the vault until you verify.`;
  }
  if (job.capability === "memory.store") {
    return "Memory draft is ready. It is not kept until you verify.";
  }
  if (job.capability === "policy.apply") {
    return "Diff is prepared. The workbench still shows the old policy until you verify.";
  }
  return `${job.title} finished. The result is not verified.`;
}
