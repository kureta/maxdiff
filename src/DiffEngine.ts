export type Rect = [number, number, number, number];

export interface Box {
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

export interface PatchLine {
  source: [string, number];
  destination: [string, number];
}

export interface Patcher {
  boxes: { box: Box }[];
  lines: { patchline: PatchLine }[];
  rect: Rect;
  [key: string]: unknown;
}

export interface MaxPatchJSON {
  patcher: Patcher;
}

export interface FieldDelta {
  from: unknown;
  to: unknown;
}

export type DiffOperation<T extends object> =
  | { type: "added"; current: T }
  | { type: "deleted"; previous: T }
  | {
      type: "modified" | "moved";
      previous: T;
      current: T;
      fields: Partial<Record<keyof T, FieldDelta>>;
    };

export type DiffCollection<T extends object> = DiffOperation<T>[];

export class MaxDiff {
  public static getClass(box: Box): string {
    if (box.maxclass && box.maxclass !== "newobj") return box.maxclass;
    return (box.text || "").split(" ")[0];
  }

  public static compare(
    patchA: MaxPatchJSON,
    patchB: MaxPatchJSON,
  ): DiffCollection<Box> {
    const boxesA = patchA.patcher.boxes.map((b) => b.box);
    const boxesB = patchB.patcher.boxes.map((b) => b.box);
    const linesA = patchA.patcher.lines?.map((l) => l.patchline) ?? [];
    const linesB = patchB.patcher.lines?.map((l) => l.patchline) ?? [];

    console.debug("===== Comparing =====");
    console.debug(
      `Before state: ${boxesA.length} boxes\nAfter state: ${boxesB.length} boxes`,
    );

    const mapA = new Map<string, Box>(boxesA.map((b) => [b.id, b]));
    const mapB = new Map<string, Box>(boxesB.map((b) => [b.id, b]));

    const matchedPairs: [Box, Box][] = [];
    const anchoredIds = new Set<string>();
    const matchedBIds = new Set<string>();

    const anchorPair = (idA: string, idB: string, boxA: Box, boxB: Box) => {
      matchedPairs.push([boxA, boxB]);
      anchoredIds.add(idA);
      matchedBIds.add(idB);
    };

    // Pass 1: Strict ID and Class match
    for (const [id, boxA] of mapA) {
      const boxB = mapB.get(id);
      if (boxB && this.getClass(boxA) === this.getClass(boxB)) {
        anchorPair(id, id, boxA, boxB);
      }
    }

    console.debug(`Found ${matchedPairs.length} anchor pairs.`);

    // Pass 1.5: Unique Class match
    const unanchoredClassesA = new Map<string, string[]>();
    for (const [id, box] of mapA) {
      if (anchoredIds.has(id)) continue;
      const cls = this.getClass(box);
      if (!unanchoredClassesA.has(cls)) unanchoredClassesA.set(cls, []);
      unanchoredClassesA.get(cls)!.push(id);
    }

    const unanchoredClassesB = new Map<string, string[]>();
    for (const [id, box] of mapB) {
      if (matchedBIds.has(id)) continue;
      const cls = this.getClass(box);
      if (!unanchoredClassesB.has(cls)) unanchoredClassesB.set(cls, []);
      unanchoredClassesB.get(cls)!.push(id);
    }

    for (const [cls, idsA] of unanchoredClassesA) {
      const idsB = unanchoredClassesB.get(cls);
      if (idsA.length === 1 && idsB?.length === 1) {
        const idA = idsA[0];
        const idB = idsB[0];
        anchorPair(idA, idB, mapA.get(idA)!, mapB.get(idB)!);
      }
    }

    console.debug(
      `Increased total number of anchor pairs to ${matchedPairs.length} with "single class" rule.`,
    );

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

    for (const [idA, boxA] of mapA) {
      if (anchoredIds.has(idA)) continue;
      const sigA = getSignature(idA, linesA);
      if (!sigA) continue;

      for (const [idB, boxB] of mapB) {
        if (matchedBIds.has(idB)) continue;
        if (
          this.getClass(boxA) === this.getClass(boxB) &&
          sigA === getSignature(idB, linesB)
        ) {
          anchorPair(idA, idB, boxA, boxB);
          break;
        }
      }
    }

    console.debug(
      `Increased total number of anchor pairs to ${matchedPairs.length} with "topological matching".`,
    );

    const diff: DiffCollection<Box> = [];

    // Compute modifications
    for (const [boxA, boxB] of matchedPairs) {
      const fields: Partial<Record<keyof Box, FieldDelta>> = {};
      const allKeys = new Set([...Object.keys(boxA), ...Object.keys(boxB)]);
      allKeys.delete("id");

      for (const key of allKeys) {
        if (JSON.stringify(boxA[key]) !== JSON.stringify(boxB[key])) {
          fields[key] = { from: boxA[key], to: boxB[key] };
        }
      }

      const changedKeys = Object.keys(fields);
      if (changedKeys.length > 0) {
        const isMoved = changedKeys.every((k) =>
          ["patching_rect", "presentation_rect", "rect"].includes(k),
        );
        diff.push({
          type: isMoved ? "moved" : "modified",
          previous: boxA,
          current: boxB,
          fields,
        });
      }
    }

    // Unmatched deletions and additions
    for (const [id, boxA] of mapA)
      if (!anchoredIds.has(id)) diff.push({ type: "deleted", previous: boxA });
    for (const [id, boxB] of mapB)
      if (!matchedBIds.has(id)) diff.push({ type: "added", current: boxB });

    return diff;
  }
}
