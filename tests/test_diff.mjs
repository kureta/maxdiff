import { DiffEngine } from '../js/DiffEngine.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const loadPatch = (filename) => {
    const filePath = path.join(__dirname, '../patches', filename);
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
};

const runTests = () => {
    console.log("Running DiffEngine tests...");

    // Test 1: Synthetic Data - Identical patches
    {
        const patchA = { patcher: { boxes: [{ box: { id: "obj-1", maxclass: "newobj", text: "sin" } }] } };
        const patchB = { patcher: { boxes: [{ box: { id: "obj-1", maxclass: "newobj", text: "sin" } }] } };
        const result = DiffEngine.compare(patchA, patchB);
        console.assert(result.boxes.length === 1, "Test 1 Failed: Should have 1 box");
        if (result.boxes.length > 0) {
             console.assert(result.boxes[0].diffState === "unchanged", "Test 1 Failed: Should be unchanged");
        }
        console.log("Test 1 (Identical) passed.");
    }

    // Test 2: Synthetic Data - Added box
    {
        const patchA = { patcher: { boxes: [] } };
        const patchB = { patcher: { boxes: [{ box: { id: "obj-1", maxclass: "newobj", text: "sin" } }] } };
        const result = DiffEngine.compare(patchA, patchB);
        console.assert(result.boxes.length === 1, "Test 2 Failed: Should have 1 box");
        if (result.boxes.length > 0) {
            console.assert(result.boxes[0].diffState === "added", "Test 2 Failed: Should be added");
        }
        console.log("Test 2 (Added) passed.");
    }

    // Test 3: Real Data
    try {
        const dataA = loadPatch('orchidea_static_orchestration_1.maxpat');
        const dataB = loadPatch('orchidea_static_orchestration_2.maxpat');
        
        const result = DiffEngine.compare(dataA, dataB);
        
        console.log(`Real Data Comparison: Found ${result.boxes.length} boxes and ${result.lines.length} lines.`);
        
        const modified = result.boxes.filter(b => b.diffState === 'modified');
        const added = result.boxes.filter(b => b.diffState === 'added');
        const removed = result.boxes.filter(b => b.diffState === 'removed');
        
        console.log(`Stats: ${modified.length} modified, ${added.length} added, ${removed.length} removed.`);
        
        console.assert(result.boxes.length > 0, "Test 3 Failed: No boxes returned");
        // We expect differences given the files are different
        console.assert(modified.length + added.length + removed.length > 0, "Test 3 Failed: No differences found");
        
        console.log("Test 3 (Real Data) passed.");
    } catch (e) {
        console.error("Test 3 Failed with error:", e);
    }
};

runTests();
