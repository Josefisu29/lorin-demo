import { create } from "zustand";
import { persist } from "zustand/middleware";
import { silence, speak } from "./audio";
import {
  answerQuestion,
  capabilityById,
  evidenceFor,
  fingerprint,
  splitArgs,
  uid,
  type CharacterState,
  type Decision,
  type Doc,
  type JobState,
  type Memory,
  type Mode,
  type Risk,
  type RoutePref,
  type SyncProfile,
  type View,
  type VoicePhase,
  type VoiceSource,
} from "./engine";

export type {
  CharacterState,
  Decision,
  Doc,
  Memory,
  Mode,
  RoutePref,
  SyncProfile,
  View,
  VoicePhase,
  VoiceSource,
  JobState,
  Risk,
};

export type Message = {
  id: string;
  role: "user" | "lorin";
  text: string;
  model?: string;
  sources?: string[];
  specialists?: string[];
  at: number;
};

export type Job = {
  id: string;
  capability: string;
  title: string;
  scope: string;
  args: string;
  risk: Risk;
  fingerprint: string;
  approvalId?: string;
  state: JobState;
  evidence?: string;
  at: number;
};

export type GideonEvent = { id: string; title: string; detail: string; at: number };
export type Project = { id: string; name: string; status: string; note: string };
export type Device = {
  id: string;
  name: string;
  kind: string;
  phase: "session" | "unpaired" | "code" | "paired";
  paired: boolean;
  online: boolean;
  code?: string;
  note: string;
};
export type Audit = { id: string; text: string; at: number };

type Data = {
  mode: Mode;
  view: View;
  drawer: boolean;
  inspector: boolean;
  commandPaletteOpen: boolean;
  projectId: string;
  route: RoutePref;
  syncProfile: SyncProfile;
  geminiVerified: boolean;
  online: boolean;
  micGranted: boolean;
  voice: VoicePhase;
  voiceSource: VoiceSource;
  voiceSession: string;
  transcript: string;
  character: CharacterState;
  messages: Message[];
  jobs: Job[];
  docs: Doc[];
  memories: Memory[];
  events: GideonEvent[];
  projects: Project[];
  devices: Device[];
  audit: Audit[];
  policyApplied: boolean;
  epoch: number;
  lastDecision: Decision | null;
};

type Actions = {
  setMode: (m: Mode) => void;
  setView: (v: View) => void;
  setDrawer: (v: boolean) => void;
  setInspector: (v: boolean) => void;
  setCommandPaletteOpen: (v: boolean) => void;
  setProject: (id: string) => void;
  setRoute: (r: RoutePref) => void;
  setSyncProfile: (p: SyncProfile) => void;
  verifyGemini: () => void;
  setOnline: (v: boolean) => void;
  noteMic: (granted: boolean, detail?: string) => void;
  send: (text: string, opts?: { fromVoice?: boolean }) => void;
  propose: (capability: string, scope: string, args?: string) => void;
  decide: (id: string, allow: boolean) => void;
  verify: (id: string) => void;
  rejectEvidence: (id: string) => void;
  cancel: (id: string) => void;
  beginListen: (source: Exclude<VoiceSource, "none">) => void;
  finishUtterance: (text: string, source: "typed" | "script") => void;
  interrupt: () => void;
  snapshot: (fileName: string) => void;
  issuePairCode: (id: string) => void;
  confirmHandshake: (id: string) => void;
  revokeDevice: (id: string) => void;
  reset: () => void;
};

export type Store = Data & Actions;

const timers = new Set<number>();

function later(fn: () => void, ms: number) {
  const id = window.setTimeout(() => {
    timers.delete(id);
    fn();
  }, ms);
  timers.add(id);
}

function clearTimers() {
  timers.forEach((id) => window.clearTimeout(id));
  timers.clear();
}

function pushAudit(audit: Audit[], text: string): Audit[] {
  return [{ id: uid("a"), text, at: Date.now() }, ...audit].slice(0, 40);
}

function pushEvent(events: GideonEvent[], title: string, detail: string): GideonEvent[] {
  return [{ id: uid("e"), title, detail, at: Date.now() }, ...events].slice(0, 40);
}

const opened = Date.now();

