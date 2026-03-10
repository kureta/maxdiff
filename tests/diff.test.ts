import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { MaxDiff, boxClass } from "../src/DiffEngine.ts";
import type { MaxPatch } from "../src/DiffEngine.ts";
import { DiffPresenter } from "../src/DiffPresenter.ts";
import type { BoxViewModel, LineViewModel } from "../src/components.ts";

// Convenience wrapper: makePatch returns loosely-typed objects for test ergonomics,
// so we cast to MaxPatch here rather than threading strict types through all helpers.
function process(a: unknown, b: unknown) {
  return DiffPresenter.renderDiff(
    MaxDiff.annotate(a as MaxPatch, b as MaxPatch),
  );
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadPatch(filename: string) {
  return JSON.parse(
    fs.readFileSync(path.join(__dirname, "../patches", filename), "utf8"),
  );
}

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

function assertNoOrphanLines(result: {
  boxes: BoxViewModel[];
  lines: LineViewModel[];
}): void {
  const ids = new Set(result.boxes.map((b) => b.id));
  for (const l of result.lines) {
    assert.ok(ids.has(l.source[0]), `Orphan line source "${l.source[0]}"`);
    assert.ok(
      ids.has(l.destination[0]),
      `Orphan line destination "${l.destination[0]}"`,
    );
  }
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

// ─── MaxDiff.annotate — box classification ────────────────────────────────────

test("Identical patches → no _diff annotations", () => {
  const p = makePatch([box("obj-1", "cycle~")]);
  assert.ok(MaxDiff.annotate(p, p).patcher.boxes.every((b) => !b.box._diff));
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
  const boxes = MaxDiff.annotate(a, b).patcher.boxes;
  assert.equal(boxes.length, 1);
  assert.equal(boxes[0].box._diff?.type, "added");
});

test("Deleted box → annotated as 'deleted'", () => {
  const a = makePatch([box("obj-1", "cycle~")]);
  const b = makePatch([]);
  const boxes = MaxDiff.annotate(a, b).patcher.boxes;
  assert.equal(boxes.length, 1);
  assert.equal(boxes[0].box._diff?.type, "deleted");
});

test("Attribute change → 'modified' with correct field delta", () => {
  const a = makePatch([box("obj-1", "cycle~", { some_param: 0 })]);
  const b = makePatch([box("obj-1", "cycle~", { some_param: 1 })]);
  const annotatedBox = MaxDiff.annotate(a, b).patcher.boxes[0].box;
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
  assert.equal(
    MaxDiff.annotate(a, b).patcher.boxes[0].box._diff?.type,
    "moved",
  );
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
  assert.equal(
    MaxDiff.annotate(a, b).patcher.boxes[0].box._diff?.type,
    "moved",
  );
});

test("patching_rect + attribute change → 'modified', not 'moved'", () => {
  const a = makePatch([
    box("obj-1", "cycle~", { patching_rect: [0, 0, 60, 22], foo: "a" }),
  ]);
  const b = makePatch([
    box("obj-1", "cycle~", { patching_rect: [100, 100, 60, 22], foo: "b" }),
  ]);
  assert.equal(
    MaxDiff.annotate(a, b).patcher.boxes[0].box._diff?.type,
    "modified",
  );
});

// ─── Matching Passes ──────────────────────────────────────────────────────────

test("Pass 1: same-ID same-class stays matched; unique-class neighbour matched via Pass 1.5", () => {
  const a = makePatch([box("obj-1", "cycle~"), box("obj-2", "dac~")]);
  const b = makePatch([box("obj-1", "cycle~"), box("obj-99", "dac~")]);
  assert.ok(MaxDiff.annotate(a, b).patcher.boxes.every((b) => !b.box._diff));
});

test("Pass 1: same ID but different class → treated as delete + add", () => {
  const a = makePatch([box("obj-1", "cycle~")]);
  const b = makePatch([{ ...box("obj-1", "dac~"), maxclass: "newobj" }]);
  const boxes = MaxDiff.annotate(a, b).patcher.boxes;
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
  const boxes = MaxDiff.annotate(a, b).patcher.boxes;
  assert.ok(!boxes.some((b) => b.box._diff?.type === "deleted"));
  assert.ok(!boxes.some((b) => b.box._diff?.type === "added"));
});

test("Pass 1.5: ambiguous class (two of same) → no unique-class match", () => {
  const a = makePatch([box("obj-1", "cycle~"), box("obj-2", "cycle~")]);
  const b = makePatch([box("obj-3", "cycle~"), box("obj-4", "cycle~")]);
  const boxes = MaxDiff.annotate(a, b).patcher.boxes;
  assert.equal(boxes.filter((b) => b.box._diff?.type === "deleted").length, 2);
  assert.equal(boxes.filter((b) => b.box._diff?.type === "added").length, 2);
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
  const boxes = MaxDiff.annotate(a, b).patcher.boxes;
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
  const annotatedBox = MaxDiff.annotate(a, b).patcher.boxes[0].box;
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
  const vm = result.boxes.find((bx) => bx.id === "obj-1")!;
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
  const vm = result.boxes.find((bx) => bx.id === "obj-1_removed")!;
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
  const removed = result.lines.find((l) => l.diffState === "removed")!;
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
  const added = result.lines.find((l) => l.diffState === "added")!;
  assert.ok(added);
  assert.equal(added.source[0], "obj-1");
});

test("Lines: no orphan endpoints in any scenario", () => {
  const a = loadPatch("edge_cases_a.maxpat");
  const b = loadPatch("edge_cases_b.maxpat");
  assertNoOrphanLines(process(a, b) as never);
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
  assertNoOrphanLines(result as never);

  const gainVm = result.boxes.find(
    (bx) => bx.id === "obj-4" && bx.maxclass === "live.gain~",
  )!;
  assert.ok(gainVm, "live.gain~ must be present");
  assert.equal(gainVm.diffState, "moved");

  const removedVm = result.boxes.find((bx) => bx.id === "obj-4_removed")!;
  assert.ok(removedVm, "Deleted old-thing must appear as obj-4_removed");
  assert.equal(removedVm.diffState, "removed");

  const gainLine = result.lines.find(
    (l) => l.source[0] === "obj-4" && l.destination[0] === "obj-2",
  )!;
  assert.ok(gainLine);
  assert.equal(gainLine.diffState, "unchanged");

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

// ─── Integration: Real Patch Files ────────────────────────────────────────────

test("Real patches: no orphan lines", () => {
  const a = loadPatch("edge_cases_a.maxpat");
  const b = loadPatch("edge_cases_b.maxpat");
  assertNoOrphanLines(process(a, b) as never);
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
});

test("Real patches: expected line diff states", () => {
  const a = loadPatch("edge_cases_a.maxpat");
  const b = loadPatch("edge_cases_b.maxpat");
  const result = process(a, b);

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
