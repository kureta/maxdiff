import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MaxDiff } from "../src/DiffEngine.js";
import { DiffPresenter } from "../src/DiffPresenter.js";
import type { BoxViewModel, LineViewModel } from "../src/components.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadPatch(filename: string) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, "../patches", filename), "utf8"),
  );
}

/** Build a minimal valid MaxPatchJSON from a flat list of boxes and lines. */
function makePatch(
  boxes: object[],
  lines: { src: [string, number]; dst: [string, number] }[] = [],
) {
  return {
    patcher: {
      rect: [0, 0, 600, 400] as [number, number, number, number],
      boxes: boxes.map((b) => ({ box: b })),
      lines: lines.map(({ src, dst }) => ({
        patchline: { source: src, destination: dst },
      })),
    },
  };
}

/** Build a minimal box object. */
function box(id: string, text: string, extra: object = {}): object {
  return {
    id,
    maxclass: "newobj",
    text,
    numinlets: 1,
    numoutlets: 1,
    patching_rect: [0, 0, 60, 22] as [number, number, number, number],
    ...extra,
  };
}

/** Assert no line references a box ID absent from the box list. */
function assertNoOrphanLines(result: {
  boxes: BoxViewModel[];
  lines: LineViewModel[];
}): void {
  const ids = new Set(result.boxes.map((b) => b.id));
  for (const l of result.lines) {
    assert.ok(
      ids.has(l.source[0]),
      `Orphan line source "${l.source[0]}" has no corresponding box`,
    );
    assert.ok(
      ids.has(l.destination[0]),
      `Orphan line destination "${l.destination[0]}" has no corresponding box`,
    );
  }
}

// ---------------------------------------------------------------------------
// Unit tests: MaxDiff.getClass
// ---------------------------------------------------------------------------

test("getClass: returns maxclass when not newobj", () => {
  assert.equal(
    MaxDiff.getClass({
      id: "x",
      maxclass: "live.dial",
      numinlets: 1,
      numoutlets: 1,
      patching_rect: [0, 0, 0, 0],
    }),
    "live.dial",
  );
});

test("getClass: extracts first token of text for newobj", () => {
  assert.equal(
    MaxDiff.getClass({
      id: "x",
      maxclass: "newobj",
      text: "scale 0 127 0 1",
      numinlets: 1,
      numoutlets: 1,
      patching_rect: [0, 0, 0, 0],
    }),
    "scale",
  );
});

test("getClass: returns empty string for newobj with no text", () => {
  assert.equal(
    MaxDiff.getClass({
      id: "x",
      maxclass: "newobj",
      numinlets: 1,
      numoutlets: 1,
      patching_rect: [0, 0, 0, 0],
    }),
    "",
  );
});

// ---------------------------------------------------------------------------
// MaxDiff.compare — synthetic data
// ---------------------------------------------------------------------------

test("Identical patches → zero diff ops", () => {
  const p = makePatch([box("obj-1", "cycle~")]);
  assert.equal(MaxDiff.compare(p, p).length, 0);
});

test("Identical patches → Presenter marks all boxes unchanged", () => {
  const p = makePatch([box("obj-1", "cycle~"), box("obj-2", "dac~")]);
  const result = DiffPresenter.process(p, p, MaxDiff.compare(p, p));
  assert.equal(result.boxes.length, 2);
  assert.ok(result.boxes.every((b) => b.diffState === "unchanged"));
});

test("Added box → one 'added' op", () => {
  const a = makePatch([]);
  const b = makePatch([box("obj-1", "cycle~")]);
  const diffs = MaxDiff.compare(a, b);
  assert.equal(diffs.length, 1);
  assert.equal(diffs[0].type, "added");
});

test("Deleted box → one 'deleted' op", () => {
  const a = makePatch([box("obj-1", "cycle~")]);
  const b = makePatch([]);
  const diffs = MaxDiff.compare(a, b);
  assert.equal(diffs.length, 1);
  assert.equal(diffs[0].type, "deleted");
});

test("Attribute change → 'modified' op with correct field delta", () => {
  const a = makePatch([box("obj-1", "cycle~", { some_param: 0 })]);
  const b = makePatch([box("obj-1", "cycle~", { some_param: 1 })]);
  const diffs = MaxDiff.compare(a, b);
  assert.equal(diffs.length, 1);
  assert.equal(diffs[0].type, "modified");
  if (diffs[0].type === "modified") {
    assert.deepEqual(diffs[0].fields.some_param, { from: 0, to: 1 });
  }
});

