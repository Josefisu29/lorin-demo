import { useEffect, useRef, useState } from "react";
import type { View } from "./engine";

export interface NavigationShortcut {
  chord: string;
  secondKey: string;
  view: View;
  label: string;
}

export const NAVIGATION_SHORTCUTS: NavigationShortcut[] = [
  { chord: "g h", secondKey: "h", view: "home", label: "Go to Today / Home" },
  { chord: "g c", secondKey: "c", view: "chat", label: "Go to Conversation" },
  { chord: "g p", secondKey: "p", view: "projects", label: "Go to Projects" },
  { chord: "g t", secondKey: "t", view: "tasks", label: "Go to Tasks & approvals" },
  { chord: "g w", secondKey: "w", view: "workbench", label: "Go to Workbench" },
  { chord: "g x", secondKey: "x", view: "sandbox", label: "Go to Sandbox" },
  { chord: "g k", secondKey: "k", view: "knowledge", label: "Go to Knowledge vault" },
  { chord: "g v", secondKey: "v", view: "vault", label: "Go to Private vault" },
  { chord: "g m", secondKey: "m", view: "memory", label: "Go to Memory" },
  { chord: "g g", secondKey: "g", view: "gideon", label: "Go to Continuity (GIDEON)" },
  { chord: "g i", secondKey: "i", view: "intelligence", label: "Go to Intelligence studio" },
  { chord: "g n", secondKey: "n", view: "connections", label: "Go to Connected services" },
  { chord: "g d", secondKey: "d", view: "devices", label: "Go to Devices" },
  { chord: "g r", secondKey: "r", view: "trust", label: "Go to Security & trust" },
  { chord: "g s", secondKey: "s", view: "settings", label: "Go to Settings" },
];

const SHORTCUT_MAP = new Map<string, View>(
  NAVIGATION_SHORTCUTS.map((item) => [item.secondKey, item.view]),
);

/**
 * Resolves the second key of a "g <key>" navigation chord to a LORIN View.
 */
export function resolveNavigationShortcut(key: string): View | null {
  if (!key) return null;
  return SHORTCUT_MAP.get(key.toLowerCase()) ?? null;
}

/**
 * Returns true if the event target is an editable form control where single-key
 * navigation chords should not hijack text entry.
 */
export function isEditableTarget(target: EventTarget | null): boolean {
  if (!target || typeof target !== "object") return false;
  const el = target as {
    tagName?: string;
    isContentEditable?: boolean;
    getAttribute?: (name: string) => string | null;
  };
  if (el.isContentEditable) return true;
  const tag = (el.tagName ?? "").toUpperCase();
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (typeof el.getAttribute === "function" && el.getAttribute("role") === "textbox") {
    return true;
  }
  return false;
}

export interface GlobalShortcutOptions {
  onNavigate: (view: View) => void;
  onTogglePalette: () => void;
  onClosePalette: () => void;
  paletteOpen: boolean;
  chordTimeoutMs?: number;
}

/**
 * Handles global LORIN keyboard shortcuts:
 * - Cmd+K / Ctrl+K: Toggle Command Palette (works even while focused in inputs)
 * - Escape: Close Command Palette
 * - "g" followed by a navigation key (e.g. "g" then "h" -> Home, "g" then "s" -> Settings)
 */
export function useGlobalShortcuts({
  onNavigate,
  onTogglePalette,
  onClosePalette,
  paletteOpen,
  chordTimeoutMs = 1000,
}: GlobalShortcutOptions) {
  const [pendingPrefix, setPendingPrefix] = useState<string | null>(null);
  const prefixRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const clearChord = () => {
      prefixRef.current = null;
      setPendingPrefix(null);
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const keyLower = event.key.toLowerCase();

      // Cmd+K or Ctrl+K toggles command palette globally
      if ((event.metaKey || event.ctrlKey) && !event.altKey && keyLower === "k") {
        event.preventDefault();
        clearChord();
        onTogglePalette();
        return;
      }

      if (keyLower === "escape") {
        if (paletteOpen) {
          event.preventDefault();
          onClosePalette();
        }
        clearChord();
        return;
      }

      // Do not process single-letter chords when command palette is open,
      // when modifier keys are held, or while typing in an input.
      if (paletteOpen || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      if (isEditableTarget(event.target)) {
        return;
      }

      if (prefixRef.current === "g") {
        const destination = resolveNavigationShortcut(keyLower);
        clearChord();
        if (destination) {
          event.preventDefault();
          onNavigate(destination);
        }
        return;
      }

      if (keyLower === "g") {
        prefixRef.current = "g";
        setPendingPrefix("g");
        if (timerRef.current !== null) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => {
          clearChord();
        }, chordTimeoutMs);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearChord();
    };
  }, [onNavigate, onTogglePalette, onClosePalette, paletteOpen, chordTimeoutMs]);

  return { pendingPrefix };
}
