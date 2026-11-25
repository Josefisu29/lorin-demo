import { Mic, MicOff, Phone, PhoneIncoming, PhoneOff, ShieldCheck } from "lucide-react";
import { useLorin } from "@/lib/lorin/store";
import { CompanionCanvas } from "./CompanionCanvas";

export function CallInModal() {
  const callState = useLorin((s) => s.callInState);
  const briefing = useLorin((s) => s.callBriefingText);
  const accept = useLorin((s) => s.acceptSimulatedCall);
  const toggleMute = useLorin((s) => s.toggleMuteCall);
  const end = useLorin((s) => s.endSimulatedCall);

  if (callState === "idle" || callState === "ended") return null;

  const isRinging = callState === "ringing";
  const isMuted = callState === "muted";

  return (
    <div
      className="command-palette-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="LORIN Presence Incoming Call Briefing"
      data-testid="call-in-modal"
    >
      <div className="lorin-panel w-full max-w-lg items-center text-center shadow-2xl">
        <div className="flex w-full items-center justify-between gap-2 border-b border-line pb-3">
          <span className="lorin-badge lorin-badge-amber">SIMULATED · M7 Presence Call-In</span>
          <span className="lorin-badge lorin-badge-red">Priority P1 Urgent</span>
        </div>

        <div className="my-4">
          <CompanionCanvas size={160} />
        </div>

        <p className="text-xs font-semibold uppercase tracking-widest text-teal">
          {isRinging ? "Incoming Presence Briefing Call…" : isMuted ? "Call Connected (Muted)" : "Call Connected · Live Synthesis"}
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold">LORIN — Personal Intelligence</h2>
        <p className="mt-1 text-xs text-muted">
          Synthesized from active demonstration tasks, deadlines, and approval records.
        </p>

        {!isRinging && (
          <pre className="code-panel mt-4 w-full whitespace-pre-wrap text-left text-xs leading-relaxed">
            {briefing}
          </pre>
        )}

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {isRinging ? (
            <>
              <button
                type="button"
                className="action-button action-button-primary"
                onClick={accept}
              >
                <PhoneIncoming size={15} />
                <span>Accept briefing call</span>
              </button>
              <button
                type="button"
                className="action-button action-button-secondary"
                onClick={end}
              >
                <PhoneOff size={15} />
                <span>Decline</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="action-button action-button-secondary"
                onClick={toggleMute}
              >
                {isMuted ? <MicOff size={15} /> : <Mic size={15} />}
                <span>{isMuted ? "Unmute" : "Mute audio"}</span>
              </button>
              <button
                type="button"
                className="action-button action-button-primary"
                onClick={end}
              >
                <Phone size={15} />
                <span>Acknowledge &amp; end call</span>
              </button>
            </>
          )}
        </div>

        <div className="privacy-note mt-4 w-full text-left">
          <ShieldCheck size={15} className="shrink-0" />
          <span>
            This call is an in-app simulated demonstration. No external PSTN, cellular, or third-party VoIP call is placed without a separately configured and authorized provider.
          </span>
        </div>
      </div>
    </div>
  );
}