test("Only patching_rect change → 'moved', not 'modified'", () => {
  const a = makePatch([
    box("obj-1", "cycle~", { patching_rect: [0, 0, 60, 22] }),
  ]);
  const b = makePatch([
    box("obj-1", "cycle~", { patching_rect: [200, 300, 60, 22] }),
  ]);
  const diffs = MaxDiff.compare(a, b);
  assert.equal(diffs.length, 1);
  assert.equal(diffs[0].type, "moved");
});

test("Only presentation_rect change → 'moved', not 'modified'", () => {
  const a = makePatch([
    box("obj-1", "cycle~", {
      presentation: 1,
      presentation_rect: [0, 0, 60, 22],
    }),
  ]);
  const b = makePatch([
    box("obj-1", "cycle~", {
      presentation: 1,
      presentation_rect: [50, 50, 60, 22],
    }),
  ]);
  const diffs = MaxDiff.compare(a, b);
  assert.equal(diffs.length, 1);
  assert.equal(diffs[0].type, "moved");
});

test("patching_rect + attribute change → 'modified', not 'moved'", () => {
  const a = makePatch([
    box("obj-1", "cycle~", { patching_rect: [0, 0, 60, 22], foo: "a" }),
  ]);
  const b = makePatch([
    box("obj-1", "cycle~", { patching_rect: [100, 100, 60, 22], foo: "b" }),
  ]);
  const diffs = MaxDiff.compare(a, b);
  assert.equal(diffs[0].type, "modified");
});

// ---------------------------------------------------------------------------
// Matching passes
// ---------------------------------------------------------------------------

test("Pass 1: same-ID same-class stays matched; unique-class neighbour also matched via Pass 1.5", () => {
  // obj-1=cycle~ anchored by ID. obj-2=dac~ in A, obj-99=dac~ in B: dac~ is
  // unique in both so Pass 1.5 also matches them. Zero diff ops overall.
  const a = makePatch([box("obj-1", "cycle~"), box("obj-2", "dac~")]);
  const b = makePatch([box("obj-1", "cycle~"), box("obj-99", "dac~")]);
  assert.equal(MaxDiff.compare(a, b).length, 0);
});

test("Pass 1: same ID but different class → treated as delete + add", () => {
  const a = makePatch([box("obj-1", "cycle~")]);
  const b = makePatch([{ ...box("obj-1", "dac~"), maxclass: "newobj" }]);
  const diffs = MaxDiff.compare(a, b);
  assert.equal(diffs.length, 2);
  assert.ok(diffs.some((d) => d.type === "deleted"));
  assert.ok(diffs.some((d) => d.type === "added"));
});

test("Pass 1.5: unique-class box matched across different IDs → no delete/add", () => {
  const a = makePatch([
    { ...box("obj-10", "live.gain~"), maxclass: "live.gain~" },
    box("obj-2", "dac~"),
  ]);
  const b = makePatch([
    { ...box("obj-4", "live.gain~"), maxclass: "live.gain~" },
    box("obj-2", "dac~"),
  ]);
  const diffs = MaxDiff.compare(a, b);
  assert.ok(!diffs.some((d) => d.type === "deleted"));
  assert.ok(!diffs.some((d) => d.type === "added"));
});

test("Pass 1.5: ambiguous class (two of same) → no unique-class match", () => {
  // Two cycle~ in A, two in B, all different IDs — ambiguous, none matched
  const a = makePatch([box("obj-1", "cycle~"), box("obj-2", "cycle~")]);
  const b = makePatch([box("obj-3", "cycle~"), box("obj-4", "cycle~")]);
  const diffs = MaxDiff.compare(a, b);
  assert.equal(diffs.filter((d) => d.type === "deleted").length, 2);
  assert.equal(diffs.filter((d) => d.type === "added").length, 2);
});

test("Pass 2: topological match via shared anchored neighbour", () => {
  // obj-1=dac~ anchored by ID. obj-A/obj-B are both gain~ connected to inlet 0
  // of obj-1 — same topology, so Pass 2 matches them across different IDs.
  const a = makePatch(
    [box("obj-1", "dac~"), box("obj-A", "gain~")],
    [{ src: ["obj-A", 0], dst: ["obj-1", 0] }],
  );
  const b = makePatch(
    [box("obj-1", "dac~"), box("obj-B", "gain~")],
    [{ src: ["obj-B", 0], dst: ["obj-1", 0] }],
  );
  const diffs = MaxDiff.compare(a, b);
  assert.ok(!diffs.some((d) => d.type === "deleted"));
  assert.ok(!diffs.some((d) => d.type === "added"));
});

