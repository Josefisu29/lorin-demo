import { useState, type ReactNode } from "react";
import {
  AlertTriangle,
  Archive,
  ArrowRight,
  BadgeCheck,
  Bell,
  Calendar,
  Check,
  Compass,
  Download,
  GitMerge,
  HardDrive,
  Lock,
  Mic,
  MonitorSmartphone,
  PhoneIncoming,
  Play,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  WifiOff,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import { GUIDED_SCENARIOS, M1_M9_ACCEPTANCE_MATRIX, type AutomationLevel } from "@/lib/lorin/demo-seed";
import { useLorin } from "@/lib/lorin/store";
import { formatWakeStateLabel, getWakeWordCapabilities } from "@/lib/lorin/wake";
import { CompanionCanvas } from "./CompanionCanvas";
import { MODES } from "./chrome";

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
}: {
  title: string;
  eyebrow?: string;
  lede?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="lorin-page max-w-screen-2xl">
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

export function CompanionView() {
  const s = useLorin();
  const [customUtterance, setCustomUtterance] = useState("LORIN, can you check the Atlas project?");
  const wakeStatus = formatWakeStateLabel(s.wakeState);

  const adaptiveRules = [
    { context: "Wake word detected", mode: "companion", detail: "5-second 4-stage activation sequence with context-aware greeting." },
    { context: "Code / diff inspection", mode: "workspace", detail: "Minimizes 3D companion into header orbital so diffs and files remain unobstructed." },
    { context: "Voice conversation", mode: "immersive", detail: "Full-screen 3D holographic companion with lip-sync and audio-reactive pulse." },
    { context: "Idle / ambient display", mode: "ambient", detail: "Low-power breathing presence with pending approval summary." },
    { context: "Phone / compact viewport", mode: "compact", detail: "Single-column conversational rail with top status header." },
  ];

  return (
    <Page
      title="LORIN Companion"
      eyebrow="M1 · 3D REAL-TIME PRESENCE & ADAPTIVE CONTROLLER"
      lede="Real-time 3D interactive companion with cursor gaze tracking, audio-reactive lip-sync, 5-second wake activation, and adaptive presentation scaling."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={wakeStatus.tone}>{wakeStatus.label}</Badge>
          <ActionButton
            variant="primary"
            icon={Sparkles}
            onClick={() => s.triggerWakePhrase("Hey LORIN")}
          >
            Run 5s activation intro
          </ActionButton>
        </div>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(340px,0.95fr)]">
        <Panel
          title="Interactive 3D Companion Core"
          description="Move your cursor over the companion canvas to test real-time gaze tracking. Quality tiers degrade gracefully to 2D orbital fallback."
          action={
            <div className="flex items-center gap-1.5">
              {(["high", "balanced", "2d-fallback"] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => s.setCompanionQuality(tier)}
                  className={`mode-option ${s.companionQuality === tier ? "is-active" : ""}`}
                >
                  {tier}
                </button>
              ))}
            </div>
          }
        >
          <div className="flex flex-col items-center justify-center rounded-card border border-line bg-bg py-6">
            <CompanionCanvas size={250} interactive />
            <div className="mt-5 flex flex-wrap justify-center gap-2 px-4">
              {(["idle", "listening", "processing", "researching", "coding", "speaking"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => useLorin.setState({ character: st })}
                  className={`prompt-chip ${s.character === st ? "border-teal text-teal" : ""}`}
                >
                  State: {st}
                </button>
              ))}
            </div>
          </div>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel
            title="Wake-word & trailing command preservation"
            description="Test wake phrases with or without a trailing command. LORIN preserves the command after the wake phrase and executes it after the 5-second intro."
          >
            <label className="field-label" htmlFor="companion-wake-input">
              Simulated wake utterance
            </label>
            <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
              <input
                id="companion-wake-input"
                type="text"
                value={customUtterance}
                onChange={(e) => setCustomUtterance(e.target.value)}
                className="field-input flex-1"
                placeholder="e.g., LORIN, can you check the Atlas project?"
              />
              <ActionButton
                variant="primary"
                icon={Mic}
                onClick={() => s.triggerWakePhrase(customUtterance)}
              >
                Trigger wake
              </ActionButton>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[
                "Hey LORIN",
                "LORIN, are you there?",
                "LORIN, let's get to work",
                "LORIN, can you check the Atlas project?",
                "LORIN, summarize the permission model",
              ].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  className="prompt-chip"
                  onClick={() => {
                    setCustomUtterance(sample);
                    s.triggerWakePhrase(sample);
                  }}
                >
                  “{sample}”
                </button>
              ))}
            </div>
            {s.pendingWakeCommand && (
              <div className="mt-3 rounded-control border border-teal/30 bg-teal/10 p-3 text-xs">
                <span className="font-semibold text-teal">Preserved trailing command:</span>{" "}
                <span className="font-mono">“{s.pendingWakeCommand}”</span>
              </div>
            )}
          </Panel>

          <Panel
            title="Adaptive presentation controller"
            description="Automatically or manually switch presentation mode based on current task context."
            action={
              <button
                type="button"
                onClick={() => s.setAutoPresentation(!s.autoPresentation)}
                className={`lorin-badge ${s.autoPresentation ? "lorin-badge-teal" : ""}`}
              >
                {s.autoPresentation ? "Adaptive: ON" : "Adaptive: Manual"}
              </button>
            }
          >
            <div className="flex flex-wrap gap-1.5 pb-3">
              {MODES.map((m) => (
                <ActionButton
                  key={m}
                  variant={s.mode === m ? "primary" : "secondary"}
                  onClick={() => s.setMode(m)}
                >
                  {m}
                </ActionButton>
              ))}
            </div>
            <div className="readiness-list border-t border-line pt-2">
              {adaptiveRules.map((rule) => (
                <div key={rule.context} className="readiness-row">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold">{rule.context}</p>
                    <p className="mt-0.5 text-[11px] text-muted">{rule.detail}</p>
                  </div>
                  <Badge tone={s.mode === rule.mode ? "teal" : "neutral"}>{rule.mode}</Badge>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </Page>
  );
}

export function CalendarView() {
  const s = useLorin();
  const overdueTasks = s.workTasks.filter((t) => t.status === "overdue" && t.projectId !== "p2");

  return (
    <Page
      title="Calendar & Contacts"
      eyebrow="SCHEDULE & COMMUNICATION BOUNDARY"
      lede="Review schedule commitments, overdue project milestones, and fictional demonstration contacts. Outbound messages always require explicit owner approval."
      actions={
        <Badge tone={s.envMode === "demo" ? "indigo" : "teal"}>
          {s.envMode === "demo" ? "Demo Tenant · Alex Mercer" : "Live Owner Schedule"}
        </Badge>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <div className="flex flex-col gap-4">
          <Panel
            title="Upcoming schedule & milestones"
            description={`${s.calendar.length} calendar entries in the active environment`}
          >
            {s.calendar.length ? (
              <div className="readiness-list">
                {s.calendar.map((evt) => {
                  const project = s.projects.find((p) => p.id === evt.projectId);
                  return (
                    <div key={evt.id} className="readiness-row">
                      <span className="readiness-icon">
                        <Calendar size={16} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium">{evt.title}</p>
                          <Badge
                            tone={
                              evt.kind === "Milestone"
                                ? "red"
                                : evt.kind === "Review"
                                  ? "amber"
                                  : "teal"
                            }
                          >
                            {evt.kind}
                          </Badge>
                          {project && <Badge>{project.name}</Badge>}
                        </div>
                        <p className="mt-1 text-xs text-muted">{evt.notes}</p>
                        <p className="mt-1 text-[11px] text-muted">
                          {evt.startAt} ({evt.durationMin} min) ·{" "}
                          {evt.participants.join(", ")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-state-icon">
                  <Calendar size={20} />
                </span>
                <p className="text-sm font-medium">No calendar events in Live environment</p>
                <p className="text-xs text-muted">
                  Switch to the Demonstration Environment in Owner Control to inspect the seeded events.
                </p>
              </div>
            )}
          </Panel>

          <Panel
            title="Overdue milestone alerts"
            description="Linked directly to project work tasks and proactive Presence events."
            action={<Badge tone={overdueTasks.length ? "red" : "teal"}>{overdueTasks.length} overdue</Badge>}
          >
            {overdueTasks.length ? (
              <div className="flex flex-col gap-2">
                {overdueTasks.map((task) => (
                  <div key={task.id} className="approval-preview flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        Due {task.dueAt} · Assignee: {task.assignee} · Priority: {task.priority}
                      </p>
                    </div>
                    <ActionButton
                      variant="primary"
                      icon={Check}
                      onClick={() => s.toggleWorkTaskStatus(task.id)}
                    >
                      Mark completed
                    </ActionButton>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted">No overdue tasks in the current environment.</p>
            )}
          </Panel>
        </div>

        <Panel
          title="Trusted contacts directory"
          description="Drafting a follow-up creates an unapproved draft proposal in Tasks & Approvals; LORIN never sends external messages autonomously."
        >
          {s.contacts.length ? (
            <div className="flex flex-col gap-3">
              {s.contacts.map((contact) => (
                <article key={contact.id} className="memory-card">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{contact.name}</p>
                      <p className="text-xs text-muted">
                        {contact.role} · {contact.organization}
                      </p>
                    </div>
                    <Badge tone={contact.status === "Follow-up due" ? "amber" : "teal"}>
                      {contact.status}
                    </Badge>
                  </div>
                  <p className="mt-2 font-mono text-[11px] text-muted">{contact.email}</p>
                  <p className="mt-2 text-xs text-muted">Last note: {contact.lastInteraction}</p>
                  <div className="mt-3">
                    <ActionButton
                      icon={Users}
                      onClick={() => {
                        s.propose(
                          "knowledge.append",
                          `Prepare unsent follow-up draft for ${contact.name} (${contact.email}) — requires owner review before sending.`,
                          `Follow-up Draft (${contact.name}) :: Hi ${contact.name.split(" ")[0]}, following up on: ${contact.lastInteraction}.`,
                        );
                        s.setView("tasks");
                      }}
                    >
                      Propose follow-up draft
                    </ActionButton>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted">No contacts stored in Live environment.</p>
          )}
        </Panel>
      </div>
    </Page>
  );
}

export function AutomationView() {
  const s = useLorin();

  const levels: { id: AutomationLevel; title: string; badge: string; detail: string }[] = [
    {
      id: 0,
      title: "Level 0 — Manual Only",
      badge: "Strict Manual",
      detail: "LORIN performs zero background preparation. Every index, summary, and proposal waits for an explicit prompt.",
    },
    {
      id: 1,
      title: "Level 1 — Assisted Preparation",
      badge: "Assisted",
      detail: "LORIN organizes context and highlights overdue tasks, but never queues draft proposals without a user command.",
    },
    {
      id: 2,
      title: "Level 2 — Semi-Autonomous (Default)",
      badge: "Recommended",
      detail: "LORIN may autonomously summarize notes, prepare daily briefings, index approved knowledge, and detect anomalies — while pausing for owner approval on all consequential actions.",
    },
    {
      id: 3,
      title: "Level 3 — Approval-Required Scheduled Mode",
      badge: "Scheduled Guard",
      detail: "Scheduled pipelines execute read-only stages and queue approval gates for owner verification.",
    },
  ];

  const allowedAutonomous = [
    "Summarize internal project documents and highlight overdue milestones",
    "Prepare daily morning and evening briefing cards in Presence Centre",
    "Run read-only title scans of the approved Knowledge Vault (excluding Private Vault)",
    "Verify SHA-256 checksums on local storage objects and backup snapshots",
    "Queue conflict records when two paired devices edit the same entity offline",
  ];

  const requiresOwnerApproval = [
    "Writing or modifying notes in Knowledge Vault or Private Vault",
    "Storing new long-term owner memories in GIDEON",
    "Applying engineering policy or code diffs in Workbench",
    "Sending any external message, email, or calendar invitation",
    "Pairing or revoking device certificates or changing tenant boundaries",
    "Executing arbitrary shell commands (permanently blocked by policy)",
  ];

  return (
    <Page
      title="Automation & Safe Autonomy"
      eyebrow="M8 · SEMI-AUTONOMOUS INTELLIGENCE & EMERGENCY STOP"
      lede="Configure LORIN's autonomy level (Levels 0–3) and inspect the strict boundary between safe background preparation and owner-approved consequential actions."
      actions={
        s.emergencyStopped ? (
          <ActionButton variant="primary" icon={Play} onClick={() => s.resumeAutomation()}>
            Resume Normal Operation
          </ActionButton>
        ) : (
          <button
            type="button"
            onClick={() => s.triggerEmergencyStop()}
            className="action-button border-danger/60 bg-danger/20 text-danger"
          >
            <ShieldAlert size={15} />
            <span>Emergency Stop All Automation</span>
          </button>
        )
      }
    >
      {s.emergencyStopped && (
        <div className="hardware-alert-banner is-critical" role="alert">
          <AlertTriangle size={18} className="shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold">Emergency Stop Active — All Autonomous Loops Halted</p>
            <p className="mt-0.5 text-xs text-muted">
              Wake-word listener, running tasks, and incoming briefings have been immediately suspended by owner command.
            </p>
          </div>
          <ActionButton variant="primary" onClick={() => s.resumeAutomation()}>
            Resume Level 1 Assisted
          </ActionButton>
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {levels.map((lvl) => {
          const active = s.automationLevel === lvl.id;
          return (
            <article
              key={lvl.id}
              className={`project-card flex flex-col justify-between ${active ? "is-active" : ""}`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Badge tone={active ? "teal" : "neutral"}>
                    {active ? "Active Level" : lvl.badge}
                  </Badge>
                  <Workflow size={16} className="text-muted" />
                </div>
                <h2 className="mt-4 font-display text-base font-semibold">{lvl.title}</h2>
                <p className="mt-2 text-xs leading-relaxed text-muted">{lvl.detail}</p>
              </div>
              <div className="mt-4 border-t border-line pt-3">
                <ActionButton
                  variant={active ? "quiet" : "primary"}
                  disabled={active}
                  onClick={() => s.setAutomationLevel(lvl.id)}
                >
                  {active ? "Selected" : "Select level"}
                </ActionButton>
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel
          title="Allowed autonomous actions (Level 2)"
          description="Read-only analysis, preparation, and health checks that never mutate external state."
          action={<Badge tone="teal">Permitted automatically</Badge>}
        >
          <div className="readiness-list">
            {allowedAutonomous.map((item) => (
              <div key={item} className="readiness-row">
                <span className="readiness-icon text-teal">
                  <Check size={15} />
                </span>
                <p className="text-xs leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Consequential actions requiring explicit owner approval"
          description="LORIN can never approve its own proposals or expand its own permissions."
          action={<Badge tone="amber">Owner approval mandatory</Badge>}
        >
          <div className="readiness-list">
            {requiresOwnerApproval.map((item) => (
              <div key={item} className="readiness-row">
                <span className="readiness-icon text-signal">
                  <Lock size={15} />
                </span>
                <p className="text-xs leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </Page>
  );
}

export function VerificationView() {
  const s = useLorin();
  const completedJobs = s.jobs.filter((j) => j.state === "completed");
  const verifiedJobs = s.jobs.filter((j) => j.state === "verified");

  return (
    <Page
      title="Verification & Acceptance Matrix"
      eyebrow="M1–M9 · ZERO-FABRICATION EVIDENCE & SCENARIO RUNNER"
      lede="An action is complete only when its post-execution evidence is verified. Run repeatable guided scenarios or inspect the M1–M9 engineering acceptance matrix."
      actions={
        <div className="flex flex-wrap gap-2">
          <Badge tone="teal">{M1_M9_ACCEPTANCE_MATRIX.length} / 9 Milestones Active</Badge>
          <ActionButton variant="primary" icon={Compass} onClick={() => s.startExplore()}>
            Launch 18-step guided tour
          </ActionButton>
        </div>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <Panel
          title="M1–M9 Upgrade Acceptance Matrix"
          description="Every milestone operates directly on the unified LORIN Zustand state store with honest capability labels."
        >
          <div className="readiness-list">
            {M1_M9_ACCEPTANCE_MATRIX.map((row) => (
              <div key={row.id} className="readiness-row">
                <span className="download-step-number">{row.milestone}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">{row.capability}</p>
                    <Badge tone="teal">{row.status}</Badge>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{row.evidence}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel
            title="Interactive Scenario Library (10 Scenarios)"
            description="Click any scenario to execute its real state transition in the active workspace."
          >
            <div className="flex flex-col gap-2">
              {GUIDED_SCENARIOS.map((sc) => (
                <div key={sc.id} className="approval-preview flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge tone="indigo">{sc.category}</Badge>
                      <p className="text-xs font-semibold">{sc.title}</p>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-muted">{sc.description}</p>
                  </div>
                  <ActionButton
                    variant="secondary"
                    icon={Play}
                    onClick={() => s.runGuidedScenario(sc.id)}
                  >
                    Run
                  </ActionButton>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            title="Evidence verification queue"
            description={`${completedJobs.length} awaiting evidence review · ${verifiedJobs.length} verified`}
          >
            {completedJobs.length ? (
              <div className="flex flex-col gap-2">
                {completedJobs.map((job) => (
                  <div key={job.id} className="approval-preview">
                    <p className="text-xs font-semibold">{job.title}</p>
                    <p className="mt-1 text-xs text-muted">{job.evidence}</p>
                    <div className="mt-2 flex gap-2">
                      <ActionButton variant="primary" icon={BadgeCheck} onClick={() => s.verify(job.id)}>
                        Verify evidence
                      </ActionButton>
                      <ActionButton icon={X} onClick={() => s.rejectEvidence(job.id)}>
                        Reject
                      </ActionButton>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted">
                No completed tasks are waiting for evidence verification. Approve a proposal in Tasks & Approvals first.
              </p>
            )}
          </Panel>
        </div>
      </div>
    </Page>
  );
}

export function PresenceView() {
  const s = useLorin();
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const events = s.presenceEvents.filter(
    (e) => filterPriority === "ALL" || e.priority === filterPriority,
  );
  const unackCount = s.presenceEvents.filter((e) => e.status !== "acknowledged").length;
  const unreadNotifs = s.notifications.filter((n) => !n.read).length;

  return (
    <Page
      title="Presence Centre & Call-In"
      eyebrow="M7 · PROACTIVE BRIEFINGS, PRIORITY ALERTS & SIMULATED CALL-IN"
      lede="LORIN monitors project milestones, device health, and synchronization conflicts, surfacing priority-tiered (P0–P4) presence briefings and interactive call-ins."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <ActionButton
            variant="secondary"
            icon={SlidersHorizontal}
            onClick={() => s.setQuietHours(!s.quietHoursEnabled)}
          >
            {s.quietHoursEnabled ? "Quiet Hours: ON (P0/P1 only)" : "Quiet Hours: OFF"}
          </ActionButton>
          <ActionButton
            variant="primary"
            icon={PhoneIncoming}
            onClick={() => s.startSimulatedCall()}
          >
            Simulate Incoming LORIN Call
          </ActionButton>
        </div>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <Panel
          title={`Presence events (${events.length})`}
          description={`${unackCount} active unacknowledged events across P0–P4 priority tiers`}
          action={
            <div className="flex flex-wrap gap-1">
              {["ALL", "P0", "P1", "P2", "P3", "P4"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFilterPriority(p)}
                  className={`mode-option ${filterPriority === p ? "is-active" : ""}`}
                >
                  {p}
                </button>
              ))}
            </div>
          }
        >
          {events.length ? (
            <div className="flex flex-col gap-2.5">
              {events.map((ev) => (
                <article
                  key={ev.id}
                  className={`memory-card ${ev.status !== "acknowledged" ? "border-teal/35" : ""}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
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
                      <Badge>{ev.category}</Badge>
                      <p className="text-sm font-semibold">{ev.title}</p>
                    </div>
                    <span className="text-[11px] text-muted" suppressHydrationWarning>
                      {new Date(ev.at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted">{ev.detail}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      {ev.category === "briefing" && (
                        <ActionButton
                          variant="primary"
                          icon={PhoneIncoming}
                          onClick={() => s.startSimulatedCall()}
                        >
                          Trigger Call-In Briefing
                        </ActionButton>
                      )}
                    </div>
                    {ev.status !== "acknowledged" ? (
                      <ActionButton
                        variant="quiet"
                        icon={Check}
                        onClick={() => s.acknowledgePresenceEvent(ev.id)}
                      >
                        Acknowledge
                      </ActionButton>
                    ) : (
                      <span className="text-[11px] text-muted">Acknowledged</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted">No presence events match the selected filter.</p>
          )}
        </Panel>

        <Panel
          title={`Notifications (${s.notifications.length})`}
          description={`${unreadNotifs} unread system notifications`}
        >
          <div className="flex flex-col gap-2">
            {s.notifications.map((notif) => (
              <div
                key={notif.id}
                className={`approval-preview ${!notif.read ? "border-indigo/40" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <Bell size={13} className="text-teal" />
                    <p className="text-xs font-semibold">{notif.title}</p>
                  </div>
                  <Badge
                    tone={
                      notif.priority === "P0" || notif.priority === "P1"
                        ? "red"
                        : notif.priority === "P2"
                          ? "amber"
                          : "neutral"
                    }
                  >
                    {notif.priority}
                  </Badge>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted">{notif.body}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-muted">
                  <span suppressHydrationWarning>{new Date(notif.at).toLocaleString()}</span>
                  {!notif.read ? (
                    <button
                      type="button"
                      className="font-semibold text-teal"
                      onClick={() => s.markNotificationRead(notif.id)}
                    >
                      Mark read
                    </button>
                  ) : (
                    <span>Read</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </Page>
  );
}

export function StorageView() {
  const s = useLorin();

  return (
    <Page
      title="Cloud & Local-First Storage"
      eyebrow="M5 & M6 · CONTENT-ADDRESSED STORAGE & VERIFIED BACKUPS"
      lede="Inspect versioned local-first storage objects with SHA-256 checksums, create point-in-time recovery snapshots, and run restore integrity verification."
      actions={
        <ActionButton variant="primary" icon={Archive} onClick={() => s.createBackupSnapshot()}>
          Create Snapshot Backup
        </ActionButton>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
        <Panel
          title={`Storage objects (${s.storageObjects.length})`}
          description="Local-first objects with content-addressed SHA-256 digests and explicit storage tier labels."
        >
          <div className="readiness-list">
            {s.storageObjects.map((obj) => (
              <div key={obj.id} className="readiness-row">
                <span className="readiness-icon">
                  <HardDrive size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{obj.name}</p>
                    <Badge tone="teal">{obj.version}</Badge>
                    <Badge tone={obj.location === "Primary Node SQLite (Demo)" ? "indigo" : "neutral"}>
                      {obj.location}
                    </Badge>
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-muted">
                    {obj.category} · {obj.sizeKb.toFixed(1)} KB · {obj.checksum}
                  </p>
                </div>
                <span className="text-[11px] text-muted">
                  {obj.updatedAt}
                </span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title={`Backup snapshots (${s.backups.length})`}
          description="Verify backup checksums before relying on a restore archive."
        >
          <div className="flex flex-col gap-3">
            {s.backups.map((bkp) => (
              <article key={bkp.id} className="memory-card">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{bkp.label}</p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {bkp.createdAt} · {bkp.sizeKb} KB · {bkp.location}
                    </p>
                  </div>
                  <Badge tone={bkp.restoreVerified ? "teal" : "amber"}>
                    {bkp.restoreVerified ? "Restore Verified" : "Unverified"}
                  </Badge>
                </div>
                <p className="mt-2 font-mono text-[11px] text-muted">{bkp.checksum}</p>
                <div className="mt-3">
                  <ActionButton
                    variant={bkp.restoreVerified ? "secondary" : "primary"}
                    icon={ShieldCheck}
                    onClick={() => s.verifyBackupRestore(bkp.id)}
                  >
                    {bkp.restoreVerified ? "Re-verify restore integrity" : "Verify restore integrity"}
                  </ActionButton>
                </div>
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </Page>
  );
}

export function SyncView() {
  const s = useLorin();
  const [simTitle, setSimTitle] = useState("Validate offline sync journal delta from Pixel 9 Pro");
  const [simDevice, setSimDevice] = useState("Pixel 9 Pro Companion");
  const openConflicts = s.syncConflicts.filter((c) => c.status === "unresolved");

  return (
    <Page
      title="Synchronization Centre"
      eyebrow="M4 & M5 · MULTI-DEVICE SYNC JOURNAL & CONFLICT RESOLUTION"
      lede="Local-first change journal, offline queue simulation, multi-client propagation simulator, and deterministic conflict resolution."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={s.online ? "teal" : "amber"}>
            {s.online ? "Transport: Local Wi-Fi (mDNS/TLS)" : "Offline Queue Active"}
          </Badge>
          <ActionButton
            icon={WifiOff}
            onClick={() => s.setOnline(!s.online)}
          >
            {s.online ? "Simulate Offline Queue" : "Reconnect & Flush Queue"}
          </ActionButton>
        </div>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <div className="flex flex-col gap-4">
          <Panel
            title={`Conflict resolution inspector (${openConflicts.length} unresolved)`}
            description="Never silently overwrite conflicting user edits across devices. Choose Local, Remote, or Merged state."
            action={
              <Badge tone={openConflicts.length ? "amber" : "teal"}>
                {openConflicts.length} open
              </Badge>
            }
          >
            {s.syncConflicts.length ? (
              <div className="flex flex-col gap-3">
                {s.syncConflicts.map((conflict) => (
                  <article key={conflict.id} className="memory-card">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{conflict.entityTitle}</p>
                        <p className="text-xs text-muted">
                          {conflict.localDevice} vs {conflict.remoteDevice}
                        </p>
                      </div>
                      <Badge tone={conflict.status === "unresolved" ? "amber" : "teal"}>
                        {conflict.status}
                      </Badge>
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-control border border-line bg-surface p-2.5 text-xs">
                        <p className="font-semibold text-teal">Local ({conflict.localDevice})</p>
                        <p className="mt-1 text-muted">{conflict.localSummary}</p>
                      </div>
                      <div className="rounded-control border border-line bg-surface p-2.5 text-xs">
                        <p className="font-semibold text-indigo">Remote ({conflict.remoteDevice})</p>
                        <p className="mt-1 text-muted">{conflict.remoteSummary}</p>
                      </div>
                    </div>
                    {conflict.status === "unresolved" && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <ActionButton
                          variant="secondary"
                          onClick={() => s.resolveSyncConflict(conflict.id, "resolved_local")}
                        >
                          Keep Local
                        </ActionButton>
                        <ActionButton
                          variant="secondary"
                          onClick={() => s.resolveSyncConflict(conflict.id, "resolved_remote")}
                        >
                          Keep Remote
                        </ActionButton>
                        <ActionButton
                          variant="primary"
                          icon={GitMerge}
                          onClick={() => s.resolveSyncConflict(conflict.id, "resolved_merged")}
                        >
                          Merge Both Versions
                        </ActionButton>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted">No synchronization conflicts recorded.</p>
            )}
          </Panel>

          <Panel
            title="Multi-client task sync simulator"
            description="Simulate a paired companion device creating or updating a task and propagating it into this session's journal."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="sim-device">
                  Origin paired device
                </label>
                <select
                  id="sim-device"
                  value={simDevice}
                  onChange={(e) => setSimDevice(e.target.value)}
                  className="field-input mt-1"
                >
                  <option value="Pixel 9 Pro Companion">Pixel 9 Pro Companion (Android)</option>
                  <option value="ThinkPad X1 Carbon">ThinkPad X1 Carbon (Mobile Laptop)</option>
                  <option value="Atlas Desktop Workstation">Atlas Desktop Workstation (Primary Node)</option>
                </select>
              </div>
              <div>
                <label className="field-label" htmlFor="sim-title">
                  Task payload
                </label>
                <input
                  id="sim-title"
                  value={simTitle}
                  onChange={(e) => setSimTitle(e.target.value)}
                  className="field-input mt-1"
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <ActionButton
                variant="primary"
                icon={RefreshCw}
                onClick={() => {
                  if (!simTitle.trim()) return;
                  s.simulatePeerSync(simTitle.trim(), simDevice);
                }}
              >
                Propagate task from {simDevice.split(" ")[0]}
              </ActionButton>
            </div>
          </Panel>
        </div>

        <Panel
          title={`Durable change journal (${s.syncOps.length})`}
          description="Ordered operation log with transport and delivery state."
        >
          <div className="readiness-list">
            {s.syncOps.map((op) => (
              <div key={op.id} className="readiness-row">
                <span className="readiness-icon">
                  <RefreshCw size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold">
                      [{op.entityType.toUpperCase()}] {op.opId} v{op.version} — {op.entityTitle}
                    </p>
                    <Badge
                      tone={
                        op.status === "acknowledged"
                          ? "teal"
                          : op.status === "conflict"
                            ? "red"
                            : "amber"
                      }
                    >
                      {op.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[11px] text-muted">
                    Origin: {op.originDevice} → {op.targetDevice} · {op.transport} ·{" "}
                    <span suppressHydrationWarning>{new Date(op.at).toLocaleTimeString()}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </Page>
  );
}

export function AuditView() {
  const s = useLorin();
  const [query, setQuery] = useState("");
  const filteredAudit = s.audit.filter((a) =>
    a.text.toLowerCase().includes(query.toLowerCase()),
  );

  const exportAuditJson = () => {
    const payload = JSON.stringify(
      {
        tenant: s.envMode === "demo" ? "demo-atlas-01" : "live-owner-01",
        exportedAt: new Date().toISOString(),
        auditCount: s.audit.length,
        audit: s.audit,
        continuityEvents: s.events,
      },
      null,
      2,
    );
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lorin-audit-${s.envMode}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Page
      title="Audit History"
      eyebrow="TAMPER-EVIDENT SECURITY & DECISION LOG"
      lede="Chronological record of every capability proposal, approval decision, wake-word activation, conflict resolution, and environment switch."
      actions={
        <ActionButton variant="primary" icon={Download} onClick={exportAuditJson}>
          Export Audit JSON
        </ActionButton>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <Panel
          title={`Security audit trail (${filteredAudit.length})`}
          description="Every consequential operation records an immutable timestamped entry."
          action={
            <div className="search-field">
              <input
                aria-label="Filter audit entries"
                placeholder="Filter audit log…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          }
        >
          <div className="audit-list">
            {filteredAudit.map((entry) => (
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

        <Panel
          title={`GIDEON continuity timeline (${s.events.length})`}
          description="High-level decision milestones and verification markers."
        >
          <ol className="timeline-list">
            {s.events.map((event) => (
              <li key={event.id} className="timeline-item">
                <span className="timeline-dot" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">{event.title}</p>
                    <time className="text-[11px] text-muted" suppressHydrationWarning>
                      {new Date(event.at).toLocaleTimeString()}
                    </time>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{event.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      </div>
    </Page>
  );
}

export function OwnerControlView() {
  const s = useLorin();
  const wakeCaps = getWakeWordCapabilities();

  const platforms = [
    {
      name: "Web Application (Current Session)",
      status: "Available & Active",
      tone: "teal" as Tone,
      detail: "Full 24-workspace personal intelligence interface running in this browser.",
    },
    {
      name: "Progressive Web App (PWA)",
      status: "Installable Web App",
      tone: "teal" as Tone,
      detail: "Supports offline local-first cache and home-screen installation where browser permits.",
    },
    {
      name: "Windows Desktop Application",
      status: "Windows Desktop Application — Not Yet Available",
      tone: "amber" as Tone,
      detail: "Native Windows tray service, local folder watcher, and hardware probe installer is not packaged in this web build.",
    },
    {
      name: "Android Companion",
      status: "Simulated Pairing · Foreground Web Ready",
      tone: "indigo" as Tone,
      detail: "Responsive mobile web experience works today; native background wake-word service requires the signed Android APK.",
    },
    {
      name: "iPhone / iPad (iOS / iPadOS)",
      status: "Tap-to-Talk & Foreground Only",
      tone: "neutral" as Tone,
      detail: "iOS restricts permanent background microphone capture for web apps; honest foreground listener enforced.",
    },
  ];

  return (
    <Page
      title="Owner Control & Environment Isolation"
      eyebrow="TENANT ISOLATION · PLATFORM TRUTH · SOVEREIGN GOVERNANCE"
      lede="Switch cleanly between the rich fictional Demonstration Environment (Alex Mercer · demo-atlas-01) and the isolated Live Owner Environment (live-owner-01) with zero data cross-contamination."
      actions={
        <Badge tone={s.envMode === "demo" ? "indigo" : "teal"}>
          Active Tenant: {s.envMode === "demo" ? "demo-atlas-01 (Demo)" : "live-owner-01 (Live)"}
        </Badge>
      }
    >
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel
          title="Operating Environment Isolation (§0.2)"
          description="Demonstration data and live owner data are strictly separated. Switching environments replaces the active namespace without mixing records."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <article className={`project-card ${s.envMode === "demo" ? "is-active" : ""}`}>
              <div className="flex items-center justify-between">
                <Badge tone="indigo">demo-atlas-01</Badge>
                {s.envMode === "demo" && <Badge tone="teal">Active</Badge>}
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold">Demonstration Environment</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Fictional owner Alex Mercer · 4+1 projects · 26 tasks · 22 knowledge docs · 15 presence events · 7 devices.
              </p>
              <div className="mt-4">
                <ActionButton
                  variant={s.envMode === "demo" ? "quiet" : "primary"}
                  disabled={s.envMode === "demo"}
                  onClick={() => s.switchEnvironment("demo")}
                >
                  {s.envMode === "demo" ? "Currently active" : "Switch to Demo Environment"}
                </ActionButton>
              </div>
            </article>

            <article className={`project-card ${s.envMode === "live" ? "is-active" : ""}`}>
              <div className="flex items-center justify-between">
                <Badge tone="teal">live-owner-01</Badge>
                {s.envMode === "live" && <Badge tone="teal">Active</Badge>}
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold">Owner's Live Environment</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Clean, zero-synthetic-data workspace for real owner notes, tasks, and verified memories.
              </p>
              <div className="mt-4">
                <ActionButton
                  variant={s.envMode === "live" ? "quiet" : "primary"}
                  disabled={s.envMode === "live"}
                  onClick={() => s.switchEnvironment("live")}
                >
                  {s.envMode === "live" ? "Currently active" : "Switch to Live Owner Environment"}
                </ActionButton>
              </div>
            </article>
          </div>
        </Panel>

        <Panel
          title="Platform Installation & Capability Truth Matrix (§19 & §23)"
          description="LORIN never fabricates native installer links or misrepresents browser background microphone limits."
        >
          <div className="readiness-list">
            {platforms.map((p) => (
              <div key={p.name} className="readiness-row">
                <span className="readiness-icon">
                  <MonitorSmartphone size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold">{p.name}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{p.detail}</p>
                </div>
                <Badge tone={p.tone}>{p.status}</Badge>
              </div>
            ))}
          </div>
          <div className="privacy-note mt-3">
            <ShieldCheck size={15} className="shrink-0" />
            <span>{wakeCaps.platformNote}</span>
          </div>
        </Panel>
      </div>
    </Page>
  );
}
