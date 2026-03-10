{
  "patcher": {
    "rect": [0, 0, 800, 600],
    "boxes": [
      { "box": { "id": "obj-1",  "maxclass": "newobj",   "text": "cycle~",          "numinlets": 2, "numoutlets": 1, "patching_rect": [100, 100, 60, 22] } },
      { "box": { "id": "obj-2",  "maxclass": "newobj",   "text": "dac~",             "numinlets": 2, "numoutlets": 0, "patching_rect": [100, 200, 60, 22] } },
      { "box": { "id": "obj-3",  "maxclass": "newobj",   "text": "gain~",            "numinlets": 1, "numoutlets": 1, "patching_rect": [100, 150, 60, 22],
                 "extra_param": "added-attr" } },
      { "box": { "id": "obj-5",  "maxclass": "newobj",   "text": "moved~",           "numinlets": 1, "numoutlets": 1, "patching_rect": [400, 250, 60, 22] } },
      { "box": { "id": "obj-20", "maxclass": "newobj",   "text": "added~",           "numinlets": 1, "numoutlets": 1, "patching_rect": [300, 100, 60, 22] } },
      { "box": { "id": "obj-6",  "maxclass": "live.dial",                             "numinlets": 1, "numoutlets": 2, "patching_rect": [200, 100, 40, 40], "presentation": 1, "presentation_rect": [20, 20, 40, 40] } },
      { "box": { "id": "obj-7",  "maxclass": "newobj",   "text": "print",            "numinlets": 1, "numoutlets": 0, "patching_rect": [300, 300, 40, 22] } },
      { "box": { "id": "obj-8",  "maxclass": "newobj",   "text": "unique~",          "numinlets": 1, "numoutlets": 1, "patching_rect": [500, 100, 60, 22],
                 "presentation": 0 } },
      { "box": { "id": "obj-9",  "maxclass": "toggle",                               "numinlets": 1, "numoutlets": 1, "patching_rect": [600, 100, 24, 24] } },
      { "box": { "id": "obj-10", "maxclass": "newobj",   "text": "metro 500",        "numinlets": 2, "numoutlets": 1, "patching_rect": [600, 140, 70, 22] } },
      { "box": { "id": "obj-11", "maxclass": "newobj",   "text": "counter",          "numinlets": 2, "numoutlets": 3, "patching_rect": [500, 300, 60, 22] } },
      { "box": { "id": "obj-4",  "maxclass": "newobj",   "text": "added-reuse~",     "numinlets": 1, "numoutlets": 1, "patching_rect": [700, 100, 60, 22] } },

      { "box": { "id": "obj-12", "maxclass": "newobj",   "text": "new-twelve~",      "numinlets": 1, "numoutlets": 1, "patching_rect": [300, 450, 60, 22] } },

      { "box": { "id": "obj-31", "maxclass": "newobj",   "text": "filter~",          "numinlets": 2, "numoutlets": 1, "patching_rect": [200, 400, 60, 22] } },

      { "box": { "id": "obj-34", "maxclass": "newobj",   "text": "scale 0 127 0 1", "numinlets": 1, "numoutlets": 1, "patching_rect": [400, 350, 80, 22] } },
      { "box": { "id": "obj-35", "maxclass": "newobj",   "text": "scale 0 127 0 1", "numinlets": 1, "numoutlets": 1, "patching_rect": [550, 400, 80, 22] } }
    ],
    "lines": [
      { "patchline": { "source": ["obj-1",  0], "destination": ["obj-3",  0] } },
      { "patchline": { "source": ["obj-3",  0], "destination": ["obj-2",  0] } },
      { "patchline": { "source": ["obj-6",  0], "destination": ["obj-1",  0] } },
      { "patchline": { "source": ["obj-20", 0], "destination": ["obj-7",  0] } },
      { "patchline": { "source": ["obj-9",  0], "destination": ["obj-10", 0] } },
      { "patchline": { "source": ["obj-10", 0], "destination": ["obj-11", 0] } },

      { "patchline": { "source": ["obj-5",  0], "destination": ["obj-2",  1] } },

      { "patchline": { "source": ["obj-1",  0], "destination": ["obj-31", 0] } },

      { "patchline": { "source": ["obj-11", 0], "destination": ["obj-34", 0] } },
      { "patchline": { "source": ["obj-11", 1], "destination": ["obj-35", 0] } }
    ]
  }
}