// ---------------------------------------------------------------------------
// Presentation view scenarios
// ---------------------------------------------------------------------------

test("Box added to presentation view → 'modified' with presentation field", () => {
  const a = makePatch([box("obj-1", "cycle~")]);
  const b = makePatch([
    box("obj-1", "cycle~", {
      presentation: 1,
      presentation_rect: [50, 50, 60, 22],
    }),
  ]);
  const diffs = MaxDiff.compare(a, b);
  assert.equal(diffs.length, 1);
  assert.equal(diffs[0].type, "modified");
  if (diffs[0].type === "modified") {
    assert.ok("presentation" in diffs[0].fields);
  }
});

test("Box removed from presentation view → 'modified'; Presenter exposes presentation attrDiff", () => {
  const a = makePatch([
    box("obj-1", "cycle~", {
      presentation: 1,
      presentation_rect: [50, 50, 60, 22],
    }),
  ]);
  const b = makePatch([box("obj-1", "cycle~", { presentation: 0 })]);
  const result = DiffPresenter.process(a, b, MaxDiff.compare(a, b));
  const vm = result.boxes.find((bx) => bx.id === "obj-1")!;
  assert.equal(vm.diffState, "modified");
  assert.ok(vm.attrDiffs?.some((d) => d.key === "presentation"));
  // presentation_rect is in excludedKeys — must not appear in attrDiffs
  assert.ok(!vm.attrDiffs?.some((d) => d.key === "presentation_rect"));
});

test("Deleted box with presentation_rect → presentation_rect preserved on removed BoxViewModel", () => {
  const a = makePatch([
    box("obj-1", "cycle~", {
      presentation: 1,
      presentation_rect: [50, 50, 60, 22],
    }),
  ]);
  const b = makePatch([]);
  const result = DiffPresenter.process(a, b, MaxDiff.compare(a, b));
  const vm = result.boxes.find((bx) => bx.id === "obj-1_removed")!;
  assert.ok(vm, "Removed box must exist with _removed suffix");
  assert.deepEqual(vm.presentation_rect, [50, 50, 60, 22]);
});

// ---------------------------------------------------------------------------
// DiffPresenter — BoxViewModel shape
// ---------------------------------------------------------------------------

test("Presenter: added box has patcherA=null", () => {
  const a = makePatch([]);
  const b = makePatch([box("obj-1", "cycle~")]);
  const result = DiffPresenter.process(a, b, MaxDiff.compare(a, b));
  assert.equal(result.boxes[0].diffState, "added");
  assert.equal(result.boxes[0].patcherA, null);
});

test("Presenter: removed box gets _removed suffix and patcherB=null", () => {
  const a = makePatch([box("obj-1", "cycle~")]);
  const b = makePatch([]);
  const result = DiffPresenter.process(a, b, MaxDiff.compare(a, b));
  assert.equal(result.boxes[0].id, "obj-1_removed");
  assert.equal(result.boxes[0].diffState, "removed");
  assert.equal(result.boxes[0].patcherB, null);
});

test("Presenter: modified box carries oldText from previous", () => {
  const a = makePatch([box("obj-1", "scale 0 127 0 1")]);
  const b = makePatch([box("obj-1", "scale 0 127 0 2")]);
  const result = DiffPresenter.process(a, b, MaxDiff.compare(a, b));
  assert.equal(result.boxes[0].diffState, "modified");
  assert.equal(result.boxes[0].oldText, "scale 0 127 0 1");
});

test("Presenter: attrDiffs excludes patching_rect and presentation_rect", () => {
  const a = makePatch([
    box("obj-1", "cycle~", {
      patching_rect: [0, 0, 60, 22],
      foo: "a",
      presentation_rect: [0, 0, 60, 22],
    }),
  ]);
  const b = makePatch([
    box("obj-1", "cycle~", { patching_rect: [100, 100, 60, 22], foo: "b" }),
  ]);
  const result = DiffPresenter.process(a, b, MaxDiff.compare(a, b));
  const attrKeys = result.boxes[0].attrDiffs?.map((d) => d.key) ?? [];
  assert.ok(!attrKeys.includes("patching_rect"));
  assert.ok(!attrKeys.includes("presentation_rect"));
  assert.ok(attrKeys.includes("foo"));
});

