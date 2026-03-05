import { test } from "node:test";
import assert from "node:assert";
import { DiffEngine } from "../js/DiffEngine.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const loadPatch = (filename) => {
  const filePath = path.join(__dirname, "../patches", filename);
  const content = fs.readFileSync(filePath, "utf8");
  return JSON.parse(content);
};

// TODO:
//  * Create a couple of optimum `maxpat` and `amxd` pairs.
//      * Added, deleted, modified objects
//      * Deleted objects that were in the presentation view
//      * Objects added to/removed from presentation view
//      * Moved objects
//  * Write all expected results of the diffing operation and test against that.

test("DiffEngine tests", async (t) => {
  t.test("Synthetic Data - Identical patches", () => {
    const patchA = {
      patcher: {
        boxes: [{ box: { id: "obj-1", maxclass: "newobj", text: "sin" } }],
      },
    };
    const patchB = {
      patcher: {
        boxes: [{ box: { id: "obj-1", maxclass: "newobj", text: "sin" } }],
      },
    };
    const result = DiffEngine.compare(patchA, patchB);
    assert.strictEqual(result.boxes.length, 1, "Should have 1 box");
    if (result.boxes.length > 0) {
      assert.strictEqual(
        result.boxes[0].diffState,
        "unchanged",
        "Should be unchanged",
      );
    }
  });

  t.test("Synthetic Data - Added box", () => {
    const patchA = { patcher: { boxes: [] } };
    const patchB = {
      patcher: {
        boxes: [{ box: { id: "obj-1", maxclass: "newobj", text: "sin" } }],
      },
    };
    const result = DiffEngine.compare(patchA, patchB);
    assert.strictEqual(result.boxes.length, 1, "Should have 1 box");
    if (result.boxes.length > 0) {
      assert.strictEqual(result.boxes[0].diffState, "added", "Should be added");
    }
  });

  t.test("Real Data", () => {
    const dataA = loadPatch("orchidea_static_orchestration_1.maxpat");
    const dataB = loadPatch("orchidea_static_orchestration_2.maxpat");

    const result = DiffEngine.compare(dataA, dataB);

    console.log(
      `Real Data Comparison: Found ${result.boxes.length} boxes and ${result.lines.length} lines.`,
    );

    const modified = result.boxes.filter((b) => b.diffState === "modified");
    const added = result.boxes.filter((b) => b.diffState === "added");
    const removed = result.boxes.filter((b) => b.diffState === "removed");

    console.log(
      `Stats: ${modified.length} modified, ${added.length} added, ${removed.length} removed.`,
    );

    assert.ok(result.boxes.length > 0, "No boxes returned");
    // We expect differences given the files are different
    assert.ok(
      modified.length + added.length + removed.length > 0,
      "No differences found",
    );
  });
});
