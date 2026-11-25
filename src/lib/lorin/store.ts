import { create } from "zustand";
import { persist } from "zustand/middleware";
import { silence, speak } from "./audio";
import {
  computeChecksum,
  DEMO_BACKUPS,
  DEMO_CALENDAR,
  DEMO_CONTACTS,
  DEMO_CONVERSATIONS,
  DEMO_KNOWLEDGE_DOCS,
  DEMO_MEMORIES,
  DEMO_NOTIFICATIONS,
  DEMO_PRESENCE_EVENTS,
  DEMO_PROJECTS,
  DEMO_STORAGE_OBJECTS,
  DEMO_SYNC_CONFLICTS,
  DEMO_SYNC_OPS,
  DEMO_WORK_TASKS,
  EXPLORE_STEPS,
  GUIDED_SCENARIOS,
  type AppNotification,
  type AutomationLevel,
  type BackupRecord,
  type CalendarEntry,
  type ConversationThread,
  type DemoContact,
  type EnvironmentTenant,
  type PresenceEventRecord,
  type StorageObjectRecord,
  type SyncConflictRecord,
  type SyncOperationRecord,
  type WorkTask,
} from "./demo-seed";
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
import {
  DEFAULT_WAKE_PHRASES,
  generateContextualGreeting,
  parseWakePhraseInput,
  type ActivationStage,
  type WakeListenerState,
  type WakePhraseConfig,
} from "./wake";

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

export type DeviceTransport =
  | "Local Wi-Fi (mDNS/TLS)"
  | "Local Hotspot"
  | "Native Peer"
  | "Approved Private Server"
  | "Encrypted Relay (Opt-in)"
  | "Offline Queue";

export type Device = {
  id: string;
  name: string;
  kind: string;
  phase: "session" | "unpaired" | "code" | "paired";
  paired: boolean;
  online: boolean;
  code?: string;
  note: string;
  keyFingerprint?: string;
  transport?: DeviceTransport;
  scopes?: string[];
  lastSeen?: string;
};

export type Audit = { id: string; text: string; at: number };
export type CompanionQuality = "high" | "balanced" | "2d-fallback";
export type CallInState = "idle" | "ringing" | "connected" | "muted" | "ended";

export type Data = {
  envMode: EnvironmentTenant;
  tenantId: string;
  ownerName: string;
  themeMode: "dark" | "light";
  mode: Mode;
  view: View;
  drawer: boolean;
  inspector: boolean;
  commandPaletteOpen: boolean;
  autoPresentation: boolean;
  companionQuality: CompanionQuality;
  companionEnabled: boolean;
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
  // Wake-word & 5-second activation state
  wakeState: WakeListenerState;
  wakePhrases: WakePhraseConfig[];
  activationStage: ActivationStage;
  activationGreeting: string;
  pendingWakeCommand: string;
  falseWakeCount: number;
  // Guided Explore LORIN walkthrough & scenarios
  exploreActive: boolean;
  exploreStep: number;
  completedScenarios: string[];
  // Semi-autonomous mode & Presence Call-In
  automationLevel: AutomationLevel;
  emergencyStopped: boolean;
  quietHoursEnabled: boolean;
  callInState: CallInState;
  callBriefingText: string;
  // Core domain collections
  messages: Message[];
  jobs: Job[];
  docs: Doc[];
  memories: Memory[];
  events: GideonEvent[];
  projects: Project[];
  devices: Device[];
  audit: Audit[];
  // Extended M1–M9 collections
  workTasks: WorkTask[];
  contacts: DemoContact[];
  conversations: ConversationThread[];
  calendar: CalendarEntry[];
  presenceEvents: PresenceEventRecord[];
  notifications: AppNotification[];
  storageObjects: StorageObjectRecord[];
  backups: BackupRecord[];
  syncOps: SyncOperationRecord[];
  syncConflicts: SyncConflictRecord[];
  policyApplied: boolean;
  epoch: number;
  lastDecision: Decision | null;
};

type Actions = {
  switchEnvironment: (env: EnvironmentTenant) => void;
  setThemeMode: (theme: "dark" | "light") => void;
  setMode: (m: Mode) => void;
  setView: (v: View) => void;
  setDrawer: (v: boolean) => void;
  setInspector: (v: boolean) => void;
  setCommandPaletteOpen: (v: boolean) => void;
  setAutoPresentation: (v: boolean) => void;
  setCompanionQuality: (q: CompanionQuality) => void;
  setCompanionEnabled: (v: boolean) => void;
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
  // Wake-word & 5-second activation actions
  setWakeState: (state: WakeListenerState) => void;
  addWakePhrase: (phrase: string) => void;
  toggleWakePhrase: (id: string) => void;
  removeWakePhrase: (id: string) => void;
  triggerWakePhrase: (spokenInput: string) => void;
  skipActivationIntro: () => void;
  // Guided Explore walkthrough & scenarios
  startExplore: () => void;
  setExploreStep: (step: number) => void;
  stopExplore: () => void;
  runGuidedScenario: (scenarioId: string) => void;
  // Semi-autonomous & Presence Call-In
  setAutomationLevel: (level: AutomationLevel) => void;
  triggerEmergencyStop: () => void;
  resumeAutomation: () => void;
  setQuietHours: (enabled: boolean) => void;
  startSimulatedCall: () => void;
  acceptSimulatedCall: () => void;
  toggleMuteCall: () => void;
  endSimulatedCall: () => void;
  acknowledgePresenceEvent: (id: string) => void;
  markNotificationRead: (id: string) => void;
  // M6 Device fabric actions
  issuePairCode: (id: string) => void;
  confirmHandshake: (id: string) => void;
  revokeDevice: (id: string) => void;
  toggleDeviceScope: (deviceId: string, scope: string) => void;
  simulateNetworkHandover: (deviceId: string, transport: DeviceTransport) => void;
  // M9 Storage, Backup, Sync & Tasks actions
  resolveSyncConflict: (id: string, resolution: "resolved_local" | "resolved_remote" | "resolved_merged") => void;
  simulatePeerSync: (title: string, originDevice: string) => void;
  createBackupSnapshot: (label?: string) => void;
  verifyBackupRestore: (backupId: string) => void;
  importDocumentFile: (title: string, body: string, category: string, vault?: "knowledge" | "private") => void;
  deleteDocument: (docId: string) => void;
  createWorkTask: (title: string, projectId: string, priority: "high" | "medium" | "low", dueAt: string) => void;
  toggleWorkTaskStatus: (taskId: string) => void;
  approveMemory: (memoryId: string) => void;
  togglePinMemory: (memoryId: string) => void;
  deleteMemory: (memoryId: string) => void;
  reset: () => void;
};