// ---------------------------------------------------------------------------
// DiffPresenter — LineViewModel
// ---------------------------------------------------------------------------

test("Lines: unchanged when both endpoints exist in both patches", () => {
  const p = makePatch(
    [box("obj-1", "cycle~"), box("obj-2", "dac~")],
    [{ src: ["obj-1", 0], dst: ["obj-2", 0] }],
  );
  const result = DiffPresenter.process(p, p, MaxDiff.compare(p, p));
  assert.equal(result.lines.length, 1);
  assert.equal(result.lines[0].diffState, "unchanged");
});

test("Lines: deleted box makes its lines 'removed' with _removed source", () => {
  const a = makePatch(
    [box("obj-1", "cycle~"), box("obj-2", "dac~")],
    [{ src: ["obj-1", 0], dst: ["obj-2", 0] }],
  );
  const b = makePatch([box("obj-2", "dac~")]);
  const result = DiffPresenter.process(a, b, MaxDiff.compare(a, b));
  const removed = result.lines.find((l) => l.diffState === "removed")!;
  assert.ok(removed, "Should have a removed line");
  assert.equal(removed.source[0], "obj-1_removed");
  assert.equal(removed.destination[0], "obj-2");
});

test("Lines: added box makes its lines 'added'", () => {
  const a = makePatch([box("obj-2", "dac~")]);
  const b = makePatch(
    [box("obj-1", "cycle~"), box("obj-2", "dac~")],
    [{ src: ["obj-1", 0], dst: ["obj-2", 0] }],
  );
  const result = DiffPresenter.process(a, b, MaxDiff.compare(a, b));
  const added = result.lines.find((l) => l.diffState === "added")!;
  assert.ok(added, "Should have an added line");
  assert.equal(added.source[0], "obj-1");
});

test("Lines: no orphan endpoints in any scenario", () => {
  const a = loadPatch("edge_cases_a.maxpat");
  const b = loadPatch("edge_cases_b.maxpat");
  assertNoOrphanLines(DiffPresenter.process(a, b, MaxDiff.compare(a, b)));
});

// ---------------------------------------------------------------------------
// The key-collision bug: B recycles an ID that A deleted
// ---------------------------------------------------------------------------

test("ID collision: B's obj-4 is a heuristic match for A's obj-10, while A's obj-4 is deleted", () => {
  // A: obj-10=live.gain~ (pos 0,0), obj-4=old-thing (deleted), obj-2=dac~
  // B: obj-4=live.gain~ (pos 200,200 — 'moved' op emitted), obj-2=dac~, obj-99=brand-new
  //
  // live.gain~ is unique → Pass 1.5 matches obj-10↔obj-4. Since their patching_rects
  // differ, a 'moved' op is emitted with current.id="obj-4".
  // A's obj-4 (old-thing) is also deleted → deletedMapByAId["obj-4"].
  // The old single-map implementation would let the deleted entry overwrite the moved
  // entry, silently dropping live.gain~ and breaking all its lines.
  const a = makePatch(
    [
      {
        ...box("obj-10", "live.gain~"),
        maxclass: "live.gain~",
        patching_rect: [0, 0, 48, 136],
      },
      box("obj-4", "old-thing"),
      box("obj-2", "dac~"),
    ],
    [
      { src: ["obj-10", 0], dst: ["obj-2", 0] },
      { src: ["obj-4", 0], dst: ["obj-2", 0] },
    ],
  );
  const b = makePatch(
    [
      {
        ...box("obj-4", "live.gain~"),
        maxclass: "live.gain~",
        patching_rect: [200, 200, 48, 136],
      },
      box("obj-2", "dac~"),
      box("obj-99", "brand-new"),
    ],
    [{ src: ["obj-4", 0], dst: ["obj-2", 0] }],
  );

  const result = DiffPresenter.process(a, b, MaxDiff.compare(a, b));

  assertNoOrphanLines(result);

  // live.gain~ (B's obj-4) must be present and not dropped or misclassified
  const gainVm = result.boxes.find(
    (bx) => bx.id === "obj-4" && bx.maxclass === "live.gain~",
  )!;
  assert.ok(gainVm, "live.gain~ must be present");
  assert.equal(gainVm.diffState, "moved");

  // A's old-thing must be present as obj-4_removed
  const removedVm = result.boxes.find((bx) => bx.id === "obj-4_removed")!;
  assert.ok(removedVm, "Deleted old-thing must appear as obj-4_removed");
  assert.equal(removedVm.diffState, "removed");

  // The live.gain~→dac~ line must survive as unchanged
  const gainLine = result.lines.find(
    (l) => l.source[0] === "obj-4" && l.destination[0] === "obj-2",
  )!;
  assert.ok(gainLine, "Line from live.gain~ to dac~ must exist");
  assert.equal(gainLine.diffState, "unchanged");

  // The old-thing→dac~ line must be removed
  const removedLine = result.lines.find(
    (l) => l.source[0] === "obj-4_removed",
  )!;
  assert.ok(removedLine);
  assert.equal(removedLine.diffState, "removed");

  assert.equal(
    result.boxes.find((bx) => bx.id === "obj-99")?.diffState,
    "added",
  );
});

