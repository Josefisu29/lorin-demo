import { useEffect, useRef, useState } from "react";
import { captureMic, releaseMic, silence, startMeter } from "@/lib/lorin/audio";
import { useLorin } from "@/lib/lorin/store";

const SCRIPT = "What does the Atlas brief say about verification?";

export function useVoiceSession() {
  const beginListen = useLorin((s) => s.beginListen);
  const finishUtterance = useLorin((s) => s.finishUtterance);
  const interruptStore = useLorin((s) => s.interrupt);
  const noteMic = useLorin((s) => s.noteMic);
  const micGranted = useLorin((s) => s.micGranted);
  const [level, setLevel] = useState(0);
  const [draft, setDraft] = useState(SCRIPT);
  const stopMeter = useRef<(() => void) | null>(null);
  const draftRef = useRef(draft);
  const ending = useRef(false);
  const heard = useRef(false);
  const quietSince = useRef<number | null>(null);
  draftRef.current = draft;

  function stopAudio() {
    stopMeter.current?.();
    stopMeter.current = null;
    releaseMic();
    setLevel(0);
    heard.current = false;
    quietSince.current = null;
  }

  useEffect(() => () => {
    stopAudio();
    silence();
  }, []);

  async function grant() {
    try {
      const stream = await captureMic();
      stream.getTracks().forEach((t) => t.stop());
      noteMic(true);
    } catch {
      noteMic(false, "Microphone permission was denied or is unavailable. You can still run a scripted line.");
    }
  }

  function finish(source: "typed" | "script") {
    if (ending.current) return;
    const text = source === "script" ? SCRIPT : draftRef.current.trim();
    if (!text) return;
    ending.current = true;
    stopAudio();
    finishUtterance(text, source);
    ending.current = false;
  }

  async function listen(source: "microphone" | "script") {
    stopAudio();
    ending.current = false;
    if (source === "microphone") {
      if (!micGranted) {
        noteMic(false, "Grant the microphone before a live listen.");
        return;
      }
      try {
        const stream = await captureMic();
        beginListen("microphone");
        stopMeter.current = startMeter(stream, (n) => {
          setLevel(n);
          if (n > 0.12) {
            heard.current = true;
            quietSince.current = null;
            return;
          }
          if (!heard.current || !draftRef.current.trim()) return;
          const now = performance.now();
          if (quietSince.current == null) quietSince.current = now;
          else if (now - quietSince.current > 700) finish("typed");
        });
        return;
      } catch {
        noteMic(false, "The microphone closed before listening started.");
        return;
      }
    }
    beginListen("script");
  }

  function interrupt() {
    ending.current = true;
    stopAudio();
    interruptStore();
    ending.current = false;
  }

  return { level, draft, setDraft, grant, listen, finish, interrupt, script: SCRIPT };
}
