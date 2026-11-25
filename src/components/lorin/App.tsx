import { useCallback, useEffect } from "react";
import { useGlobalShortcuts } from "@/lib/lorin/shortcuts";
import { useLorin, type View } from "@/lib/lorin/store";
import { Shell } from "./chrome";
import { CommandPalette } from "./CommandPalette";
import { Ambient, Immersive, MainView } from "./views";

export function LorinApp() {
  const mode = useLorin((s) => s.mode);
  const paletteOpen = useLorin((s) => s.commandPaletteOpen);
  const setCommandPaletteOpen = useLorin((s) => s.setCommandPaletteOpen);

  useEffect(() => {
    void useLorin.persist.rehydrate().then(() => {
      const s = useLorin.getState();
      const hot = s.character === "listening" || s.character === "processing" || s.character === "speaking" || s.voice !== "idle";
      const patch: Partial<typeof s> = {};
      if (hot) Object.assign(patch, { voice: "idle", voiceSource: "none", character: "idle", voiceSession: "" });
      // Older demo builds allowed a local toggle to mark Gemini verified.
      // That flag never checked credentials; clear it during migration.
      if (s.geminiVerified) patch.geminiVerified = false;
      if (Object.keys(patch).length) useLorin.setState(patch);
    });
  }, []);

  const handleNavigate = useCallback((view: View) => {
    const state = useLorin.getState();
    if (state.mode === "ambient" || state.mode === "immersive" || state.mode === "compact") {
      state.setMode("workspace");
    }
    state.setView(view);
  }, []);

  const handleTogglePalette = useCallback(() => {
    setCommandPaletteOpen(!useLorin.getState().commandPaletteOpen);
  }, [setCommandPaletteOpen]);

  const handleClosePalette = useCallback(() => {
    setCommandPaletteOpen(false);
  }, [setCommandPaletteOpen]);

  const { pendingPrefix } = useGlobalShortcuts({
    onNavigate: handleNavigate,
    onTogglePalette: handleTogglePalette,
    onClosePalette: handleClosePalette,
    paletteOpen,
  });

  const content =
    mode === "ambient" ? (
      <Ambient />
    ) : mode === "immersive" ? (
      <Immersive />
    ) : (
      <Shell>
        <MainView />
      </Shell>
    );

  return (
    <>
      {content}
      <CommandPalette />
      {pendingPrefix && (
        <div className="chord-indicator" role="status" aria-live="polite">
          <span className="text-muted">Shortcut</span>
          <kbd className="kbd-key">{pendingPrefix}</kbd>
          <span className="text-muted">then h / s / c / i …</span>
        </div>
      )}
    </>
  );
}

