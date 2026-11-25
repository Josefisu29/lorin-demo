import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  BookOpen,
  BrainCircuit,
  Cpu,
  Database,
  Eye,
  FolderKanban,
  History,
  Home,
  Lock,
  MessageSquare,
  Mic,
  MonitorSmartphone,
  PanelRight,
  Plug,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Terminal,
  WifiOff,
  X,
  type LucideIcon,
} from "lucide-react";
import { useLorin, type Mode, type View } from "@/lib/lorin/store";

interface CommandItem {
  id: string;
  group: "Navigation" | "Workspace mode" | "Projects" | "Quick actions";
  label: string;
  detail: string;
  shortcut?: string;
  icon: LucideIcon;
  keywords: string;
  run: () => void;
}

export function CommandPalette() {
  const open = useLorin((s) => s.commandPaletteOpen);
  const setOpen = useLorin((s) => s.setCommandPaletteOpen);
  const setView = useLorin((s) => s.setView);
  const setMode = useLorin((s) => s.setMode);
  const setProject = useLorin((s) => s.setProject);
  const setRoute = useLorin((s) => s.setRoute);
  const setOnline = useLorin((s) => s.setOnline);
  const setInspector = useLorin((s) => s.setInspector);
  const propose = useLorin((s) => s.propose);
  const projects = useLorin((s) => s.projects);
  const online = useLorin((s) => s.online);
  const inspector = useLorin((s) => s.inspector);

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const commands = useMemo<CommandItem[]>(() => {
    const closeAnd = (fn: () => void) => () => {
      fn();
      setOpen(false);
    };

    const nav = (view: View, label: string, detail: string, icon: LucideIcon, shortcut?: string): CommandItem => ({
      id: `nav-${view}`,
      group: "Navigation",
      label,
      detail,
      shortcut,
      icon,
      keywords: `${label} ${detail} ${view} ${shortcut ?? ""}`.toLowerCase(),
      run: closeAnd(() => {
        if (useLorin.getState().mode === "ambient" || useLorin.getState().mode === "immersive" || useLorin.getState().mode === "compact") {
          setMode("workspace");
        }
        setView(view);
      }),
    });

    const modes: { id: Mode; label: string; detail: string }[] = [
      { id: "workspace", label: "Workspace mode", detail: "Full navigation, tools and optional inspector" },
      { id: "companion", label: "Companion mode", detail: "Icon rail navigation with companion presence" },
      { id: "compact", label: "Compact mode", detail: "Focused conversation without sidebar" },
      { id: "immersive", label: "Immersive mode", detail: "Full-screen visual presence and voice" },
      { id: "ambient", label: "Ambient mode", detail: "Low-distraction standby surface" },
    ];

    return [
      nav("home", "Today / Home", "Overview, readiness and pending approvals", Home, "g h"),
      nav("chat", "Conversation", "Chat with LORIN across internal capabilities", MessageSquare, "g c"),
      nav("projects", "Projects", "Switch isolated workspaces (Atlas / MOSAIRA)", FolderKanban, "g p"),
      nav("tasks", "Tasks & approvals", "Review, approve and verify scoped actions", Activity, "g t"),
      nav("workbench", "Workbench", "Inspect policy diffs and controlled changes", Cpu, "g w"),
      nav("sandbox", "Sandbox", "Isolated execution environments and policies", Terminal, "g x"),
      nav("knowledge", "Knowledge vault", "Approved project documents and indexing", BookOpen, "g k"),
      nav("vault", "Private vault", "Isolated private owner notes", Lock, "g v"),
      nav("memory", "Memory", "Approved memories with provenance", Sparkles, "g m"),
      nav("gideon", "Continuity (GIDEON)", "Chronological decisions and events", History, "g g"),
      nav("voice", "Voice", "Microphone permission and speech controls", Mic),
      nav("vision", "Vision", "User-selected local image snapshots", Eye),
      nav("intelligence", "Intelligence studio", "Models, downloads, providers and hardware", BrainCircuit, "g i"),
      nav("connections", "Connected services", "Google Drive and local folder governance", Plug, "g n"),
      nav("devices", "Devices", "Companion enrollment and revocation", MonitorSmartphone, "g d"),
      nav("trust", "Security & trust", "Capabilities, policies and audit trail", ShieldCheck, "g r"),
      nav("settings", "Settings", "Hardware status, privacy defaults and shortcuts", Settings, "g s"),
      ...modes.map((m) => ({
        id: `mode-${m.id}`,
        group: "Workspace mode" as const,
        label: m.label,
        detail: m.detail,
        icon: Sparkles,
        keywords: `mode ${m.id} ${m.label} ${m.detail}`.toLowerCase(),
        run: closeAnd(() => setMode(m.id)),
      })),
      ...projects.map((p) => ({
        id: `project-${p.id}`,
        group: "Projects" as const,
        label: `Switch project to ${p.name}`,
        detail: p.note,
        icon: FolderKanban,
        keywords: `project switch workspace ${p.name} ${p.note}`.toLowerCase(),
        run: closeAnd(() => setProject(p.id)),
      })),
      {
        id: "act-local-only",
        group: "Quick actions",
        label: "Enforce Local-only routing",
        detail: "Block all cloud routing preferences",
        icon: Lock,
        keywords: "local only private route model security",
        run: closeAnd(() => setRoute("local-only")),
      },
      {
        id: "act-auto-route",
        group: "Quick actions",
        label: "Use Automatic model routing",
        detail: "Local-first with verified cloud routing where allowed",
        icon: BrainCircuit,
        keywords: "auto automatic route model",
        run: closeAnd(() => setRoute("auto")),
      },
      {
        id: "act-toggle-offline",
        group: "Quick actions",
        label: online ? "Simulate offline mode" : "End offline simulation",
        detail: "Toggle simulated network availability",
        icon: WifiOff,
        keywords: "offline online network simulation",
        run: closeAnd(() => setOnline(!online)),
      },
      {
        id: "act-toggle-inspector",
        group: "Quick actions",
        label: inspector ? "Hide context inspector" : "Show context inspector",
        detail: "Toggle the right-hand session context panel",
        icon: PanelRight,
        keywords: "inspector sidebar panel context",
        run: closeAnd(() => setInspector(!inspector)),
      },
      {
        id: "act-propose-index",
        group: "Quick actions",
        label: "Propose Knowledge Vault index",
        detail: "Queue a read-only scan of Knowledge Vault titles",
        icon: Database,
        keywords: "index knowledge vault scan propose",
        run: closeAnd(() =>
          propose("vault.index", "Read-only scan of Knowledge Vault titles. No private vault access."),
        ),
      },
    ];
  }, [projects, online, inspector, setOpen, setMode, setView, setProject, setRoute, setOnline, setInspector, propose]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((cmd) => cmd.keywords.includes(q));
  }, [commands, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      const id = window.requestAnimationFrame(() => inputRef.current?.focus());
      return () => window.cancelAnimationFrame(id);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!open) return null;

  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((prev) => (filtered.length ? (prev + 1) % filtered.length : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prev) => (filtered.length ? (prev - 1 + filtered.length) % filtered.length : 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const activeItem = filtered[selectedIndex];
      if (activeItem) activeItem.run();
    } else if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  };

  let runningIndex = -1;

  return (
    <div
      className="command-palette-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) setOpen(false);
      }}
    >
      <div
        className="command-palette-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className="command-palette-header">
          <Search size={16} className="shrink-0 text-muted" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            className="command-palette-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Jump to a workspace, switch mode, or run an action…"
            aria-label="Search commands"
            aria-autocomplete="list"
          />
          <button
            type="button"
            className="icon-button"
            onClick={() => setOpen(false)}
            aria-label="Close command palette"
          >
            <X size={16} />
          </button>
        </div>

        <div className="command-palette-list" role="listbox" aria-label="Available commands">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted">
              No command matches “{query}”.
            </div>
          ) : (
            Object.entries(grouped).map(([groupName, items]) => (
              <div key={groupName} className="command-palette-group">
                <p className="command-palette-group-label">{groupName}</p>
                {items.map((item) => {
                  runningIndex += 1;
                  const idx = runningIndex;
                  const Icon = item.icon;
                  const active = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      aria-selected={active}
                      className={`command-palette-item ${active ? "is-active" : ""}`}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => item.run()}
                    >
                      <span className="command-palette-icon">
                        <Icon size={15} />
                      </span>
                      <span className="min-w-0 flex-1 text-left">
                        <span className="block truncate text-sm font-medium">{item.label}</span>
                        <span className="block truncate text-xs text-muted">{item.detail}</span>
                      </span>
                      {item.shortcut && (
                        <span className="flex shrink-0 items-center gap-1" aria-hidden="true">
                          {item.shortcut.split(" ").map((keyPart, keyIdx) => (
                            <kbd key={`${item.id}-${keyIdx}-${keyPart}`} className="kbd-key">
                              {keyPart}
                            </kbd>
                          ))}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="command-palette-footer">
          <span>
            <kbd className="kbd-key">↑</kbd> <kbd className="kbd-key">↓</kbd> navigate · <kbd className="kbd-key">↵</kbd> select · <kbd className="kbd-key">Esc</kbd> close
          </span>
          <span>Shortcuts: g then h (Home) · g then s (Settings)</span>
        </div>
      </div>
    </div>
  );
}