export type Store = Data & Actions;

const timers = new Set<number>();

function later(fn: () => void, ms: number) {
  if (typeof window === "undefined") return;
  const id = window.setTimeout(() => {
    timers.delete(id);
    fn();
  }, ms);
  timers.add(id);
}

function clearTimers() {
  if (typeof window === "undefined") return;
  timers.forEach((id) => window.clearTimeout(id));
  timers.clear();
}

function pushAudit(audit: Audit[], text: string): Audit[] {
  return [{ id: uid("a"), text, at: Date.now() }, ...audit].slice(0, 60);
}

function pushEvent(events: GideonEvent[], title: string, detail: string): GideonEvent[] {
  return [{ id: uid("e"), title, detail, at: Date.now() }, ...events].slice(0, 60);
}

const opened = Date.now();

const DEMO_DEVICES: Device[] = [
  {
    id: "dev1",
    name: "This browser (PWA Session)",
    kind: "Web / PWA",
    phase: "session",
    paired: true,
    online: true,
    note: "Current authenticated session. Supports foreground voice, local IndexedDB vault, and mDNS/TLS sync.",
    keyFingerprint: "ed25519:8f2a:4c91:b01e",
    transport: "Local Wi-Fi (mDNS/TLS)",
    scopes: ["conversation_sync", "project_sync", "task_sync", "knowledge_sync", "notifications", "voice"],
    lastSeen: "Active now",
  },
  {
    id: "dev2",
    name: "Windows Workstation (Tauri 2)",
    kind: "Windows Desktop",
    phase: "unpaired",
    paired: false,
    online: false,
    note: "Discovered on local LAN. Issue a one-time cryptographic challenge to pair. Native installer status: Not Yet Available in web sandbox.",
    keyFingerprint: "ed25519:pending-challenge",
    transport: "Local Wi-Fi (mDNS/TLS)",
    scopes: ["conversation_sync", "project_sync", "task_sync", "knowledge_sync"],
    lastSeen: "Discovered via mDNS",
  },
  {
    id: "dev3",
    name: "ThinkPad X1 Laptop",
    kind: "Windows Laptop",
    phase: "paired",
    paired: true,
    online: true,
    note: "Pair-once cryptographic trust active. Synchronized 14 records over local Wi-Fi.",
    keyFingerprint: "ed25519:3d7c:91a0:e442",
    transport: "Local Wi-Fi (mDNS/TLS)",
    scopes: ["conversation_sync", "project_sync", "task_sync", "knowledge_sync", "file_access"],
    lastSeen: "2 mins ago",
  },
  {
    id: "dev4",
    name: "Pixel 9 Pro (Android Companion)",
    kind: "Android Phone",
    phase: "paired",
    paired: true,
    online: true,
    note: "Paired mobile companion. Reconnected seamlessly after switching from home Wi-Fi to mobile hotspot.",
    keyFingerprint: "ed25519:7a19:55c8:f012",
    transport: "Local Hotspot",
    scopes: ["conversation_sync", "task_sync", "notifications", "voice", "camera"],
    lastSeen: "5 mins ago",
  },
  {
    id: "dev5",
    name: "Galaxy Tab S9",
    kind: "Android Tablet",
    phase: "paired",
    paired: true,
    online: true,
    note: "Used for Meridian Studio architectural drawing reviews and Knowledge Vault reading.",
    keyFingerprint: "ed25519:6b04:22e9:a871",
    transport: "Local Wi-Fi (mDNS/TLS)",
    scopes: ["project_sync", "knowledge_sync", "file_access"],
    lastSeen: "18 mins ago",
  },
  {
    id: "dev6",
    name: "iPad Pro (Safari PWA)",
    kind: "iOS/iPadOS Web Client",
    phase: "paired",
    paired: true,
    online: false,
    note: "Installed via Add to Home Screen. Supports tap-to-talk and foreground audio; background mic not advertised on iOS.",
    keyFingerprint: "ed25519:9e41:10b7:c309",
    transport: "Offline Queue",
    scopes: ["conversation_sync", "project_sync", "knowledge_sync"],
    lastSeen: "3 hours ago",
  },
  {
    id: "dev7",
    name: "Atlas Home Primary Node",
    kind: "Primary Node / Home Server",
    phase: "paired",
    paired: true,
    online: true,
    note: "Owner-controlled local Primary Node hosting SQLite WAL store, encrypted backups, and local Ollama gateway.",
    keyFingerprint: "ed25519:00a1:root:99f4",
    transport: "Local Wi-Fi (mDNS/TLS)",
    scopes: ["conversation_sync", "project_sync", "task_sync", "knowledge_sync", "file_access", "device_management"],
    lastSeen: "Active now",
  },
];

