let current: MediaStream | null = null;

export async function captureMic() {
  releaseMic();
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Microphone API is unavailable.");
  }
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  current = stream;
  return stream;
}

export function releaseMic() {
  current?.getTracks().forEach((t) => t.stop());
  current = null;
}

export function startMeter(stream: MediaStream, onLevel: (level: number) => void) {
  const ctx = new AudioContext();
  void ctx.resume();
  const source = ctx.createMediaStreamSource(stream);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);
  const data = new Uint8Array(analyser.frequencyBinCount);
  let raf = 0;
  const tick = () => {
    analyser.getByteTimeDomainData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      const v = (data[i] - 128) / 128;
      sum += v * v;
    }
    onLevel(Math.min(1, Math.sqrt(sum / data.length) * 4));
    raf = requestAnimationFrame(tick);
  };
  tick();
  return () => {
    cancelAnimationFrame(raf);
    source.disconnect();
    void ctx.close();
  };
}

export function silence() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

export function speak(
  text: string,
  hooks: { onstart: () => void; onend: () => void; onerror: () => void },
) {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  utterance.onstart = hooks.onstart;
  utterance.onend = hooks.onend;
  utterance.onerror = hooks.onerror;
  window.speechSynthesis.speak(utterance);
  return true;
}
