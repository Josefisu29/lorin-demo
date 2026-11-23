import { useEffect } from "react";
import { Shell } from "./chrome";
import { useLorin } from "@/lib/lorin/store";
import { Ambient, Immersive, MainView } from "./views";

export function LorinApp() {
  const mode = useLorin((s) => s.mode);
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

  if (mode === "ambient") return <Ambient />;
  if (mode === "immersive") return <Immersive />;
  return (
    <Shell>
      <MainView />
    </Shell>
  );
}