function freshDemo(): Data {
  const indexScope = "Read-only scan of Knowledge Vault titles. No private vault access.";
  return {
    envMode: "demo",
    tenantId: "demo-atlas-01",
    ownerName: "Alex Mercer (Demo Owner)",
    themeMode: "dark",
    mode: "workspace",
    view: "home",
    drawer: false,
    inspector: true,
    commandPaletteOpen: false,
    autoPresentation: true,
    companionQuality: "high",
    companionEnabled: true,
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
    wakeState: "disabled",
    wakePhrases: DEFAULT_WAKE_PHRASES,
    activationStage: 0,
    activationGreeting: "",
    pendingWakeCommand: "",
    falseWakeCount: 0,
    exploreActive: false,
    exploreStep: 1,
    completedScenarios: [],
    automationLevel: 2,
    emergencyStopped: false,
    quietHoursEnabled: true,
    callInState: "idle",
    callBriefingText: "",
    messages: [
      {
        id: "m0",
        role: "lorin",
        text: "Workspace is on this device. I cite the Knowledge Vault, I preserve wake-word context, I propose scoped actions, and I never call a result verified until you check its evidence.",
        model: "ollama-local",
        specialists: ["Riley", "Owen"],
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
    docs: DEMO_KNOWLEDGE_DOCS,
    memories: DEMO_MEMORIES,
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
      {
        id: "e3",
        title: "M6 Device Fabric initialized",
        detail: "7 demo devices loaded with cryptographic key fingerprints and mDNS/TLS transport priority.",
        at: opened - 32_000_000,
      },
      {
        id: "e4",
        title: "Starter Knowledge Base verified",
        detail: "22 documents across 20 technical and LORIN domains indexed with SHA-256 checksums.",
        at: opened - 18_000_000,
      },
    ],
    projects: DEMO_PROJECTS,
    devices: DEMO_DEVICES,
    audit: [
      { id: "a0", text: "Isolated Demonstration Environment (tenant demo-atlas-01) opened. No live cloud call was made.", at: opened },
      { id: "a1", text: "Lena Guardian verified zero-trust capability registry and critical action blocks.", at: opened - 600_000 },
    ],
    workTasks: DEMO_WORK_TASKS,
    contacts: DEMO_CONTACTS,
    conversations: DEMO_CONVERSATIONS,
    calendar: DEMO_CALENDAR,
    presenceEvents: DEMO_PRESENCE_EVENTS,
    notifications: DEMO_NOTIFICATIONS,
    storageObjects: DEMO_STORAGE_OBJECTS,
    backups: DEMO_BACKUPS,
    syncOps: DEMO_SYNC_OPS,
    syncConflicts: DEMO_SYNC_CONFLICTS,
    policyApplied: false,
    epoch: 1,
    lastDecision: null,
  };
}

/**
 * Isolated Owner's Live Environment (§0.2) — zero mixed demo records.
 */
function freshLive(): Data {
  const base = freshDemo();
  return {
    ...base,
    envMode: "live",
    tenantId: "live-owner-01",
    ownerName: "Owner Live Workspace (Isolated)",
    projectId: "live-p1",
    automationLevel: 1,
    exploreActive: false,
    messages: [
      {
        id: "live-m0",
        role: "lorin",
        text: "Owner's Live Environment active (tenant live-owner-01). All demonstration records are isolated and excluded. Connect a verified local Ollama endpoint or server-side Gemini configuration to begin live inference.",
        model: "ollama-local",
        specialists: ["Lena", "Riley"],
        at: Date.now(),
      },
    ],
    jobs: [],
    docs: [
      {
        id: "live-d1",
        vault: "knowledge",
        title: "Live Environment Boundary Policy",
        body: "This workspace belongs to the Owner's Live Environment (tenant live-owner-01). No synthetic demo tasks, contacts, or conversations are mixed into this namespace.",
        tags: ["live", "isolation", "security"],
        indexed: true,
        scope: "atlas",
        topic: "Environment Isolation",
        category: "LORIN Security",
        provenance: "Live Tenant Bootstrap",
        version: "2.1.0",
        verified: true,
        createdAt: "2026-11-25",
        checksum: computeChecksum("Live Environment Boundary Policy"),
      },
    ],
    memories: [],
    events: [
      {
        id: "live-e1",
        title: "Live tenant initialized",
        detail: "Switched to isolated live namespace (live-owner-01). Demo data excluded.",
        at: Date.now(),
      },
    ],
    projects: [
      {
        id: "live-p1",
        name: "Owner Primary Workspace",
        status: "Active",
        note: "Isolated live owner environment. Zero synthetic demo records.",
      },
    ],
    devices: [
      {
        id: "live-dev1",
        name: "This browser (Live Owner Session)",
        kind: "Web / PWA",
        phase: "session",
        paired: true,
        online: true,
        note: "Current live session. Pair real companion devices in Device Centre.",
        keyFingerprint: "ed25519:live:session01",
        transport: "Local Wi-Fi (mDNS/TLS)",
        scopes: ["conversation_sync", "project_sync", "task_sync", "knowledge_sync"],
        lastSeen: "Active now",
      },
    ],
    workTasks: [],
    contacts: [],
    conversations: [],
    calendar: [],
    presenceEvents: [],
    notifications: [],
    storageObjects: [],
    backups: [],
    syncOps: [],
    syncConflicts: [],
    audit: [
      {
        id: uid("a"),
        text: "Switched to Owner's Live Environment (tenant live-owner-01). Strict demo/live tenant separation enforced.",
        at: Date.now(),
      },
    ],
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
      indexed: true,
      scope: "atlas",
      topic: "User Added Note",
      category: job.capability === "private.append" ? "Private Vault" : "LORIN Projects",
      provenance: "Owner Approved Task",
      version: "1.0.0",
      verified: true,
      createdAt: new Date().toISOString().slice(0, 10),
      checksum: computeChecksum(title + body),
    };
    return { docs: [doc, ...data.docs] };
  }
  if (job.capability === "memory.store") {
    const memory: Memory = {
      id: uid("mem"),
      text: job.args.trim(),
      source: "Verified in this session",
      verified: true,
      category: "Approved Memory",
      pinned: false,
    };
    return { memories: [memory, ...data.memories] };
  }
  if (job.capability === "policy.apply") return { policyApplied: true };
  return {};
}

