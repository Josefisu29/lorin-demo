import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_WAKE_PHRASES,
  formatWakeStateLabel,
  generateContextualGreeting,
  parseWakePhraseInput,
} from "./wake";

test("parseWakePhraseInput matches simple wake phrase with no trailing command", () => {
  const res = parseWakePhraseInput("Hey LORIN.");
  assert.equal(res.matched, true);
  assert.equal(res.intent, "wake_only");
  assert.equal(res.preservedCommand, "");
});

test("parseWakePhraseInput classifies built-in availability and work session wake phrases", () => {
  const avail = parseWakePhraseInput("LORIN, are you there?");
  assert.equal(avail.matched, true);
  assert.equal(avail.intent, "availability_check");
  assert.equal(avail.preservedCommand, "");

  const work = parseWakePhraseInput("LORIN, let's get to work.");
  assert.equal(work.matched, true);
  assert.equal(work.intent, "work_session");
  assert.equal(work.preservedCommand, "");
});

test("parseWakePhraseInput preserves trailing command spoken after wake phrase (§2.6)", () => {
  const res = parseWakePhraseInput("LORIN, can you check the Atlas project?");
  assert.equal(res.matched, true);
  assert.equal(res.intent, "direct_command");
  assert.equal(res.preservedCommand, "can you check the Atlas project?");

  const res2 = parseWakePhraseInput("Hey LORIN summarize the security policy");
  assert.equal(res2.matched, true);
  assert.equal(res2.intent, "direct_command");
  assert.equal(res2.preservedCommand, "summarize the security policy");
});

test("parseWakePhraseInput respects custom enabled and disabled wake phrases", () => {
  const custom = [
    ...DEFAULT_WAKE_PHRASES,
    { id: "custom-1", phrase: "Wake up LORIN", enabled: true },
    { id: "custom-2", phrase: "Dormant phrase", enabled: false },
  ];

  const hit = parseWakePhraseInput("Wake up LORIN, run project briefing", custom);
  assert.equal(hit.matched, true);
  assert.equal(hit.intent, "direct_command");
  assert.equal(hit.preservedCommand, "run project briefing");

  const miss = parseWakePhraseInput("Dormant phrase", custom);
  assert.equal(miss.matched, false);
});

test("generateContextualGreeting adapts to intent and preserved commands", () => {
  const cmdParsed = parseWakePhraseInput("LORIN, can you check the Atlas project?");
  const cmdGreeting = generateContextualGreeting({
    parsed: cmdParsed,
    activeProjectName: "Atlas Commerce",
    pendingTaskCount: 7,
    pendingApprovalCount: 2,
    hourOfDay: 9,
  });
  assert.match(cmdGreeting, /Acknowledged/i);
  assert.match(cmdGreeting, /can you check the Atlas project\?/i);

  const wakeOnly = parseWakePhraseInput("Hey LORIN");
  const morningGreeting = generateContextualGreeting({
    parsed: wakeOnly,
    activeProjectName: "Atlas Commerce",
    pendingTaskCount: 7,
    pendingApprovalCount: 2,
    hourOfDay: 9,
  });
  assert.match(morningGreeting, /Good morning\. I'm here/i);
});

test("formatWakeStateLabel flags active microphone capture accurately", () => {
  assert.equal(formatWakeStateLabel("disabled").activeMic, false);
  assert.equal(formatWakeStateLabel("foreground_listening").activeMic, true);
  assert.equal(formatWakeStateLabel("command_recognition").activeMic, true);
  assert.equal(formatWakeStateLabel("paused").activeMic, false);
});
