import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { annotate, boxClass } from "../src/DiffEngine.js";
import { DiffPresenter } from "../src/DiffPresenter.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadPatch(filename) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, "../patches", filename), "utf8"),
  );
}

function makePatch(boxes, lines = []) {
  return {
    patcher: {
      rect: [0, 0, 600, 400],
      boxes: boxes.map((b) => ({ box: b })),
      lines: lines.map(({ src, dst }) => ({
        patchline: { source: src, destination: dst },
      })),
    },
  };
}

function box(id, text, extra = {}) {
  return {
    id,
    maxclass: "newobj",
    text,
    numinlets: 1,
    numoutlets: 1,
    patching_rect: [0, 0, 60, 22],
    ...extra,
  };
}

function assertNoOrphanLines(result) {
  const ids = new Set(result.boxes.map((b) => b.id));
  for (const l of result.lines) {
    assert.ok(ids.has(l.source[0]), `Orphan line source "${l.source[0]}"`);
    assert.ok(
      ids.has(l.destination[0]),
      `Orphan line destination "${l.destination[0]}"`,
    );
  }
}

// Convenience wrapper: makePatch returns loosely-typed objects for test ergonomics.
function process(a, b) {
  return DiffPresenter.render(annotate(a, b));
}

// ─── boxClass ─────────────────────────────────────────────────────────────────

test("boxClass: returns maxclass when not newobj", () => {
  assert.equal(
    boxClass({
      id: "x",
      maxclass: "live.dial",
      numinlets: 1,
      numoutlets: 1,
      patching_rect: [0, 0, 0, 0],
    }),
    "live.dial",
  );
});

