import { ArrowLeft, ArrowRight, Compass, Play, Sparkles, X } from "lucide-react";
import { EXPLORE_STEPS, GUIDED_SCENARIOS } from "@/lib/lorin/demo-seed";
import { useLorin } from "@/lib/lorin/store";

export function ExploreWalkthroughBar() {
  const active = useLorin((s) => s.exploreActive);
  const stepNum = useLorin((s) => s.exploreStep);
  const setStep = useLorin((s) => s.setExploreStep);
  const stop = useLorin((s) => s.stopExplore);
  const runScenario = useLorin((s) => s.runGuidedScenario);

  if (!active) return null;

  const current = EXPLORE_STEPS.find((item) => item.step === stepNum) ?? EXPLORE_STEPS[0];

  return (
    <section
      className="border-b border-teal/30 bg-elevated/95 px-4 py-3 text-xs"
      aria-label="Explore how LORIN works walkthrough"
      data-testid="explore-walkthrough-bar"
    >
      <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <span className="metric-icon shrink-0">
            <Compass size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="lorin-badge lorin-badge-teal">
                Step {current.step} of {EXPLORE_STEPS.length}
              </span>
              <p className="font-semibold text-fg">{current.title}</p>
            </div>
            <p className="mt-1 text-muted">{current.instruction}</p>
            <p className="mt-0.5 text-[11px] text-teal">Expected result: {current.expectedOutcome}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor="explore-step-select">Jump to walkthrough step</label>
          <select
            id="explore-step-select"
            className="topbar-select"
            value={current.step}
            onChange={(e) => setStep(Number(e.target.value))}
          >
            {EXPLORE_STEPS.map((st) => (
              <option key={st.id} value={st.step}>
                {st.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="action-button action-button-secondary"
            disabled={current.step <= 1}
            onClick={() => setStep(current.step - 1)}
          >
            <ArrowLeft size={14} />
            <span>Prev</span>
          </button>

          <button
            type="button"
            className="action-button action-button-primary"
            disabled={current.step >= EXPLORE_STEPS.length}
            onClick={() => setStep(current.step + 1)}
          >
            <span>Next step</span>
            <ArrowRight size={14} />
          </button>

          <button
            type="button"
            className="icon-button"
            onClick={stop}
            aria-label="Close walkthrough"
            title="Close guided walkthrough"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      <div className="mx-auto mt-2.5 flex max-w-screen-2xl flex-wrap items-center gap-1.5 border-t border-line pt-2">
        <span className="mr-1 flex items-center gap-1 text-[11px] font-semibold text-muted">
          <Sparkles size={12} className="text-teal" /> Guided scenarios:
        </span>
        {GUIDED_SCENARIOS.slice(0, 6).map((sc) => (
          <button
            key={sc.id}
            type="button"
            className="prompt-chip inline-flex items-center gap-1"
            onClick={() => runScenario(sc.id)}
          >
            <Play size={10} className="text-teal" />
            <span>{sc.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
