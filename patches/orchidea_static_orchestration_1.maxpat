{
    "patcher": {
        "fileversion": 1,
        "appversion": {
            "major": 9,
            "minor": 1,
            "revision": 2,
            "architecture": "x64",
            "modernui": 1
        },
        "classnamespace": "box",
        "rect": [ 34.0, 95.0, 1402.0, 827.0 ],
        "boxes": [
            {
                "box": {
                    "bubble": 1,
                    "id": "obj-349",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1432.0, 102.0, 232.0, 24.0 ],
                    "text": "connection (2nd element is ignored)"
                }
            },
            {
                "box": {
                    "bubble": 1,
                    "id": "obj-350",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1393.0, 72.0, 175.0, 24.0 ],
                    "text": "2nd segment, 3rd solution"
                }
            },
            {
                "box": {
                    "bubble": 1,
                    "id": "obj-351",
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1364.0, 41.0, 170.0, 24.0 ],
                    "text": "1st segment, 4th solution"
                }
            },
            {
                "box": {
                    "bgcolor": [ 0.996078431372549, 0.0, 0.0, 1.0 ],
                    "bgcolor2": [ 0.2, 0.2, 0.2, 1.0 ],
                    "bgfillcolor_angle": 270.0,
                    "bgfillcolor_autogradient": 0.0,
                    "bgfillcolor_color": [ 0.2, 0.2, 0.2, 1.0 ],
                    "bgfillcolor_color1": [ 0.996078431372549, 0.0, 0.0, 1.0 ],
                    "bgfillcolor_color2": [ 0.2, 0.2, 0.2, 1.0 ],
                    "bgfillcolor_proportion": 0.5,
                    "bgfillcolor_type": "gradient",
                    "gradient": 1,
                    "id": "obj-352",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1332.0, 41.0, 29.5, 22.0 ],
                    "text": "1 2"
                }
            },
            {
                "box": {
                    "bgcolor": [ 0.996078431372549, 0.0, 0.0, 1.0 ],
                    "bgcolor2": [ 0.2, 0.2, 0.2, 1.0 ],
                    "bgfillcolor_angle": 270.0,
                    "bgfillcolor_autogradient": 0.0,
                    "bgfillcolor_color": [ 0.2, 0.2, 0.2, 1.0 ],
                    "bgfillcolor_color1": [ 0.996078431372549, 0.0, 0.0, 1.0 ],
                    "bgfillcolor_color2": [ 0.2, 0.2, 0.2, 1.0 ],
                    "bgfillcolor_proportion": 0.5,
                    "bgfillcolor_type": "gradient",
                    "gradient": 1,
                    "id": "obj-354",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1364.0, 72.0, 29.5, 22.0 ],
                    "text": "2 3"
                }
            },
            {
                "box": {
                    "bgcolor": [ 0.996078431372549, 0.0, 0.0, 1.0 ],
                    "bgcolor2": [ 0.2, 0.2, 0.2, 1.0 ],
                    "bgfillcolor_angle": 270.0,
                    "bgfillcolor_autogradient": 0.0,
                    "bgfillcolor_color": [ 0.2, 0.2, 0.2, 1.0 ],
                    "bgfillcolor_color1": [ 0.996078431372549, 0.0, 0.0, 1.0 ],
                    "bgfillcolor_color2": [ 0.2, 0.2, 0.2, 1.0 ],
                    "bgfillcolor_proportion": 0.5,
                    "bgfillcolor_type": "gradient",
                    "gradient": 1,
                    "id": "obj-355",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1392.0, 102.0, 45.0, 22.0 ],
                    "text": "1 2000"
                }
            },
            {
                "box": {
                    "id": "obj-341",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 5,
                    "outlettype": [ "dictionary", "", "", "", "" ],
                    "patching_rect": [ 1332.0, 223.0, 272.5, 22.0 ],
                    "saved_object_attributes": {
                        "legacy": 1,
                        "parameter_enable": 0,
                        "parameter_mappable": 0
                    },
                    "text": "dict"
                }
            },
            {
                "box": {
                    "id": "obj-342",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "bang", "" ],
                    "patching_rect": [ 1332.0, 186.0, 139.5, 22.0 ],
                    "text": "t b l"
                }
            },
            {
                "box": {
                    "id": "obj-29",
                    "maxclass": "button",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 811.0, 12.0, 24.0, 24.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-4",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "bang" ],
                    "patching_rect": [ 221.42682766914368, 322.0, 58.0, 22.0 ],
                    "text": "loadbang"
                }
            },
            {
                "box": {
                    "attr": "dynamics",
                    "id": "obj-6",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 67.0, 530.0, 315.0, 22.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 593.7805008888245, 527.9268407821655, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "attr": "styles",
                    "id": "obj-5",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 67.0, 506.0, 315.0, 22.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 578.7805008888245, 512.9268407821655, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "attr": "sparsity",
                    "id": "obj-1",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 549.0, 514.0, 159.78050088882446, 22.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 563.7805008888245, 497.9268407821655, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "attr": "forecastwithdetuning",
                    "id": "obj-24",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 549.0, 333.0, 160.0, 22.0 ],
                    "text_width": 135.0
                }
            },
            {
                "box": {
                    "attr": "tonedivision",
                    "id": "obj-49",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 549.0, 309.0, 159.78050088882446, 22.0 ]
                }
            },
            {
                "box": {
                    "channels": 1,
                    "id": "obj-119",
                    "lastchannelcount": 0,
                    "maxclass": "live.gain~",
                    "numinlets": 1,
                    "numoutlets": 4,
                    "orientation": 1,
                    "outlettype": [ "signal", "", "float", "list" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 1166.411167212895, 820.7317268848419, 151.0, 30.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 714.6999989999999, 2932.0, 210.0, 30.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_initial": [ 0.0 ],
                            "parameter_longname": "solution[4]",
                            "parameter_mmax": 6.0,
                            "parameter_mmin": -70.0,
                            "parameter_modmode": 0,
                            "parameter_shortname": "solution",
                            "parameter_type": 0,
                            "parameter_unitstyle": 4
                        }
                    },
                    "shownumber": 0,
                    "varname": "live.gain~[4]"
                }
            },
            {
                "box": {
                    "id": "obj-97",
                    "maxclass": "ezdac~",
                    "numinlets": 2,
                    "numoutlets": 0,
                    "patching_rect": [ 1166.411167212895, 870.7317280769348, 45.0, 45.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-91",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "signal", "signal" ],
                    "patching_rect": [ 1166.411167212895, 784.1463601589203, 135.0, 22.0 ],
                    "text": "orchidea.play~ 20"
                }
            },
            {
                "box": {
                    "attr": "onsettimegate",
                    "id": "obj-44",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 549.0, 482.9268407821655, 159.78050088882446, 22.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 548.7805008888245, 482.9268407821655, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "attr": "onsetthreshold",
                    "id": "obj-45",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 549.0, 458.5365962982178, 159.78050088882446, 22.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 548.7805008888245, 458.5365962982178, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "attr": "xoverrate",
                    "id": "obj-39",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 549.0, 434.14635181427, 159.78050088882446, 22.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 548.7805008888245, 434.14635181427, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "attr": "mutationrate",
                    "id": "obj-40",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 549.0, 410.97561955451965, 159.78050088882446, 22.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 548.7805008888245, 410.97561955451965, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "attr": "maxepochs",
                    "id": "obj-37",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 549.0, 387.0, 159.78050088882446, 22.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 548.7805008888245, 387.0, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "attr": "pursuit",
                    "id": "obj-35",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 549.0, 364.6341550350189, 159.78050088882446, 22.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 548.7805008888245, 364.6341550350189, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "hidden": 1,
                    "id": "obj-120",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1115.8536851406097, 58.53658676147461, 96.0, 22.0 ],
                    "text": "loadmess clear"
                }
            },
            {
                "box": {
                    "id": "obj-32",
                    "maxclass": "textbutton",
                    "numinlets": 1,
                    "numoutlets": 3,
                    "outlettype": [ "", "", "int" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 28.0, 35.0, 136.0, 26.0 ],
                    "text": "Select Target Sound",
                    "texton": "Select Target Sound",
                    "textoncolor": [ 0.2, 0.4980392157, 0.4941176471, 1.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-31",
                    "maxclass": "textbutton",
                    "numinlets": 1,
                    "numoutlets": 3,
                    "outlettype": [ "", "", "int" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 66.54877519607544, 374.390252828598, 136.0, 26.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 67.07317233085632, 374.390252828598, 136.58536911010742, 65.90244007110596 ],
                    "text": "Begin Orchestration",
                    "texton": "Begin Orchestration",
                    "textoncolor": [ 0.2, 0.4980392157, 0.4941176471, 1.0 ]
                }
            },
            {
                "box": {
                    "bwcompatibility": 80001,
                    "clefs": [ "G", "G", "G", "G", "G8va" ],
                    "defaultnoteslots": [ "null" ],
                    "enharmonictable": [ "default", "default", "default", "default", "default" ],
                    "fontface": 0,
                    "fontname": "Arial",
                    "fontsize": 12.0,
                    "hidevoices": [ 0, 0, 0, 0, 0 ],
                    "id": "obj-106",
                    "keys": [ "C", "C", "C", "C", "C" ],
                    "loop": [ 0.0, 1000.0 ],
                    "maxclass": "bach.roll",
                    "midichannels": [ 1, 2, 3, 4, 5 ],
                    "numinlets": 6,
                    "numoutlets": 8,
                    "numparts": [ 1, 1, 1, 1, 1 ],
                    "numvoices": 5,
                    "out": "nnnnnnn",
                    "outlettype": [ "", "", "", "", "", "", "", "bang" ],
                    "patching_rect": [ 729.2683100700378, 103.65853905677795, 529.0, 667.0 ],
                    "pitcheditrange": [ "null" ],
                    "stafflines": [ 5, 5, 5, 5, 5 ],
                    "textcolor": [ 0.0, 0.0, 0.0, 1.0 ],
                    "versionnumber": 80300,
                    "voicenames": [ "Fl", "ClBb", "Vn", "Vla", "Vlc" ],
                    "voicespacing": [ 0.0, 17.0, 17.0, 17.0, 17.0, 17.0 ],
                    "vzoom": 80.0,
                    "whole_roll_data_0000000000": [ "roll", "[", "slotinfo", "[", 1, "[", "name", "velocity envelope", "]", "[", "type", "function", "]", "[", "key", 0, "]", "[", "range", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1080016896, "]", "[", "slope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "representation", "]", "[", "grid", "]", "[", "ysnap", "]", "[", "domain", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1072693248, "]", "[", "domainslope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "temporalmode", "relative", "]", "[", "extend", 0, "]", "[", "width", "auto", "]", "[", "height", "auto", "]", "[", "copywhensplit", 0, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 2, "[", "name", "slot function", "]", "[", "type", "function", "]", "[", "key", 0, "]", "[", "range", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1072693248, "]", "[", "slope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "representation", "]", "[", "grid", "]", "[", "ysnap", "]", "[", "domain", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1072693248, "]", "[", "domainslope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "temporalmode", "relative", "]", "[", "extend", 0, "]", "[", "width", "auto", "]", "[", "height", "auto", "]", "[", "copywhensplit", 0, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 3, "[", "name", "slot intlist", "]", "[", "type", "intlist", "]", "[", "key", 0, "]", "[", "range", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1080016896, "]", "[", "slope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "representation", "]", "[", "default", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1078984704, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 4, "[", "name", "slot floatlist", "]", "[", "type", "floatlist", "]", "[", "key", 0, "]", "[", "range", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1072693248, "]", "[", "slope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "representation", "]", "[", "default", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 5, "[", "name", "slot int", "]", "[", "type", "int", "]", "[", "key", 0, "]", "[", "range", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1080016896, "]", "[", "slope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "representation", "]", "[", "default", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1078984704, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 6, "[", "name", "slot float", "]", "[", "type", "float", "]", "[", "key", 0, "]", "[", "range", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1072693248, "]", "[", "slope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "representation", "]", "[", "default", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 7, "[", "name", "detune", "]", "[", "type", "int", "]", "[", "key", 0, "]", "[", "range", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 3227058176, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "slope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "representation", "mc", "]", "[", "default", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 0, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 8, "[", "name", "relpath", "]", "[", "type", "text", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1080213504, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 9, "[", "name", "abspath", "]", "[", "type", "text", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1080213504, "]", "[", "height", "auto", "]", "[", "copywhensplit", 0, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 10, "[", "name", "slot llll", "]", "[", "type", "llll", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 0, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 11, "[", "name", "slot 11", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 12, "[", "name", "slot 12", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 13, "[", "name", "slot 13", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 14, "[", "name", "slot 14", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 15, "[", "name", "slot 15", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 16, "[", "name", "slot 16", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 17, "[", "name", "slot 17", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 18, "[", "name", "slot 18", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 19, "[", "name", "slot 19", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 20, "[", "name", "dynamics", "]", "[", "type", "dynamics", "]", "[", "key", "d", "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079738368, "]", "[", "height", "auto", "]", "[", "copywhensplit", 0, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 21, "[", "name", "lyrics", "]", "[", "type", "text", "]", "[", "key", "l", "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 0, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 22, "[", "name", "articulations", "]", "[", "type", "articulations", "]", "[", "key", "a", "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079738368, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 23, "[", "name", "notehead", "]", "[", "type", "notehead", "]", "[", "key", "h", "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079738368, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 24, "[", "name", "annotation", "]", "[", "type", "text", "]", "[", "key", "t", "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 25, "[", "name", "slot 25", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 26, "[", "name", "slot 26", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 27, "[", "name", "slot 27", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 28, "[", "name", "slot 28", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 29, "[", "name", "slot 29", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 30, "[", "name", "slot 30", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "]", "[", "commands", "[", 1, "[", "name", "command", "]", "[", "note", "note", "]", "[", "chord", "chord", "]", "[", "rest", "rest", "]", "[", "marker", "marker", "]", "[", "start", "none", "]", "[", "end", "none", "]", "[", "key", 0, "]", "]", "[", 2, "[", "name", "command", "]", "[", "note", "note", "]", "[", "chord", "chord", "]", "[", "rest", "rest", "]", "[", "marker", "marker", "]", "[", "start", "none", "]", "[", "end", "none", "]", "[", "key", 0, "]", "]", "[", 3, "[", "name", "command", "]", "[", "note", "note", "]", "[", "chord", "chord", "]", "[", "rest", "rest", "]", "[", "marker", "marker", "]", "[", "start", "none", "]", "[", "end", "none", "]", "[", "key", 0, "]", "]", "[", 4, "[", "name", "command", "]", "[", "note", "note", "]", "[", "chord", "chord", "]", "[", "rest", "rest", "]", "[", "marker", "marker", "]", "[", "start", "none", "]", "[", "end", "none", "]", "[", "key", 0, "]", "]", "[", 5, "[", "name", "command", "]", "[", "note", "note", "]", "[", "chord", "chord", "]", "[", "rest", "rest", "]", "[", "marker", "marker", "]", "[", "start", "none", "]", "[", "end", "none", "]", "[", "key", 0, "]", "]", "]", "[", "groups", "]", "[", "markers", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "seg1.sol2", "none", "]", "]", "[", "midichannels", 1, 2, 3, 4, 5, "]", "[", "articulationinfo", "]", "[", "noteheadinfo", "]", "[", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086121984, "_x_x_x_x_bach_float64_x_x_x_x_", 1568003933, 1083960791, 100, "[", "slots", "[", 7, 0, "]", "[", 8, "/Winds/Flute/ordinario/Fl-ord-D5-mf-N-T11d.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Winds/Flute/ordinario/Fl-ord-D5-mf-N-T11d.wav", "]", "[", 20, "[", "auto", "mf", "=", "]", "]", "[", 24, "ord", "]", "]", 0, "]", 0, "]", 0, "]", "[", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086262784, "_x_x_x_x_bach_float64_x_x_x_x_", 1568003933, 1083960791, 100, "[", "slots", "[", 7, 0, "]", "[", 8, "/Winds/Clarinet_Bb/ordinario_quartertones/ClBb-ord-Gq5-ff-N-N.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Winds/Clarinet_Bb/ordinario_quartertones/ClBb-ord-Gq5-ff-N-N.wav", "]", "[", 20, "[", "auto", "ff", "=", "]", "]", "[", 24, "ord", "]", "]", 0, "]", 0, "]", 0, "]", "[", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086249984, "_x_x_x_x_bach_float64_x_x_x_x_", 1568003933, 1083960791, 100, "[", "slots", "[", 7, 0, "]", "[", 8, "/Strings/Violin/pizzicato_l_vib/Vn-pizz_lv-G5-ff-2c-N.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Strings/Violin/pizzicato_l_vib/Vn-pizz_lv-G5-ff-2c-N.wav", "]", "[", 20, "[", "auto", "ff", "=", "]", "]", "[", 24, "pizz_lv", "]", "]", 0, "]", 0, "]", 0, "]", "[", 0, "]", "[", 0, "]" ],
                    "whole_roll_data_count": [ 1 ],
                    "zoom": 94.046875
                }
            },
            {
                "box": {
                    "id": "obj-98",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 729.2683100700378, 58.53658676147461, 377.0, 22.0 ],
                    "text": "orchidea.solution.toroll"
                }
            },
            {
                "box": {
                    "id": "obj-19",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 74.0, 206.0, 35.0, 22.0 ],
                    "text": "stop"
                }
            },
            {
                "box": {
                    "id": "obj-20",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 33.0, 206.0, 34.0, 22.0 ],
                    "text": "start"
                }
            },
            {
                "box": {
                    "id": "obj-21",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "signal", "bang" ],
                    "patching_rect": [ 33.0, 240.0, 150.0, 22.0 ],
                    "text": "play~ orchideatargetsound"
                }
            },
            {
                "box": {
                    "channels": 1,
                    "id": "obj-22",
                    "lastchannelcount": 0,
                    "maxclass": "live.gain~",
                    "numinlets": 1,
                    "numoutlets": 4,
                    "orientation": 1,
                    "outlettype": [ "signal", "", "float", "list" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 33.0, 273.0, 200.0, 20.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_initial": [ 0.0 ],
                            "parameter_longname": "gain[2]",
                            "parameter_mmax": 6.0,
                            "parameter_mmin": -70.0,
                            "parameter_modmode": 0,
                            "parameter_shortname": "gain",
                            "parameter_type": 0,
                            "parameter_unitstyle": 4
                        }
                    },
                    "showname": 0,
                    "shownumber": 0,
                    "varname": "live.gain~[2]"
                }
            },
            {
                "box": {
                    "id": "obj-43",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 271.0, 564.0, 35.0, 22.0 ],
                    "text": "stop"
                }
            },
            {
                "box": {
                    "id": "obj-41",
                    "local": 1,
                    "maxclass": "ezdac~",
                    "numinlets": 2,
                    "numoutlets": 0,
                    "patching_rect": [ 232.0, 663.0, 44.0, 44.0 ],
                    "prototypename": "helpfile"
                }
            },
            {
                "box": {
                    "channels": 1,
                    "id": "obj-42",
                    "lastchannelcount": 0,
                    "maxclass": "live.gain~",
                    "numinlets": 1,
                    "numoutlets": 4,
                    "orientation": 1,
                    "outlettype": [ "signal", "", "float", "list" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 232.0, 631.0, 200.0, 20.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_initial": [ 0.0 ],
                            "parameter_longname": "gain[1]",
                            "parameter_mmax": 6.0,
                            "parameter_mmin": -70.0,
                            "parameter_modmode": 0,
                            "parameter_shortname": "gain",
                            "parameter_type": 0,
                            "parameter_unitstyle": 4
                        }
                    },
                    "showname": 0,
                    "shownumber": 0,
                    "varname": "live.gain~[1]"
                }
            },
            {
                "box": {
                    "id": "obj-38",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 232.0, 564.0, 32.0, 22.0 ],
                    "text": "start"
                }
            },
            {
                "box": {
                    "id": "obj-36",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "signal", "bang" ],
                    "patching_rect": [ 232.0, 597.0, 264.0, 22.0 ],
                    "text": "play~ orchideatargetsound_orchidea.connection"
                }
            },
            {
                "box": {
                    "bgcolor": [ 0.5725490196078431, 0.0196078431372549, 0.0196078431372549, 1.0 ],
                    "bgcolor2": [ 0.5725490196078431, 0.0196078431372549, 0.0196078431372549, 1.0 ],
                    "bgfillcolor_angle": 270.0,
                    "bgfillcolor_autogradient": 0.0,
                    "bgfillcolor_color": [ 0.39215686274509803, 0.1607843137254902, 0.06666666666666667, 1.0 ],
                    "bgfillcolor_color1": [ 0.5725490196078431, 0.0196078431372549, 0.0196078431372549, 1.0 ],
                    "bgfillcolor_color2": [ 0.208680531953877, 0.20868047419733, 0.208680489290039, 1.0 ],
                    "bgfillcolor_proportion": 0.5,
                    "bgfillcolor_type": "color",
                    "gradient": 1,
                    "id": "obj-11",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 66.54877519607544, 413.41464400291443, 118.0, 22.0 ],
                    "text": "orchideatargetsound"
                }
            },
            {
                "box": {
                    "fontname": "Arial",
                    "fontsize": 13.0,
                    "id": "obj-14",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "bang" ],
                    "patching_rect": [ 195.0, 72.0, 67.0, 23.0 ],
                    "text": "loadbang"
                }
            },
            {
                "box": {
                    "fontname": "Arial",
                    "fontsize": 13.0,
                    "id": "obj-72",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 195.0, 100.0, 148.0, 23.0 ],
                    "text": "set orchideatargetsound"
                }
            },
            {
                "box": {
                    "bgcolor": [ 0.501961, 0.717647, 0.764706, 1.0 ],
                    "buffername": "orchideatargetsound",
                    "gridcolor": [ 0.352941, 0.337255, 0.521569, 1.0 ],
                    "id": "obj-73",
                    "maxclass": "waveform~",
                    "numinlets": 5,
                    "numoutlets": 6,
                    "outlettype": [ "float", "float", "float", "float", "list", "" ],
                    "patching_rect": [ 28.0, 130.0, 246.0, 59.0 ],
                    "selectioncolor": [ 0.313726, 0.498039, 0.807843, 0.0 ],
                    "setunit": 1,
                    "waveformcolor": [ 0.082353, 0.25098, 0.431373, 1.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-12",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 28.0, 71.0, 48.0, 22.0 ],
                    "text": "replace"
                }
            },
            {
                "box": {
                    "id": "obj-71",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "float", "bang" ],
                    "patching_rect": [ 28.0, 100.0, 159.0, 22.0 ],
                    "text": "buffer~ orchideatargetsound"
                }
            },
            {
                "box": {
                    "autopopulate": 1,
                    "bgfillcolor_angle": 270.0,
                    "bgfillcolor_autogradient": 0.0,
                    "bgfillcolor_color": [ 0.2, 0.5019607843137255, 0.4980392156862745, 1.0 ],
                    "bgfillcolor_color1": [ 0.2, 0.5019607843137255, 0.4980392156862745, 1.0 ],
                    "bgfillcolor_color2": [ 0.208680531953877, 0.20868047419733, 0.208680489290039, 1.0 ],
                    "bgfillcolor_proportion": 0.5,
                    "bgfillcolor_type": "gradient",
                    "id": "obj-176",
                    "items": [ "CSOL_multiphonics.mfcc.db", ",", "CSOL_multiphonics.spectrum.db", ",", "CSOL_tam_tam.mfcc.db", ",", "CSOL_tam_tam.spectrum.db", ",", "FullSOL2020.md5.txt", ",", "FullSOL2020.mfcc.db", ",", "FullSOL2020.moments.db", ",", "FullSOL2020.specenv.db", ",", "FullSOL2020.specpeaks.db", ",", "FullSOL2020.spectrum.db", ",", "SOL_0.9_HQ.spectrum.db", ",", "StaticSOL.mfcc.db", ",", "StaticSOL.spectrum.db", ",", "TinySOL2020.mfcc.db", ",", "TinySOL2020.spectrum.db" ],
                    "maxclass": "umenu",
                    "numinlets": 1,
                    "numoutlets": 3,
                    "outlettype": [ "int", "", "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 396.5, 108.0, 188.0, 22.0 ],
                    "prefix": "Package:/orchidea/db/"
                }
            },
            {
                "box": {
                    "id": "obj-3",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "", "" ],
                    "patching_rect": [ 221.42682766914368, 418.292692899704, 59.0, 22.0 ],
                    "text": "route text"
                }
            },
            {
                "box": {
                    "id": "obj-7",
                    "maxclass": "textedit",
                    "numinlets": 1,
                    "numoutlets": 4,
                    "outlettype": [ "", "int", "", "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 221.42682766914368, 370.73171615600586, 289.0, 33.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 212.19512701034546, 373.17074060440063, 300.80487298965454, 69.5121967792511 ],
                    "text": "Fl ClBb Vn Vla Vlc"
                }
            },
            {
                "box": {
                    "id": "obj-2",
                    "maxclass": "button",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 432.5, 37.0, 24.0, 24.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-34",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patcher": {
                        "fileversion": 1,
                        "appversion": {
                            "major": 9,
                            "minor": 1,
                            "revision": 2,
                            "architecture": "x64",
                            "modernui": 1
                        },
                        "classnamespace": "box",
                        "rect": [ 1231.0, 839.0, 1000.0, 780.0 ],
                        "boxes": [
                            {
                                "box": {
                                    "comment": "",
                                    "id": "obj-5",
                                    "index": 1,
                                    "maxclass": "outlet",
                                    "numinlets": 1,
                                    "numoutlets": 0,
                                    "patching_rect": [ 60.0, 282.0, 30.0, 30.0 ]
                                }
                            },
                            {
                                "box": {
                                    "comment": "",
                                    "id": "obj-4",
                                    "index": 2,
                                    "maxclass": "inlet",
                                    "numinlets": 0,
                                    "numoutlets": 1,
                                    "outlettype": [ "bang" ],
                                    "patching_rect": [ 144.0, 53.0, 30.0, 30.0 ]
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-2",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 1,
                                    "outlettype": [ "bang" ],
                                    "patching_rect": [ 165.0, 87.0, 58.0, 22.0 ],
                                    "text": "loadbang"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-33",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 108.0, 237.0, 85.0, 22.0 ],
                                    "text": "prepend prefix"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-19",
                                    "maxclass": "toggle",
                                    "numinlets": 1,
                                    "numoutlets": 1,
                                    "outlettype": [ "int" ],
                                    "parameter_enable": 0,
                                    "patching_rect": [ 220.0, 203.0, 24.0, 24.0 ]
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-11",
                                    "maxclass": "message",
                                    "numinlets": 2,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 137.0, 121.0, 249.0, 22.0 ],
                                    "text": "\"~/Documents/Max 9/Packages/orchidea/db/\""
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-9",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 2,
                                    "outlettype": [ "", "int" ],
                                    "patching_rect": [ 87.0, 204.0, 128.0, 22.0 ],
                                    "text": "conformpath max boot"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-3",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 2,
                                    "outlettype": [ "", "int" ],
                                    "patching_rect": [ 60.0, 237.0, 39.0, 22.0 ],
                                    "text": "folder"
                                }
                            },
                            {
                                "box": {
                                    "comment": "",
                                    "id": "obj-1",
                                    "index": 1,
                                    "maxclass": "inlet",
                                    "numinlets": 0,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 60.0, 53.0, 30.0, 30.0 ]
                                }
                            }
                        ],
                        "lines": [
                            {
                                "patchline": {
                                    "destination": [ "obj-3", 0 ],
                                    "source": [ "obj-1", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-9", 0 ],
                                    "source": [ "obj-11", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-11", 0 ],
                                    "source": [ "obj-2", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-5", 0 ],
                                    "source": [ "obj-3", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-5", 0 ],
                                    "source": [ "obj-33", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-11", 0 ],
                                    "source": [ "obj-4", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-19", 0 ],
                                    "source": [ "obj-9", 1 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-3", 0 ],
                                    "order": 1,
                                    "source": [ "obj-9", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-33", 0 ],
                                    "order": 0,
                                    "source": [ "obj-9", 0 ]
                                }
                            }
                        ],
                        "toolbaradditions": [ "packagemanager" ]
                    },
                    "patching_rect": [ 396.5, 78.0, 55.0, 22.0 ],
                    "text": "p loaddb"
                }
            },
            {
                "box": {
                    "bgmode": 0,
                    "border": 0,
                    "clickthrough": 0,
                    "enablehscroll": 0,
                    "enablevscroll": 0,
                    "id": "obj-16",
                    "lockeddragscroll": 0,
                    "lockedsize": 0,
                    "maxclass": "bpatcher",
                    "name": "orchidea.demodb.maxpat",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "offset": [ 0.0, 0.0 ],
                    "outlettype": [ "" ],
                    "patching_rect": [ 380.0, 167.0, 215.0, 64.0 ],
                    "viewvisibility": 1
                }
            },
            {
                "box": {
                    "id": "obj-25",
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 5,
                    "outlettype": [ "dictionary", "", "", "", "" ],
                    "patching_rect": [ 66.54877519607544, 451.21952295303345, 226.399994, 22.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 66.54877519607544, 451.21952295303345, 226.399994, 22.0 ],
                    "text": "orchidea.orchestrate"
                }
            },
            {
                "box": {
                    "angle": 270.0,
                    "bgcolor": [ 0.20784313725490197, 0.20784313725490197, 0.20784313725490197, 1.0 ],
                    "border": 1,
                    "bordercolor": [ 0.2, 0.5019607843137255, 0.4980392156862745, 1.0 ],
                    "id": "obj-26",
                    "maxclass": "panel",
                    "mode": 0,
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 371.0, 24.0, 232.0, 216.0 ],
                    "proportion": 0.5
                }
            },
            {
                "box": {
                    "angle": 270.0,
                    "bgcolor": [ 0.208680531953877, 0.20868047419733, 0.208680489290039, 1.0 ],
                    "border": 1,
                    "bordercolor": [ 0.2, 0.5019607843137255, 0.4980392156862745, 1.0 ],
                    "id": "obj-27",
                    "maxclass": "panel",
                    "mode": 0,
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 16.0, 24.0, 342.0, 287.0 ],
                    "proportion": 0.5
                }
            },
            {
                "box": {
                    "angle": 270.0,
                    "bgcolor": [ 0.208680531953877, 0.20868047419733, 0.208680489290039, 1.0 ],
                    "border": 1,
                    "bordercolor": [ 0.2, 0.5019607843137255, 0.4980392156862745, 1.0 ],
                    "id": "obj-33",
                    "maxclass": "panel",
                    "mode": 0,
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 56.79267740249634, 359.75610613822937, 463.4146451950073, 141.46341800689697 ],
                    "presentation": 1,
                    "presentation_rect": [ 56.79267740249634, 359.75610613822937, 463.4146451950073, 141.46341800689697 ],
                    "proportion": 0.5
                }
            },
            {
                "box": {
                    "attr": "popsize",
                    "id": "obj-8",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 549.0, 550.0, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "attr": "richness",
                    "id": "obj-9",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 549.0, 589.0, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "attr": "maxexport",
                    "id": "obj-10",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 549.0, 629.0, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "attr": "partialsfiltering",
                    "id": "obj-30",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 549.0, 673.0, 150.0, 22.0 ]
                }
            }
        ],
        "lines": [
            {
                "patchline": {
                    "destination": [ "obj-25", 0 ],
                    "source": [ "obj-1", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 0 ],
                    "source": [ "obj-10", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-91", 0 ],
                    "source": [ "obj-106", 6 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 0 ],
                    "source": [ "obj-11", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-97", 1 ],
                    "order": 0,
                    "source": [ "obj-119", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-97", 0 ],
                    "order": 1,
                    "source": [ "obj-119", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-71", 0 ],
                    "source": [ "obj-12", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-106", 0 ],
                    "source": [ "obj-120", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-72", 0 ],
                    "source": [ "obj-14", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 2 ],
                    "source": [ "obj-16", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 2 ],
                    "midpoints": [ 490.5, 450.0, 283.44876919607543, 450.0 ],
                    "source": [ "obj-176", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-21", 0 ],
                    "source": [ "obj-19", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-34", 1 ],
                    "source": [ "obj-2", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-21", 0 ],
                    "source": [ "obj-20", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-22", 0 ],
                    "source": [ "obj-21", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-41", 0 ],
                    "midpoints": [ 42.5, 408.0, 30.0, 408.0, 30.0, 660.0, 241.5, 660.0 ],
                    "source": [ "obj-22", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 0 ],
                    "source": [ "obj-24", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-341", 1 ],
                    "source": [ "obj-25", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-98", 0 ],
                    "source": [ "obj-29", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 1 ],
                    "source": [ "obj-3", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 0 ],
                    "source": [ "obj-30", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-11", 0 ],
                    "source": [ "obj-31", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-12", 0 ],
                    "source": [ "obj-32", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-176", 0 ],
                    "source": [ "obj-34", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-98", 0 ],
                    "source": [ "obj-341", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-341", 0 ],
                    "source": [ "obj-342", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-98", 1 ],
                    "source": [ "obj-342", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 0 ],
                    "source": [ "obj-35", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-342", 0 ],
                    "source": [ "obj-352", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-342", 0 ],
                    "source": [ "obj-354", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-342", 0 ],
                    "source": [ "obj-355", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-42", 0 ],
                    "source": [ "obj-36", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 0 ],
                    "source": [ "obj-37", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-36", 0 ],
                    "source": [ "obj-38", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 0 ],
                    "source": [ "obj-39", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-7", 0 ],
                    "source": [ "obj-4", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 0 ],
                    "source": [ "obj-40", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-41", 1 ],
                    "order": 0,
                    "source": [ "obj-42", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-41", 0 ],
                    "order": 1,
                    "source": [ "obj-42", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-36", 0 ],
                    "source": [ "obj-43", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 0 ],
                    "source": [ "obj-44", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 0 ],
                    "source": [ "obj-45", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 0 ],
                    "source": [ "obj-49", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 0 ],
                    "source": [ "obj-5", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 0 ],
                    "source": [ "obj-6", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-3", 0 ],
                    "source": [ "obj-7", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-73", 0 ],
                    "source": [ "obj-72", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 0 ],
                    "source": [ "obj-8", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 0 ],
                    "source": [ "obj-9", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-119", 0 ],
                    "source": [ "obj-91", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-106", 0 ],
                    "source": [ "obj-98", 0 ]
                }
            }
        ],
        "parameters": {
            "obj-119": [ "solution[4]", "solution", 0 ],
            "obj-22": [ "gain[2]", "gain", 0 ],
            "obj-42": [ "gain[1]", "gain", 0 ],
            "parameterbanks": {
                "0": {
                    "index": 0,
                    "name": "",
                    "parameters": [ "-", "-", "-", "-", "-", "-", "-", "-" ],
                    "buttons": [ "-", "-", "-", "-", "-", "-", "-", "-" ]
                }
            },
            "inherited_shortname": 1
        },
        "autosave": 0,
        "toolbaradditions": [ "packagemanager" ]
    }
}