function fresh(): Data {
  const docs: Doc[] = [
    {
      id: "d1",
      vault: "knowledge",
      title: "Atlas project brief",
      body: "Atlas is the private intelligence shell. It routes locally first, cites vault sources, and never treats a finished process as verification.",
      tags: ["project", "atlas"],
      indexed: false,
      scope: "atlas",
    },
    {
      id: "d2",
      vault: "knowledge",
      title: "Permission model",
      body: "Capabilities are closed schemas. Critical operations are denied. A write requires a single-use approval bound to the action fingerprint.",
      tags: ["security"],
      indexed: false,
      scope: "atlas",
    },
    {
      id: "d4",
      vault: "knowledge",
      title: "MOSAIRA public boundary",
      body: "MOSAIRA publishes research. It does not receive private notes, memories, credentials, or device permissions from Atlas.",
      tags: ["mosaira", "public"],
      indexed: false,
      scope: "public",
    },
    {
      id: "d3",
      vault: "private",
      title: "Owner note",
      body: "Keep private notes off cloud models. The working timezone is WAT. Do not copy this note into MOSAIRA.",
      tags: ["private"],
      indexed: false,
      scope: "atlas",
    },
  ];
  const indexScope = "Read-only scan of Knowledge Vault titles. No private vault access.";
  return {
    mode: "workspace",
    view: "home",
    drawer: false,
    inspector: true,
    commandPaletteOpen: false,
    projectId: "p1",
    route: "auto",
    syncProfile: "balanced",
    geminiVerified: false,
    online: true,
    micGranted: false,
    voice: "idle",
    voiceSource: "none",
    voiceSession: "",
    transcript: "",
    character: "idle",
    messages: [
      {
        id: "m0",
        role: "lorin",
        text: "Workspace is on this device. I cite the vault, I propose scoped actions, and I do not call a result verified until you check it.",
        model: "ollama-local",
        specialists: ["Riley"],
        at: opened - 3_600_000,
      },
    ],
    jobs: [
      {
        id: "j1",
        capability: "vault.index",
        title: "Index knowledge vault",
        scope: indexScope,
        args: "",
        risk: "read",
        fingerprint: fingerprint("vault.index", indexScope, ""),
        state: "awaiting",
        at: opened - 7_200_000,
      },
      {
        id: "j0",
        capability: "memory.store",
        title: "Record Atlas decision",
        scope: "Append one continuity event: local-first routing is the default.",
        args: "Local-first routing is the default.",
        risk: "write",
        fingerprint: fingerprint(
          "memory.store",
          "Append one continuity event: local-first routing is the default.",
          "Local-first routing is the default.",
        ),
        approvalId: "ap_seed01",
        state: "verified",
        evidence: "Continuity already contains the routing decision.",
        at: opened - 86_400_000,
      },
    ],
    docs,
    memories: [
      { id: "mem1", text: "Prefer the local model for private notes.", source: "Owner note", verified: true },
      { id: "mem2", text: "The active project starts as Atlas.", source: "Atlas project brief", verified: true },
    ],
    events: [
      {
        id: "e1",
        title: "Routing policy set",
        detail: "Local-first is the default. Cloud only when the provider is verified and the content is not private.",
        at: opened - 86_400_000,
      },
      {
        id: "e2",
        title: "Vaults separated",
        detail: "Knowledge and the private vault are different stores. MOSAIRA cannot read the private one.",
        at: opened - 50_000_000,
      },
    ],
    projects: [
      {
        id: "p1",
        name: "Atlas",
        status: "Active",
        note: "Personal intelligence shell. Local-first routing, cited answers, gated actions.",
      },
      {
        id: "p2",
        name: "MOSAIRA",
        status: "Separate",
        note: "Public research surface. It does not inherit private memory, notes, or device permissions.",
      },
    ],
    devices: [
      {
        id: "dev1",
        name: "This browser",
        kind: "Web",
        phase: "session",
        paired: true,
        online: true,
        note: "The session you are using. It is not a desktop agent.",
      },
      {
        id: "dev2",
        name: "Windows companion",
        kind: "Desktop",
        phase: "unpaired",
        paired: false,
        online: false,
        note: "No desktop agent is installed in this demo. Pairing only records a handshake.",
      },
    ],
    audit: [{ id: "a0", text: "Demo session opened. No live cloud call was made.", at: opened }],
    policyApplied: false,
    epoch: 1,
    lastDecision: null,
  };
}

