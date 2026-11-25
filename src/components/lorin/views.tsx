import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  BadgeCheck,
  BookOpen,
  BrainCircuit,
  Check,
  CircleAlert,
  Cloud,
  CloudOff,
  Code2,
  Command,
  Compass,
  Cpu,
  Database,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Folder,
  FolderKanban,
  HardDrive,
  History,
  KeyRound,
  Keyboard,
  Laptop,
  Lock,
  MessageSquare,
  Mic,
  Network,
  PhoneIncoming,
  Pin,
  Plug,
  Plus,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  Trash2,
  Upload,
  Workflow,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { GUIDED_SCENARIOS } from "@/lib/lorin/demo-seed";
import { CAPABILITIES, POLICY_AFTER, POLICY_BEFORE, SPECIALISTS, type SyncProfile } from "@/lib/lorin/engine";
import { NAVIGATION_SHORTCUTS } from "@/lib/lorin/shortcuts";
import { useLorin, type DeviceTransport, type View } from "@/lib/lorin/store";
import { formatWakeStateLabel, getWakeWordCapabilities } from "@/lib/lorin/wake";
import { CompanionCanvas } from "./CompanionCanvas";
import { MODES } from "./chrome";
import {
  AuditView,
  AutomationView,
  CalendarView,
  CompanionView,
  OwnerControlView,
  PresenceView,
  StorageView,
  SyncView,
  VerificationView,
} from "./extended-views";
import { HardwareStatus } from "./HardwareStatus";
import { useVoiceSession } from "./use-voice";

type Tone = "teal" | "indigo" | "amber" | "red" | "neutral";

function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: Tone }) {
  return <span className={`lorin-badge lorin-badge-${tone}`}>{children}</span>;
}

function Page({
  title,
  eyebrow,
  lede,
  actions,
  children,
  width = "wide",
}: {
  title: string;
  eyebrow?: string;
  lede?: string;
  actions?: ReactNode;
  children: ReactNode;
  width?: "wide" | "reading";
}) {
  return (
    <section className={`lorin-page ${width === "reading" ? "max-w-4xl" : "max-w-screen-2xl"}`}>
      <div className="page-heading">
        <div className="min-w-0">
          {eyebrow && <p className="page-eyebrow">{eyebrow}</p>}
          <h1 className="page-title">{title}</h1>
          {lede && <p className="page-lede">{lede}</p>}
        </div>
        {actions && <div className="page-actions">{actions}</div>}
      </div>
      {children}
    </section>
  );
}