// ---------------------------------------------------------------------------
// Integration: real patch files
// ---------------------------------------------------------------------------

test("Real patches: no orphan lines", () => {
  const a = loadPatch("edge_cases_a.maxpat");
  const b = loadPatch("edge_cases_b.maxpat");
  assertNoOrphanLines(DiffPresenter.process(a, b, MaxDiff.compare(a, b)));
});

test("Real patches: expected box diff states", () => {
  const a = loadPatch("edge_cases_a.maxpat");
  const b = loadPatch("edge_cases_b.maxpat");
  const result = DiffPresenter.process(a, b, MaxDiff.compare(a, b));
  const byId = Object.fromEntries(result.boxes.map((bx) => [bx.id, bx]));

  assert.equal(byId["obj-1"].diffState, "unchanged", "cycle~");
  assert.equal(byId["obj-2"].diffState, "unchanged", "dac~");
  assert.equal(byId["obj-6"].diffState, "unchanged", "live.dial");
  assert.equal(byId["obj-7"].diffState, "unchanged", "print");
  assert.equal(byId["obj-9"].diffState, "unchanged", "toggle");
  assert.equal(byId["obj-10"].diffState, "unchanged", "metro 500");
  assert.equal(byId["obj-11"].diffState, "unchanged", "counter");

  assert.equal(byId["obj-3"].diffState, "modified", "gain~ got extra_param");
  assert.ok(byId["obj-3"].attrDiffs?.some((d) => d.key === "extra_param"));

  assert.equal(byId["obj-5"].diffState, "moved", "moved~ only changed rect");

  assert.equal(
    byId["obj-8"].diffState,
    "modified",
    "unique~ removed from presentation",
  );
  assert.ok(byId["obj-8"].attrDiffs?.some((d) => d.key === "presentation"));
  assert.ok(
    !byId["obj-8"].attrDiffs?.some((d) => d.key === "presentation_rect"),
  );

  assert.ok(byId["obj-4_removed"], "deleted~ must be obj-4_removed");
  assert.equal(byId["obj-4_removed"].diffState, "removed");

  assert.equal(byId["obj-20"].diffState, "added", "added~");
  assert.equal(byId["obj-4"].diffState, "added", "added-reuse~ (recycled ID)");
});

test("Real patches: expected line diff states", () => {
  const a = loadPatch("edge_cases_a.maxpat");
  const b = loadPatch("edge_cases_b.maxpat");
  const result = DiffPresenter.process(a, b, MaxDiff.compare(a, b));

  const key = (l: LineViewModel) =>
    `${l.source[0]}:${l.source[1]}->${l.destination[0]}:${l.destination[1]}`;
  const lineMap = Object.fromEntries(result.lines.map((l) => [key(l), l]));

  assert.equal(lineMap["obj-1:0->obj-3:0"]?.diffState, "unchanged");
  assert.equal(lineMap["obj-3:0->obj-2:0"]?.diffState, "unchanged");
  assert.equal(lineMap["obj-6:0->obj-1:0"]?.diffState, "unchanged");
  assert.equal(lineMap["obj-9:0->obj-10:0"]?.diffState, "unchanged");
  assert.equal(lineMap["obj-10:0->obj-11:0"]?.diffState, "unchanged");
  assert.equal(lineMap["obj-4_removed:0->obj-7:0"]?.diffState, "removed");
  assert.equal(lineMap["obj-20:0->obj-7:0"]?.diffState, "added");
});