test("boxClass: extracts first token of text for newobj", () => {
  assert.equal(
    boxClass({
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

test("boxClass: returns empty string for newobj with no text", () => {
  assert.equal(
    boxClass({
      id: "x",
      maxclass: "newobj",
      numinlets: 1,
      numoutlets: 1,
      patching_rect: [0, 0, 0, 0],
    }),
    "",
  );
});

// ─── annotate — box classification ────────────────────────────────────

test("Identical patches → no _diff annotations", () => {
  const p = makePatch([box("obj-1", "cycle~")]);
  assert.ok(annotate(p, p).patcher.boxes.every((b) => !b.box._diff));
});

test("Identical patches → Presenter marks all boxes unchanged", () => {
  const p = makePatch([box("obj-1", "cycle~"), box("obj-2", "dac~")]);
  const result = process(p, p);
  assert.equal(result.boxes.length, 2);
  assert.ok(result.boxes.every((b) => b.diffState === "unchanged"));
});

test("Added box → annotated as 'added'", () => {
  const a = makePatch([]);
  const b = makePatch([box("obj-1", "cycle~")]);
  const boxes = annotate(a, b).patcher.boxes;
  assert.equal(boxes.length, 1);
  assert.equal(boxes[0].box._diff?.type, "added");
});

test("Deleted box → annotated as 'deleted'", () => {
  const a = makePatch([box("obj-1", "cycle~")]);
  const b = makePatch([]);
  const boxes = annotate(a, b).patcher.boxes;
  assert.equal(boxes.length, 1);
  assert.equal(boxes[0].box._diff?.type, "deleted");
});

test("Attribute change → 'modified' with correct field delta", () => {
  const a = makePatch([box("obj-1", "cycle~", { some_param: 0 })]);
  const b = makePatch([box("obj-1", "cycle~", { some_param: 1 })]);
  const annotatedBox = annotate(a, b).patcher.boxes[0].box;
  assert.equal(annotatedBox._diff?.type, "modified");
  assert.deepEqual(annotatedBox._diff?.fields?.["some_param"], {
    from: 0,
    to: 1,
  });
});

test("Only patching_rect change → 'moved', not 'modified'", () => {
  const a = makePatch([
    box("obj-1", "cycle~", { patching_rect: [0, 0, 60, 22] }),
  ]);
  const b = makePatch([
    box("obj-1", "cycle~", { patching_rect: [200, 300, 60, 22] }),
  ]);
  assert.equal(annotate(a, b).patcher.boxes[0].box._diff?.type, "moved");
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
  assert.equal(annotate(a, b).patcher.boxes[0].box._diff?.type, "moved");
});

test("patching_rect + attribute change → 'modified', not 'moved'", () => {
  const a = makePatch([
    box("obj-1", "cycle~", { patching_rect: [0, 0, 60, 22], foo: "a" }),
  ]);
  const b = makePatch([
    box("obj-1", "cycle~", { patching_rect: [100, 100, 60, 22], foo: "b" }),
  ]);
  assert.equal(annotate(a, b).patcher.boxes[0].box._diff?.type, "modified");
});

// ─── Matching Passes ──────────────────────────────────────────────────────────

test("Pass 1: same-ID same-class stays matched; unique-class neighbour matched via Pass 1.5", () => {
  const a = makePatch([box("obj-1", "cycle~"), box("obj-2", "dac~")]);
  const b = makePatch([box("obj-1", "cycle~"), box("obj-99", "dac~")]);
  assert.ok(annotate(a, b).patcher.boxes.every((b) => !b.box._diff));
});

test("Pass 1: same ID but different class → treated as delete + add", () => {
  const a = makePatch([box("obj-1", "cycle~")]);
  const b = makePatch([{ ...box("obj-1", "dac~"), maxclass: "newobj" }]);
  const boxes = annotate(a, b).patcher.boxes;
  assert.ok(boxes.some((b) => b.box._diff?.type === "deleted"));
  assert.ok(boxes.some((b) => b.box._diff?.type === "added"));
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
  const boxes = annotate(a, b).patcher.boxes;
  assert.ok(!boxes.some((b) => b.box._diff?.type === "deleted"));
  assert.ok(!boxes.some((b) => b.box._diff?.type === "added"));
});

test("Pass 1.5: ambiguous class (two of same) → no unique-class match", () => {
  const a = makePatch([box("obj-1", "cycle~"), box("obj-2", "cycle~")]);
  const b = makePatch([box("obj-3", "cycle~"), box("obj-4", "cycle~")]);
  const boxes = annotate(a, b).patcher.boxes;
  assert.equal(boxes.filter((b) => b.box._diff?.type === "deleted").length, 2);
  assert.equal(boxes.filter((b) => b.box._diff?.type === "added").length, 2);
});

test("Pass 2: topology match works when the shared anchor was itself matched via Pass 1.5 (different IDs)", () => {
  // obj-anchor~ appears once on each side but with different IDs → matched by Pass 1.5.
  // The two "scale" boxes on each side have no unique class but connect to that anchor
  // with distinct outlet indices → must be matched by Pass 2 using canonical (A-side) IDs.
  const a = makePatch(
    [
      { ...box("obj-1", "unique-anchor~"), maxclass: "unique-anchor~" },
      box("obj-2", "scale"),
      box("obj-3", "scale"),
    ],
    [
      { src: ["obj-1", 0], dst: ["obj-2", 0] },
      { src: ["obj-1", 1], dst: ["obj-3", 0] },
    ],
  );
  const b = makePatch(
    [
      { ...box("obj-99", "unique-anchor~"), maxclass: "unique-anchor~" },
      box("obj-4", "scale"),
      box("obj-5", "scale"),
    ],
    [
      { src: ["obj-99", 0], dst: ["obj-4", 0] },
      { src: ["obj-99", 1], dst: ["obj-5", 0] },
    ],
  );
  const boxes = annotate(a, b).patcher.boxes;
  assert.ok(
    !boxes.some((b) => b.box._diff?.type === "deleted"),
    "no deleted boxes",
  );
  assert.ok(
    !boxes.some((b) => b.box._diff?.type === "added"),
    "no added boxes",
  );
});

test("Pass 2: topological match via shared anchored neighbour", () => {
  const a = makePatch(
    [box("obj-1", "dac~"), box("obj-A", "gain~")],
    [{ src: ["obj-A", 0], dst: ["obj-1", 0] }],
  );
  const b = makePatch(
    [box("obj-1", "dac~"), box("obj-B", "gain~")],
    [{ src: ["obj-B", 0], dst: ["obj-1", 0] }],
  );
  const boxes = annotate(a, b).patcher.boxes;
  assert.ok(!boxes.some((b) => b.box._diff?.type === "deleted"));
  assert.ok(!boxes.some((b) => b.box._diff?.type === "added"));
});

// ─── Presentation View ────────────────────────────────────────────────────────

test("Box added to presentation view → 'modified' with presentation field", () => {
  const a = makePatch([box("obj-1", "cycle~")]);
  const b = makePatch([
    box("obj-1", "cycle~", {
      presentation: 1,
      presentation_rect: [50, 50, 60, 22],
    }),
  ]);
  const annotatedBox = annotate(a, b).patcher.boxes[0].box;
  assert.equal(annotatedBox._diff?.type, "modified");
  assert.ok(
    annotatedBox._diff?.fields && "presentation" in annotatedBox._diff.fields,
  );
});

test("Box removed from presentation view → attrDiffs exposes presentation; presentation_rect excluded", () => {
  const a = makePatch([
    box("obj-1", "cycle~", {
      presentation: 1,
      presentation_rect: [50, 50, 60, 22],
    }),
  ]);
  const b = makePatch([box("obj-1", "cycle~", { presentation: 0 })]);
  const result = process(a, b);
  const vm = result.boxes.find((bx) => bx.id === "obj-1");
  assert.equal(vm.diffState, "modified");
  assert.ok(vm.attrDiffs?.some((d) => d.key === "presentation"));
  assert.ok(!vm.attrDiffs?.some((d) => d.key === "presentation_rect"));
});

test("Deleted box with presentation_rect → preserved on removed BoxViewModel", () => {
  const a = makePatch([
    box("obj-1", "cycle~", {
      presentation: 1,
      presentation_rect: [50, 50, 60, 22],
    }),
  ]);
  const b = makePatch([]);
  const result = process(a, b);
  const vm = result.boxes.find((bx) => bx.id === "obj-1_removed");
  assert.ok(vm, "Removed box must exist");
  assert.deepEqual(vm.presentation_rect, [50, 50, 60, 22]);
});

// ─── DiffPresenter — BoxViewModel ─────────────────────────────────────────────

test("Presenter: added box has patcherA=null", () => {
  const a = makePatch([]);
  const b = makePatch([box("obj-1", "cycle~")]);
  const result = process(a, b);
  assert.equal(result.boxes[0].diffState, "added");
  assert.equal(result.boxes[0].patcherA, null);
});

test("Presenter: removed box gets _removed suffix and patcherB=null", () => {
  const a = makePatch([box("obj-1", "cycle~")]);
  const b = makePatch([]);
  const result = process(a, b);
  assert.equal(result.boxes[0].id, "obj-1_removed");
  assert.equal(result.boxes[0].diffState, "removed");
  assert.equal(result.boxes[0].patcherB, null);
});

test("Presenter: modified box carries oldText", () => {
  const a = makePatch([box("obj-1", "scale 0 127 0 1")]);
  const b = makePatch([box("obj-1", "scale 0 127 0 2")]);
  const result = process(a, b);
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
  const result = process(a, b);
  const keys = result.boxes[0].attrDiffs?.map((d) => d.key) ?? [];
  assert.ok(!keys.includes("patching_rect"));
  assert.ok(!keys.includes("presentation_rect"));
  assert.ok(keys.includes("foo"));
});

// ─── DiffPresenter — LineViewModel ────────────────────────────────────────────

test("Lines: unchanged when both endpoints exist in both patches", () => {
  const p = makePatch(
    [box("obj-1", "cycle~"), box("obj-2", "dac~")],
    [{ src: ["obj-1", 0], dst: ["obj-2", 0] }],
  );
  const result = process(p, p);
  assert.equal(result.lines.length, 1);
  assert.equal(result.lines[0].diffState, "unchanged");
});

test("Lines: deleted box makes its lines 'removed' with _removed source", () => {
  const a = makePatch(
    [box("obj-1", "cycle~"), box("obj-2", "dac~")],
    [{ src: ["obj-1", 0], dst: ["obj-2", 0] }],
  );
  const b = makePatch([box("obj-2", "dac~")]);
  const result = process(a, b);
  const removed = result.lines.find((l) => l.diffState === "removed");
  assert.ok(removed);
  assert.equal(removed.source[0], "obj-1_removed");
  assert.equal(removed.destination[0], "obj-2");
});

test("Lines: added box makes its lines 'added'", () => {
  const a = makePatch([box("obj-2", "dac~")]);
  const b = makePatch(
    [box("obj-1", "cycle~"), box("obj-2", "dac~")],
    [{ src: ["obj-1", 0], dst: ["obj-2", 0] }],
  );
  const result = process(a, b);
  const added = result.lines.find((l) => l.diffState === "added");
  assert.ok(added);
  assert.equal(added.source[0], "obj-1");
});

test("Lines: no orphan endpoints in any scenario", () => {
  const a = loadPatch("edge_cases_a.maxpat");
  const b = loadPatch("edge_cases_b.maxpat");
  assertNoOrphanLines(process(a, b));
});

// ─── ID Collision Bug Regression ─────────────────────────────────────────────

test("ID collision: B recycles an ID that A deleted — no data loss", () => {
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

  const result = process(a, b);
  assertNoOrphanLines(result);

  const gainVm = result.boxes.find(
    (bx) => bx.id === "obj-4" && bx.maxclass === "live.gain~",
  );
  assert.ok(gainVm, "live.gain~ must be present");
  assert.equal(gainVm.diffState, "moved");

  const removedVm = result.boxes.find((bx) => bx.id === "obj-4_removed");
  assert.ok(removedVm, "Deleted old-thing must appear as obj-4_removed");
  assert.equal(removedVm.diffState, "removed");

  const gainLine = result.lines.find(
    (l) => l.source[0] === "obj-4" && l.destination[0] === "obj-2",
  );
  assert.ok(gainLine);
  assert.equal(gainLine.diffState, "unchanged");

  const removedLine = result.lines.find((l) => l.source[0] === "obj-4_removed");
  assert.ok(removedLine);
  assert.equal(removedLine.diffState, "removed");

  assert.equal(
    result.boxes.find((bx) => bx.id === "obj-99")?.diffState,
    "added",
  );
});

// ─── Integration: Real Patch Files ────────────────────────────────────────────

test("Real patches: no orphan lines", () => {
  const a = loadPatch("edge_cases_a.maxpat");
  const b = loadPatch("edge_cases_b.maxpat");
  assertNoOrphanLines(process(a, b));
});

test("Real patches: expected box diff states", () => {
  const a = loadPatch("edge_cases_a.maxpat");
  const b = loadPatch("edge_cases_b.maxpat");
  const result = process(a, b);
  const byId = Object.fromEntries(result.boxes.map((bx) => [bx.id, bx]));

  for (const id of [
    "obj-1",
    "obj-2",
    "obj-6",
    "obj-7",
    "obj-9",
    "obj-10",
    "obj-11",
  ])
    assert.equal(byId[id].diffState, "unchanged", id);

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

  // Multiple ID recycle: obj-12 in A is "also-deleted~", obj-12 in B is "new-twelve~"
  assert.ok(
    byId["obj-12_removed"],
    "also-deleted~ must appear as obj-12_removed",
  );
  assert.equal(byId["obj-12_removed"].diffState, "removed");
  assert.equal(
    byId["obj-12"].diffState,
    "added",
    "new-twelve~ (recycled obj-12 ID)",
  );

  // Pass 1.5: obj-30 "filter~" in A matched to obj-31 "filter~" in B (unique class, ID changed)
  assert.equal(
    byId["obj-31"].diffState,
    "unchanged",
    "filter~ matched via Pass 1.5",
  );
  assert.ok(
    !byId["obj-30_removed"],
    "obj-30 must NOT appear as _removed — it was matched to obj-31",
  );

  // Pass 2: obj-32/obj-33 in A matched to obj-34/obj-35 in B via topology (connections to anchored obj-11)
  assert.equal(
    byId["obj-34"].diffState,
    "unchanged",
    "scale at outlet 0 matched via Pass 2",
  );
  assert.equal(
    byId["obj-35"].diffState,
    "moved",
    "scale at outlet 1 matched via Pass 2, position changed",
  );
});

test("Real patches: expected line diff states", () => {
  const a = loadPatch("edge_cases_a.maxpat");
  const b = loadPatch("edge_cases_b.maxpat");
  const result = process(a, b);

  const key = (l) =>
    `${l.source[0]}:${l.source[1]}->${l.destination[0]}:${l.destination[1]}`;
  const lineMap = Object.fromEntries(result.lines.map((l) => [key(l), l]));

  assert.equal(lineMap["obj-1:0->obj-3:0"]?.diffState, "unchanged");
  assert.equal(lineMap["obj-3:0->obj-2:0"]?.diffState, "unchanged");
  assert.equal(lineMap["obj-6:0->obj-1:0"]?.diffState, "unchanged");
  assert.equal(lineMap["obj-9:0->obj-10:0"]?.diffState, "unchanged");
  assert.equal(lineMap["obj-10:0->obj-11:0"]?.diffState, "unchanged");
  assert.equal(lineMap["obj-4_removed:0->obj-7:0"]?.diffState, "removed");
  assert.equal(lineMap["obj-20:0->obj-7:0"]?.diffState, "added");

  // Line removed between two surviving boxes (obj-6 inlet 1 → obj-2 inlet 1 present in A, absent in B)
  assert.equal(lineMap["obj-6:1->obj-2:1"]?.diffState, "removed");

  // Line added between two surviving boxes (obj-5 outlet 0 → obj-2 inlet 1, only in B)
  assert.equal(lineMap["obj-5:0->obj-2:1"]?.diffState, "added");

  // Deleted obj-12 had a line to obj-7; must appear as removed with _removed suffix
  assert.equal(lineMap["obj-12_removed:0->obj-7:0"]?.diffState, "removed");

  // Pass 1.5 match: A's obj-1:0→obj-30:0 mapped to obj-1:0→obj-31:0 (filter~ matched)
  assert.equal(lineMap["obj-1:0->obj-31:0"]?.diffState, "unchanged");

  // Pass 2 matches: both scale lines unchanged after topology matching
  assert.equal(lineMap["obj-11:0->obj-34:0"]?.diffState, "unchanged");
  assert.equal(lineMap["obj-11:1->obj-35:0"]?.diffState, "unchanged");
});