function Panel({
  children,
  className = "",
  title,
  description,
  action,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <section className={`lorin-panel ${className}`}>
      {(title || description || action) && (
        <div className="panel-heading">
          <div className="min-w-0">
            {title && <h2 className="panel-title">{title}</h2>}
            {description && <p className="panel-description">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function ActionButton({
  children,
  onClick,
  icon: Icon,
  variant = "secondary",
  disabled = false,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: "primary" | "secondary" | "quiet";
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      className={`action-button action-button-${variant}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && <Icon size={15} />}
      <span>{children}</span>
    </button>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  onClick,
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  onClick?: () => void;
}) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="metric-icon">
          <Icon size={17} />
        </span>
        {onClick && <ArrowUpRight size={15} className="text-muted" />}
      </div>
      <div className="mt-5">
        <p className="metric-value">{value}</p>
        <p className="mt-1 text-sm font-medium">{label}</p>
        <p className="mt-1 text-xs text-muted">{detail}</p>
      </div>
    </>
  );
  return onClick ? (
    <button className="metric-card text-left" onClick={onClick}>
      {content}
    </button>
  ) : (
    <div className="metric-card">{content}</div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">
        <Icon size={21} />
      </span>
      <h3 className="font-medium">{title}</h3>
      <p className="max-w-md text-sm leading-relaxed text-muted">{description}</p>
      {action}
    </div>
  );
}

function HomeView() {
  const s = useLorin();
  const project = s.projects.find((p) => p.id === s.projectId);
  const pending = s.jobs.filter((j) => j.state === "awaiting");
  const verified = s.jobs.filter((j) => j.state === "verified").length;
  const knowledge = s.docs.filter((d) => d.vault === "knowledge").length;
  const turns = s.messages.filter((m) => m.role === "user").length;
  const latestEvent = s.events[0];
  const stats: { label: string; n: number; detail: string; icon: LucideIcon; view: View }[] = [
    { label: "Conversations", n: turns, detail: "Your messages in this session", icon: MessageSquare, view: "chat" },
    { label: "Projects", n: s.projects.length, detail: "Available workspaces", icon: FolderKanban, view: "projects" },
    { label: "Pending approvals", n: pending.length, detail: "Actions awaiting your review", icon: ShieldCheck, view: "tasks" },
    { label: "Knowledge records", n: knowledge, detail: "Current session records", icon: BookOpen, view: "knowledge" },
  ];

  return (
    <Page
      title="Your intelligence workspace"
      eyebrow="PERSONAL INTELLIGENCE · EVERYWHERE"
      lede={`A clear view of ${project?.name ?? "your workspace"}, recent activity and the capabilities available in this build.`}
      actions={
        <div className="flex flex-wrap gap-2">
          <ActionButton
            variant="secondary"
            icon={PhoneIncoming}
            onClick={() => s.startSimulatedCall()}
          >
            Simulate Call-In
          </ActionButton>
          <ActionButton
            variant="primary"
            icon={Compass}
            onClick={() => s.startExplore()}
          >
            Explore how LORIN works.
          </ActionButton>
        </div>
      }
    >
      <section className="lorin-hero">
        <div className="lorin-hero-copy">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="teal">Owner-controlled</Badge>
            <Badge>Local-first design</Badge>
            <Badge tone="indigo">
              {s.envMode === "demo" ? "Demo Tenant · Alex Mercer" : "Live Owner Environment"}
            </Badge>
          </div>
          <h2 className="hero-title">
            Think clearly.
            <br />
            <span>Get things done.</span>
          </h2>
          <p className="hero-description">
            LORIN brings your conversations, projects, knowledge, wake-word companion, local-first device fabric and approved actions into one private workspace.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <ActionButton variant="primary" icon={AudioLines} onClick={() => s.setView("chat")}>
              Start a conversation
            </ActionButton>
            <ActionButton icon={Compass} onClick={() => s.startExplore()}>
              Explore how LORIN works.
            </ActionButton>
            <ActionButton
              icon={Mic}
              onClick={() => s.triggerWakePhrase("LORIN, can you check the Atlas project?")}
            >
              Wake: “Check Atlas project”
            </ActionButton>
          </div>
        </div>
        <div className="lorin-hero-presence">
          <div className="hero-orbit-caption">
            <span className="status-dot status-dot-live" /> LORIN 3D CORE
          </div>
          <CompanionCanvas size={180} interactive />
          <p className="hero-presence-note">
            One assistant. Specialist capabilities work behind the scenes.
          </p>
        </div>
        <div className="hero-grid-lines" aria-hidden="true" />
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        {stats.map((item) => (
          <MetricCard
            key={item.label}
            label={item.label}
            value={item.n}
            detail={item.detail}
            icon={item.icon}
            onClick={() => s.setView(item.view)}
          />
        ))}
      </div>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
        <div className="flex flex-col gap-4">
          <Panel
            title="Guided Scenarios & Interactive Walkthrough"
            description="Run any of the 10 end-to-end M1–M9 scenarios directly against the live state store."
            action={
              <ActionButton variant="quiet" onClick={() => s.setView("verification")}>
                All 10 scenarios <ArrowRight size={14} />
              </ActionButton>
            }
          >
            <div className="grid gap-2 sm:grid-cols-2">
              {GUIDED_SCENARIOS.slice(0, 6).map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => s.runGuidedScenario(sc.id)}
                  className="approval-preview text-left transition-colors hover:border-teal/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold">{sc.title}</span>
                    <Badge tone="indigo">{sc.category}</Badge>
                  </div>
                  <p className="mt-1 line-clamp-2 text-[11px] text-muted">{sc.description}</p>
                </button>
              ))}
            </div>
          </Panel>

          <Panel
            title="System readiness"
            description="Live integrations are distinguished from prototype capabilities."
          >
            <div className="readiness-list">
              <ReadinessRow
                icon={Cpu}
                title="Model inference"
                detail="Local and cloud model calls are not connected in this demo."
                badge="Not connected"
                tone="amber"
              />
              <ReadinessRow
                icon={Cloud}
                title="Google Drive"
                detail="No Google account or Drive files are connected."
                badge="Not connected"
                tone="amber"
              />
              <ReadinessRow
                icon={Terminal}
                title="Secure sandbox"
                detail="The workbench is a proposal demo, not an isolated execution runtime."
                badge="Not provisioned"
                tone="neutral"
              />
              <ReadinessRow
                icon={Database}
                title="Knowledge vault"
                detail={`${knowledge} session records are available for local demo retrieval across 20 domains.`}
                badge="Session data"
                tone="teal"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionButton variant="quiet" icon={BrainCircuit} onClick={() => s.setView("intelligence")}>
                Intelligence studio
              </ActionButton>
              <ActionButton variant="quiet" icon={Plug} onClick={() => s.setView("connections")}>
                Connected services
              </ActionButton>
              <ActionButton variant="quiet" icon={Terminal} onClick={() => s.setView("sandbox")}>
                Sandbox plan
              </ActionButton>
            </div>
          </Panel>

          <Panel
            title="Recent continuity"
            description="GIDEON keeps a record of important changes in this session."
            action={
              <ActionButton variant="quiet" onClick={() => s.setView("gideon")}>
                View history <ArrowRight size={14} />
              </ActionButton>
            }
          >
            {latestEvent ? (
              <div className="activity-entry">
                <span className="activity-marker">
                  <History size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{latestEvent.title}</p>
                  <p className="mt-1 text-sm text-muted">{latestEvent.detail}</p>
                  <p className="mt-2 text-[11px] text-muted" suppressHydrationWarning>
                    {new Date(latestEvent.at).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={History}
                title="No continuity records"
                description="Verified activity will appear here."
              />
            )}
          </Panel>
        </div>

        <div className="flex flex-col gap-4">
          <Panel
            title="Approval queue"
            description="Review proposed actions before they are committed."
            action={<Badge tone={pending.length ? "amber" : "teal"}>{pending.length} waiting</Badge>}
          >
            {pending.length ? (
              <div className="flex flex-col gap-3">
                {pending.slice(0, 2).map((job) => (
                  <div key={job.id} className="approval-preview">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{job.title}</p>
                      <Badge
                        tone={
                          job.risk === "critical"
                            ? "red"
                            : job.risk === "write"
                              ? "amber"
                              : "teal"
                        }
                      >
                        {job.risk}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{job.scope}</p>
                  </div>
                ))}
                <ActionButton variant="primary" onClick={() => s.setView("tasks")}>
                  Review approvals <ArrowRight size={14} />
                </ActionButton>
              </div>
            ) : (
              <EmptyState
                icon={BadgeCheck}
                title="You're all caught up"
                description="There are no actions waiting for your approval."
              />
            )}
          </Panel>

          <Panel
            title="Proactive Presence Feed"
            description="Latest P0–P4 proactive events and briefings."
            action={
              <ActionButton variant="quiet" onClick={() => s.setView("presence")}>
                Presence Centre <ArrowRight size={14} />
              </ActionButton>
            }
          >
            <div className="flex flex-col gap-2">
              {s.presenceEvents.slice(0, 3).map((ev) => (
                <div key={ev.id} className="approval-preview">
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      tone={
                        ev.priority === "P0" || ev.priority === "P1"
                          ? "red"
                          : ev.priority === "P2"
                            ? "amber"
                            : "teal"
                      }
                    >
                      {ev.priority}
                    </Badge>
                    <span className="text-[10px] text-muted">{ev.category}</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold">{ev.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-[11px] text-muted">{ev.detail}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Current workspace" description="Your selected project and session context.">
            <div className="flex items-start gap-3">
              <span className="project-avatar project-avatar-large">
                {(project?.name ?? "L").slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{project?.name ?? "No project selected"}</p>
                <Badge tone={project?.status === "Active" ? "teal" : "neutral"}>
                  {project?.status ?? "Unavailable"}
                </Badge>
                <p className="mt-3 text-sm leading-relaxed text-muted">{project?.note}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-line pt-4">
              <div>
                <p className="text-xs text-muted">Verified actions</p>
                <p className="mt-1 text-xl font-semibold tabular-nums">{verified}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Approved memories</p>
                <p className="mt-1 text-xl font-semibold tabular-nums">
                  {s.memories.filter((m) => m.verified).length}
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </Page>
  );
}

function ReadinessRow({
  icon: Icon,
  title,
  detail,
  badge,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  detail: string;
  badge: string;
  tone: Tone;
}) {
  return (
    <div className="readiness-row">
      <span className="readiness-icon">
        <Icon size={17} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted">{detail}</p>
      </div>
      <Badge tone={tone}>{badge}</Badge>
    </div>
  );
}

function ChatView() {
  const s = useLorin();
  const [draft, setDraft] = useState("");
  const prompts = [
    "What does the Atlas brief say about verification?",
    "Summarize the permission model",
    "What is in the owner note?",
    "What do you remember?",
    "Explain distributed systems consensus",
    "Research the latest public boundary",
  ];
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.trim()) return;
    s.send(draft);
    setDraft("");
  };
  return (
    <Page
      title="Conversation"
      eyebrow="LORIN COMPANION"
      lede="A single conversational interface across LORIN's internal specialist capabilities."
      width="wide"
    >
      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="chat-context-strip">
            <span className="flex items-center gap-2">
              <span className="status-dot" /> Session conversation ·{" "}
              {s.projects.find((p) => p.id === s.projectId)?.name}
            </span>
            <span className="text-muted">
              {s.route === "local-only" ? "Local-only preference" : `${s.route} routing preference`}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            {s.messages.map((message) => (
              <article
                key={message.id}
                className={`chat-message ${message.role === "user" ? "chat-message-user" : "chat-message-lorin"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold tracking-wide">
                    {message.role === "user" ? "YOU" : "LORIN"}
                  </p>
                  {message.model && (
                    <Badge
                      tone={
                        message.model === "blocked" || message.model === "offline"
                          ? "amber"
                          : "neutral"
                      }
                    >
                      {message.model}
                    </Badge>
                  )}
                </div>
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {message.text}
                </p>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {message.sources.map((source) => (
                      <Badge key={source} tone="indigo">
                        {source}
                      </Badge>
                    ))}
                  </div>
                )}
                {message.specialists &&
                  message.specialists.length > 0 &&
                  message.role === "lorin" && (
                    <p className="mt-3 text-[11px] text-muted">
                      Internal capabilities consulted: {message.specialists.join(" · ")}. One
                      assistant identity.
                    </p>
                  )}
              </article>
            ))}
          </div>
          <form className="chat-composer" onSubmit={submit}>
            <label htmlFor="ask" className="sr-only">
              Ask LORIN
            </label>
            <textarea
              id="ask"
              rows={2}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Message LORIN…"
              className="chat-input"
            />
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] text-muted">
                Demo responses use session records. Live model inference is not connected.
              </p>
              <button
                className="action-button action-button-primary"
                type="submit"
                disabled={!draft.trim()}
              >
                Send <ArrowRight size={14} />
              </button>
            </div>
          </form>
          <div className="flex flex-wrap gap-2">
            {prompts.map((prompt) => (
              <button key={prompt} className="prompt-chip" onClick={() => setDraft(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          {s.mode === "companion" && (
            <Panel className="items-center text-center">
              <CompanionCanvas size={180} />
              <p className="mt-4 text-sm text-muted">
                LORIN's visual presence adapts to the current interaction state.
              </p>
            </Panel>
          )}
          <Panel title="Conversation context">
            <div className="context-row">
              <span>Project</span>
              <strong>{s.projects.find((p) => p.id === s.projectId)?.name}</strong>
            </div>
            <div className="context-row">
              <span>Model route</span>
              <strong className="capitalize">{s.route.replace("-", " ")}</strong>
            </div>
            <div className="context-row">
              <span>Last decision</span>
              <strong>{s.lastDecision?.model ?? "None"}</strong>
            </div>
            <div className="context-row">
              <span>Sources</span>
              <strong>{s.lastDecision?.sources.length ?? 0}</strong>
            </div>
          </Panel>
          <Panel
            title="Conversation threads"
            description={`${s.conversations.length} historical threads in this tenant`}
          >
            <div className="flex flex-col gap-1.5">
              {s.conversations.slice(0, 5).map((conv) => (
                <div key={conv.id} className="rounded-control border border-line bg-bg p-2.5 text-xs">
                  <p className="font-medium">{conv.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-muted">{conv.summary}</p>
                </div>
              ))}
            </div>
          </Panel>
          <Panel
            title="Scoped actions"
            description="Proposals are reviewed in Tasks before any demo state is committed."
          >
            <div className="flex flex-col gap-2">
              <ActionButton
                icon={Database}
                onClick={() =>
                  s.propose(
                    "vault.index",
                    "Read-only scan of Knowledge Vault titles. No private vault access.",
                  )
                }
              >
                Propose knowledge index
              </ActionButton>
              <ActionButton
                icon={FileText}
                onClick={() =>
                  s.propose(
                    "knowledge.append",
                    "Add one knowledge note about verification.",
                    "Verification note :: A finished job is not verified until the evidence is checked.",
                  )
                }
              >
                Propose knowledge note
              </ActionButton>
              <ActionButton
                icon={Shield}
                onClick={() =>
                  s.propose("shell.exec", "Unrestricted shell on this device.", "rm -rf /")
                }
              >
                Test critical-action guard
              </ActionButton>
            </div>
          </Panel>
        </aside>
      </div>
    </Page>
  );
}

function ProjectsView() {
  const s = useLorin();
  return (
    <Page
      title="Projects"
      eyebrow="WORKSPACES"
      lede="Separate project contexts keep information, decisions, tasks and permissions within their intended boundaries. Progress is calculated directly from real project tasks."
      actions={<Badge>{s.projects.length} workspaces</Badge>}
    >
      <div className="grid gap-3 xl:grid-cols-2">
        {s.projects.map((project) => {
          const active = project.id === s.projectId;
          const projTasks = s.workTasks.filter((t) => t.projectId === project.id);
          const completedCount = projTasks.filter((t) => t.status === "completed").length;
          const overdueCount = projTasks.filter((t) => t.status === "overdue").length;
          const progressPct = projTasks.length
            ? Math.round((completedCount / projTasks.length) * 100)
            : 0;

          return (
            <article key={project.id} className={`project-card ${active ? "is-active" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <span className="project-avatar project-avatar-large">
                  {project.name.slice(0, 1)}
                </span>
                <div className="flex items-center gap-2">
                  {overdueCount > 0 && <Badge tone="red">{overdueCount} overdue</Badge>}
                  <Badge tone={active ? "teal" : "neutral"}>
                    {active ? "Active workspace" : project.status}
                  </Badge>
                </div>
              </div>
              <div className="mt-5">
                <h2 className="font-display text-xl font-semibold">{project.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{project.note}</p>
              </div>
              {projTasks.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span>
                      Task completion ({completedCount} / {projTasks.length})
                    </span>
                    <span className="font-mono">{progressPct}%</span>
                  </div>
                  <div className="audio-meter mt-1.5">
                    <span style={{ transform: `scaleX(${progressPct / 100})` }} />
                  </div>
                </div>
              )}
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                <span className="text-xs text-muted">
                  {project.id === "p2" ? "Public project boundary" : "Private owner workspace"}
                </span>
                <ActionButton
                  variant={active ? "quiet" : "primary"}
                  disabled={active}
                  onClick={() => s.setProject(project.id)}
                >
                  {active ? (
                    <>
                      <Check size={14} /> Selected
                    </>
                  ) : (
                    <>
                      Switch workspace <ArrowRight size={14} />
                    </>
                  )}
                </ActionButton>
              </div>
            </article>
          );
        })}
      </div>
      <Panel
        title="Workspace separation"
        description="Project switching changes retrieval boundaries; it does not copy private content between workspaces."
      >
        <div className="grid gap-3 md:grid-cols-2">
          <ReadinessRow
            icon={Lock}
            title="Atlas & Private Projects"
            detail="Private owner context, vault and memory."
            badge="Private"
            tone="teal"
          />
          <ReadinessRow
            icon={Network}
            title="MOSAIRA"
            detail="Separate public research surface. No private memory or device access."
            badge="Isolated"
            tone="indigo"
          />
        </div>
      </Panel>
    </Page>
  );
}

function TasksView() {
  const s = useLorin();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"high" | "medium" | "low">("medium");
  const pending = s.jobs.filter((job) => job.state === "awaiting");
  const active = s.jobs.filter((job) =>
    ["running", "completed", "proposed"].includes(job.state),
  );
  const closed = s.jobs.filter((job) =>
    ["verified", "blocked", "failed", "cancelled"].includes(job.state),
  );
  const projectTasks = s.workTasks.filter((t) => t.projectId === s.projectId);

  return (
    <Page
      title="Tasks & approvals"
      eyebrow="ACTION CONTROL & PROJECT WORK ITEMS"
      lede="An action is not complete when it finishes. It is complete only when its evidence is reviewed and verified."
      actions={
        <div className="flex items-center gap-2">
          <Badge tone={pending.length ? "amber" : "teal"}>
            {pending.length} approvals waiting
          </Badge>
          <Badge tone="indigo">{s.workTasks.length} total project tasks</Badge>
        </div>
      }
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          label="Awaiting approval"
          value={pending.length}
          detail="Needs your decision"
          icon={Shield}
        />
        <MetricCard
          label="In progress"
          value={active.length}
          detail="Proposed or running"
          icon={Activity}
        />
        <MetricCard
          label="Closed records"
          value={closed.length}
          detail="Verified or stopped"
          icon={FileCheck2}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Scoped capability approvals ({s.jobs.length})
          </h2>
          {s.jobs.map((job) => (
            <article key={job.id} className="task-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                    {job.capability}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold">{job.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    tone={
                      job.risk === "critical"
                        ? "red"
                        : job.risk === "write"
                          ? "amber"
                          : "teal"
                    }
                  >
                    {job.risk} risk
                  </Badge>
                  <Badge
                    tone={
                      job.state === "verified"
                        ? "teal"
                        : job.state === "blocked" || job.state === "failed"
                          ? "red"
                          : job.state === "awaiting"
                            ? "amber"
                            : "neutral"
                    }
                  >
                    {job.state}
                  </Badge>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed">{job.scope}</p>
              {job.args && (
                <p className="mt-2 break-words rounded-control bg-bg px-3 py-2 font-mono text-xs text-muted">
                  {job.args}
                </p>
              )}
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted">
                <span>Fingerprint: {job.fingerprint}</span>
                {job.approvalId && <span>Approval: {job.approvalId}</span>}
                <span suppressHydrationWarning>{new Date(job.at).toLocaleString()}</span>
              </div>
              {job.evidence && (
                <div className="mt-3 rounded-control border border-line bg-elevated p-3 text-sm text-muted">
                  {job.evidence}
                </div>
              )}
              {job.state === "awaiting" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <ActionButton
                    variant="primary"
                    icon={Check}
                    onClick={() => s.decide(job.id, true)}
                  >
                    Approve scoped action
                  </ActionButton>
                  <ActionButton icon={X} onClick={() => s.decide(job.id, false)}>
                    Deny
                  </ActionButton>
                </div>
              )}
              {job.state === "running" && (
                <div className="mt-4">
                  <ActionButton icon={X} onClick={() => s.cancel(job.id)}>
                    Cancel action
                  </ActionButton>
                </div>
              )}
              {job.state === "completed" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <ActionButton
                    variant="primary"
                    icon={BadgeCheck}
                    onClick={() => s.verify(job.id)}
                  >
                    Verify evidence
                  </ActionButton>
                  <ActionButton icon={X} onClick={() => s.rejectEvidence(job.id)}>
                    Reject evidence
                  </ActionButton>
                </div>
              )}
            </article>
          ))}
        </div>

        <Panel
          title={`Project work tasks (${projectTasks.length})`}
          description={`Tasks for ${s.projects.find((p) => p.id === s.projectId)?.name ?? "active workspace"}`}
        >
          <form
            className="mb-4 flex flex-col gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!newTaskTitle.trim()) return;
              s.createWorkTask(newTaskTitle.trim(), s.projectId, newTaskPriority, "Tomorrow 17:00");
              setNewTaskTitle("");
            }}
          >
            <input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Add a work task to this project…"
              className="field-input"
            />
            <div className="flex items-center justify-between gap-2">
              <select
                value={newTaskPriority}
                onChange={(e) =>
                  setNewTaskPriority(e.target.value as "high" | "medium" | "low")
                }
                className="topbar-select"
                aria-label="New task priority"
              >
                <option value="high">High priority</option>
                <option value="medium">Medium priority</option>
                <option value="low">Low priority</option>
              </select>
              <ActionButton
                variant="primary"
                icon={Plus}
                type="submit"
                disabled={!newTaskTitle.trim()}
              >
                Add task
              </ActionButton>
            </div>
          </form>

          <div className="flex flex-col gap-2">
            {projectTasks.map((task) => (
              <div
                key={task.id}
                className="approval-preview flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge
                      tone={
                        task.status === "completed"
                          ? "teal"
                          : task.status === "overdue"
                            ? "red"
                            : "amber"
                      }
                    >
                      {task.status}
                    </Badge>
                    <Badge>{task.priority}</Badge>
                  </div>
                  <p
                    className={`mt-1.5 text-xs font-medium ${task.status === "completed" ? "line-through text-muted" : ""}`}
                  >
                    {task.title}
                  </p>
                  <p className="mt-1 text-[10px] text-muted">
                    Due {task.dueAt} · {task.assignee}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => s.toggleWorkTaskStatus(task.id)}
                  className="action-button action-button-secondary px-2.5 py-1 text-[10px]"
                >
                  {task.status === "completed" ? "Reopen" : "Complete"}
                </button>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </Page>
  );
}

function VaultView({ which }: { which: "knowledge" | "private" }) {
  const s = useLorin();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [query, setQuery] = useState("");
  const [importedName, setImportedName] = useState("");
  const docs = useMemo(
    () =>
      s.docs.filter(
        (doc) =>
          doc.vault === which &&
          `${doc.title} ${doc.body} ${doc.tags.join(" ")} ${doc.category ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [s.docs, which, query],
  );
  const capability = which === "private" ? "private.append" : "knowledge.append";
  const heading = which === "private" ? "Private vault" : "Knowledge vault";

  return (
    <Page
      title={heading}
      eyebrow={which === "private" ? "PRIVATE OWNER DATA" : "M3 · APPROVED KNOWLEDGE & 20-DOMAIN STARTER PACK"}
      lede={
        which === "private"
          ? "Private notes remain separate from general knowledge. Retrieval is local-only in this demo."
          : "A searchable collection of approved project information and 20 technical knowledge domains. Indexing does not include the private vault."
      }
    >
      {which === "knowledge" && (
        <div className="drive-summary-card">
          <span className="drive-summary-icon">
            <Cloud size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-medium">Google Drive knowledge source</p>
            <p className="mt-1 text-xs text-muted">
              Not connected · No files imported · OAuth integration pending
            </p>
          </div>
          <ActionButton onClick={() => s.setView("connections")}>
            Manage source <ArrowRight size={14} />
          </ActionButton>
        </div>
      )}
      {which === "private" && (
        <div className="privacy-note">
          <Lock size={16} />
          <span>
            Private vault boundary active in the demo. MOSAIRA cannot retrieve these records.
          </span>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel
          title="Add a knowledge note"
          description="Notes are proposals. The demo writes them only after you approve and verify the task."
        >
          <form
            className="grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              if (!title.trim() || !body.trim()) return;
              s.propose(
                capability,
                `Append “${title.trim()}” into the ${which} vault.`,
                `${title.trim()} :: ${body.trim()}`,
              );
              setTitle("");
              setBody("");
            }}
          >
            <label className="field-label" htmlFor={`${which}-title`}>
              Title
            </label>
            <input
              id={`${which}-title`}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Give this note a clear title"
              className="field-input"
            />
            <label className="field-label" htmlFor={`${which}-body`}>
              Content
            </label>
            <textarea
              id={`${which}-body`}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={3}
              placeholder="Write the information LORIN should retain…"
              className="field-input field-textarea"
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted">
                Stored in the {which === "private" ? "private" : "knowledge"} session vault after
                verification.
              </p>
              <ActionButton
                variant="primary"
                icon={Plus}
                type="submit"
                disabled={!title.trim() || !body.trim()}
              >
                Propose note
              </ActionButton>
            </div>
          </form>
        </Panel>

        <Panel
          title="Import local text / markdown / JSON document"
          description="Parse and index a local document (.txt, .md, .json, .csv, .html) directly into this vault with a content checksum."
        >
          <label className="file-dropzone min-h-[175px]">
            <span className="file-dropzone-icon">
              <Upload size={20} />
            </span>
            <span className="text-sm font-medium">Choose a document to import</span>
            <span className="text-xs text-muted">
              Supports .md, .txt, .json, .csv, .html — indexed locally
            </span>
            <input
              type="file"
              accept=".txt,.md,.json,.csv,.html,text/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const content = typeof reader.result === "string" ? reader.result : "";
                  if (content.trim()) {
                    s.importDocumentFile(file.name, content.slice(0, 4000), "Imported File", which);
                    setImportedName(file.name);
                  }
                };
                reader.readAsText(file);
                event.target.value = "";
              }}
            />
          </label>
          {importedName && (
            <p className="mt-2 text-xs text-teal">
              Imported and indexed “{importedName}” into {which} vault.
            </p>
          )}
        </Panel>
      </div>

      <Panel
        title="Documents"
        description={`${docs.length} record${docs.length === 1 ? "" : "s"} in this session`}
        action={
          <div className="search-field">
            <Search size={14} />
            <input
              aria-label="Search documents"
              placeholder="Search documents"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        }
      >
        {docs.length ? (
          <div className="document-list">
            {docs.map((doc) => (
              <article key={doc.id} className="document-row">
                <span className="document-icon">
                  <FileText size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{doc.title}</p>
                    <Badge tone={doc.indexed ? "teal" : "neutral"}>
                      {doc.indexed ? "Indexed" : "Not indexed"}
                    </Badge>
                    {doc.category && <Badge tone="indigo">{doc.category}</Badge>}
                    {doc.version && <Badge>v{doc.version}</Badge>}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">
                    {doc.body}
                  </p>
                  <p className="mt-2 text-[10px] text-muted">
                    {doc.tags.join(" · ")} · {doc.scope}
                    {doc.checksum ? ` · ${doc.checksum}` : ""}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Folder}
            title="No matching documents"
            description="Try another search or add a new note to this vault."
          />
        )}
      </Panel>
      {which === "knowledge" && (
        <Panel
          title="Indexing"
          description="The current demo indexes session records only; it does not crawl Google Drive or local folders."
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Knowledge title index</p>
              <p className="mt-1 text-xs text-muted">
                Read-only scan · Private vault excluded
              </p>
            </div>
            <ActionButton
              variant="primary"
              icon={RefreshCw}
              onClick={() =>
                s.propose(
                  "vault.index",
                  "Read-only scan of Knowledge Vault titles. No private vault access.",
                )
              }
            >
              Propose index refresh
            </ActionButton>
          </div>
        </Panel>
      )}
    </Page>
  );
}

function MemoryView() {
  const s = useLorin();
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const memories = s.memories.filter((memory) =>
    memory.text.toLowerCase().includes(query.toLowerCase()),
  );

  const exportMemoriesJson = () => {
    const payload = JSON.stringify(s.memories, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lorin-memories-${s.envMode}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Page
      title="Memory (GIDEON)"
      eyebrow="M3 · OWNER-CONTROLLED LONG-TERM MEMORY"
      lede="Only verified memory records are used as memory answers. Inspect provenance, pin critical facts, approve pending memories, export JSON, or delete records."
      actions={
        <div className="flex items-center gap-2">
          <Badge tone="teal">
            {s.memories.filter((memory) => memory.verified).length} approved
          </Badge>
          <ActionButton icon={Download} onClick={exportMemoriesJson}>
            Export JSON
          </ActionButton>
        </div>
      }
    >
      <Panel
        title="Propose a memory"
        description="A new memory is saved only after its task is approved and verified."
      >
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            if (!text.trim()) return;
            s.propose("memory.store", "Store one approved memory.", text.trim());
            setText("");
          }}
        >
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="What should LORIN remember?"
            className="field-input min-w-0 flex-1"
          />
          <ActionButton
            variant="primary"
            icon={Plus}
            type="submit"
            disabled={!text.trim()}
          >
            Propose memory
          </ActionButton>
        </form>
      </Panel>
      <Panel
        title="Memory records"
        description="Pin, verify, or delete individual memory records."
        action={
          <div className="search-field">
            <Search size={14} />
            <input
              aria-label="Search memories"
              placeholder="Search memories"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        }
      >
        {memories.length ? (
          <div className="flex flex-col gap-2">
            {memories.map((memory) => (
              <article key={memory.id} className="memory-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="text-sm leading-relaxed">{memory.text}</p>
                  <div className="flex items-center gap-1.5">
                    {memory.pinned && <Badge tone="indigo">Pinned</Badge>}
                    {memory.category && <Badge>{memory.category}</Badge>}
                    <Badge tone={memory.verified ? "teal" : "amber"}>
                      {memory.verified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[11px] text-muted">Source: {memory.source}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {!memory.verified && (
                      <ActionButton
                        variant="primary"
                        icon={Check}
                        onClick={() => s.approveMemory(memory.id)}
                      >
                        Verify memory
                      </ActionButton>
                    )}
                    <ActionButton
                      variant="quiet"
                      icon={Pin}
                      onClick={() => s.togglePinMemory(memory.id)}
                    >
                      {memory.pinned ? "Unpin" : "Pin"}
                    </ActionButton>
                    <ActionButton
                      variant="quiet"
                      icon={Trash2}
                      onClick={() => s.deleteMemory(memory.id)}
                    >
                      Delete
                    </ActionButton>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Sparkles}
            title="No matching memories"
            description="No memory matched this search. Try a broader term."
          />
        )}
      </Panel>
    </Page>
  );
}

function GideonView() {
  const s = useLorin();
  return (
    <Page
      title="Continuity"
      eyebrow="GIDEON · PROJECT HISTORY"
      lede="GIDEON maintains the history of important events. It is an internal capability, not a second conversational assistant."
    >
      <Panel
        title="Recent events"
        description={`${s.events.length} recorded event${s.events.length === 1 ? "" : "s"} in this session`}
      >
        {s.events.length ? (
          <ol className="timeline-list">
            {s.events.map((event) => (
              <li key={event.id} className="timeline-item">
                <span className="timeline-dot" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">{event.title}</p>
                    <time className="text-[11px] text-muted" suppressHydrationWarning>
                      {new Date(event.at).toLocaleString()}
                    </time>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{event.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState
            icon={History}
            title="No events recorded"
            description="Verified activities will appear here."
          />
        )}
      </Panel>
    </Page>
  );
}

function VoiceView() {
  const s = useLorin();
  const voice = useVoiceSession();
  const listening = s.voice === "listening";
  const [newPhrase, setNewPhrase] = useState("");
  const [wakeTestInput, setWakeTestInput] = useState("LORIN, can you check the Atlas project?");
  const wakeStatus = formatWakeStateLabel(s.wakeState);
  const wakeCaps = getWakeWordCapabilities();

  return (
    <Page
      title="Voice & Wake Word"
      eyebrow="M2 · 15-STATE WAKE-WORD LISTENER & TRAILING COMMAND PRESERVATION"
      lede="Microphone permission, foreground wake-word listening, 5-second companion activation, and speech output are shown as distinct honest states."
      actions={
        <div className="flex items-center gap-2">
          <Badge tone={wakeStatus.tone}>Wake state: {wakeStatus.label}</Badge>
          {wakeStatus.activeMic && <Badge tone="teal">Active Mic Indicator ON</Badge>}
        </div>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.85fr)_minmax(340px,1.15fr)]">
        <Panel className="items-center text-center">
          <CompanionCanvas size={210} />
          <div className="mt-5 w-full">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Audio activity</span>
              <span>{Math.round(voice.level * 100)}%</span>
            </div>
            <div className="audio-meter mt-2">
              <span style={{ transform: `scaleX(${voice.level})` }} />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge tone={s.micGranted ? "teal" : "amber"}>
              Microphone {s.micGranted ? "permitted" : "not granted"}
            </Badge>
            <Badge tone={wakeStatus.tone}>{s.wakeState}</Badge>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <ActionButton
              variant={s.wakeState === "foreground_listening" ? "quiet" : "primary"}
              icon={Mic}
              onClick={() => {
                useLorin.setState({ micGranted: true });
                s.setWakeState("foreground_listening");
              }}
            >
              Arm Foreground Listener
            </ActionButton>
            <ActionButton
              onClick={() =>
                s.setWakeState(s.wakeState === "paused" ? "foreground_listening" : "paused")
              }
            >
              {s.wakeState === "paused" ? "Resume Listener" : "Pause Listener"}
            </ActionButton>
            <ActionButton onClick={() => s.setWakeState("disabled")}>
              Disable
            </ActionButton>
          </div>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel
            title="Wake-word activation & trailing command test"
            description="When a wake phrase is followed by a request, LORIN preserves the trailing command and executes it automatically after the 5-second activation intro."
          >
            <label className="field-label" htmlFor="wake-test-utterance">
              Utterance with wake phrase
            </label>
            <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
              <input
                id="wake-test-utterance"
                value={wakeTestInput}
                onChange={(e) => setWakeTestInput(e.target.value)}
                className="field-input flex-1"
                placeholder="e.g., LORIN, can you check the Atlas project?"
              />
              <ActionButton
                variant="primary"
                icon={Sparkles}
                onClick={() => s.triggerWakePhrase(wakeTestInput)}
              >
                Trigger Wake
              </ActionButton>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {s.wakePhrases
                .filter((p) => p.enabled)
                .map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className="prompt-chip"
                    onClick={() => {
                      setWakeTestInput(p.phrase);
                      s.triggerWakePhrase(p.phrase);
                    }}
                  >
                    “{p.phrase}”
                  </button>
                ))}
            </div>
          </Panel>

          <Panel
            title="Configurable wake phrases"
            description="Enable, disable, or add custom wake phrases."
          >
            <form
              className="mb-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newPhrase.trim()) return;
                s.addWakePhrase(newPhrase.trim());
                setNewPhrase("");
              }}
            >
              <input
                value={newPhrase}
                onChange={(e) => setNewPhrase(e.target.value)}
                placeholder="Add custom wake phrase (e.g., Wake up LORIN)"
                className="field-input flex-1"
              />
              <ActionButton
                variant="primary"
                icon={Plus}
                type="submit"
                disabled={!newPhrase.trim()}
              >
                Add phrase
              </ActionButton>
            </form>
            <div className="flex flex-col gap-1.5">
              {s.wakePhrases.map((wp) => (
                <div
                  key={wp.id}
                  className="shortcut-row flex items-center justify-between gap-2"
                >
                  <div>
                    <p className="text-xs font-medium">“{wp.phrase}”</p>
                    <p className="text-[10px] text-muted">
                      {wp.builtIn ? "Built-in wake phrase" : "Custom wake phrase"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => s.toggleWakePhrase(wp.id)}
                      className={`lorin-badge ${wp.enabled ? "lorin-badge-teal" : ""}`}
                    >
                      {wp.enabled ? "Enabled" : "Disabled"}
                    </button>
                    {!wp.builtIn && (
                      <button
                        type="button"
                        onClick={() => s.removeWakePhrase(wp.id)}
                        className="text-xs text-danger"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            title="Direct voice session controls"
            description="Choose exactly when LORIN listens. The microphone is never opened without your action."
          >
            <label className="field-label" htmlFor="utterance">
              Test utterance / recognized text
            </label>
            <input
              id="utterance"
              value={voice.draft}
              onChange={(event) => voice.setDraft(event.target.value)}
              className="field-input mt-1"
              placeholder="Type a phrase to test the voice flow"
            />
            <p className="mt-3 min-h-10 rounded-control bg-bg p-3 text-xs leading-relaxed text-muted">
              {s.transcript || "No active voice session."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {!s.micGranted && (
                <ActionButton
                  variant="primary"
                  icon={Mic}
                  onClick={() => void voice.grant()}
                >
                  Request microphone permission
                </ActionButton>
              )}
              <ActionButton
                icon={AudioLines}
                onClick={() => void voice.listen("script")}
                disabled={listening}
              >
                Start scripted session
              </ActionButton>
              <ActionButton
                icon={Mic}
                onClick={() => void voice.listen("microphone")}
                disabled={!s.micGranted || listening}
              >
                Listen on microphone
              </ActionButton>
              {listening && s.voiceSource === "script" && (
                <ActionButton variant="primary" onClick={() => voice.finish("script")}>
                  Use scripted phrase
                </ActionButton>
              )}
              {listening && s.voiceSource === "microphone" && (
                <ActionButton variant="primary" onClick={() => voice.finish("typed")}>
                  End utterance
                </ActionButton>
              )}
              <ActionButton icon={X} onClick={() => voice.interrupt()}>
                Interrupt
              </ActionButton>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-muted">
              {wakeCaps.platformNote}
            </p>
          </Panel>
        </div>
      </div>
    </Page>
  );
}

function VisionView() {
  const s = useLorin();
  const [fileName, setFileName] = useState("");
  return (
    <Page
      title="Vision"
      eyebrow="VISUAL INPUT"
      lede="Choose one image for a local session record. The image is not uploaded and no vision model is called by this demo."
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Panel
          title="Image input"
          description="A user-selected file is acknowledged locally; it is not analyzed automatically."
        >
          <label className="file-dropzone">
            <span className="file-dropzone-icon">
              <Upload size={22} />
            </span>
            <span className="font-medium">Choose an image</span>
            <span className="text-xs text-muted">
              PNG, JPG, WEBP or another browser-supported image type
            </span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  setFileName(file.name);
                  s.snapshot(file.name);
                }
                event.target.value = "";
              }}
            />
          </label>
          {fileName && <p className="mt-3 text-sm text-muted">Selected: {fileName}</p>}
        </Panel>
        <Panel title="Privacy status">
          <ReadinessRow
            icon={Lock}
            title="File handling"
            detail="Local acknowledgement only."
            badge="Local"
            tone="teal"
          />
          <ReadinessRow
            icon={Eye}
            title="Live camera"
            detail="No background camera access."
            badge="Off"
            tone="neutral"
          />
          <ReadinessRow
            icon={BrainCircuit}
            title="Vision inference"
            detail="No image model is connected."
            badge="Unavailable"
            tone="amber"
          />
        </Panel>
      </div>
    </Page>
  );
}

function WorkbenchView() {
  const applied = useLorin((state) => state.policyApplied);
  const propose = useLorin((state) => state.propose);
  return (
    <Page
      title="Workbench"
      eyebrow="CONTROLLED ENGINEERING"
      lede="Review a scoped change before proposing it. The workbench is not a general-purpose shell or a live coding sandbox."
    >
      <Panel
        title="Policy change proposal"
        description="The example highlights why a client-controlled boolean is weaker than a server-bound, single-use digest."
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge tone={applied ? "teal" : "amber"}>
            {applied ? "Verified in demo state" : "Not applied"}
          </Badge>
          <span className="text-xs text-muted">Illustrative policy diff</span>
        </div>
        <div className="grid gap-3 xl:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Before
            </p>
            <pre className="code-panel">{POLICY_BEFORE}</pre>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
              Proposed
            </p>
            <pre className="code-panel">{POLICY_AFTER}</pre>
          </div>
        </div>
        {!applied && (
          <div className="mt-3 rounded-control border border-line bg-elevated p-3 font-mono text-xs">
            <p className="text-danger">- trust the client flag</p>
            <p className="mt-1 text-teal">+ require a server-bound digest</p>
          </div>
        )}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-xl text-xs leading-relaxed text-muted">
            The demo records a proposal and verifies an illustrative change. It does not modify a
            production policy file or run a shell command.
          </p>
          <ActionButton
            variant="primary"
            icon={Check}
            disabled={applied}
            onClick={() =>
              propose(
                "policy.apply",
                "Replace the client flag with a server-bound digest check.",
                "policy.ts",
              )
            }
          >
            {applied ? "Already verified" : "Propose this change"}
          </ActionButton>
        </div>
      </Panel>
      <Panel
        title="Execution boundary"
        description="Code execution will be added through the separate, isolated Sandbox runtime."
      >
        <ReadinessRow
          icon={Terminal}
          title="Shell execution"
          detail="Not exposed in this demo. Critical shell capability remains denied."
          badge="Blocked"
          tone="red"
        />
        <div className="mt-3">
          <ActionButton
            icon={Terminal}
            onClick={() => useLorin.getState().setView("sandbox")}
          >
            View sandbox workspace <ArrowRight size={14} />
          </ActionButton>
        </div>
      </Panel>
    </Page>
  );
}

function DevicesView() {
  const s = useLorin();
  const transports: DeviceTransport[] = [
    "Local Wi-Fi (mDNS/TLS)",
    "Local Hotspot",
    "Native Peer",
    "Approved Private Server",
    "Encrypted Relay (Opt-in)",
    "Offline Queue",
  ];
  const allScopes = [
    "conversation_sync",
    "project_sync",
    "task_sync",
    "knowledge_sync",
    "notifications",
    "voice",
  ];

  return (
    <Page
      title="Device Centre"
      eyebrow="M4 · LOCAL-FIRST CRYPTOGRAPHIC DEVICE FABRIC"
      lede="Manage enrolled companion devices, cryptographic Ed25519 key fingerprints, transport priority (Local Wi-Fi → Hotspot → Offline Queue), and per-device capability scopes."
      actions={<Badge tone="teal">{s.devices.filter((d) => d.paired).length} paired devices</Badge>}
    >
      <div className="grid gap-3 xl:grid-cols-2">
        {s.devices.map((device) => (
          <article key={device.id} className="device-card">
            <div className="flex items-start justify-between gap-3">
              <span className="metric-icon">
                <Laptop size={18} />
              </span>
              <div className="flex items-center gap-2">
                {device.transport && <Badge tone="indigo">{device.transport}</Badge>}
                <Badge
                  tone={
                    device.paired && device.phase === "session"
                      ? "teal"
                      : device.phase === "paired"
                        ? "amber"
                        : "neutral"
                  }
                >
                  {device.phase === "session"
                    ? "Current session"
                    : device.paired
                      ? "Paired (SIMULATED)"
                      : "Not paired"}
                </Badge>
              </div>
            </div>
            <h2 className="mt-4 font-display text-lg font-semibold">{device.name}</h2>
            <p className="mt-1 text-xs text-muted">
              {device.kind} · {device.online ? "online" : "offline"} · {device.phase}
            </p>
            {device.keyFingerprint && (
              <p className="mt-1.5 font-mono text-[11px] text-teal">
                Key: {device.keyFingerprint}
              </p>
            )}
            <p className="mt-2 text-sm leading-relaxed text-muted">{device.note}</p>

            {device.scopes && (
              <div className="mt-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                  Authorized scopes (click to toggle)
                </p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {allScopes.map((sc) => {
                    const has = device.scopes?.includes(sc);
                    return (
                      <button
                        key={sc}
                        type="button"
                        onClick={() => s.toggleDeviceScope(device.id, sc)}
                        className={`lorin-badge ${has ? "lorin-badge-teal" : ""}`}
                      >
                        {has ? "✓ " : "+ "}
                        {sc}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {device.paired && (
              <div className="mt-3">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted" htmlFor={`tr-${device.id}`}>
                  Transport handover simulation
                </label>
                <select
                  id={`tr-${device.id}`}
                  value={device.transport ?? transports[0]}
                  onChange={(e) =>
                    s.simulateNetworkHandover(device.id, e.target.value as DeviceTransport)
                  }
                  className="field-input mt-1 min-h-[34px] py-1 text-xs"
                >
                  {transports.map((tr) => (
                    <option key={tr} value={tr}>
                      {tr}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {device.code && device.phase === "code" && (
              <p className="mt-3 rounded-control bg-bg p-3 font-mono text-sm">
                Pairing code: {device.code}
              </p>
            )}
            {device.phase !== "session" && (
              <div className="mt-4 flex flex-wrap gap-2">
                {device.phase === "unpaired" && (
                  <ActionButton variant="primary" onClick={() => s.issuePairCode(device.id)}>
                    Issue demo pairing code
                  </ActionButton>
                )}
                {device.phase === "code" && (
                  <ActionButton
                    variant="primary"
                    onClick={() => s.confirmHandshake(device.id)}
                  >
                    Record demo handshake
                  </ActionButton>
                )}
                {device.phase !== "unpaired" && (
                  <ActionButton onClick={() => s.revokeDevice(device.id)}>
                    Revoke demo pairing
                  </ActionButton>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </Page>
  );
}

function TrustView() {
  const s = useLorin();
  return (
    <Page
      title="Security & trust"
      eyebrow="OWNER CONTROL"
      lede="Provider labels in this demo are routing decisions, not verified network connections. The security model is deliberately conservative."
    >
      <div className="grid gap-3 md:grid-cols-2">
        <ReadinessRow
          icon={KeyRound}
          title="Identity"
          detail="This is a browser session. No owner account or remote identity is configured here."
          badge="Demo session"
          tone="neutral"
        />
        <ReadinessRow
          icon={CloudOff}
          title="Gemini provider"
          detail="A provider has not been contacted. The demo verification toggle does not verify credentials."
          badge="Not live"
          tone="amber"
        />
        <ReadinessRow
          icon={ShieldCheck}
          title="Critical actions"
          detail="Critical capabilities are denied even if an approval is attempted."
          badge="Blocked"
          tone="teal"
        />
        <ReadinessRow
          icon={FileCheck2}
          title="Policy changes"
          detail={`Policy state: ${s.policyApplied ? "illustrative change verified in demo" : "original demo flag"}.`}
          badge="Demo state"
          tone="neutral"
        />
      </div>
      <Panel title="Capability registry" description="Each operation has a fixed scope and risk tier.">
        <div className="registry-list">
          {CAPABILITIES.map((capability) => (
            <div key={capability.id} className="registry-row">
              <div className="min-w-0">
                <p className="text-sm font-medium">{capability.title}</p>
                <p className="mt-1 font-mono text-[11px] text-muted">{capability.id}</p>
                <p className="mt-1 text-xs text-muted">{capability.schema}</p>
              </div>
              <Badge
                tone={
                  capability.risk === "critical"
                    ? "red"
                    : capability.risk === "write"
                      ? "amber"
                      : "teal"
                }
              >
                {capability.risk}
              </Badge>
            </div>
          ))}
        </div>
      </Panel>
      <Panel
        title="Internal specialist capabilities"
        description="Specialists contribute internally. LORIN remains the only conversational identity."
      >
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {SPECIALISTS.map((specialist) => (
            <div key={specialist.name} className="specialist-card">
              <span className="specialist-avatar">{specialist.name.slice(0, 1)}</span>
              <div>
                <p className="text-sm font-medium">{specialist.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{specialist.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel
        title="Audit trail"
        description={`${s.audit.length} local audit event${s.audit.length === 1 ? "" : "s"}`}
        action={
          <ActionButton variant="quiet" onClick={() => s.setView("audit")}>
            Full Audit Workspace <ArrowRight size={14} />
          </ActionButton>
        }
      >
        <div className="audit-list">
          {s.audit.slice(0, 12).map((entry) => (
            <div key={entry.id} className="audit-row">
              <span className="audit-dot" />
              <div className="min-w-0 flex-1">
                <p className="text-sm">{entry.text}</p>
                <p className="mt-1 text-[11px] text-muted" suppressHydrationWarning>
                  {new Date(entry.at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-panel border border-danger/30 bg-danger/5 p-4">
        <div>
          <p className="text-sm font-medium">Reset local demo data</p>
          <p className="mt-1 text-xs text-muted">
            This clears the browser's persisted LORIN demo session.
          </p>
        </div>
        <ActionButton onClick={() => s.reset()} icon={RefreshCw}>
          Reset demo
        </ActionButton>
      </div>
    </Page>
  );
}

function IntelligenceView() {
  const s = useLorin();
  const [tab, setTab] = useState<"models" | "downloads" | "providers" | "hardware">("models");
  const [query, setQuery] = useState("");
  const tabs = [
    { id: "models" as const, label: "Model library", icon: BrainCircuit },
    { id: "downloads" as const, label: "Downloads", icon: Download },
    { id: "providers" as const, label: "Providers", icon: Network },
    { id: "hardware" as const, label: "Hardware", icon: Cpu },
  ];
  return (
    <Page
      title="Intelligence studio"
      eyebrow="MODEL INFRASTRUCTURE"
      lede="A single control surface for private models, cloud providers, model downloads and local hardware readiness."
    >
      <section className="intelligence-hero">
        <div className="min-w-0">
          <Badge tone="amber">Runtime integration pending</Badge>
          <h2 className="mt-3 font-display text-2xl font-semibold">
            Build your private intelligence layer.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            The current demo contains routing decisions, not a live inference gateway. Downloading
            or activating models will remain unavailable until the local runtime is installed and
            verified.
          </p>
        </div>
        <span className="intelligence-hero-icon">
          <BrainCircuit size={34} />
        </span>
      </section>
      <div className="studio-tabs" role="tablist" aria-label="Intelligence studio sections">
        {tabs.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              role="tab"
              aria-selected={tab === item.id}
              className={`studio-tab ${tab === item.id ? "is-active" : ""}`}
              onClick={() => setTab(item.id)}
            >
              <Icon size={15} />
              {item.label}
            </button>
          );
        })}
      </div>

      {tab === "models" && (
        <div className="flex flex-col gap-4">
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="Installed models"
              value="Unknown"
              detail="Needs local runtime inventory"
              icon={Database}
            />
            <MetricCard
              label="Available disk"
              value="Unknown"
              detail="Needs Windows hardware probe"
              icon={HardDrive}
            />
            <MetricCard
              label="Active inference"
              value="None"
              detail="No model request executed"
              icon={Activity}
            />
          </div>
          <Panel
            title="Model library"
            description="The live model catalogue will be loaded from the configured provider or registry."
            action={
              <div className="search-field">
                <Search size={14} />
                <input
                  aria-label="Search model library"
                  placeholder="Search models"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            }
          >
            <EmptyState
              icon={BrainCircuit}
              title={query ? "No live catalogue results" : "Model catalogue not connected"}
              description={
                query
                  ? `No result can be confirmed for “${query}” because no model registry is connected.`
                  : "Once Ollama or the private model registry is connected, this area will show model families, context size, parameter count, quantization options, licenses, hardware requirements and verified download sources."
              }
              action={
                <ActionButton variant="primary" onClick={() => setTab("providers")}>
                  Configure a model provider <ArrowRight size={14} />
                </ActionButton>
              }
            />
          </Panel>
          <Panel
            title="Model profiles"
            description="These are planned selection profiles, not downloadable model packages."
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {[
                { name: "Fast local assistant", detail: "Small footprint · quick responses", icon: Zap },
                { name: "Balanced general model", detail: "Daily reasoning · broader context", icon: BrainCircuit },
                { name: "Coding specialist", detail: "Code generation · debugging", icon: Code2 },
                { name: "Knowledge models", detail: "Embeddings · reranking", icon: Database },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.name} className="profile-card">
                    <span className="metric-icon">
                      <Icon size={17} />
                    </span>
                    <p className="mt-4 text-sm font-medium">{item.name}</p>
                    <p className="mt-1 text-xs text-muted">{item.detail}</p>
                    <p className="mt-3 text-[10px] uppercase tracking-wider text-muted">
                      Hardware check required
                    </p>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      )}

      {tab === "downloads" && (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
          <Panel
            title="Model download manager"
            description="The installation flow is designed but the download worker is not connected."
          >
            <div className="download-steps">
              {[
                ["01", "Choose a model", "Select provider, model version and licence."],
                ["02", "Check compatibility", "Confirm RAM, VRAM, disk and quantization requirements."],
                ["03", "Choose storage", "Select an approved local model directory."],
                ["04", "Download & verify", "Track progress, validate checksums and inspect the manifest."],
                ["05", "Install & activate", "Register the model and run a local inference health check."],
              ].map(([number, title, description]) => (
                <div key={number} className="download-step">
                  <span className="download-step-number">{number}</span>
                  <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-control border border-line bg-bg p-3">
              <div className="flex items-center gap-2">
                <CircleAlert size={15} className="text-signal" />
                <p className="text-sm font-medium">Download service unavailable</p>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                No download has started. The app does not yet have a trusted local model manager or
                hardware probe.
              </p>
            </div>
          </Panel>
          <div className="flex flex-col gap-4">
            <Panel
              title="Download queue"
              description="Actual jobs will appear here after the model manager is connected."
            >
              <EmptyState
                icon={Download}
                title="Queue is empty"
                description="No model downloads have been submitted by this application."
              />
            </Panel>
            <Panel title="Storage location">
              <ReadinessRow
                icon={HardDrive}
                title="Model directory"
                detail="Not detected. A Windows companion must report the configured location."
                badge="Unknown"
                tone="neutral"
              />
              <div className="mt-3">
                <ReadinessRow
                  icon={ShieldCheck}
                  title="Integrity verification"
                  detail="Checksum verification is required before activation."
                  badge="Required"
                  tone="teal"
                />
              </div>
            </Panel>
          </div>
        </div>
      )}

      {tab === "providers" && (
        <div className="grid gap-3 xl:grid-cols-2">
          <ProviderCard
            icon={Server}
            name="Ollama local"
            category="Private inference runtime"
            status="Not connected"
            description="The intended first local model runtime. LORIN must verify the endpoint and enumerate actual installed models before displaying ready status."
          />
          <ProviderCard
            icon={Cloud}
            name="Google Gemini"
            category="Approved cloud provider"
            status="Not live-verified"
            description="The demo contains a routing preference only. No Gemini API call or credential validation occurs here."
          />
          <ProviderCard
            icon={Network}
            name="OpenAI-compatible endpoint"
            category="Future external provider"
            status="Not configured"
            description="A future adapter can support approved remote inference endpoints through the central model gateway."
          />
          <ProviderCard
            icon={Workflow}
            name="vLLM private server"
            category="Future self-hosted inference"
            status="Not configured"
            description="For dedicated GPU infrastructure after local model serving and privacy controls are established."
          />
        </div>
      )}

      {tab === "hardware" && (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]">
          <Panel
            title="Device capability report"
            description="Sanitized browser capabilities are reported live; companion-only specs remain Unknown until a trusted local probe is paired."
          >
            <HardwareStatus />
          </Panel>
          <Panel
            title="Why hardware matters"
            description="Model selection will be based on measured capacity."
          >
            <ul className="principle-list">
              <li>
                RAM determines how much model data can be loaded when using system memory.
              </li>
              <li>VRAM affects GPU-resident model size and inference speed.</li>
              <li>
                Disk space must account for downloads, quantized variants and temporary files.
              </li>
              <li>
                Compatibility checks must use the selected model's actual requirements.
              </li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <ActionButton icon={Plug} onClick={() => s.setView("devices")}>
                View device connections
              </ActionButton>
              <ActionButton variant="quiet" icon={SlidersHorizontal} onClick={() => s.setView("settings")}>
                Open Settings
              </ActionButton>
            </div>
          </Panel>
        </div>
      )}
    </Page>
  );
}

function ProviderCard({
  icon: Icon,
  name,
  category,
  status,
  description,
}: {
  icon: LucideIcon;
  name: string;
  category: string;
  status: string;
  description: string;
}) {
  return (
    <article className="provider-card">
      <div className="flex items-start justify-between gap-3">
        <span className="metric-icon">
          <Icon size={19} />
        </span>
        <Badge tone="amber">{status}</Badge>
      </div>
      <p className="mt-4 text-xs uppercase tracking-wider text-muted">{category}</p>
      <h2 className="mt-1 font-display text-lg font-semibold">{name}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
      <div className="mt-4 border-t border-line pt-3 text-xs text-muted">
        No live connection test has been performed.
      </div>
    </article>
  );
}

function ConnectionsView() {
  const s = useLorin();
  const [driveDetails, setDriveDetails] = useState(false);
  const [localDetails, setLocalDetails] = useState(false);
  return (
    <Page
      title="Connected services"
      eyebrow="KNOWLEDGE & PROVIDERS"
      lede="Control which external sources LORIN may use. Each connection must be authenticated, scoped and independently revocable."
    >
      <section className="connection-hero">
        <span className="connection-hero-icon">
          <Plug size={25} />
        </span>
        <div>
          <Badge tone="amber">No external account connected</Badge>
          <h2 className="mt-2 font-display text-xl font-semibold">
            Your data stays under your control.
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
            Connections shown here are setup surfaces. They do not imply that LORIN has access to
            your Google account, files or cloud services.
          </p>
        </div>
      </section>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel
          title="Google Drive"
          description="External knowledge source · OAuth integration pending"
          action={<Badge tone="amber">Not connected</Badge>}
        >
          <div className="flex items-start gap-3">
            <span className="drive-brand-mark">
              <Cloud size={22} />
            </span>
            <div className="min-w-0">
              <p className="font-medium">Connect selected Drive files</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                The planned integration uses Google OAuth and a file picker. The initial design
                requests per-file access rather than unrestricted access to all Drive content.
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="connection-stat">
              <p className="text-xs text-muted">Imported files</p>
              <p className="mt-1 text-lg font-semibold">0</p>
            </div>
            <div className="connection-stat">
              <p className="text-xs text-muted">Last synchronization</p>
              <p className="mt-1 text-sm font-semibold">Never</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <ActionButton
              variant="primary"
              icon={KeyRound}
              onClick={() => setDriveDetails((value) => !value)}
            >
              {driveDetails ? "Hide setup details" : "Review connection setup"}
            </ActionButton>
            <ActionButton icon={Shield} onClick={() => s.setView("trust")}>
              Security policy
            </ActionButton>
          </div>
          {driveDetails && (
            <div className="connection-detail">
              <p className="text-sm font-semibold">Google Drive setup requirements</p>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-xs leading-relaxed text-muted">
                <li>Configure a Google Cloud project and enable the Drive API.</li>
                <li>Register the OAuth client and approved redirect URI on the backend.</li>
                <li>Use Google Picker for user-selected files and the narrowest compatible scope.</li>
                <li>Store refresh tokens encrypted on the server; never in browser storage.</li>
                <li>Implement file metadata, content export/download, change tracking and re-indexing.</li>
                <li>Provide disconnect, revocation and deletion propagation.</li>
              </ol>
              <div className="mt-3 rounded-control bg-bg p-3 text-xs text-muted">
                Not configured in this build. No OAuth redirect has been started and no Google data
                has been accessed.
              </div>
            </div>
          )}
        </Panel>

        <Panel
          title="Local folders"
          description="Windows knowledge-folder watcher · Companion integration pending"
          action={<Badge>Not connected</Badge>}
        >
          <div className="flex items-start gap-3">
            <span className="metric-icon">
              <Folder size={20} />
            </span>
            <div>
              <p className="font-medium">LORIN_KNOWLEDGE</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                A dedicated local folder can act as an offline-first source after a trusted Windows
                companion is installed and granted read-only access.
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <ActionButton icon={Folder} onClick={() => setLocalDetails((value) => !value)}>
              {localDetails ? "Hide details" : "View folder setup"}
            </ActionButton>
          </div>
          {localDetails && (
            <div className="connection-detail">
              <p className="text-sm font-semibold">Recommended folder structure</p>
              <pre className="code-panel mt-2">{`LORIN_KNOWLEDGE/\n  Personal/\n  Projects/\n  Research/\n  Reference/`}</pre>
              <p className="mt-2 text-xs text-muted">
                The browser cannot watch arbitrary Windows folders. The local companion must own
                this permission and synchronization process.
              </p>
            </div>
          )}
        </Panel>
      </div>
      <Panel
        title="Connection governance"
        description="The same permissions must apply to retrieval, indexing, exports and agent tools."
      >
        <div className="grid gap-3 md:grid-cols-3">
          <ReadinessRow
            icon={Lock}
            title="Default access"
            detail="Selected files, read-only"
            badge="Restricted"
            tone="teal"
          />
          <ReadinessRow
            icon={ShieldCheck}
            title="Write operations"
            detail="Separate approval required"
            badge="Approval"
            tone="amber"
          />
          <ReadinessRow
            icon={History}
            title="Synchronization"
            detail="Auditable change history"
            badge="Required"
            tone="indigo"
          />
        </div>
      </Panel>
    </Page>
  );
}

function SandboxView() {
  const s = useLorin();
  const [tab, setTab] = useState<"overview" | "workspaces" | "policies">("overview");
  const tabs = [
    { id: "overview" as const, label: "Overview" },
    { id: "workspaces" as const, label: "Environments" },
    { id: "policies" as const, label: "Security policies" },
  ];
  return (
    <Page
      title="Sandbox workspace"
      eyebrow="SECURE EXECUTION"
      lede="LORIN's future execution layer will work in isolated, temporary environments with explicit resource and network policies."
    >
      <section className="sandbox-hero">
        <div>
          <Badge tone="amber">Runtime not provisioned</Badge>
          <h2 className="mt-3 font-display text-2xl font-semibold">
            Work safely before changing the real world.
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            This demo's Workbench can propose an illustrative policy change. It cannot execute
            arbitrary code, launch containers or inspect your computer.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <ActionButton variant="primary" icon={Code2} onClick={() => s.setView("workbench")}>
              Open Workbench
            </ActionButton>
            <ActionButton icon={ShieldCheck} onClick={() => s.setView("tasks")}>
              Review approvals
            </ActionButton>
          </div>
        </div>
        <span className="sandbox-hero-icon">
          <Terminal size={34} />
        </span>
      </section>
      <div className="studio-tabs" role="tablist" aria-label="Sandbox sections">
        {tabs.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={tab === item.id}
            className={`studio-tab ${tab === item.id ? "is-active" : ""}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {tab === "overview" && (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
          <Panel title="Execution activity" description="Only real sandbox jobs will appear here.">
            <EmptyState
              icon={Terminal}
              title="No sandbox jobs"
              description="No isolated execution worker is provisioned. Existing Tasks are approval demonstrations and are not sandbox executions."
            />
          </Panel>
          <Panel title="Runtime status">
            <ReadinessRow
              icon={Server}
              title="Sandbox worker"
              detail="Container or microVM runner unavailable."
              badge="Offline"
              tone="amber"
            />
            <div className="mt-3">
              <ReadinessRow
                icon={Activity}
                title="Job streaming"
                detail="No execution logs are being streamed."
                badge="Unavailable"
                tone="neutral"
              />
            </div>
            <div className="mt-3">
              <ReadinessRow
                icon={HardDrive}
                title="Artifact storage"
                detail="No isolated artifact store is configured."
                badge="Unavailable"
                tone="neutral"
              />
            </div>
          </Panel>
        </div>
      )}
      {tab === "workspaces" && (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            { name: "Code environment", icon: Code2, description: "Project copy, editor, terminal and test runner." },
            { name: "Data environment", icon: Database, description: "Validated files, analysis tools and exportable results." },
            { name: "Browser environment", icon: Cloud, description: "Isolated research and browser automation." },
            { name: "Application preview", icon: Laptop, description: "Build servers and preview URLs scoped to a job." },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.name} className="environment-card">
                <span className="metric-icon">
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 text-sm font-semibold">{item.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">{item.description}</p>
                <div className="mt-4">
                  <Badge>Not provisioned</Badge>
                </div>
              </article>
            );
          })}
        </div>
      )}
      {tab === "policies" && (
        <Panel
          title="Execution policy baseline"
          description="These are required controls for a future runtime. They are not yet enforced by an actual container worker."
        >
          <div className="policy-grid">
            {[
              ["Filesystem", "Temporary working copy only", "No host home directory or broad Drive mount."],
              ["Secrets", "No inherited credentials", "Secrets are injected through scoped broker APIs."],
              ["Network", "Default deny", "Per-job allowlists for approved endpoints."],
              ["Resources", "Bounded CPU, RAM and disk", "Execution timeout and process-count caps."],
              ["Isolation", "Rootless container or microVM", "Never expose the Docker socket to an agent job."],
              ["Delivery", "Review and explicit approval", "Diffs, tests and artifacts inspected before apply."],
            ].map(([title, value, detail]) => (
              <div key={title} className="policy-item">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {title}
                </span>
                <p className="mt-2 text-sm font-semibold">{value}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{detail}</p>
              </div>
            ))}
          </div>
        </Panel>
      )}
    </Page>
  );
}

const SYNC_PROFILES: { id: SyncProfile; label: string; detail: string }[] = [
  { id: "balanced", label: "Balanced", detail: "Sync approved project context and preferences when a trusted backend is connected." },
  { id: "privacy-first", label: "Privacy-first", detail: "Keep private notes and local memories strictly on-device unless explicitly exported." },
  { id: "full-approved", label: "Full approved", detail: "Synchronize all owner-approved records across paired devices." },
  { id: "manual", label: "Manual only", detail: "Hold all remote synchronization until explicitly triggered by the owner." },
];

function SettingsView() {
  const s = useLorin();
  const activeSync = SYNC_PROFILES.find((item) => item.id === s.syncProfile) ?? SYNC_PROFILES[0];

  return (
    <Page
      title="Settings"
      eyebrow="WORKSPACE CONFIGURATION"
      lede="Inspect sanitized local hardware readiness, configure routing, theme and synchronization defaults, and review global keyboard shortcuts."
      actions={
        <ActionButton
          variant="primary"
          icon={Command}
          onClick={() => s.setCommandPaletteOpen(true)}
        >
          Command palette
        </ActionButton>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <Panel
          title="Hardware & system status"
          description="Sanitized browser capabilities (CPU, RAM pressure, GPU availability and battery). Sensitive device identifiers are never collected."
          action={<Badge tone="teal">Sanitized probe</Badge>}
        >
          <HardwareStatus />
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel
            title="Privacy, routing & sync defaults"
            description="These preferences govern how LORIN routes inference and prepares synchronization boundaries."
          >
            <div className="flex flex-col gap-3">
              <div>
                <label className="field-label" htmlFor="settings-route">
                  Default model routing
                </label>
                <select
                  id="settings-route"
                  className="field-input mt-1.5"
                  value={s.route}
                  onChange={(event) => s.setRoute(event.target.value as typeof s.route)}
                >
                  <option value="auto">Automatic routing (local-first)</option>
                  <option value="ollama">Prefer local (Ollama)</option>
                  <option value="gemini">Request Gemini (requires verified backend)</option>
                  <option value="local-only">Local only (block cloud routing)</option>
                </select>
              </div>

              <div>
                <label className="field-label" htmlFor="settings-sync">
                  Synchronization profile
                </label>
                <select
                  id="settings-sync"
                  className="field-input mt-1.5"
                  value={s.syncProfile}
                  onChange={(event) => s.setSyncProfile(event.target.value as SyncProfile)}
                >
                  {SYNC_PROFILES.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{activeSync.detail}</p>
              </div>

              <div>
                <label className="field-label" htmlFor="settings-project">
                  Active workspace boundary
                </label>
                <select
                  id="settings-project"
                  className="field-input mt-1.5"
                  value={s.projectId}
                  onChange={(event) => s.setProject(event.target.value)}
                >
                  {s.projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name} ({project.id === "p2" ? "Public isolated" : "Private owner"})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="privacy-note mt-4">
              <ShieldCheck size={15} className="shrink-0" />
              <span>
                Cloud sync and remote inference remain inactive in this demo build until explicitly
                configured and verified.
              </span>
            </div>
          </Panel>

          <Panel
            title="Presentation, theme & session"
            description="Switch workspace density, toggle dark/light theme, or reset local browser demo state."
          >
            <div className="flex flex-wrap gap-2">
              {MODES.map((mode) => (
                <ActionButton
                  key={mode}
                  variant={s.mode === mode ? "primary" : "secondary"}
                  onClick={() => s.setMode(mode)}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </ActionButton>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
              <ActionButton
                variant="secondary"
                onClick={() => s.setThemeMode(s.themeMode === "dark" ? "light" : "dark")}
              >
                Theme: {s.themeMode === "dark" ? "Dark (#0B0F14)" : "Light"}
              </ActionButton>
              <ActionButton
                variant="secondary"
                onClick={() => s.setInspector(!s.inspector)}
              >
                {s.inspector ? "Hide context inspector" : "Show context inspector"}
              </ActionButton>
              <ActionButton icon={RefreshCw} onClick={() => s.reset()}>
                Reset local session
              </ActionButton>
            </div>
          </Panel>
        </div>
      </div>

      <Panel
        title="Keyboard shortcuts & command palette"
        description="Press Cmd+K (or Ctrl+K) anywhere to search commands, or type a two-key navigation chord outside text fields."
        action={
          <ActionButton icon={Keyboard} onClick={() => s.setCommandPaletteOpen(true)}>
            Open palette
          </ActionButton>
        }
      >
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <div className="shortcut-row">
            <span className="text-xs font-medium">Open Command Palette</span>
            <span className="flex items-center gap-1">
              <kbd className="kbd-key">⌘/Ctrl</kbd>
              <kbd className="kbd-key">K</kbd>
            </span>
          </div>
          {NAVIGATION_SHORTCUTS.map((item) => (
            <button
              key={item.chord}
              type="button"
              className="shortcut-row text-left transition-colors hover:border-teal/40"
              onClick={() => s.setView(item.view)}
            >
              <span className="truncate text-xs font-medium">{item.label}</span>
              <span className="flex shrink-0 items-center gap-1">
                {item.chord.split(" ").map((keyPart, keyIdx) => (
                  <kbd key={`${item.chord}-${keyIdx}-${keyPart}`} className="kbd-key">
                    {keyPart}
                  </kbd>
                ))}
              </span>
            </button>
          ))}
        </div>
      </Panel>
    </Page>
  );
}

export function MainView() {
  const mode = useLorin((state) => state.mode);
  const view = useLorin((state) => state.view);
  if (mode === "compact") return <ChatView />;
  if (view === "home") return <HomeView />;
  if (view === "companion") return <CompanionView />;
  if (view === "chat") return <ChatView />;
  if (view === "projects") return <ProjectsView />;
  if (view === "tasks") return <TasksView />;
  if (view === "calendar") return <CalendarView />;
  if (view === "workbench") return <WorkbenchView />;
  if (view === "intelligence") return <IntelligenceView />;
  if (view === "knowledge") return <VaultView which="knowledge" />;
  if (view === "vault") return <VaultView which="private" />;
  if (view === "memory") return <MemoryView />;
  if (view === "gideon") return <GideonView />;
  if (view === "voice") return <VoiceView />;
  if (view === "vision") return <VisionView />;
  if (view === "sandbox") return <SandboxView />;
  if (view === "automation") return <AutomationView />;
  if (view === "verification") return <VerificationView />;
  if (view === "devices") return <DevicesView />;
  if (view === "connections") return <ConnectionsView />;
  if (view === "presence") return <PresenceView />;
  if (view === "storage") return <StorageView />;
  if (view === "sync") return <SyncView />;
  if (view === "trust") return <TrustView />;
  if (view === "audit") return <AuditView />;
  if (view === "owner") return <OwnerControlView />;
  if (view === "settings") return <SettingsView />;
  return <HomeView />;
}

export function Ambient() {
  const s = useLorin();
  const project = s.projects.find((p) => p.id === s.projectId);
  const pending = s.jobs.filter((job) => job.state === "awaiting").length;
  return (
    <main className="ambient-screen">
      <div className="ambient-card">
        <BrandPresence />
        <CompanionCanvas size={190} />
        <p className="font-display text-2xl font-semibold">{project?.name ?? "LORIN"}</p>
        <p className="text-sm text-muted">
          {pending} approvals waiting · Demo runtime · No live model connection
        </p>
        <ActionButton variant="primary" onClick={() => s.setMode("workspace")}>
          Open workspace <ArrowRight size={14} />
        </ActionButton>
      </div>
    </main>
  );
}

function BrandPresence() {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-muted">
      <span className="brand-mark brand-mark-small">
        <span>L</span>
      </span>
      LORIN
    </div>
  );
}

export function Immersive() {
  const s = useLorin();
  const voice = useVoiceSession();
  const last = [...s.messages].reverse().find((message) => message.role === "lorin");
  return (
    <main className="immersive-screen">
      <div className="immersive-content">
        <BrandPresence />
        <CompanionCanvas size={240} interactive />
        <div className="max-w-xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
            Latest response
          </p>
          <p className="mt-3 text-base leading-relaxed">
            {last?.text ?? "LORIN is ready when you are."}
          </p>
        </div>
        <p className="min-h-6 text-center text-sm text-muted">{s.transcript}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <ActionButton
            variant="primary"
            icon={AudioLines}
            onClick={() => void voice.listen("script")}
          >
            Start scripted listen
          </ActionButton>
          {s.voice === "listening" && (
            <ActionButton onClick={() => voice.finish("script")}>Use script</ActionButton>
          )}
          <ActionButton icon={X} onClick={() => voice.interrupt()}>
            Interrupt
          </ActionButton>
          <ActionButton onClick={() => s.setMode("workspace")}>Workspace</ActionButton>
        </div>
      </div>
    </main>
  );
}