function commitJob(job: Job, data: Data): Partial<Data> {
  if (job.capability === "vault.index") {
    return { docs: data.docs.map((d) => (d.vault === "knowledge" ? { ...d, indexed: true } : d)) };
  }
  if (job.capability === "knowledge.append" || job.capability === "private.append") {
    const { title, body } = splitArgs(job.args);
    const doc: Doc = {
      id: uid("d"),
      vault: job.capability === "private.append" ? "private" : "knowledge",
      title,
      body: body || title,
      tags: [job.capability === "private.append" ? "private" : "project"],
      indexed: false,
      scope: "atlas",
    };
    return { docs: [doc, ...data.docs] };
  }
  if (job.capability === "memory.store") {
    const memory: Memory = { id: uid("mem"), text: job.args.trim(), source: "Verified in this session", verified: true };
    return { memories: [memory, ...data.memories] };
  }
  if (job.capability === "policy.apply") return { policyApplied: true };
  return {};
}

export const useLorin = create<Store>()(
  persist(
    (set, get) => ({
      ...fresh(),
      setMode: (mode) =>
        set({
          mode,
          drawer: false,
          view: mode === "compact" ? "chat" : get().view,
        }),
      setView: (view) => set({ view, drawer: false }),
      setDrawer: (drawer) => set({ drawer }),
      setInspector: (inspector) => set({ inspector }),
      setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
      setProject: (projectId) => {
        const name = get().projects.find((p) => p.id === projectId)?.name ?? projectId;
        set((s) => ({ projectId, audit: pushAudit(s.audit, `Active project is ${name}.`) }));
      },
      setRoute: (route) => set({ route }),
      setSyncProfile: (syncProfile) =>
        set((s) => ({
          syncProfile,
          audit: pushAudit(s.audit, `Sync profile preference set to ${syncProfile}.`),
        })),
      verifyGemini: () =>
        set((s) => ({
          // This demo has no server-side Gemini verification endpoint. Never
          // allow a local UI toggle to authorize cloud routing.
          geminiVerified: false,
          audit: pushAudit(s.audit, "Gemini verification unavailable in this demo. No credentials were checked and cloud routing remains blocked."),
        })),
      setOnline: (online) => set({ online, character: online ? "idle" : "offline" }),
      noteMic: (micGranted, detail) =>
        set((s) => ({
          micGranted,
          character: micGranted ? s.character : "error",
          transcript: micGranted ? s.transcript : detail || "Microphone permission was denied or is unavailable.",
          audit: pushAudit(s.audit, micGranted ? "Microphone permission granted." : "Microphone permission was not granted."),
        })),
      send: (text, opts) => {
        const t = text.trim();
        if (!t) return;
        const s = get();
        const user: Message = { id: uid("u"), role: "user", text: t, at: Date.now() };
        const a = answerQuestion({
          query: t,
          docs: s.docs,
          memories: s.memories,
          projectId: s.projectId,
          route: s.route,
          geminiVerified: s.geminiVerified,
          online: s.online,
        });
        const reply: Message = {
          id: uid("l"),
          role: "lorin",
          text: a.text,
          model: a.model,
          sources: a.sources,
          specialists: a.specialists,
          at: Date.now() + 1,
        };
        const decision: Decision = {
          model: a.model,
          reason: a.reason,
          specialists: a.specialists,
          sources: a.sources,
          character: a.character,
        };
        set({
          messages: [...s.messages, user, reply].slice(-80),
          lastDecision: decision,
          character: opts?.fromVoice ? "processing" : a.character,
          view: opts?.fromVoice ? s.view : s.view === "home" ? "chat" : s.view,
          events: a.sources.length ? pushEvent(s.events, "Cited reply", a.sources.join(", ")) : s.events,
          audit: pushAudit(s.audit, `Routed via ${a.model}. ${a.reason}`),
        });
      },
      propose: (capabilityId, scope, args = "") => {
        const cap = capabilityById(capabilityId);
        if (!cap) return;
        if ((cap.risk === "write" || capabilityId.endsWith(".append") || capabilityId === "memory.store") && capabilityId !== "policy.apply" && capabilityId !== "vault.index" && !args.trim()) {
          return;
        }
        const fp = fingerprint(cap.id, scope, args);
        if (cap.risk === "critical") {
          const job: Job = {
            id: uid("j"),
            capability: cap.id,
            title: cap.title,
            scope,
            args,
            risk: cap.risk,
            fingerprint: fp,
            state: "blocked",
            evidence: "Critical risk is denied. No approval can override that.",
            at: Date.now(),
          };
          set((s) => ({
            jobs: [job, ...s.jobs],
            view: "tasks",
            character: "error",
            audit: pushAudit(s.audit, `Blocked ${cap.id}.`),
            events: pushEvent(s.events, "Action blocked", cap.title),
          }));
          return;
        }
        const job: Job = {
          id: uid("j"),
          capability: cap.id,
          title: cap.title,
          scope,
          args,
          risk: cap.risk,
          fingerprint: fp,
          state: "awaiting",
          at: Date.now(),
        };
        set((s) => ({
          jobs: [job, ...s.jobs],
          view: "tasks",
          audit: pushAudit(s.audit, `Proposed ${cap.risk} action ${cap.id} · ${fp}.`),
        }));
      },
      decide: (id, allow) => {
        const job = get().jobs.find((j) => j.id === id);
        if (!job || job.state !== "awaiting" || job.risk === "critical") return;
        const expect = fingerprint(job.capability, job.scope, job.args);
        if (expect !== job.fingerprint) {
          set((s) => ({
            jobs: s.jobs.map((j) =>
              j.id === id ? { ...j, state: "failed", evidence: "Fingerprint no longer matches the proposal. Approval refused." } : j,
            ),
            audit: pushAudit(s.audit, `Fingerprint mismatch on ${job.title}.`),
          }));
          return;
        }
        if (!allow) {
          set((s) => ({
            jobs: s.jobs.map((j) => (j.id === id ? { ...j, state: "cancelled", evidence: "Denied. Nothing ran." } : j)),
            audit: pushAudit(s.audit, `Denied ${job.title}.`),
          }));
          return;
        }
        const approvalId = uid("ap");
        const epoch = get().epoch;
        set((s) => ({
          jobs: s.jobs.map((j) => (j.id === id ? { ...j, state: "running", approvalId, evidence: undefined } : j)),
          character: job.capability === "policy.apply" ? "coding" : "processing",
          audit: pushAudit(s.audit, `Single-use approval ${approvalId} consumed for ${job.fingerprint}.`),
        }));
        later(() => {
          if (get().epoch !== epoch) return;
          const current = get().jobs.find((j) => j.id === id);
          if (!current || current.state !== "running") return;
          const evidence = evidenceFor(current, get().docs);
          set((s) => ({
            jobs: s.jobs.map((j) => (j.id === id ? { ...j, state: "completed", evidence } : j)),
            character: s.voice === "idle" ? "idle" : s.character,
            events: pushEvent(s.events, "Awaiting verification", current.title),
          }));
        }, 900);
      },
      verify: (id) => {
        const s = get();
        const job = s.jobs.find((j) => j.id === id);
        if (!job || job.state !== "completed") return;
        const committed = commitJob(job, s);
        set({
          ...committed,
          jobs: s.jobs.map((j) =>
            j.id === id ? { ...j, state: "verified", evidence: "Verified. The scoped change is now committed in this demo." } : j,
          ),
          events: pushEvent(s.events, "Verified", job.title),
          audit: pushAudit(s.audit, `Verified ${job.title}.`),
          character: "idle",
        });
      },
      rejectEvidence: (id) => {
        const job = get().jobs.find((j) => j.id === id);
        if (!job || job.state !== "completed") return;
        set((s) => ({
          jobs: s.jobs.map((j) =>
            j.id === id ? { ...j, state: "failed", evidence: "Evidence rejected. Nothing was committed." } : j,
          ),
          audit: pushAudit(s.audit, `Evidence rejected for ${job.title}.`),
          character: "idle",
        }));
      },
      cancel: (id) =>
        set((s) => ({
          jobs: s.jobs.map((j) =>
            j.id === id && (j.state === "awaiting" || j.state === "running")
              ? { ...j, state: "cancelled", evidence: "Cancelled before commit." }
              : j,
          ),
          character: s.voice === "idle" ? "idle" : s.character,
          audit: pushAudit(s.audit, "Job cancelled."),
        })),
      beginListen: (source) =>
        set({
          voice: "listening",
          voiceSource: source,
          voiceSession: uid("vs"),
          character: "listening",
          view: get().view === "home" ? "voice" : get().view,
          transcript: source === "microphone" ? "Microphone open. Audio is not transcribed." : "Scripted listen. The microphone is not open.",
        }),
      finishUtterance: (text, source) => {
        const clean = text.trim();
        if (!clean) return;
        if (get().voice !== "listening") return;
        const session = uid("vs");
        const epoch = get().epoch;
        set({
          voice: "processing",
          voiceSource: source,
          voiceSession: session,
          character: "processing",
          transcript: source === "script" ? `Scripted line: ${clean}` : `Utterance: ${clean}`,
        });
        get().send(clean, { fromVoice: true });
        const reply = [...get().messages].reverse().find((m) => m.role === "lorin");
        const spoken = (reply?.text ?? clean).replace(/\s+/g, " ").slice(0, 220);
        const started = speak(spoken, {
          onstart: () => {
            if (get().voiceSession === session && get().voice === "processing") {
              set({ voice: "speaking", character: "speaking" });
            }
          },
          onend: () => {
            if (get().voiceSession === session) set({ voice: "idle", character: "idle" });
          },
          onerror: () => {
            if (get().voiceSession === session) {
              set({
                voice: "idle",
                character: "idle",
                transcript: `${get().transcript} Speech output did not play. The reply is in Conversation.`,
              });
            }
          },
        });
        if (!started && get().voiceSession === session) {
          set({
            voice: "idle",
            character: "idle",
            transcript: `${get().transcript} This browser has no speech output. The reply is in Conversation.`,
          });
        }
        later(() => {
          if (get().epoch !== epoch || get().voiceSession !== session) return;
          if (get().voice === "processing") {
            set({
              voice: "idle",
              character: "idle",
              transcript: `${get().transcript} Speech did not start. The reply is in Conversation.`,
            });
          }
        }, 1200);
      },
      interrupt: () => {
        clearTimers();
        silence();
        set({
          voice: "idle",
          voiceSource: "none",
          voiceSession: uid("vs"),
          character: "idle",
          transcript: get().transcript ? `${get().transcript} (interrupted)` : "",
        });
      },
      snapshot: (fileName) =>
        set((s) => ({
          view: "vision",
          character: "vision",
          messages: [
            ...s.messages,
            {
              id: uid("l"),
              role: "lorin" as const,
              text: `Snapshot noted: ${fileName}. The file stays on this device. No vision model was called, and nothing is watched in the background.`,
              model: "ollama-local",
              specialists: ["Iris"],
              at: Date.now(),
            },
          ].slice(-80),
          audit: pushAudit(s.audit, `Snapshot noted (${fileName}). Not analyzed by a model.`),
          events: pushEvent(s.events, "Snapshot noted", fileName),
        })),
      issuePairCode: (id) => {
        const code = Math.random().toString(36).slice(2, 8).toUpperCase();
        set((s) => ({
          devices: s.devices.map((d) =>
            d.id === id && d.phase !== "session"
              ? { ...d, phase: "code", paired: false, online: false, code, note: "Code issued. Confirming it does not start a Windows process." }
              : d,
          ),
          audit: pushAudit(s.audit, `Pairing code issued for ${id}.`),
        }));
      },
      confirmHandshake: (id) =>
        set((s) => ({
          devices: s.devices.map((d) =>
            d.id === id && d.phase === "code"
              ? {
                  ...d,
                  phase: "paired",
                  paired: true,
                  online: true,
                  note: "Demo handshake recorded. No Windows companion is running.",
                }
              : d,
          ),
          audit: pushAudit(s.audit, "Device handshake recorded locally."),
          events: pushEvent(s.events, "Device handshake", "Windows companion marked paired in this demo only."),
        })),
      revokeDevice: (id) =>
        set((s) => ({
          devices: s.devices.map((d) =>
            d.id === id && d.phase !== "session"
              ? { ...d, phase: "unpaired", paired: false, online: false, code: undefined, note: "Pairing revoked. No desktop agent was contacted." }
              : d,
          ),
          audit: pushAudit(s.audit, "Device pairing revoked."),
        })),
      reset: () => {
        clearTimers();
        silence();
        set({ ...fresh(), epoch: get().epoch + 1 });
      },
    }),
    {
      name: "lorin-m0-m6",
      skipHydration: true,
      partialize: (state) => {
        const { commandPaletteOpen: _commandPaletteOpen, ...rest } = state;
        return rest;
      },
    },
  ),
);
