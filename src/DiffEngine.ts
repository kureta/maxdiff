type Rect = [number, number, number, number];

interface Box {
  id: string;
  maxclass: string;
  numinlets: number;
  numoutlets: number;
  patching_rect: Rect;
  text?: string;
  patcher?: Patcher;
  presentation?: number;
  presentation_rect?: Rect;
  [key: string]: unknown;
}

interface PatchLine {
  source: [string, number];
  destination: [string, number];
}

interface Patcher {
  boxes: BoxContainer[];
  lines: PatchLineContainer[];
  rect: Rect;
  [key: string]: unknown;
}

interface BoxContainer {
  box: Box;
}

interface PatchLineContainer {
  patchline: PatchLine;
}

interface MaxPatchJSON {
  patcher: Patcher;
}

type DiffOperation<T extends object> =
  | { type: "added"; current: T }
  | { type: "deleted"; previous: T }
  | {
      type: "modified";
      previous: T;
      current: T;
      fields: Partial<Record<keyof T, FieldDelta>>;
    }
  | {
      type: "moved";
      previous: T;
      current: T;
      fields: Partial<Record<keyof T, FieldDelta>>;
    };

interface FieldDelta {
  from: unknown;
  to: unknown;
}

type DiffCollection<T extends object> = DiffOperation<T>[];

// TODO: Recursively serialize the json. Top level is a Patcher object.
//  Box serializer should call patcher serializer when it sees a subpatch box.
//  These type of boxes have a "patcher" attribute.

export class MaxDiff {
  public static getClass(box: Box): string {
    if (box.maxclass && box.maxclass !== "newobj") {
      return box.maxclass;
    }
    return (box.text || "").split(" ")[0];
  }

  public static compare(
    patchA: MaxPatchJSON,
    patchB: MaxPatchJSON,
  ): DiffCollection<Box> {
    const boxesA = patchA.patcher.boxes.map((b) => b.box);
    const boxesB = patchB.patcher.boxes.map((b) => b.box);
    const linesA = patchA.patcher.lines?.map((l) => l.patchline) || [];
    const linesB = patchB.patcher.lines?.map((l) => l.patchline) || [];

    const mapA = new Map<string, Box>(boxesA.map((b) => [b.id, b]));
    const mapB = new Map<string, Box>(boxesB.map((b) => [b.id, b]));

    const matchedPairs: [Box, Box][] = [];
    const anchoredIds = new Set<string>();
    const matchedBIds = new Set<string>();

    // Pass 1: Strict ID and Class match
    for (const [id, boxA] of mapA.entries()) {
      const boxB = mapB.get(id);
      if (boxB && this.getClass(boxA) === this.getClass(boxB)) {
        matchedPairs.push([boxA, boxB]);
        anchoredIds.add(id);
        matchedBIds.add(id);
      }
    }

    // Pass 2: Topological connection match
    const getSignature = (boxId: string, lines: PatchLine[]) => {
      const sig: string[] = [];
      for (const { source, destination } of lines) {
        if (destination[0] === boxId && anchoredIds.has(source[0])) {
          sig.push(`in:${destination[1]}<-${source[0]}:${source[1]}`);
        }
        if (source[0] === boxId && anchoredIds.has(destination[0])) {
          sig.push(`out:${source[1]}->${destination[0]}:${destination[1]}`);
        }
      }
      return sig.sort().join("|");
    };

    for (const [idA, boxA] of mapA.entries()) {
      if (anchoredIds.has(idA)) continue;

      const sigA = getSignature(idA, linesA);
      if (!sigA) continue;

      for (const [idB, boxB] of mapB.entries()) {
        if (matchedBIds.has(idB)) continue;

        if (this.getClass(boxA) === this.getClass(boxB)) {
          const sigB = getSignature(idB, linesB);
          if (sigA === sigB) {
            matchedPairs.push([boxA, boxB]);
            anchoredIds.add(idA);
            matchedBIds.add(idB);
            break;
          }
        }
      }
    }

    const diff: DiffCollection<Box> = [];

    // Compute diffs for all matched pairs
    for (const [boxA, boxB] of matchedPairs) {
      const fields: Partial<Record<keyof Box, FieldDelta>> = {};
      let isModified = false;

      const allKeys = new Set([...Object.keys(boxA), ...Object.keys(boxB)]);
      allKeys.delete("id");

      for (const key of allKeys) {
        const valA = boxA[key];
        const valB = boxB[key];

        if (JSON.stringify(valA) !== JSON.stringify(valB)) {
          fields[key] = { from: valA, to: valB };
          isModified = true;
        }
      }

      if (isModified) {
        const changedKeys = Object.keys(fields);
        const isOnlyCosmetic = changedKeys.every(
          (key) =>
            key === "patching_rect" ||
            key === "presentation_rect" ||
            key === "rect",
        );

        diff.push({
          type: isOnlyCosmetic ? "moved" : "modified",
          previous: boxA,
          current: boxB,
          fields,
        });
      }
    }

    for (const [id, boxA] of mapA.entries()) {
      if (!anchoredIds.has(id)) {
        diff.push({ type: "deleted", previous: boxA });
      }
    }

    for (const [id, boxB] of mapB.entries()) {
      if (!matchedBIds.has(id)) {
        diff.push({ type: "added", current: boxB });
      }
    }

    return diff;
  }
}
