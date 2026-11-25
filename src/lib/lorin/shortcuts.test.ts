import test from "node:test";
import assert from "node:assert/strict";
import { isEditableTarget, NAVIGATION_SHORTCUTS, resolveNavigationShortcut } from "./shortcuts";

test("resolveNavigationShortcut maps g-chord keys to expected LORIN views", () => {
  assert.equal(resolveNavigationShortcut("h"), "home");
  assert.equal(resolveNavigationShortcut("H"), "home");
  assert.equal(resolveNavigationShortcut("s"), "settings");
  assert.equal(resolveNavigationShortcut("c"), "chat");
  assert.equal(resolveNavigationShortcut("p"), "projects");
  assert.equal(resolveNavigationShortcut("t"), "tasks");
  assert.equal(resolveNavigationShortcut("i"), "intelligence");
  assert.equal(resolveNavigationShortcut("d"), "devices");
  assert.equal(resolveNavigationShortcut("z"), null);
  assert.equal(resolveNavigationShortcut(""), null);
});

test("NAVIGATION_SHORTCUTS has unique secondKey bindings", () => {
  const keys = NAVIGATION_SHORTCUTS.map((s) => s.secondKey);
  assert.equal(new Set(keys).size, keys.length);
});

test("isEditableTarget accurately detects inputs, textareas, selects, and contentEditable elements", () => {
  assert.equal(isEditableTarget(null), false);
  assert.equal(isEditableTarget({ tagName: "BUTTON" } as unknown as EventTarget), false);
  assert.equal(isEditableTarget({ tagName: "DIV" } as unknown as EventTarget), false);
  assert.equal(isEditableTarget({ tagName: "INPUT" } as unknown as EventTarget), true);
  assert.equal(isEditableTarget({ tagName: "TEXTAREA" } as unknown as EventTarget), true);
  assert.equal(isEditableTarget({ tagName: "SELECT" } as unknown as EventTarget), true);
  assert.equal(isEditableTarget({ tagName: "DIV", isContentEditable: true } as unknown as EventTarget), true);
  assert.equal(
    isEditableTarget({
      tagName: "DIV",
      getAttribute: (name: string) => (name === "role" ? "textbox" : null),
    } as unknown as EventTarget),
    true,
  );
});
