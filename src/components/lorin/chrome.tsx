import type { ReactNode } from "react";
import {
  Activity,
  Archive,
  Bell,
  BookOpen,
  BrainCircuit,
  Calendar,
  ChevronRight,
  CircleAlert,
  Cloud,
  Compass,
  Cpu,
  Eye,
  FileCheck2,
  FolderKanban,
  History,
  Home,
  Lock,
  Menu,
  MessageSquare,
  Mic,
  MonitorSmartphone,
  PanelRight,
  Plug,
  RefreshCw,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  UserCheck,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import { useLorin, type Mode, type View } from "@/lib/lorin/store";
import { formatWakeStateLabel } from "@/lib/lorin/wake";
import { ExploreWalkthroughBar } from "./ExploreWalkthrough";

const GROUPS: {
  label: string;
  items: { id: View; label: string; icon: LucideIcon; hint?: string }[];
}[] = [
  {
    label: "Personal Workspace",
    items: [
      { id: "home", label: "Today", icon: Home },
      { id: "companion", label: "LORIN Companion", icon: Sparkles },
      { id: "chat", label: "Conversations", icon: MessageSquare },
      { id: "projects", label: "Projects", icon: FolderKanban },
      { id: "tasks", label: "Tasks & approvals", icon: Activity },
      { id: "calendar", label: "Calendar & contacts", icon: Calendar },
      { id: "workbench", label: "Engineering workbench", icon: Cpu },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { id: "intelligence", label: "Intelligence studio", icon: BrainCircuit },
      { id: "knowledge", label: "Knowledge vault", icon: BookOpen },
      { id: "vault", label: "Private vault", icon: Lock },
      { id: "memory", label: "Memory (GIDEON)", icon: Sparkles },
      { id: "gideon", label: "Continuity", icon: History },
      { id: "voice", label: "Voice & wake word", icon: Mic },
      { id: "vision", label: "Vision", icon: Eye },
    ],
  },
  {
    label: "Execution",
    items: [
      { id: "sandbox", label: "Sandbox", icon: Terminal, hint: "Planned runtime" },
      { id: "automation", label: "Automation", icon: Workflow },
      { id: "verification", label: "Verification", icon: FileCheck2 },
    ],
  },
  {
    label: "Connected Environment",
    items: [
      { id: "devices", label: "Device centre", icon: MonitorSmartphone },
      { id: "connections", label: "Connections", icon: Plug },
      { id: "presence", label: "Presence centre", icon: Bell },
      { id: "storage", label: "Cloud & storage", icon: Archive },
      { id: "sync", label: "Synchronization", icon: RefreshCw },
    ],
  },
  {
    label: "Security & Administration",
    items: [
      { id: "trust", label: "Security centre", icon: ShieldCheck },
      { id: "audit", label: "Audit history", icon: History },
      { id: "owner", label: "Owner control", icon: UserCheck },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

export const VIEW_META: Record<View, { title: string; subtitle: string }> = {
  home: { title: "Today", subtitle: "Your personal intelligence workspace" },
  companion: { title: "LORIN Companion", subtitle: "3D real-time presence, 5s wake activation & adaptive mode controller." },
  chat: { title: "Conversations", subtitle: "One assistant. Context-aware, private by default." },
  projects: { title: "Projects", subtitle: "Keep work, context and decisions together." },
  tasks: { title: "Tasks & approvals", subtitle: "Review proposed actions and manage project tasks." },
  calendar: { title: "Calendar & contacts", subtitle: "Upcoming deadlines, milestones and trusted contacts." },
  workbench: { title: "Engineering workbench", subtitle: "Review controlled changes and their evidence." },
  intelligence: { title: "Intelligence studio", subtitle: "Models, providers, downloads and local hardware readiness." },
  knowledge: { title: "Knowledge vault", subtitle: "Approved documents, 20-domain knowledge base and file import." },
  vault: { title: "Private vault", subtitle: "Private notes remain separate from shared knowledge." },
  memory: { title: "Memory (GIDEON)", subtitle: "Owner-controlled memories with clear provenance." },
  gideon: { title: "Continuity", subtitle: "A reliable record of decisions and important events." },
  voice: { title: "Voice & wake word", subtitle: "15-state wake listener, trailing command capture and speech output." },
  vision: { title: "Vision", subtitle: "Owner-selected visual inputs, with transparent processing status." },
  sandbox: { title: "Sandbox", subtitle: "Isolated execution workspace — runtime setup pending." },
  automation: { title: "Automation", subtitle: "Autonomy Levels 0–2, approval rules and Owner Emergency Stop." },
  verification: { title: "Verification", subtitle: "M1–M9 acceptance matrix, scenario runner and evidence checks." },
  devices: { title: "Device centre", subtitle: "Cryptographic device fabric, transport handover and scope controls." },
  connections: { title: "Connections", subtitle: "Manage trusted sources and their permissions." },
  presence: { title: "Presence centre", subtitle: "Proactive P0–P4 briefings, notifications and simulated Call-In." },
  storage: { title: "Cloud & storage", subtitle: "Content-addressed local-first objects and verified restore backups." },
  sync: { title: "Synchronization centre", subtitle: "Durable change journal, multi-client sync and conflict resolution." },
  trust: { title: "Security centre", subtitle: "Permissions, policy boundaries and capability registry." },
  audit: { title: "Audit history", subtitle: "Tamper-evident security log and JSON export." },
  owner: { title: "Owner control", subtitle: "Demo/Live tenant isolation and platform installation truth matrix." },
  settings: { title: "Settings", subtitle: "Hardware diagnostics, privacy defaults and keyboard shortcuts." },
};

export const MODES: Mode[] = ["workspace", "companion", "compact", "immersive", "ambient"];

export function faceCaption(state: string, voice: string, source: string) {
  if (voice === "listening" && source === "microphone") return "Listening · microphone";
  if (voice === "listening" && source === "script") return "Listening · scripted input";
  if (voice === "speaking") return "Speaking · browser speech";
  if (voice === "processing") return "Processing";
  return state.charAt(0).toUpperCase() + state.slice(1);
}

export function Face({
  state,
  caption,
  size = "normal",
}: {
  state: string;
  caption: string;
  size?: "normal" | "large";
}) {
  const live = state === "listening" || state === "speaking";
  const busy = state === "processing" || state === "researching" || state === "coding";
  const warn = state === "error" || state === "offline";
  return (
    <div className={`lorin-presence flex flex-col items-center ${size === "large" ? "gap-5" : "gap-3"}`}>
      <div
        className={`lorin-orbital ${size === "large" ? "lorin-orbital-large" : ""} ${live ? "is-live" : ""} ${busy ? "is-busy" : ""} ${warn ? "is-warning" : ""}`}
        aria-label={`LORIN status: ${caption}`}
        role="img"
      >
        <span className="orbital-ring orbital-ring-one" />
        <span className="orbital-ring orbital-ring-two" />
        <span className="orbital-core">
          <span className="orbital-core-mark">L</span>
        </span>
        <span className="orbital-spark orbital-spark-one" />
        <span className="orbital-spark orbital-spark-two" />
      </div>
      <p className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted">
        <span className={`status-dot ${live ? "status-dot-live" : warn ? "status-dot-warning" : ""}`} />
        {caption}
      </p>
    </div>
  );
}

function BrandMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <span>L</span>
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const s = useLorin();
  const project = s.projects.find((p) => p.id === s.projectId) ?? s.projects[0];
  const pending = s.jobs.filter((j) => j.state === "awaiting").length;
  const openConflicts = s.syncConflicts.filter((c) => c.status === "unresolved").length;
  const unackPresence = s.presenceEvents.filter((e) => e.status !== "acknowledged").length;
  const iconOnly = s.mode === "companion";
  const showNav = s.mode !== "compact";
  const meta = VIEW_META[s.view] ?? VIEW_META.home;
  const wakeStatus = formatWakeStateLabel(s.wakeState);

  return (
    <div
      className={`lorin-app-shell flex min-h-dvh bg-bg text-fg ${s.themeMode === "light" ? "theme-light" : ""}`}
    >
      <a href="#main" className="skip-link">
        Skip to workspace
      </a>

      {s.drawer && showNav && (
        <button
          className="nav-backdrop md:hidden"
          aria-label="Close navigation"
          onClick={() => s.setDrawer(false)}
        />
      )}

      {showNav && (
        <aside
          className={`lorin-sidebar ${s.drawer ? "is-open" : ""} ${iconOnly ? "is-collapsed" : ""}`}
          aria-label="Main navigation"
        >
          <div className="sidebar-top">
            <div className="flex min-w-0 items-center gap-3">
              <BrandMark />
              <div className={iconOnly ? "hidden" : "min-w-0"}>
                <p className="font-display text-[15px] font-semibold tracking-[0.16em]">LORIN</p>
                <p className="truncate text-[11px] text-muted">
                  {s.envMode === "demo" ? "Demo · Alex Mercer" : "Owner Live Workspace"}
                </p>
              </div>
            </div>
            <button
              className="icon-button md:hidden"
              onClick={() => s.setDrawer(false)}
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => s.setView("projects")}
            className={`sidebar-project text-left ${iconOnly ? "justify-center" : ""}`}
          >
            <span className="project-avatar">{(project?.name ?? "L").slice(0, 1).toUpperCase()}</span>
            <div className={iconOnly ? "hidden" : "min-w-0 flex-1"}>
              <p className="truncate text-sm font-medium">{project?.name ?? "Workspace"}</p>
              <p className="text-[11px] text-muted">Active workspace</p>
            </div>
            {!iconOnly && <ChevronRight size={14} className="text-muted" />}
          </button>

          <nav className="sidebar-nav">
            {GROUPS.map((group) => (
              <div key={group.label} className="nav-group">
                <p className={`nav-group-label ${iconOnly ? "sr-only" : ""}`}>{group.label}</p>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = s.view === item.id;
                  const badgeCount =
                    item.id === "tasks"
                      ? pending
                      : item.id === "sync"
                        ? openConflicts
                        : item.id === "presence"
                          ? unackPresence
                          : 0;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => s.setView(item.id)}
                      aria-current={active ? "page" : undefined}
                      title={iconOnly ? item.label : undefined}
                      className={`nav-item ${active ? "is-active" : ""} ${iconOnly ? "is-icon-only" : ""}`}
                    >
                      <Icon size={17} strokeWidth={1.8} />
                      <span className={iconOnly ? "sr-only" : "nav-item-label"}>{item.label}</span>
                      {badgeCount > 0 && !iconOnly && <span className="nav-count">{badgeCount}</span>}
                      {item.hint && !iconOnly && <span className="nav-hint">Preview</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className={`sidebar-bottom ${iconOnly ? "hidden" : ""}`}>
            <div className="sidebar-status-card">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium">Environment</span>
                <span className="lorin-badge lorin-badge-teal">
                  {s.envMode === "demo" ? "DEMO · M1–M9" : "LIVE OWNER"}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">
                {s.envMode === "demo"
                  ? "Isolated demo tenant (demo-atlas-01). No live cloud credentials used."
                  : "Isolated live owner namespace (live-owner-01)."}
              </p>
              <button
                type="button"
                className="sidebar-status-link"
                onClick={() => s.setView("owner")}
              >
                Manage tenant isolation <ChevronRight size={13} />
              </button>
            </div>
            <div className="flex items-center justify-between px-2 pt-3 text-[10px] text-muted">
              <span>Owner-controlled workspace</span>
              <ShieldCheck size={13} />
            </div>
          </div>
        </aside>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="lorin-topbar">
          <div className="flex min-w-0 items-center gap-3">
            {showNav && (
              <button
                className="icon-button md:hidden"
                onClick={() => s.setDrawer(true)}
                aria-label="Open navigation"
              >
                <Menu size={19} />
              </button>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold">{meta.title}</p>
                <span className="hidden text-muted sm:inline">/</span>
                <p className="hidden truncate text-xs text-muted sm:block">{project?.name}</p>
              </div>
              <p className="truncate text-[11px] text-muted">{meta.subtitle}</p>
            </div>
          </div>

          <div className="topbar-actions">
            {wakeStatus.activeMic && (
              <button
                type="button"
                onClick={() => s.setView("voice")}
                className="lorin-badge lorin-badge-teal flex items-center gap-1.5"
                title="Microphone active — click to manage wake-word listener"
              >
                <span className="status-dot status-dot-live" />
                <span>Mic: {wakeStatus.label}</span>
              </button>
            )}

            {s.emergencyStopped && (
              <button
                type="button"
                onClick={() => s.setView("automation")}
                className="lorin-badge lorin-badge-red flex items-center gap-1"
              >
                <ShieldAlert size={12} />
                <span>Emergency Stop</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => s.setView("owner")}
              className="runtime-chip hidden lg:inline-flex"
              title="Switch between Demo and Live environments"
            >
              <span className={`status-dot ${s.envMode === "live" ? "status-dot-live" : ""}`} />
              <span>{s.envMode === "demo" ? "Demo tenant" : "Live owner"}</span>
            </button>

            <button
              type="button"
              className={`topbar-button ${s.exploreActive ? "is-selected" : ""}`}
              onClick={() => (s.exploreActive ? s.stopExplore() : s.startExplore())}
              title="Guided interactive walkthrough of LORIN M1–M9"
            >
              <Compass size={14} className="text-teal" />
              <span className="hidden sm:inline">Explore how LORIN works.</span>
              <span className="sm:hidden">Explore</span>
            </button>

            <button
              type="button"
              className="topbar-button"
              onClick={() => s.setCommandPaletteOpen(true)}
              aria-label="Open command palette (Cmd+K)"
              title="Open command palette (Cmd+K / Ctrl+K)"
            >
              <Search size={14} />
              <span className="hidden sm:inline">Commands</span>
              <kbd className="kbd-key hidden md:inline-flex">⌘K</kbd>
            </button>

            <label className="sr-only" htmlFor="route">
              Model routing preference
            </label>
            <select
              id="route"
              className="topbar-select hidden sm:inline-flex"
              value={s.route}
              onChange={(e) => s.setRoute(e.target.value as typeof s.route)}
            >
              <option value="auto">Automatic routing</option>
              <option value="ollama">Prefer local</option>
              <option value="gemini">Request Gemini</option>
              <option value="local-only">Local only</option>
            </select>

            <button
              className={`topbar-button hidden xl:inline-flex ${s.online ? "" : "is-selected"}`}
              onClick={() => s.setOnline(!s.online)}
              title="This changes the demo's simulated network state only"
            >
              {s.online ? "Simulate offline" : "End offline"}
            </button>

            {s.mode === "workspace" && (
              <button
                className={`icon-button hidden md:grid ${s.inspector ? "is-selected" : ""}`}
                onClick={() => s.setInspector(!s.inspector)}
                aria-pressed={s.inspector}
                aria-label="Toggle context inspector"
                title="Context inspector"
              >
                <PanelRight size={17} />
              </button>
            )}
          </div>
        </header>

        {s.mode !== "compact" && (
          <div className="mode-bar">
            <div className="mode-switcher" role="group" aria-label="Workspace presentation mode">
              {MODES.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => s.setMode(mode)}
                  aria-pressed={s.mode === mode}
                  className={`mode-option ${s.mode === mode ? "is-active" : ""}`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <div className="hidden items-center gap-2 text-[11px] text-muted lg:flex">
              <span>{pending} pending approvals</span>
              <span className="mode-bar-divider" />
              <span>{openConflicts} sync conflicts</span>
              <span className="mode-bar-divider" />
              <span>{s.online ? "Online simulation" : "Offline simulation"}</span>
            </div>
          </div>
        )}

        <ExploreWalkthroughBar />

        {s.projectId === "p2" && (
          <div className="system-banner system-banner-info">
            <ShieldCheck size={15} />
            <span>MOSAIRA is isolated. Private notes, memories and devices remain with Atlas.</span>
          </div>
        )}
        {s.route === "gemini" && !s.geminiVerified && (
          <div className="system-banner system-banner-warning">
            <CircleAlert size={15} />
            <span>
              Gemini is not live-verified in this demo. No request will be sent to a cloud provider.
            </span>
            <button onClick={() => s.setView("intelligence")}>View setup</button>
          </div>
        )}

        <div className="flex min-h-0 flex-1">
          <main id="main" className="lorin-main min-w-0 flex-1 overflow-auto">
            {children}
          </main>

          {s.inspector && s.mode === "workspace" && (
            <aside className="context-inspector hidden xl:block" aria-label="Workspace context">
              <div className="inspector-heading">
                <div>
                  <p className="text-sm font-semibold">Context</p>
                  <p className="mt-0.5 text-[11px] text-muted">Current session details</p>
                </div>
                <Activity size={16} className="text-muted" />
              </div>
              <div className="inspector-section">
                <p className="inspector-label">Operating environment</p>
                <p className="text-sm font-medium">
                  {s.envMode === "demo" ? "Demo (demo-atlas-01)" : "Live (live-owner-01)"}
                </p>
                <p className="mt-1 text-xs text-muted">
                  Autonomy: Level {s.automationLevel}
                </p>
              </div>
              <div className="inspector-section">
                <p className="inspector-label">Active project</p>
                <p className="text-sm font-medium">{project?.name ?? "None"}</p>
                <p className="mt-1 text-xs text-muted">{project?.note}</p>
              </div>
              <div className="inspector-section">
                <p className="inspector-label">Routing preference</p>
                <p className="text-sm font-medium capitalize">{s.route.replace("-", " ")}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {s.lastDecision?.reason ?? "No inference request has been made in this session."}
                </p>
              </div>
              <div className="inspector-section">
                <p className="inspector-label">Last response source</p>
                <p className="text-sm">{s.lastDecision?.model ?? "No model selected"}</p>
                <p className="mt-1 text-xs text-muted">
                  {s.lastDecision?.sources?.length
                    ? s.lastDecision.sources.join(", ")
                    : "No sources retrieved"}
                </p>
              </div>
              <div className="inspector-section">
                <p className="inspector-label">Specialist capabilities</p>
                <p className="text-sm">{s.lastDecision?.specialists?.join(", ") || "Not invoked"}</p>
              </div>
              <div className="inspector-section">
                <p className="inspector-label">Wake & voice state</p>
                <p className="text-sm">{wakeStatus.label}</p>
                <p className="mt-1 text-xs text-muted">
                  Microphone {s.micGranted ? "permission granted" : "not granted"}
                </p>
              </div>
              <div className="inspector-footnote">
                <Cloud size={14} />
                <span>
                  Cloud providers remain disabled until a real connection is configured and verified.
                </span>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