export const useLorin = create<Store>()(
  persist(
    (set, get) => ({
      ...freshDemo(),

      switchEnvironment: (env) => {
        clearTimers();
        silence();
        const next = env === "live" ? freshLive() : freshDemo();
        set({ ...next, epoch: get().epoch + 1 });
      },

      setThemeMode: (themeMode) =>
        set((s) => ({
          themeMode,
          audit: pushAudit(s.audit, `Theme preference changed to ${themeMode}.`),
        })),

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
      setAutoPresentation: (autoPresentation) =>
        set((s) => ({
          autoPresentation,
          audit: pushAudit(s.audit, `Adaptive presentation controller ${autoPresentation ? "enabled" : "set to manual override"}.`),
        })),
      setCompanionQuality: (companionQuality) =>
        set((s) => ({
          companionQuality,
          audit: pushAudit(s.audit, `Companion 3D quality tier set to ${companionQuality}.`),
        })),
      setCompanionEnabled: (companionEnabled) => set({ companionEnabled }),

      setProject: (projectId) => {
        const name = get().projects.find((p) => p.id === projectId)?.name ?? projectId;
        set((s) => ({ projectId, audit: pushAudit(s.audit, `Active project switched to ${name}.`) }));
      },

      setRoute: (route) => set({ route }),
      setSyncProfile: (syncProfile) =>
        set((s) => ({
          syncProfile,
          audit: pushAudit(s.audit, `Sync profile preference set to ${syncProfile}.`),
        })),

      verifyGemini: () =>
        set((s) => ({
          geminiVerified: false,
          audit: pushAudit(
            s.audit,
            "Gemini verification checked: No server-side API credentials configured for this tenant. Cloud routing remains blocked.",
          ),
        })),

      setOnline: (online) =>
        set((s) => ({
          online,
          character: online ? "idle" : "offline",
          audit: pushAudit(s.audit, online ? "Network state restored: Online. Queued local operations ready to sync." : "Simulated offline state enabled. Local changes are queued in durable journal."),
        })),

      noteMic: (micGranted, detail) =>
        set((s) => ({
          micGranted,
          wakeState: micGranted ? "foreground_listening" : "permission_denied",
          character: micGranted ? "listening" : "error",
          transcript: micGranted ? s.transcript || "Microphone permission granted. Foreground wake-word listener ready." : detail || "Microphone permission was denied or is unavailable.",
          audit: pushAudit(s.audit, micGranted ? "Microphone permission granted by user." : "Microphone permission denied or unavailable."),
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
          messages: [...s.messages, user, reply].slice(-100),
          lastDecision: decision,
          character: opts?.fromVoice ? "processing" : a.character,
          view: opts?.fromVoice ? s.view : s.view === "home" ? "chat" : s.view,
          events: a.sources.length ? pushEvent(s.events, "Cited knowledge reply", a.sources.join(", ")) : s.events,
          audit: pushAudit(s.audit, `Routed via ${a.model}. ${a.reason}`),
        });
      },

      propose: (capabilityId, scope, args = "") => {
        const cap = capabilityById(capabilityId);
        if (!cap) return;
        if (
          (cap.risk === "write" || capabilityId.endsWith(".append") || capabilityId === "memory.store") &&
          capabilityId !== "policy.apply" &&
          capabilityId !== "vault.index" &&
          !args.trim()
        ) {
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
            evidence: "Critical risk is denied by Lena Guardian. No approval can override that.",
            at: Date.now(),
          };
          set((s) => ({
            jobs: [job, ...s.jobs],
            view: "tasks",
            character: "error",
            audit: pushAudit(s.audit, `Blocked critical capability ${cap.id}.`),
            events: pushEvent(s.events, "Critical action blocked", cap.title),
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
            jobs: s.jobs.map((j) => (j.id === id ? { ...j, state: "cancelled", evidence: "Denied by owner. Nothing ran." } : j)),
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
        }, 700);
      },

      verify: (id) => {
        const s = get();
        const job = s.jobs.find((j) => j.id === id);
        if (!job || job.state !== "completed") return;
        const committed = commitJob(job, s);
        set({
          ...committed,
          jobs: s.jobs.map((j) =>
            j.id === id ? { ...j, state: "verified", evidence: "Verified. The scoped change is now committed." } : j,
          ),
          events: pushEvent(s.events, "Verified", job.title),
          audit: pushAudit(s.audit, `Verified evidence for ${job.title}.`),
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
          wakeState: source === "microphone" ? "foreground_listening" : "command_recognition",
          character: "listening",
          view: get().view === "home" ? "voice" : get().view,
          transcript:
            source === "microphone"
              ? "Microphone open. Local wake-word and voice activity detection active."
              : "Scripted listen active. The physical microphone is not open.",
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
          wakeState: "processing",
          character: "processing",
          transcript: source === "script" ? `Scripted line: ${clean}` : `Utterance: ${clean}`,
        });
        get().send(clean, { fromVoice: true });
        const reply = [...get().messages].reverse().find((m) => m.role === "lorin");
        const spoken = (reply?.text ?? clean).replace(/\s+/g, " ").slice(0, 220);
        const started = speak(spoken, {
          onstart: () => {
            if (get().voiceSession === session && get().voice === "processing") {
              set({ voice: "speaking", wakeState: "speaking", character: "speaking" });
            }
          },
          onend: () => {
            if (get().voiceSession === session) {
              set({
                voice: "idle",
                wakeState: get().micGranted ? "foreground_listening" : "disabled",
                character: "idle",
              });
            }
          },
          onerror: () => {
            if (get().voiceSession === session) {
              set({
                voice: "idle",
                wakeState: get().micGranted ? "foreground_listening" : "disabled",
                character: "idle",
                transcript: `${get().transcript} Speech output did not play. The reply is in Conversation.`,
              });
            }
          },
        });
        if (!started && get().voiceSession === session) {
          set({
            voice: "idle",
            wakeState: get().micGranted ? "foreground_listening" : "disabled",
            character: "idle",
            transcript: `${get().transcript} Browser speech synthesis finished. The reply is in Conversation.`,
          });
        }
        later(() => {
          if (get().epoch !== epoch || get().voiceSession !== session) return;
          if (get().voice === "processing") {
            set({
              voice: "idle",
              wakeState: get().micGranted ? "foreground_listening" : "disabled",
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
          wakeState: "interrupted",
          activationStage: 0,
          character: "idle",
          transcript: get().transcript ? `${get().transcript} (interrupted)` : "Interrupted by user.",
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
          ].slice(-100),
          audit: pushAudit(s.audit, `Snapshot noted (${fileName}). Not analyzed by an unverified cloud model.`),
          events: pushEvent(s.events, "Snapshot noted", fileName),
        })),

      // Wake-word & 5-second activation implementation (§2 & §3)
      setWakeState: (wakeState) =>
        set((s) => ({
          wakeState,
          character:
            wakeState === "foreground_listening" || wakeState === "command_recognition"
              ? "listening"
              : wakeState === "speaking"
                ? "speaking"
                : wakeState === "error" || wakeState === "permission_denied"
                  ? "error"
                  : "idle",
          audit: pushAudit(s.audit, `Wake-word listener state changed to ${wakeState}.`),
        })),

      addWakePhrase: (phrase) => {
        const clean = phrase.trim();
        if (!clean) return;
        set((s) => ({
          wakePhrases: [
            ...s.wakePhrases,
            { id: uid("wp"), phrase: clean, enabled: true, builtIn: false },
          ],
          audit: pushAudit(s.audit, `Added custom wake phrase: “${clean}”.`),
        }));
      },

      toggleWakePhrase: (id) =>
        set((s) => ({
          wakePhrases: s.wakePhrases.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)),
        })),

      removeWakePhrase: (id) =>
        set((s) => ({
          wakePhrases: s.wakePhrases.filter((p) => p.id !== id || p.builtIn),
        })),

      triggerWakePhrase: (spokenInput) => {
        const s = get();
        const parsed = parseWakePhraseInput(spokenInput, s.wakePhrases);
        const activeProject = s.projects.find((p) => p.id === s.projectId)?.name ?? "Atlas Commerce";
        const pendingTasks = s.workTasks.filter((t) => t.projectId === s.projectId && t.status !== "completed").length;
        const pendingApprovals = s.jobs.filter((j) => j.state === "awaiting").length;
        const greeting = generateContextualGreeting({
          parsed,
          activeProjectName: activeProject,
          pendingTaskCount: pendingTasks,
          pendingApprovalCount: pendingApprovals,
        });

        clearTimers();
        const epoch = s.epoch;

        // Stage 1: Wake detected (0s)
        set({
          wakeState: "wake_detected",
          activationStage: 1,
          activationGreeting: greeting,
          pendingWakeCommand: parsed.preservedCommand,
          character: "listening",
          transcript: `Wake phrase detected: “${parsed.matchedPhrase ?? spokenInput}”${parsed.preservedCommand ? ` · Preserved command: “${parsed.preservedCommand}”` : ""}`,
          audit: pushAudit(
            s.audit,
            `Wake phrase triggered (${parsed.matchedPhrase ?? "manual"}).${parsed.preservedCommand ? ` Retained command: ${parsed.preservedCommand}` : ""}`,
          ),
        });

        // Stage 2: Companion emergence (1.2s)
        later(() => {
          if (get().epoch !== epoch || get().activationStage === 0) return;
          set({
            wakeState: "activating",
            activationStage: 2,
            character: "processing",
          });
        }, 1200);

        // Stage 3: Presence established (2.5s)
        later(() => {
          if (get().epoch !== epoch || get().activationStage === 0) return;
          set({
            wakeState: "activating",
            activationStage: 3,
            character: "listening",
          });
        }, 2500);

        // Stage 4: Greeting or command execution (3.8s)
        later(() => {
          if (get().epoch !== epoch || get().activationStage === 0) return;
          set({
            wakeState: "speaking",
            activationStage: 4,
            character: "speaking",
          });
          void speak(greeting, {
            onstart: () => {},
            onend: () => {},
            onerror: () => {},
          });
        }, 3800);

        // Complete 5-second activation sequence (5.0s)
        later(() => {
          if (get().epoch !== epoch || get().activationStage === 0) return;
          get().skipActivationIntro();
        }, 5000);
      },

      skipActivationIntro: () => {
        clearTimers();
        const s = get();
        const preserved = s.pendingWakeCommand.trim();
        const greeting =
          s.activationGreeting ||
          "Hello. I'm here. What are we working on today?";

        const greetingMsg: Message = {
          id: uid("l"),
          role: "lorin",
          text: greeting,
          model: "ollama-local",
          specialists: ["Riley", "Owen"],
          at: Date.now(),
        };

        set({
          activationStage: 0,
          wakeState: s.micGranted ? "foreground_listening" : "command_recognition",
          character: "idle",
          pendingWakeCommand: "",
          messages: [...s.messages, greetingMsg].slice(-100),
          events: pushEvent(s.events, "Companion activated", greeting),
        });

        if (preserved) {
          get().send(preserved, { fromVoice: true });
        }
      },

      // Explore LORIN guided walkthrough & scenarios (§5)
      startExplore: () => {
        const firstStep = EXPLORE_STEPS[0];
        set((s) => ({
          exploreActive: true,
          exploreStep: 1,
          view: firstStep.view,
          mode: "workspace",
          audit: pushAudit(s.audit, "Started 'Explore how LORIN works' guided walkthrough."),
        }));
      },

      setExploreStep: (step) => {
        const clamped = Math.max(1, Math.min(EXPLORE_STEPS.length, step));
        const target = EXPLORE_STEPS.find((item) => item.step === clamped) ?? EXPLORE_STEPS[0];
        set((s) => ({
          exploreActive: true,
          exploreStep: clamped,
          view: target.view,
          audit:
            clamped === EXPLORE_STEPS.length
              ? pushAudit(s.audit, "Completed all 18 steps of the Explore LORIN walkthrough.")
              : s.audit,
        }));
      },

      stopExplore: () => set({ exploreActive: false }),

      runGuidedScenario: (scenarioId) => {
        const scenario = GUIDED_SCENARIOS.find((sc) => sc.id === scenarioId);
        if (!scenario) return;
        const s = get();
        set({
          view: scenario.view,
          mode: "workspace",
          completedScenarios: s.completedScenarios.includes(scenarioId)
            ? s.completedScenarios
            : [...s.completedScenarios, scenarioId],
          audit: pushAudit(s.audit, `Executed guided scenario: ${scenario.title}.`),
          events: pushEvent(s.events, `Scenario: ${scenario.title}`, scenario.description),
        });

        if (scenario.id === "sc-meet") {
          get().triggerWakePhrase("Hey LORIN");
        } else if (scenario.id === "sc-research" && scenario.samplePrompt) {
          get().send(scenario.samplePrompt);
        } else if (scenario.id === "sc-presence") {
          get().startSimulatedCall();
        } else if (scenario.id === "sc-pair") {
          get().issuePairCode("dev2");
        } else if (scenario.id === "sc-storage") {
          get().createBackupSnapshot("Scenario Automated Snapshot");
        }
      },

      // Semi-autonomous mode & Presence Call-In (§12 & §15)
      setAutomationLevel: (level) => {
        const safeLevel: AutomationLevel = level === 3 ? 2 : level;
        set((s) => ({
          automationLevel: safeLevel,
          emergencyStopped: false,
          audit: pushAudit(
            s.audit,
            level === 3
              ? "Level 3 Advanced Automation is locked by default policy. Applied Level 2 Semi-Automatic."
              : `Automation level set to Level ${safeLevel}.`,
          ),
        }));
      },

      triggerEmergencyStop: () => {
        clearTimers();
        silence();
        set((s) => ({
          emergencyStopped: true,
          automationLevel: 0,
          wakeState: "disabled",
          activationStage: 0,
          callInState: "idle",
          voice: "idle",
          character: "idle",
          jobs: s.jobs.map((j) =>
            j.state === "running"
              ? { ...j, state: "cancelled", evidence: "Halted immediately by Owner Emergency Stop." }
              : j,
          ),
          audit: pushAudit(s.audit, "EMERGENCY STOP activated by owner. All automation, active jobs, and voice listeners halted."),
          events: pushEvent(s.events, "Emergency Stop Activated", "Automation dropped to Level 0 (Manual) and running jobs cancelled."),
        }));
      },

      resumeAutomation: () =>
        set((s) => ({
          emergencyStopped: false,
          automationLevel: 2,
          audit: pushAudit(s.audit, "Owner cleared Emergency Stop and resumed Level 2 Semi-Automatic mode."),
        })),

      setQuietHours: (quietHoursEnabled) =>
        set((s) => ({
          quietHoursEnabled,
          audit: pushAudit(s.audit, `Presence quiet hours (22:30–06:30 WAT) ${quietHoursEnabled ? "enabled" : "disabled"}.`),
        })),

      startSimulatedCall: () => {
        const s = get();
        const project = s.projects.find((p) => p.id === s.projectId)?.name ?? "Atlas Commerce";
        const overdue = s.workTasks.filter((t) => t.status === "overdue");
        const awaiting = s.jobs.filter((j) => j.state === "awaiting");
        const conflicts = s.syncConflicts.filter((c) => c.status === "unresolved");

        const briefing = [
          `[SIMULATED CALL-IN BRIEFING · Tenant ${s.tenantId}]`,
          `Hello ${s.ownerName.split(" ")[0]}. Here is your live workspace synthesis for ${project}:`,
          `1. Priority Deadlines: ${overdue.length} overdue tasks (${overdue.map((t) => t.title).join("; ") || "None"}).`,
          `2. Approval Queue: ${awaiting.length} scoped capability action(s) awaiting your decision.`,
          `3. Synchronization: ${conflicts.length} unresolved conflict(s) in Synchronization Centre.`,
          `No external PSTN or cellular call was placed. What would you like to review first?`,
        ].join("\n");

        set({
          callInState: "ringing",
          callBriefingText: briefing,
          audit: pushAudit(s.audit, "Initiated SIMULATED Presence Call-In briefing."),
        });
      },

      acceptSimulatedCall: () => {
        const s = get();
        set({
          callInState: "connected",
          character: "speaking",
          events: pushEvent(s.events, "Accepted simulated Call-In", "Synthesized briefing from active tasks and approvals."),
          audit: pushAudit(s.audit, "Accepted SIMULATED Presence Call-In briefing."),
        });
        void speak(s.callBriefingText.replace(/\[.*?\]/g, ""), {
          onstart: () => {},
          onend: () => {
            if (get().callInState === "connected") {
              set({ character: "idle" });
            }
          },
          onerror: () => {},
        });
      },

      toggleMuteCall: () =>
        set((s) => {
          const next = s.callInState === "muted" ? "connected" : "muted";
          if (next === "muted") silence();
          return { callInState: next };
        }),

      endSimulatedCall: () => {
        silence();
        set((s) => ({
          callInState: "idle",
          character: "idle",
          audit: pushAudit(s.audit, "Ended SIMULATED Presence Call-In session."),
        }));
      },

      acknowledgePresenceEvent: (id) =>
        set((s) => ({
          presenceEvents: s.presenceEvents.map((pe) =>
            pe.id === id ? { ...pe, status: "acknowledged" } : pe,
          ),
          audit: pushAudit(s.audit, `Acknowledged Presence event ${id}.`),
        })),

      markNotificationRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      // M6 Device Centre actions (§11)
      issuePairCode: (id) => {
        const code = `${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        set((s) => ({
          devices: s.devices.map((d) =>
            d.id === id && d.phase !== "session"
              ? {
                  ...d,
                  phase: "code",
                  paired: false,
                  online: false,
                  code,
                  note: "One-time cryptographic challenge issued (expires in 5 min). Requires owner approval.",
                }
              : d,
          ),
          audit: pushAudit(s.audit, `Issued one-time cryptographic pairing challenge for ${id}.`),
        }));
      },

      confirmHandshake: (id) => {
        const fp = `ed25519:${Math.random().toString(16).slice(2, 6)}:${Math.random().toString(16).slice(2, 6)}:verified`;
        set((s) => ({
          devices: s.devices.map((d) =>
            d.id === id && d.phase === "code"
              ? {
                  ...d,
                  phase: "paired",
                  paired: true,
                  online: true,
                  keyFingerprint: fp,
                  lastSeen: "Just paired",
                  note: "Pair-once cryptographic trust record saved. Reconnects across networks without Primary Node privilege escalation.",
                }
              : d,
          ),
          audit: pushAudit(s.audit, `Device ${id} paired with key fingerprint ${fp}.`),
          events: pushEvent(s.events, "Cryptographic device pairing", `Registered public key ${fp} for ${id}.`),
        }));
      },

      revokeDevice: (id) =>
        set((s) => ({
          devices: s.devices.map((d) =>
            d.id === id && d.phase !== "session"
              ? {
                  ...d,
                  phase: "unpaired",
                  paired: false,
                  online: false,
                  code: undefined,
                  keyFingerprint: "revoked",
                  note: "Device trust revoked by owner. All future sync requests from this key will be rejected.",
                }
              : d,
          ),
          audit: pushAudit(s.audit, `Revoked device trust and permissions for ${id}.`),
          events: pushEvent(s.events, "Device revoked", `Revoked cryptographic trust for ${id}.`),
        })),

      toggleDeviceScope: (deviceId, scope) =>
        set((s) => ({
          devices: s.devices.map((d) => {
            if (d.id !== deviceId) return d;
            const current = d.scopes ?? [];
            const exists = current.includes(scope);
            const nextScopes = exists ? current.filter((sc) => sc !== scope) : [...current, scope];
            return { ...d, scopes: nextScopes };
          }),
          audit: pushAudit(s.audit, `Updated permission scope '${scope}' on device ${deviceId}.`),
        })),

      simulateNetworkHandover: (deviceId, transport) =>
        set((s) => ({
          devices: s.devices.map((d) =>
            d.id === deviceId
              ? {
                  ...d,
                  transport,
                  online: transport !== "Offline Queue",
                  note: `Network changed to ${transport}. Existing cryptographic pairing retained without re-pairing.`,
                }
              : d,
          ),
          audit: pushAudit(s.audit, `Device ${deviceId} switched transport to ${transport} using existing pair-once identity.`),
        })),

      // M9 Sync, Storage & Backup actions (§14)
      resolveSyncConflict: (id, resolution) =>
        set((s) => {
          const conflict = s.syncConflicts.find((c) => c.id === id);
          if (!conflict) return s;
          const note =
            resolution === "resolved_merged"
              ? "Merged independent changes and incremented version vector."
              : resolution === "resolved_local"
                ? `Accepted local version (${conflict.localDevice}).`
                : `Accepted remote version (${conflict.remoteDevice}).`;
          return {
            syncConflicts: s.syncConflicts.map((c) =>
              c.id === id ? { ...c, status: resolution, resolvedNote: note } : c,
            ),
            events: pushEvent(s.events, "Sync conflict resolved", `${conflict.entityTitle} · ${note}`),
            audit: pushAudit(s.audit, `Resolved sync conflict ${id} (${resolution}).`),
          };
        }),

      simulatePeerSync: (title, originDevice) =>
        set((s) => {
          const nextVer = (s.syncOps[0]?.version ?? 18) + 1;
          const op: SyncOperationRecord = {
            id: uid("so"),
            opId: `op_${Math.random().toString(16).slice(2, 8)}`,
            entityType: "task",
            entityTitle: title,
            originDevice,
            targetDevice: "This browser (PWA Session)",
            version: nextVer,
            status: s.online ? "acknowledged" : "queued_offline",
            transport: s.online ? "Local Wi-Fi (mDNS/TLS)" : "Offline Queue",
            at: Date.now(),
          };
          const newTask: WorkTask = {
            id: uid("wt"),
            projectId: s.projectId,
            title,
            assignee: originDevice,
            status: "in_progress",
            priority: "medium",
            dueAt: "2026-11-29",
            summary: `Synchronized from ${originDevice} via change journal (${op.opId} · v${nextVer}).`,
          };
          return {
            syncOps: [op, ...s.syncOps],
            workTasks: [newTask, ...s.workTasks],
            events: pushEvent(s.events, "Peer sync received", `${title} from ${originDevice} (v${nextVer})`),
            audit: pushAudit(s.audit, `Applied idempotent sync operation ${op.opId} (v${nextVer}) from ${originDevice}.`),
          };
        }),

      createBackupSnapshot: (label) =>
        set((s) => {
          const ts = new Date().toISOString().replace("T", " ").slice(0, 16) + " WAT";
          const totalSize = s.storageObjects.reduce((acc, obj) => acc + obj.sizeKb, 420);
          const bk: BackupRecord = {
            id: uid("bk"),
            label: label?.trim() || `Manual Workspace Snapshot (${s.tenantId})`,
            createdAt: ts,
            sizeKb: totalSize,
            checksum: computeChecksum(`${s.tenantId}-${ts}-${totalSize}`),
            location: `Local Primary Node Vault (/backups/${s.tenantId}-${Date.now()}.tar.enc)`,
            integrity: "Pending restore check",
            restoreVerified: false,
            lastVerifiedAt: null,
          };
          return {
            backups: [bk, ...s.backups],
            audit: pushAudit(s.audit, `Created encrypted backup snapshot ${bk.id} (${bk.sizeKb} KB). Pending restore verification.`),
          };
        }),

      verifyBackupRestore: (backupId) =>
        set((s) => {
          const ts = new Date().toISOString().replace("T", " ").slice(0, 19) + " WAT";
          return {
            backups: s.backups.map((b) =>
              b.id === backupId
                ? {
                    ...b,
                    integrity: "SHA-256 matched",
                    restoreVerified: true,
                    lastVerifiedAt: ts,
                  }
                : b,
            ),
            events: pushEvent(s.events, "Backup restore verified", `Snapshot ${backupId} passed non-destructive restore test.`),
            audit: pushAudit(s.audit, `Verified backup ${backupId} via non-destructive restore and SHA-256 checksum test.`),
          };
        }),

      importDocumentFile: (title, body, category, vault = "knowledge") =>
        set((s) => {
          const cleanTitle = title.trim() || "Imported Document";
          const cleanBody = body.trim() || cleanTitle;
          const checksum = computeChecksum(cleanTitle + cleanBody);
          const newDoc: Doc = {
            id: uid("doc"),
            vault,
            title: cleanTitle,
            body: cleanBody,
            tags: [category.toLowerCase().replace(/\s+/g, "-"), "imported"],
            indexed: vault === "knowledge",
            scope: s.projectId === "p2" ? "public" : "atlas",
            topic: category,
            category,
            provenance: `Owner Imported Document · Tenant ${s.tenantId}`,
            version: "1.0.0",
            verified: true,
            createdAt: new Date().toISOString().slice(0, 10),
            checksum,
          };
          const storageItem: StorageObjectRecord = {
            id: uid("st"),
            name: cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_") + ".md",
            category: "Document",
            projectId: s.projectId,
            sizeKb: Math.max(4, Math.round(cleanBody.length / 32)),
            version: "v1.0.0",
            checksum,
            location: "Local IndexedDB / Vault",
            encrypted: true,
            updatedAt: new Date().toISOString().replace("T", " ").slice(0, 16),
          };
          return {
            docs: [newDoc, ...s.docs],
            storageObjects: [storageItem, ...s.storageObjects],
            events: pushEvent(s.events, "Document imported & indexed", `${cleanTitle} (${checksum})`),
            audit: pushAudit(s.audit, `Imported document “${cleanTitle}” into ${vault} vault with checksum ${checksum}.`),
          };
        }),

      deleteDocument: (docId) =>
        set((s) => ({
          docs: s.docs.filter((d) => d.id !== docId),
          audit: pushAudit(s.audit, `Deleted document ${docId} from local vault.`),
        })),

      createWorkTask: (title, projectId, priority, dueAt) =>
        set((s) => {
          const clean = title.trim();
          if (!clean) return s;
          const task: WorkTask = {
            id: uid("wt"),
            projectId: projectId || s.projectId,
            title: clean,
            assignee: s.ownerName.split(" ")[0],
            status: "todo",
            priority,
            dueAt: dueAt || "2026-11-30",
            summary: "Created by owner in Tasks & Approvals workspace.",
          };
          return {
            workTasks: [task, ...s.workTasks],
            events: pushEvent(s.events, "Task created", clean),
            audit: pushAudit(s.audit, `Created task “${clean}” in project ${task.projectId}.`),
          };
        }),

      toggleWorkTaskStatus: (taskId) =>
        set((s) => ({
          workTasks: s.workTasks.map((t) =>
            t.id === taskId
              ? { ...t, status: t.status === "completed" ? "in_progress" : "completed" }
              : t,
          ),
          audit: pushAudit(s.audit, `Toggled completion status for task ${taskId}.`),
        })),

      approveMemory: (memoryId) =>
        set((s) => ({
          memories: s.memories.map((m) => (m.id === memoryId ? { ...m, verified: true } : m)),
          audit: pushAudit(s.audit, `Approved GIDEON memory ${memoryId}.`),
        })),

      togglePinMemory: (memoryId) =>
        set((s) => ({
          memories: s.memories.map((m) => (m.id === memoryId ? { ...m, pinned: !m.pinned } : m)),
        })),

      deleteMemory: (memoryId) =>
        set((s) => ({
          memories: s.memories.filter((m) => m.id !== memoryId),
          audit: pushAudit(s.audit, `Deleted memory record ${memoryId}.`),
        })),

      reset: () => {
        clearTimers();
        silence();
        const isLive = get().envMode === "live";
        set({ ...(isLive ? freshLive() : freshDemo()), epoch: get().epoch + 1 });
      },
    }),
    {
      name: "lorin-m0-m9-v2",
      skipHydration: true,
      partialize: (state) => {
        const {
          commandPaletteOpen: _commandPaletteOpen,
          activationStage: _activationStage,
          callInState: _callInState,
          ...rest
        } = state;
        return rest;
      },
    },
  ),
);
