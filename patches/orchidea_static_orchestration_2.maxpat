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
        "rect": [ 37.0, 95.0, 910.0, 827.0 ],
        "boxes": [
            {
                "box": {
                    "id": "obj-28",
                    "linecount": 2,
                    "maxclass": "comment",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 1149.0, 18.347825527191162, 150.0, 33.0 ],
                    "text": "Change instrument names\nto standard ones"
                }
            },
            {
                "box": {
                    "id": "obj-57",
                    "maxclass": "newobj",
                    "numinlets": 1,
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
                        "rect": [ 34.0, 95.0, 1402.0, 827.0 ],
                        "boxes": [
                            {
                                "box": {
                                    "id": "obj-57",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 1526.0, 585.0, 118.0, 22.0 ],
                                    "text": "prepend instruments"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-58",
                                    "maxclass": "newobj",
                                    "numinlets": 2,
                                    "numoutlets": 2,
                                    "outlettype": [ "", "" ],
                                    "patching_rect": [ 1526.0, 554.0, 121.0, 22.0 ],
                                    "text": "route selecteditems"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-59",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 2,
                                    "outlettype": [ "", "bang" ],
                                    "patching_rect": [ 1362.0, 241.0, 29.5, 22.0 ],
                                    "text": "t l b"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-60",
                                    "maxclass": "button",
                                    "numinlets": 1,
                                    "numoutlets": 1,
                                    "outlettype": [ "bang" ],
                                    "parameter_enable": 0,
                                    "patching_rect": [ 1362.0, 114.0, 24.0, 24.0 ]
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-61",
                                    "maxclass": "newobj",
                                    "numinlets": 2,
                                    "numoutlets": 2,
                                    "outlettype": [ "", "" ],
                                    "patching_rect": [ 1362.0, 72.0, 75.0, 22.0 ],
                                    "text": "route source"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-62",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 1362.0, 280.0, 25.0, 22.0 ],
                                    "text": "iter"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-63",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 1362.0, 324.0, 96.0, 22.0 ],
                                    "text": "prepend append"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-64",
                                    "maxclass": "message",
                                    "numinlets": 2,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 1362.0, 158.0, 119.0, 22.0 ],
                                    "text": "getitems instruments"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-65",
                                    "maxclass": "newobj",
                                    "numinlets": 2,
                                    "numoutlets": 2,
                                    "outlettype": [ "", "" ],
                                    "patching_rect": [ 1362.0, 199.0, 105.0, 22.0 ],
                                    "text": "orchidea.db.query"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-66",
                                    "maxclass": "message",
                                    "numinlets": 2,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 1542.0, 25.0, 37.0, 22.0 ],
                                    "text": "clear"
                                }
                            },
                            {
                                "box": {
                                    "fontface": 0,
                                    "fontname": "Arial",
                                    "fontsize": 12.0,
                                    "id": "obj-67",
                                    "items": [ "ASax", ",", "Acc", ",", "BTb", ",", "BTb+S", ",", "Bn", ",", "Bn+S", ",", "Cb", ",", "Cb+S", ",", "ClBb", ",", "Fl", ",", "Gtr", ",", "Hn", ",", "Hn+S", ",", "Hp", ",", "Ob", ",", "Ob+S", ",", "Tbn", ",", "Tbn+SC", ",", "Tbn+SH", ",", "Tbn+SS", ",", "Tbn+SW", ",", "TpC", ",", "TpC+SC", ",", "TpC+SH", ",", "TpC+SS", ",", "TpC+SW", ",", "Va", ",", "Va+S", ",", "Va+SP", ",", "Vc", ",", "Vc+S", ",", "Vc+SP", ",", "Vn", ",", "Vn+S", ",", "Vn+SP" ],
                                    "maxclass": "chooser",
                                    "multiselect": 1,
                                    "numinlets": 1,
                                    "numoutlets": 6,
                                    "outlettype": [ "", "", "", "", "", "" ],
                                    "parameter_enable": 0,
                                    "patching_rect": [ 1542.0, 58.0, 276.0, 465.0 ]
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-53",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 1037.0, 585.0, 107.0, 22.0 ],
                                    "text": "prepend dynamics"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-54",
                                    "maxclass": "newobj",
                                    "numinlets": 2,
                                    "numoutlets": 2,
                                    "outlettype": [ "", "" ],
                                    "patching_rect": [ 1037.0, 554.0, 121.0, 22.0 ],
                                    "text": "route selecteditems"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-43",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 2,
                                    "outlettype": [ "", "bang" ],
                                    "patching_rect": [ 873.0, 241.0, 29.5, 22.0 ],
                                    "text": "t l b"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-44",
                                    "maxclass": "button",
                                    "numinlets": 1,
                                    "numoutlets": 1,
                                    "outlettype": [ "bang" ],
                                    "parameter_enable": 0,
                                    "patching_rect": [ 873.0, 114.0, 24.0, 24.0 ]
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-45",
                                    "maxclass": "newobj",
                                    "numinlets": 2,
                                    "numoutlets": 2,
                                    "outlettype": [ "", "" ],
                                    "patching_rect": [ 873.0, 72.0, 75.0, 22.0 ],
                                    "text": "route source"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-46",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 873.0, 280.0, 25.0, 22.0 ],
                                    "text": "iter"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-47",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 873.0, 324.0, 96.0, 22.0 ],
                                    "text": "prepend append"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-48",
                                    "maxclass": "message",
                                    "numinlets": 2,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 873.0, 158.0, 108.0, 22.0 ],
                                    "text": "getitems dynamics"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-49",
                                    "maxclass": "newobj",
                                    "numinlets": 2,
                                    "numoutlets": 2,
                                    "outlettype": [ "", "" ],
                                    "patching_rect": [ 873.0, 199.0, 105.0, 22.0 ],
                                    "text": "orchidea.db.query"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-50",
                                    "maxclass": "message",
                                    "numinlets": 2,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 1053.0, 25.0, 37.0, 22.0 ],
                                    "text": "clear"
                                }
                            },
                            {
                                "box": {
                                    "fontface": 0,
                                    "fontname": "Arial",
                                    "fontsize": 12.0,
                                    "id": "obj-51",
                                    "items": [ "N", ",", "f", ",", "ff", ",", "ffpp", ",", "fp", ",", "mf", ",", "p", ",", "pp", ",", "ppff", ",", "ppmfpp" ],
                                    "maxclass": "chooser",
                                    "multiselect": 1,
                                    "numinlets": 1,
                                    "numoutlets": 6,
                                    "outlettype": [ "", "", "", "", "", "" ],
                                    "parameter_enable": 0,
                                    "patching_rect": [ 1053.0, 58.0, 276.0, 465.0 ]
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-40",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 2,
                                    "outlettype": [ "", "bang" ],
                                    "patching_rect": [ 392.0, 241.0, 29.5, 22.0 ],
                                    "text": "t l b"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-39",
                                    "maxclass": "button",
                                    "numinlets": 1,
                                    "numoutlets": 1,
                                    "outlettype": [ "bang" ],
                                    "parameter_enable": 0,
                                    "patching_rect": [ 392.0, 114.0, 24.0, 24.0 ]
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-37",
                                    "maxclass": "newobj",
                                    "numinlets": 2,
                                    "numoutlets": 2,
                                    "outlettype": [ "", "" ],
                                    "patching_rect": [ 392.0, 72.0, 75.0, 22.0 ],
                                    "text": "route source"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-28",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 392.0, 280.0, 25.0, 22.0 ],
                                    "text": "iter"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-29",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 392.0, 324.0, 96.0, 22.0 ],
                                    "text": "prepend append"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-22",
                                    "maxclass": "message",
                                    "numinlets": 2,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 392.0, 158.0, 88.0, 22.0 ],
                                    "text": "getitems styles"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-26",
                                    "maxclass": "newobj",
                                    "numinlets": 2,
                                    "numoutlets": 2,
                                    "outlettype": [ "", "" ],
                                    "patching_rect": [ 392.0, 199.0, 105.0, 22.0 ],
                                    "text": "orchidea.db.query"
                                }
                            },
                            {
                                "box": {
                                    "comment": "",
                                    "id": "obj-21",
                                    "index": 1,
                                    "maxclass": "inlet",
                                    "numinlets": 0,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 478.0, 5.0, 30.0, 30.0 ]
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-16",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 1,
                                    "outlettype": [ "bang" ],
                                    "patching_rect": [ 113.0, 24.800000369548798, 58.0, 22.0 ],
                                    "text": "loadbang"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-32",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 572.0, 565.0, 87.0, 22.0 ],
                                    "text": "prepend styles"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-30",
                                    "maxclass": "newobj",
                                    "numinlets": 2,
                                    "numoutlets": 2,
                                    "outlettype": [ "", "" ],
                                    "patching_rect": [ 572.0, 534.0, 121.0, 22.0 ],
                                    "text": "route selecteditems"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-25",
                                    "maxclass": "message",
                                    "numinlets": 2,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 572.0, 24.800000369548798, 37.0, 22.0 ],
                                    "text": "clear"
                                }
                            },
                            {
                                "box": {
                                    "fontface": 0,
                                    "fontname": "Arial",
                                    "fontsize": 12.0,
                                    "id": "obj-20",
                                    "items": [ "aeol", ",", "aeol_and_ord", ",", "aeol_ord", ",", "art_harm", ",", "art_harm_trem", ",", "backw", ",", "behind_bridge", ",", "behind_fngrbrd", ",", "behind_frog", ",", "bell", ",", "bellowshake", ",", "bisb", ",", "bisb_and_stick", ",", "blow", ",", "blow_no_reed", ",", "bottle", ",", "bottle_chord", ",", "brassy", ",", "brassy_ord", ",", "breath", ",", "buzz", ",", "buzz_ped", ",", "closed_open", ",", "cluster_and_nail_hi", ",", "cluster_and_nail_lo", ",", "cluster_and_nail_mid", ",", "cluster_hi", ",", "cluster_lo", ",", "cluster_mid", ",", "cre_dec", ",", "cresc", ",", "crush_ord", ",", "damp", ",", "dbl_gl_asc", ",", "dbl_gl_dsc", ",", "dbl_tng", ",", "dbl_trill_maj_second", ",", "dbl_trill_min_second", ",", "decr", ",", "decresc", ",", "dedillo", ",", "diff_tn", ",", "drum", ",", "dsclrd_fngr", ",", "emb_gl", ",", "explo_slap", ",", "explo_slap_unp", ",", "flatt", ",", "flatt_and_voice_uni", ",", "flatt_closed", ",", "flatt_hi_reg", ",", "flatt_no_mthpc", ",", "flatt_open", ",", "flatt_ord", ",", "flatt_stopped", ",", "gl_and_nail_asc", ",", "gl_and_nail_dsc", ",", "gl_and_ped", ",", "gl_and_stick_asc", ",", "gl_and_stick_dsc", ",", "gl_fluido_and_stick_hi", ",", "gl_fluido_and_stick_himid", ",", "gl_fluido_and_stick_lo", ",", "gl_fluido_and_stick_lomid", ",", "gl_fst", ",", "gl_mod", ",", "gl_near_board_asc", ",", "gl_near_board_dsc", ",", "gl_slw", ",", "gl_slw_asc", ",", "gl_slw_dsc", ",", "growl", ",", "harm_fngr", ",", "harm_gl_slw_asc", ",", "harm_wood", ",", "harms_gl_fst", ",", "harms_gl_mod", ",", "harms_gl_slw", ",", "hfvl_gl_fst", ",", "hfvl_gl_mod", ",", "hfvl_gl_slw", ",", "hit_body", ",", "incr_interv_leg_fst", ",", "incr_interv_leg_slw", ",", "inhl", ",", "jet_wh", ",", "key_cl", ",", "kiss", ",", "lasting_half_sec", ",", "lasting_one_sec", ",", "legno_batt", ",", "legno_tratto", ",", "lip_gl_asc_fst", ",", "lip_gl_asc_mod", ",", "lip_gl_asc_slow", ",", "lip_gl_dsc_fst", ",", "lip_gl_dsc_mod", ",", "lip_gl_dsc_slow", ",", "move_bell_down_to_up", ",", "move_bell_left_to_right", ",", "mul", ",", "nat_harm_gl_fst_asc", ",", "nat_harm_gl_fst_dsc", ",", "nat_harm_gl_mod_asc", ",", "nat_harm_gl_mod_dsc", ",", "nat_harm_gl_slw_asc", ",", "nat_harm_gl_slw_dsc", ",", "near_board", ",", "near_board_and_nail", ",", "near_pegs", ",", "nonvib", ",", "on_bridge", ",", "on_frog", ",", "on_tailpiece", ",", "on_tuning_pegs", ",", "open_closed", ",", "open_stopped", ",", "ord", ",", "ord_aeol", ",", "ord_brassy", ",", "ord_closed", ",", "ord_crush", ",", "ord_flatt", ",", "ord_hi_reg", ",", "ord_no_mthpc", ",", "ord_open", ",", "ord_pont", ",", "ord_tasto", ",", "ord_trem", ",", "pdl_tone", ",", "perc_emb", ",", "pizz", ",", "pizz_bartok", ",", "pizz_lv", ",", "pizz_sec", ",", "play_and_sing", ",", "play_and_sing_aug_forth", ",", "play_and_sing_fifth", ",", "play_and_sing_gl", ",", "play_and_sing_gl_fst", ",", "play_and_sing_gl_slw", ",", "play_and_sing_maj_seventh", ",", "play_and_sing_min_second", ",", "play_and_sing_uni", ",", "pont", ",", "pont_ord", ",", "pont_tasto", ",", "pont_trem", ",", "rasg_long", ",", "rasg_short", ",", "reg_combi", ",", "scale_chr_asc", ",", "scale_chr_dsc", ",", "scratch_and_nail", ",", "sfz", ",", "slap", ",", "slap_unp", ",", "slide", ",", "sngl_tng", ",", "speak", ",", "stacc", ",", "stopped", ",", "stopped_open", ",", "tap_and_stick", ",", "tap_body", ",", "tasto", ",", "tasto_ord", ",", "tasto_pont", ",", "tasto_trem", ",", "throat_gl_asc_fst", ",", "throat_gl_asc_mod", ",", "throat_gl_asc_slw", ",", "throat_gl_dsc_fst", ",", "throat_gl_dsc_mod", ",", "throat_gl_dsc_slw", ",", "tng_ram", ",", "trem", ",", "trem_and_fngrtip", ",", "trem_ord", ",", "trill_maj_second", ",", "trill_min_second", ",", "vib", ",", "voc_harms", ",", "voice_filt", ",", "whst_tn", ",", "whst_tn_sw_fst", ",", "whst_tn_sw_slw", ",", "xyl" ],
                                    "maxclass": "chooser",
                                    "multiselect": 1,
                                    "numinlets": 1,
                                    "numoutlets": 6,
                                    "outlettype": [ "", "", "", "", "", "" ],
                                    "parameter_enable": 0,
                                    "patching_rect": [ 572.0, 58.0, 276.0, 465.0 ]
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-1",
                                    "maxclass": "newobj",
                                    "numinlets": 2,
                                    "numoutlets": 2,
                                    "outlettype": [ "", "" ],
                                    "patching_rect": [ 310.0, 100.0, 59.0, 22.0 ],
                                    "text": "route text"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-2",
                                    "keymode": 1,
                                    "maxclass": "textedit",
                                    "numinlets": 1,
                                    "numoutlets": 4,
                                    "outlettype": [ "", "int", "", "" ],
                                    "parameter_enable": 0,
                                    "patching_rect": [ 310.0, 73.0, 59.0, 20.0 ],
                                    "text": "300"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-5",
                                    "maxclass": "message",
                                    "numinlets": 2,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 310.0, 128.0, 67.0, 22.0 ],
                                    "text": "popsize $1"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-14",
                                    "maxclass": "newobj",
                                    "numinlets": 2,
                                    "numoutlets": 2,
                                    "outlettype": [ "", "" ],
                                    "patching_rect": [ 206.0, 100.0, 59.0, 22.0 ],
                                    "text": "route text"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-15",
                                    "keymode": 1,
                                    "maxclass": "textedit",
                                    "numinlets": 1,
                                    "numoutlets": 4,
                                    "outlettype": [ "", "int", "", "" ],
                                    "parameter_enable": 0,
                                    "patching_rect": [ 206.0, 73.0, 59.0, 20.0 ],
                                    "text": "300"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-10",
                                    "maxclass": "newobj",
                                    "numinlets": 2,
                                    "numoutlets": 2,
                                    "outlettype": [ "", "" ],
                                    "patching_rect": [ 105.0, 100.0, 59.0, 22.0 ],
                                    "text": "route text"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-12",
                                    "keymode": 1,
                                    "maxclass": "textedit",
                                    "numinlets": 1,
                                    "numoutlets": 4,
                                    "outlettype": [ "", "int", "", "" ],
                                    "parameter_enable": 0,
                                    "patching_rect": [ 105.0, 73.0, 59.0, 20.0 ],
                                    "text": "8"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-8",
                                    "maxclass": "newobj",
                                    "numinlets": 2,
                                    "numoutlets": 2,
                                    "outlettype": [ "", "" ],
                                    "patching_rect": [ 21.0, 100.0, 59.0, 22.0 ],
                                    "text": "route text"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-7",
                                    "keymode": 1,
                                    "maxclass": "textedit",
                                    "numinlets": 1,
                                    "numoutlets": 4,
                                    "outlettype": [ "", "int", "", "" ],
                                    "parameter_enable": 0,
                                    "patching_rect": [ 21.0, 73.0, 59.0, 20.0 ],
                                    "text": "0.001"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-9",
                                    "maxclass": "message",
                                    "numinlets": 2,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 206.0, 128.0, 87.0, 22.0 ],
                                    "text": "maxepochs $1"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-3",
                                    "maxclass": "message",
                                    "numinlets": 2,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 105.0, 128.0, 89.0, 22.0 ],
                                    "text": "tonedivision $1"
                                }
                            },
                            {
                                "box": {
                                    "comment": "",
                                    "id": "obj-11",
                                    "index": 1,
                                    "maxclass": "outlet",
                                    "numinlets": 1,
                                    "numoutlets": 0,
                                    "patching_rect": [ 15.0, 617.0, 30.0, 30.0 ]
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-4",
                                    "maxclass": "message",
                                    "numinlets": 2,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 21.0, 128.0, 67.0, 22.0 ],
                                    "text": "sparsity $1"
                                }
                            }
                        ],
                        "lines": [
                            {
                                "patchline": {
                                    "destination": [ "obj-5", 0 ],
                                    "source": [ "obj-1", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-3", 0 ],
                                    "source": [ "obj-10", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-10", 0 ],
                                    "source": [ "obj-12", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-9", 0 ],
                                    "source": [ "obj-14", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-14", 0 ],
                                    "source": [ "obj-15", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-12", 0 ],
                                    "order": 2,
                                    "source": [ "obj-16", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-15", 0 ],
                                    "order": 1,
                                    "source": [ "obj-16", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-2", 0 ],
                                    "order": 0,
                                    "source": [ "obj-16", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-7", 0 ],
                                    "order": 3,
                                    "source": [ "obj-16", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-1", 0 ],
                                    "source": [ "obj-2", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-30", 0 ],
                                    "source": [ "obj-20", 1 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-26", 1 ],
                                    "order": 2,
                                    "source": [ "obj-21", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-49", 1 ],
                                    "order": 1,
                                    "source": [ "obj-21", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-65", 1 ],
                                    "order": 0,
                                    "source": [ "obj-21", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-26", 0 ],
                                    "source": [ "obj-22", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-20", 0 ],
                                    "source": [ "obj-25", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-37", 0 ],
                                    "source": [ "obj-26", 1 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-40", 0 ],
                                    "source": [ "obj-26", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-29", 0 ],
                                    "source": [ "obj-28", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-20", 0 ],
                                    "source": [ "obj-29", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-11", 0 ],
                                    "source": [ "obj-3", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-32", 0 ],
                                    "source": [ "obj-30", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-11", 0 ],
                                    "source": [ "obj-32", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-39", 0 ],
                                    "source": [ "obj-37", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-22", 0 ],
                                    "source": [ "obj-39", 0 ]
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
                                    "destination": [ "obj-25", 0 ],
                                    "source": [ "obj-40", 1 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-28", 0 ],
                                    "source": [ "obj-40", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-46", 0 ],
                                    "source": [ "obj-43", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-50", 0 ],
                                    "source": [ "obj-43", 1 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-48", 0 ],
                                    "source": [ "obj-44", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-44", 0 ],
                                    "source": [ "obj-45", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-47", 0 ],
                                    "source": [ "obj-46", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-51", 0 ],
                                    "source": [ "obj-47", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-49", 0 ],
                                    "source": [ "obj-48", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-43", 0 ],
                                    "source": [ "obj-49", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-45", 0 ],
                                    "source": [ "obj-49", 1 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-11", 0 ],
                                    "source": [ "obj-5", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-51", 0 ],
                                    "source": [ "obj-50", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-54", 0 ],
                                    "source": [ "obj-51", 1 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-11", 0 ],
                                    "source": [ "obj-53", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-53", 0 ],
                                    "source": [ "obj-54", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-11", 0 ],
                                    "source": [ "obj-57", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-57", 0 ],
                                    "source": [ "obj-58", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-62", 0 ],
                                    "source": [ "obj-59", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-66", 0 ],
                                    "source": [ "obj-59", 1 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-64", 0 ],
                                    "source": [ "obj-60", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-60", 0 ],
                                    "source": [ "obj-61", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-63", 0 ],
                                    "source": [ "obj-62", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-67", 0 ],
                                    "source": [ "obj-63", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-65", 0 ],
                                    "source": [ "obj-64", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-59", 0 ],
                                    "source": [ "obj-65", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-61", 0 ],
                                    "source": [ "obj-65", 1 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-67", 0 ],
                                    "source": [ "obj-66", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-58", 0 ],
                                    "source": [ "obj-67", 1 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-8", 0 ],
                                    "source": [ "obj-7", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-4", 0 ],
                                    "source": [ "obj-8", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-11", 0 ],
                                    "source": [ "obj-9", 0 ]
                                }
                            }
                        ],
                        "toolbaradditions": [ "packagemanager" ]
                    },
                    "patching_rect": [ 61.5, 328.0, 79.0, 22.0 ],
                    "text": "p parameters"
                }
            },
            {
                "box": {
                    "id": "obj-47",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 2,
                    "outlettype": [ "", "" ],
                    "patching_rect": [ 1310.9890750646591, 65.2173900604248, 31.0, 22.0 ],
                    "text": "t s s"
                }
            },
            {
                "box": {
                    "fontsize": 12.0,
                    "id": "obj-75",
                    "lastchannelcount": 0,
                    "maxclass": "live.gain~",
                    "numinlets": 2,
                    "numoutlets": 5,
                    "orientation": 1,
                    "outlettype": [ "signal", "signal", "", "float", "list" ],
                    "parameter_enable": 1,
                    "patching_rect": [ 1171.220771738461, 943.4782428741455, 136.0, 39.0 ],
                    "saved_attribute_attributes": {
                        "valueof": {
                            "parameter_initial": [ -10 ],
                            "parameter_initial_enable": 1,
                            "parameter_longname": "live.gain~[1]",
                            "parameter_mmax": 6.0,
                            "parameter_mmin": -70.0,
                            "parameter_modmode": 0,
                            "parameter_shortname": "live.gain~",
                            "parameter_type": 0,
                            "parameter_unitstyle": 4
                        }
                    },
                    "showname": 0,
                    "varname": "live.gain~[3]"
                }
            },
            {
                "box": {
                    "id": "obj-139",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1310.9890750646591, 29.347825527191162, 58.0, 22.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 880.929443, 334.0, 58.0, 22.0 ],
                    "text": "quantize"
                }
            },
            {
                "box": {
                    "id": "obj-125",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1352.1738872528076, 65.2173900604248, 55.0, 22.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 951.0, 334.0, 55.0, 22.0 ],
                    "text": "[4 4] [60]"
                }
            },
            {
                "box": {
                    "id": "obj-138",
                    "maxclass": "newobj",
                    "numinlets": 3,
                    "numoutlets": 2,
                    "outlettype": [ "", "" ],
                    "patching_rect": [ 1310.9890750646591, 100.5, 213.75, 22.0 ],
                    "saved_object_attributes": {
                        "versionnumber": 80100
                    },
                    "text": "bach.quantize"
                }
            },
            {
                "box": {
                    "bgcolor": [ 255.0, 255.0, 255.0, 1.0 ],
                    "bwcompatibility": 80100,
                    "clefs": [ "G8va", "G8va", "G8va", "G", "G", "G", "G", "G", "G", "F", "F", "F", "F", "F", "F", "F", "G", "F8vb", "F8vb", "F", "F", "F", "G", "F", "G", "G", "G", "G", "G", "G8va", "G", "G", "G8va", "G", "G", "G", "G8va", "G", "G", "G", "Alto", "Alto", "Alto", "G", "Alto", "Alto", "Alto", "G", "F", "F", "G", "F", "F", "F", "F8vb", "F8vb" ],
                    "defaultnoteslots": [ "null" ],
                    "enharmonictable": [ "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default" ],
                    "fontface": 0,
                    "fontname": "Arial",
                    "fontsize": 12.0,
                    "hidevoices": [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                    "id": "obj-152",
                    "keys": [ "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C" ],
                    "loop": [ "[", 1, 1, 0, "]", "[", 1, 1, "1/4", "]" ],
                    "maxclass": "bach.score",
                    "midichannels": [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56 ],
                    "numinlets": 7,
                    "numoutlets": 9,
                    "numparts": [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                    "numvoices": 56,
                    "out": "nnnnnnnn",
                    "outlettype": [ "", "", "", "", "", "", "", "", "bang" ],
                    "patching_rect": [ 1310.8695402145386, 135.869562625885, 538.0434679985046, 746.739116191864 ],
                    "pitcheditrange": [ "null" ],
                    "presentation": 1,
                    "presentation_rect": [ 830.0, 333.583344, 762.0, 970.833374 ],
                    "ruler": 1,
                    "showmeasurenumbers": [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                    "stafflines": [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5 ],
                    "textcolor": [ 0.0, 0.0, 0.0, 1.0 ],
                    "tonedivision": 8,
                    "versionnumber": 80300,
                    "voicenames": [ "Fl", "Fl", "Fl", "Ob", "Ob", "Ob", "ClBb", "ClBb", "ClBb", "Bn", "Bn", "Bn", "Hn", "Hn", "Hn", "Hn", "Tp", "Tp", "Tp", "Tbn", "Tbn", "Tbn", "BTb|BTb+S", "Hp", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Va", "Va", "Va", "Va", "Va", "Va", "Va", "Va", "Vc", "Vc", "Vc", "Vc", "Vc", "Vc", "Cb", "Cb" ],
                    "voicespacing": [ 0.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0 ],
                    "vzoom": 80.0,
                    "whole_score_data_0000000000": [ "score", "[", "slotinfo", "[", 1, "[", "name", "velocity envelope", "]", "[", "type", "function", "]", "[", "key", 0, "]", "[", "range", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1080016896, "]", "[", "slope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "representation", "]", "[", "grid", "]", "[", "ysnap", "]", "[", "domain", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1072693248, "]", "[", "domainslope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "temporalmode", "relative", "]", "[", "extend", 0, "]", "[", "width", "auto", "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 0, "]", "[", "access", "readandwrite", "]", "]", "[", 2, "[", "name", "slot function", "]", "[", "type", "function", "]", "[", "key", 0, "]", "[", "range", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1072693248, "]", "[", "slope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "representation", "]", "[", "grid", "]", "[", "ysnap", "]", "[", "domain", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1072693248, "]", "[", "domainslope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "temporalmode", "relative", "]", "[", "extend", 0, "]", "[", "width", "auto", "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 0, "]", "[", "access", "readandwrite", "]", "]", "[", 3, "[", "name", "slot intlist", "]", "[", "type", "intlist", "]", "[", "key", 0, "]", "[", "range", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1080016896, "]", "[", "slope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "representation", "]", "[", "default", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1078984704, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 4, "[", "name", "slot floatlist", "]", "[", "type", "floatlist", "]", "[", "key", 0, "]", "[", "range", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1072693248, "]", "[", "slope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "representation", "]", "[", "default", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 5, "[", "name", "slot int", "]", "[", "type", "int", "]", "[", "key", 0, "]", "[", "range", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1080016896, "]", "[", "slope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "representation", "]", "[", "default", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1078984704, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 6, "[", "name", "slot float", "]", "[", "type", "float", "]", "[", "key", 0, "]", "[", "range", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1072693248, "]", "[", "slope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "representation", "]", "[", "default", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 7, "[", "name", "detune", "]", "[", "type", "int", "]", "[", "key", 0, "]", "[", "range", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 3227058176, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "slope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "representation", "mc", "]", "[", "default", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 0, "]", "[", "access", "readandwrite", "]", "]", "[", 8, "[", "name", "relpath", "]", "[", "type", "text", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1080213504, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 9, "[", "name", "abspath", "]", "[", "type", "text", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1080213504, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 0, "]", "[", "access", "readandwrite", "]", "]", "[", 10, "[", "name", "slot llll", "]", "[", "type", "llll", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 0, "]", "[", "access", "readandwrite", "]", "]", "[", 11, "[", "name", "slot 11", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 12, "[", "name", "slot 12", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 13, "[", "name", "slot 13", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 14, "[", "name", "slot 14", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 15, "[", "name", "slot 15", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 16, "[", "name", "slot 16", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 17, "[", "name", "slot 17", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 18, "[", "name", "slot 18", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 19, "[", "name", "slot 19", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 20, "[", "name", "dynamics", "]", "[", "type", "dynamics", "]", "[", "key", "d", "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079738368, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 0, "]", "[", "access", "readandwrite", "]", "]", "[", 21, "[", "name", "lyrics", "]", "[", "type", "text", "]", "[", "key", "l", "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 0, "]", "[", "access", "readandwrite", "]", "]", "[", 22, "[", "name", "articulations", "]", "[", "type", "articulations", "]", "[", "key", "a", "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079738368, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 23, "[", "name", "notehead", "]", "[", "type", "notehead", "]", "[", "key", "h", "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079738368, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 24, "[", "name", "annotation", "]", "[", "type", "text", "]", "[", "key", "t", "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 25, "[", "name", "slot 25", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 26, "[", "name", "slot 26", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 27, "[", "name", "slot 27", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 28, "[", "name", "slot 28", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 29, "[", "name", "slot 29", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "[", 30, "[", "name", "slot 30", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "singleslotfortiednotes", 1, "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "]", "]", "[", "commands", "[", 1, "[", "name", "command", "]", "[", "note", "note", "]", "[", "chord", "chord", "]", "[", "rest", "rest", "]", "[", "marker", "marker", "]", "[", "start", "none", "]", "[", "end", "none", "]", "[", "key", 0, "]", "]", "[", 2, "[", "name", "command", "]", "[", "note", "note", "]", "[", "chord", "chord", "]", "[", "rest", "rest", "]", "[", "marker", "marker", "]", "[", "start", "none", "]", "[", "end", "none", "]", "[", "key", 0, "]", "]", "[", 3, "[", "name", "command", "]", "[", "note", "note", "]", "[", "chord", "chord", "]", "[", "rest", "rest", "]", "[", "marker", "marker", "]", "[", "start", "none", "]", "[", "end", "none", "]", "[", "key", 0, "]", "]", "[", 4, "[", "name", "command", "]", "[", "note", "note", "]", "[", "chord", "chord", "]", "[", "rest", "rest", "]", "[", "marker", "marker", "]", "[", "start", "none", "]", "[", "end", "none", "]", "[", "key", 0, "]", "]", "[", 5, "[", "name", "command", "]", "[", "note", "note", "]", "[", "chord", "chord", "]", "[", "rest", "rest", "]", "[", "marker", "marker", "]", "[", "start", "none", "]", "[", "end", "none", "]", "[", "key", 0, "]", "]", "]", "[", "markers", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "seg1.sol1", "none", "]", "]", "[", "midichannels", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, "]", "[", "articulationinfo", "]", "[", "noteheadinfo", "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 1, "[", "slots", "[", 7, 25, "]", "[", 8, "/Winds/Flute/crescendo/Fl-cresc-B5-ppff-N-R200u.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Winds/Flute/crescendo/Fl-cresc-B5-ppff-N-R200u.wav", "]", "[", 20, "[", "auto", "ppff", "=", "]", "]", "[", 24, "cresc", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 0, "[", "slots", "[", 8, "/Winds/Flute/crescendo/Fl-cresc-B5-ppff-N-R200u.wav", "]", "[", 24, "cresc", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 1, "[", "slots", "[", 7, 25, "]", "[", 8, "/Winds/Flute/aeolian_and_ordinario/Fl-aeol_and_ord-B5-ff-N-T27d.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Winds/Flute/aeolian_and_ordinario/Fl-aeol_and_ord-B5-ff-N-T27d.wav", "]", "[", 20, "[", "auto", "ff", "=", "]", "]", "[", 24, "aeol_and_ord", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 0, "[", "slots", "[", 8, "/Winds/Flute/aeolian_and_ordinario/Fl-aeol_and_ord-B5-ff-N-T27d.wav", "]", "[", 24, "aeol_and_ord", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 1, "[", "slots", "[", 7, 25, "]", "[", 8, "/Winds/Flute/aeolian_and_ordinario/Fl-aeol_and_ord-B5-ff-N-T27d.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Winds/Flute/aeolian_and_ordinario/Fl-aeol_and_ord-B5-ff-N-T27d.wav", "]", "[", 20, "[", "auto", "ff", "=", "]", "]", "[", 24, "aeol_and_ord", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 0, "[", "slots", "[", 8, "/Winds/Flute/aeolian_and_ordinario/Fl-aeol_and_ord-B5-ff-N-T27d.wav", "]", "[", 24, "aeol_and_ord", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 1, "[", "slots", "[", 7, 25, "]", "[", 8, "/Winds/Oboe/sforzato/Ob-sfz-B5-fp-N-R100d.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Winds/Oboe/sforzato/Ob-sfz-B5-fp-N-R100d.wav", "]", "[", 20, "[", "auto", "fp", "=", "]", "]", "[", 24, "sfz", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 0, "[", "slots", "[", 8, "/Winds/Oboe/sforzato/Ob-sfz-B5-fp-N-R100d.wav", "]", "[", 24, "sfz", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 1, "[", "slots", "[", 7, 25, "]", "[", 8, "/Winds/Oboe/multiphonics/Ob-mul-B5_Bq3_D#6_G#5-f-N-N.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Winds/Oboe/multiphonics/Ob-mul-B5_Bq3_D#6_G#5-f-N-N.wav", "]", "[", 20, "[", "auto", "f", "=", "]", "]", "[", 24, "mul", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 0, "[", "slots", "[", 8, "/Winds/Oboe/multiphonics/Ob-mul-B5_Bq3_D#6_G#5-f-N-N.wav", "]", "[", 24, "mul", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 1, "[", "slots", "[", 7, 25, "]", "[", 8, "/Winds/Oboe/note_lasting/Ob-lasting_half_sec-B5-mf-N-R100d.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Winds/Oboe/note_lasting/Ob-lasting_half_sec-B5-mf-N-R100d.wav", "]", "[", 20, "[", "auto", "mf", "=", "]", "]", "[", 24, "lasting_half_sec", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 0, "[", "slots", "[", 8, "/Winds/Oboe/note_lasting/Ob-lasting_half_sec-B5-mf-N-R100d.wav", "]", "[", 24, "lasting_half_sec", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086224384, 100, 1, "[", "slots", "[", 7, 0, "]", "[", 8, "/Winds/Clarinet_Bb/glissando/ClBb-gl_slw-F#5_Fq5-mf-N-N.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Winds/Clarinet_Bb/glissando/ClBb-gl_slw-F#5_Fq5-mf-N-N.wav", "]", "[", 20, "[", "auto", "mf", "=", "]", "]", "[", 24, "gl_slw", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086224384, 100, 0, "[", "slots", "[", 8, "/Winds/Clarinet_Bb/glissando/ClBb-gl_slw-F#5_Fq5-mf-N-N.wav", "]", "[", 24, "gl_slw", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086224384, 100, 1, "[", "slots", "[", 7, 0, "]", "[", 8, "/Winds/Clarinet_Bb/note_lasting/ClBb-lasting_half_sec-F#5-mf-N-R100d.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Winds/Clarinet_Bb/note_lasting/ClBb-lasting_half_sec-F#5-mf-N-R100d.wav", "]", "[", 20, "[", "auto", "mf", "=", "]", "]", "[", 24, "lasting_half_sec", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086224384, 100, 0, "[", "slots", "[", 8, "/Winds/Clarinet_Bb/note_lasting/ClBb-lasting_half_sec-F#5-mf-N-R100d.wav", "]", "[", 24, "lasting_half_sec", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1085769984, 100, 1, "[", "slots", "[", 7, 25, "]", "[", 8, "/Winds/Bassoon/ordinario/Bn-ord-C4-mf-N-N.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Winds/Bassoon/ordinario/Bn-ord-C4-mf-N-N.wav", "]", "[", 20, "[", "auto", "mf", "=", "]", "]", "[", 24, "ord", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1085769984, 100, 0, "[", "slots", "[", 8, "/Winds/Bassoon/ordinario/Bn-ord-C4-mf-N-N.wav", "]", "[", 24, "ord", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086224384, 100, 1, "[", "slots", "[", 7, 0, "]", "[", 8, "/Strings/Violin/non_vibrato/Vn-nonvib-F#5-ff-2c-N.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Strings/Violin/non_vibrato/Vn-nonvib-F#5-ff-2c-N.wav", "]", "[", 20, "[", "auto", "ff", "=", "]", "]", "[", 24, "nonvib", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086224384, 100, 0, "[", "slots", "[", 8, "/Strings/Violin/non_vibrato/Vn-nonvib-F#5-ff-2c-N.wav", "]", "[", 24, "nonvib", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1085769984, 100, 1, "[", "slots", "[", 7, 25, "]", "[", 8, "/Strings/Violin/non_vibrato/Vn-nonvib-C4-mf-4c-N.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Strings/Violin/non_vibrato/Vn-nonvib-C4-mf-4c-N.wav", "]", "[", 20, "[", "auto", "mf", "=", "]", "]", "[", 24, "nonvib", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1085769984, 100, 0, "[", "slots", "[", 8, "/Strings/Violin/non_vibrato/Vn-nonvib-C4-mf-4c-N.wav", "]", "[", 24, "nonvib", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 1, "[", "slots", "[", 7, 25, "]", "[", 8, "/Strings/Violin/staccato/Vn-stacc-B5-mf-1c-T15d_R100d.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Strings/Violin/staccato/Vn-stacc-B5-mf-1c-T15d_R100d.wav", "]", "[", 20, "[", "auto", "mf", "=", "]", "]", "[", 24, "stacc", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 0, "[", "slots", "[", 8, "/Strings/Violin/staccato/Vn-stacc-B5-mf-1c-T15d_R100d.wav", "]", "[", 24, "stacc", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086224384, 100, 1, "[", "slots", "[", 7, 0, "]", "[", 8, "/Strings/Violin/pizzicato_l_vib/Vn-pizz_lv-F#5-ff-3c-N.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Strings/Violin/pizzicato_l_vib/Vn-pizz_lv-F#5-ff-3c-N.wav", "]", "[", 20, "[", "auto", "ff", "=", "]", "]", "[", 24, "pizz_lv", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086224384, 100, 0, "[", "slots", "[", 8, "/Strings/Violin/pizzicato_l_vib/Vn-pizz_lv-F#5-ff-3c-N.wav", "]", "[", 24, "pizz_lv", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 1, "[", "slots", "[", 7, 25, "]", "[", 8, "/Strings/Violin/ordinario/Vn-ord-B5-mf-2c-N.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Strings/Violin/ordinario/Vn-ord-B5-mf-2c-N.wav", "]", "[", 20, "[", "auto", "mf", "=", "]", "]", "[", 24, "ord", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 0, "[", "slots", "[", 8, "/Strings/Violin/ordinario/Vn-ord-B5-mf-2c-N.wav", "]", "[", 24, "ord", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086224384, 100, 1, "[", "slots", "[", 7, 0, "]", "[", 8, "/Strings/Violin/ordinario_to_sul_ponticello/Vn-ord_pont-F#5-mf-2c-R100u.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Strings/Violin/ordinario_to_sul_ponticello/Vn-ord_pont-F#5-mf-2c-R100u.wav", "]", "[", 20, "[", "auto", "mf", "=", "]", "]", "[", 24, "ord_pont", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086224384, 100, 0, "[", "slots", "[", 8, "/Strings/Violin/ordinario_to_sul_ponticello/Vn-ord_pont-F#5-mf-2c-R100u.wav", "]", "[", 24, "ord_pont", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086224384, 100, 1, "[", "slots", "[", 7, 0, "]", "[", 8, "/Strings/Violin/sforzato/Vn-sfz-F#5-fp-1c-R100u.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Strings/Violin/sforzato/Vn-sfz-F#5-fp-1c-R100u.wav", "]", "[", 20, "[", "auto", "fp", "=", "]", "]", "[", 24, "sfz", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086224384, 100, 0, "[", "slots", "[", 8, "/Strings/Violin/sforzato/Vn-sfz-F#5-fp-1c-R100u.wav", "]", "[", 24, "sfz", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 1, "[", "slots", "[", 7, 25, "]", "[", 8, "/Strings/Violin/pizzicato_l_vib/Vn-pizz_lv-B5-ff-1c-N.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Strings/Violin/pizzicato_l_vib/Vn-pizz_lv-B5-ff-1c-N.wav", "]", "[", 20, "[", "auto", "ff", "=", "]", "]", "[", 24, "pizz_lv", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 0, "[", "slots", "[", 8, "/Strings/Violin/pizzicato_l_vib/Vn-pizz_lv-B5-ff-1c-N.wav", "]", "[", 24, "pizz_lv", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1085769984, 100, 1, "[", "slots", "[", 7, 25, "]", "[", 8, "/Strings/Viola/sul_ponticello_tremolo/Va-pont_trem-C4-mf-3c-N.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Strings/Viola/sul_ponticello_tremolo/Va-pont_trem-C4-mf-3c-N.wav", "]", "[", 20, "[", "auto", "mf", "=", "]", "]", "[", 24, "pont_trem", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1085769984, 100, 0, "[", "slots", "[", 8, "/Strings/Viola/sul_ponticello_tremolo/Va-pont_trem-C4-mf-3c-N.wav", "]", "[", 24, "pont_trem", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 1, "[", "slots", "[", 7, 25, "]", "[", 8, "/Strings/Viola/pizzicato_bartok/Va-pizz_bartok-B5-ff-1c-N.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Strings/Viola/pizzicato_bartok/Va-pizz_bartok-B5-ff-1c-N.wav", "]", "[", 20, "[", "auto", "ff", "=", "]", "]", "[", 24, "pizz_bartok", "]" ],
                    "whole_score_data_0000000001": [ "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 0, "[", "slots", "[", 8, "/Strings/Viola/pizzicato_bartok/Va-pizz_bartok-B5-ff-1c-N.wav", "]", "[", 24, "pizz_bartok", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1085769984, 100, 1, "[", "slots", "[", 7, 25, "]", "[", 8, "/Strings/Viola/pizzicato_l_vib/Va-pizz_lv-C4-mf-4c-N.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Strings/Viola/pizzicato_l_vib/Va-pizz_lv-C4-mf-4c-N.wav", "]", "[", 20, "[", "auto", "mf", "=", "]", "]", "[", 24, "pizz_lv", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1085769984, 100, 0, "[", "slots", "[", 8, "/Strings/Viola/pizzicato_l_vib/Va-pizz_lv-C4-mf-4c-N.wav", "]", "[", 24, "pizz_lv", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1085769984, 100, 1, "[", "slots", "[", 7, 25, "]", "[", 8, "/Strings/Viola/col_legno_battuto/Va-legno_batt-C4-mf-4c-N.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Strings/Viola/col_legno_battuto/Va-legno_batt-C4-mf-4c-N.wav", "]", "[", 20, "[", "auto", "mf", "=", "]", "]", "[", 24, "legno_batt", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1085769984, 100, 0, "[", "slots", "[", 8, "/Strings/Viola/col_legno_battuto/Va-legno_batt-C4-mf-4c-N.wav", "]", "[", 24, "legno_batt", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 1, "[", "slots", "[", 7, 25, "]", "[", 8, "/Strings/Viola/artificial_harmonic_tremolo/Va-art_harm_trem-B5-mf-3c-N.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Strings/Viola/artificial_harmonic_tremolo/Va-art_harm_trem-B5-mf-3c-N.wav", "]", "[", 20, "[", "auto", "mf", "=", "]", "]", "[", 24, "art_harm_trem", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 0, "[", "slots", "[", 8, "/Strings/Viola/artificial_harmonic_tremolo/Va-art_harm_trem-B5-mf-3c-N.wav", "]", "[", 24, "art_harm_trem", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1085769984, 100, 1, "[", "slots", "[", 7, 25, "]", "[", 8, "/Strings/Violoncello/pizzicato_bartok/Vc-pizz_bartok-C4-ff-1c-N.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Strings/Violoncello/pizzicato_bartok/Vc-pizz_bartok-C4-ff-1c-N.wav", "]", "[", 20, "[", "auto", "ff", "=", "]", "]", "[", 24, "pizz_bartok", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1085769984, 100, 0, "[", "slots", "[", 8, "/Strings/Violoncello/pizzicato_bartok/Vc-pizz_bartok-C4-ff-1c-N.wav", "]", "[", 24, "pizz_bartok", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 1, "[", "slots", "[", 7, 25, "]", "[", 8, "/Strings/Violoncello/non_vibrato/Vc-nonvib-B5-mf-1c-N.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Strings/Violoncello/non_vibrato/Vc-nonvib-B5-mf-1c-N.wav", "]", "[", 20, "[", "auto", "mf", "=", "]", "]", "[", 24, "nonvib", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1086341760, 100, 0, "[", "slots", "[", 8, "/Strings/Violoncello/non_vibrato/Vc-nonvib-B5-mf-1c-N.wav", "]", "[", 24, "nonvib", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", "leveltype", 1, "]", "[", "1/2", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1085769984, 100, 1, "[", "slots", "[", 7, 25, "]", "[", 8, "/Strings/Violoncello/non_vibrato/Vc-nonvib-C4-ff-3c-N.wav", "]", "[", 9, "/Users/kureta/Documents/Max 9/Packages/orchidea/db/FullSOL2020/Strings/Violoncello/non_vibrato/Vc-nonvib-C4-ff-3c-N.wav", "]", "[", 20, "[", "auto", "ff", "=", "]", "]", "[", 24, "nonvib", "]", "]", 0, "]", 0, "]", "[", "[", "leveltype", 18, "]", "[", "1/3", "[", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1085769984, 100, 0, "[", "slots", "[", 8, "/Strings/Violoncello/non_vibrato/Vc-nonvib-C4-ff-3c-N.wav", "]", "[", 24, "nonvib", "]", "]", 0, "]", 0, "]", "[", "-1/6", 0, "]", "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]", "[", "[", "[", "[", 4, 4, "]", "[", "[", "1/4", 60, "]", "]", "]", "[", -1, 0, "]", 0, "]", 0, "]" ],
                    "whole_score_data_count": [ 2 ]
                }
            },
            {
                "box": {
                    "id": "obj-156",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1416.3043208122253, 65.2173900604248, 65.0, 22.0 ],
                    "presentation": 1,
                    "presentation_rect": [ 978.0, 289.0, 65.0, 22.0 ],
                    "text": "exportxml"
                }
            },
            {
                "box": {
                    "id": "obj-4",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "bang" ],
                    "patching_rect": [ 221.42682766914368, 333.0, 58.0, 22.0 ],
                    "text": "loadbang"
                }
            },
            {
                "box": {
                    "id": "obj-15",
                    "maxclass": "button",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "bang" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 185.0, 396.33334517478943, 24.0, 24.0 ]
                }
            },
            {
                "box": {
                    "fontname": "Arial",
                    "fontsize": 13.0,
                    "id": "obj-54",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "bang" ],
                    "patching_rect": [ 501.1282284259796, 635.1648662090302, 67.0, 23.0 ],
                    "text": "loadbang"
                }
            },
            {
                "box": {
                    "fontname": "Arial",
                    "fontsize": 13.0,
                    "id": "obj-53",
                    "maxclass": "message",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 450.5787754058838, 669.2308019399643, 272.0, 23.0 ],
                    "text": "set orchideatargetsound_orchidea.connection"
                }
            },
            {
                "box": {
                    "bgcolor": [ 0.501961, 0.717647, 0.764706, 1.0 ],
                    "buffername": "orchideatargetsound_orchidea.connection",
                    "gridcolor": [ 0.352941, 0.337255, 0.521569, 1.0 ],
                    "id": "obj-52",
                    "maxclass": "waveform~",
                    "numinlets": 5,
                    "numoutlets": 6,
                    "outlettype": [ "float", "float", "float", "float", "list", "" ],
                    "patching_rect": [ 450.5787754058838, 702.1978365182877, 246.0, 59.0 ],
                    "selectioncolor": [ 0.313726, 0.498039, 0.807843, 0.0 ],
                    "setunit": 1,
                    "waveformcolor": [ 0.082353, 0.25098, 0.431373, 1.0 ]
                }
            },
            {
                "box": {
                    "attr": "popsize",
                    "id": "obj-48",
                    "maxclass": "attrui",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 396.5, 309.0, 150.0, 22.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-10",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 0,
                    "patching_rect": [ 85.0, 76.0, 32.0, 22.0 ],
                    "text": "print"
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
                    "patching_rect": [ 62.66666853427887, 574.7253028154373, 315.0, 22.0 ],
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
                    "patching_rect": [ 62.66666853427887, 545.0549716949463, 315.0, 22.0 ],
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
                    "patching_rect": [ 545.0842745304108, 553.8461809158325, 159.78050088882446, 22.0 ],
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
                    "id": "obj-97",
                    "maxclass": "ezdac~",
                    "numinlets": 2,
                    "numoutlets": 0,
                    "patching_rect": [ 1171.220771738461, 1004.347806930542, 45.0, 45.0 ]
                }
            },
            {
                "box": {
                    "id": "obj-91",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 2,
                    "outlettype": [ "signal", "signal" ],
                    "patching_rect": [ 1172.3077282394681, 901.0869393348694, 135.0, 22.0 ],
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
                    "id": "obj-120",
                    "maxclass": "newobj",
                    "numinlets": 1,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 1120.6521525382996, 76.0, 96.0, 22.0 ],
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
                    "patching_rect": [ 33.0, 36.0, 136.0, 26.0 ],
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
                    "patching_rect": [ 62.66666853427887, 364.6341550350189, 136.0, 26.0 ],
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
                    "clefs": [ "G8va", "G8va", "G8va", "G", "G", "G", "G", "G", "G", "F", "F", "F", "F", "F", "F", "F", "G", "F8vb", "F8vb", "F", "F", "F", "G", "F", "G", "G", "G", "G", "G", "G8va", "G", "G", "G8va", "G", "G", "G", "G8va", "G", "G", "G", "Alto", "Alto", "Alto", "G", "Alto", "Alto", "Alto", "G", "F", "F", "G", "F", "F", "F", "F8vb", "F8vb" ],
                    "defaultnoteslots": [ "null" ],
                    "enharmonictable": [ "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default", "default" ],
                    "fontface": 0,
                    "fontname": "Arial",
                    "fontsize": 12.0,
                    "hidevoices": [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                    "id": "obj-106",
                    "keys": [ "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C", "C" ],
                    "loop": [ 0.0, 1000.0 ],
                    "maxclass": "bach.roll",
                    "midichannels": [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56 ],
                    "numinlets": 6,
                    "numoutlets": 8,
                    "numparts": [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
                    "numvoices": 56,
                    "out": "nnnnnnn",
                    "outlettype": [ "", "", "", "", "", "", "", "bang" ],
                    "patching_rect": [ 734.7825946807861, 140.21738862991333, 529.347815990448, 742.3912901878357 ],
                    "pitcheditrange": [ "null" ],
                    "stafflines": [ 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5 ],
                    "textcolor": [ 0.0, 0.0, 0.0, 1.0 ],
                    "tonedivision": 8,
                    "versionnumber": 80300,
                    "voicenames": [ "Fl", "Fl", "Fl", "Ob", "Ob", "Ob", "ClBb", "ClBb", "ClBb", "Bn", "Bn", "Bn", "Hn", "Hn", "Hn", "Hn", "Tp", "Tp", "Tp", "Tbn", "Tbn", "Tbn", "BTb|BTb+S", "Hp", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Vn", "Va", "Va", "Va", "Va", "Va", "Va", "Va", "Va", "Vc", "Vc", "Vc", "Vc", "Vc", "Vc", "Cb", "Cb" ],
                    "voicespacing": [ 0.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0, 17.0 ],
                    "vzoom": 80.0,
                    "whole_roll_data_0000000000": [ "roll", "[", "slotinfo", "[", 1, "[", "name", "velocity envelope", "]", "[", "type", "function", "]", "[", "key", 0, "]", "[", "range", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1080016896, "]", "[", "slope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "representation", "]", "[", "grid", "]", "[", "ysnap", "]", "[", "domain", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1072693248, "]", "[", "domainslope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "temporalmode", "relative", "]", "[", "extend", 0, "]", "[", "width", "auto", "]", "[", "height", "auto", "]", "[", "copywhensplit", 0, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 2, "[", "name", "slot function", "]", "[", "type", "function", "]", "[", "key", 0, "]", "[", "range", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1072693248, "]", "[", "slope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "representation", "]", "[", "grid", "]", "[", "ysnap", "]", "[", "domain", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1072693248, "]", "[", "domainslope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "temporalmode", "relative", "]", "[", "extend", 0, "]", "[", "width", "auto", "]", "[", "height", "auto", "]", "[", "copywhensplit", 0, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 3, "[", "name", "slot intlist", "]", "[", "type", "intlist", "]", "[", "key", 0, "]", "[", "range", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1080016896, "]", "[", "slope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "representation", "]", "[", "default", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1078984704, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 4, "[", "name", "slot floatlist", "]", "[", "type", "floatlist", "]", "[", "key", 0, "]", "[", "range", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1072693248, "]", "[", "slope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "representation", "]", "[", "default", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 5, "[", "name", "slot int", "]", "[", "type", "int", "]", "[", "key", 0, "]", "[", "range", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1080016896, "]", "[", "slope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "representation", "]", "[", "default", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1078984704, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 6, "[", "name", "slot float", "]", "[", "type", "float", "]", "[", "key", 0, "]", "[", "range", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1072693248, "]", "[", "slope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "representation", "]", "[", "default", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 7, "[", "name", "detune", "]", "[", "type", "int", "]", "[", "key", 0, "]", "[", "range", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 3227058176, "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "slope", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "representation", "mc", "]", "[", "default", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 0, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 8, "[", "name", "relpath", "]", "[", "type", "text", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1080213504, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 9, "[", "name", "abspath", "]", "[", "type", "text", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1080213504, "]", "[", "height", "auto", "]", "[", "copywhensplit", 0, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 10, "[", "name", "slot llll", "]", "[", "type", "llll", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 0, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 11, "[", "name", "slot 11", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 12, "[", "name", "slot 12", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 13, "[", "name", "slot 13", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 14, "[", "name", "slot 14", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 15, "[", "name", "slot 15", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 16, "[", "name", "slot 16", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 17, "[", "name", "slot 17", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 18, "[", "name", "slot 18", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 19, "[", "name", "slot 19", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 20, "[", "name", "dynamics", "]", "[", "type", "dynamics", "]", "[", "key", "d", "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079738368, "]", "[", "height", "auto", "]", "[", "copywhensplit", 0, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 21, "[", "name", "lyrics", "]", "[", "type", "text", "]", "[", "key", "l", "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 0, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 22, "[", "name", "articulations", "]", "[", "type", "articulations", "]", "[", "key", "a", "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079738368, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 23, "[", "name", "notehead", "]", "[", "type", "notehead", "]", "[", "key", "h", "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079738368, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 24, "[", "name", "annotation", "]", "[", "type", "text", "]", "[", "key", "t", "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 25, "[", "name", "slot 25", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 26, "[", "name", "slot 26", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 27, "[", "name", "slot 27", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 28, "[", "name", "slot 28", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 29, "[", "name", "slot 29", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "[", 30, "[", "name", "slot 30", "]", "[", "type", "none", "]", "[", "key", 0, "]", "[", "temporalmode", "none", "]", "[", "extend", 0, "]", "[", "width", "_x_x_x_x_bach_float64_x_x_x_x_", 0, 1079574528, "]", "[", "height", "auto", "]", "[", "copywhensplit", 1, "]", "[", "access", "readandwrite", "]", "[", "follownotehead", 0, "]", "]", "]", "[", "commands", "[", 1, "[", "name", "command", "]", "[", "note", "note", "]", "[", "chord", "chord", "]", "[", "rest", "rest", "]", "[", "marker", "marker", "]", "[", "start", "none", "]", "[", "end", "none", "]", "[", "key", 0, "]", "]", "[", 2, "[", "name", "command", "]", "[", "note", "note", "]", "[", "chord", "chord", "]", "[", "rest", "rest", "]", "[", "marker", "marker", "]", "[", "start", "none", "]", "[", "end", "none", "]", "[", "key", 0, "]", "]", "[", 3, "[", "name", "command", "]", "[", "note", "note", "]", "[", "chord", "chord", "]", "[", "rest", "rest", "]", "[", "marker", "marker", "]", "[", "start", "none", "]", "[", "end", "none", "]", "[", "key", 0, "]", "]", "[", 4, "[", "name", "command", "]", "[", "note", "note", "]", "[", "chord", "chord", "]", "[", "rest", "rest", "]", "[", "marker", "marker", "]", "[", "start", "none", "]", "[", "end", "none", "]", "[", "key", 0, "]", "]", "[", 5, "[", "name", "command", "]", "[", "note", "note", "]", "[", "chord", "chord", "]", "[", "rest", "rest", "]", "[", "marker", "marker", "]", "[", "start", "none", "]", "[", "end", "none", "]", "[", "key", 0, "]", "]", "]", "[", "groups", "]", "[", "markers", "]", "[", "midichannels", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, "]", "[", "articulationinfo", "]", "[", "noteheadinfo", "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]", "[", 0, "]" ],
                    "whole_roll_data_count": [ 1 ],
                    "zoom": 91.8203125
                }
            },
            {
                "box": {
                    "id": "obj-98",
                    "maxclass": "newobj",
                    "numinlets": 2,
                    "numoutlets": 1,
                    "outlettype": [ "" ],
                    "patching_rect": [ 735.164871096611, 76.0, 377.0, 22.0 ],
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
                    "patching_rect": [ 267.0622829198837, 603.2967327833176, 35.0, 22.0 ],
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
                    "patching_rect": [ 171.4285798072815, 753.8461906909943, 44.0, 44.0 ],
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
                    "patching_rect": [ 221.42682766914368, 702.1978365182877, 200.0, 20.0 ],
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
                    "patching_rect": [ 227.5018414258957, 603.2967327833176, 32.0, 22.0 ],
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
                    "patching_rect": [ 227.5018414258957, 636.2637673616409, 264.0, 22.0 ],
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
                    "patching_rect": [ 62.66666853427887, 397.33334517478943, 118.0, 22.0 ],
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
                    "patching_rect": [ 28.0, 143.33333760499954, 246.0, 59.0 ],
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
                    "patching_rect": [ 28.0, 76.0, 48.0, 22.0 ],
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
                    "patching_rect": [ 28.0, 114.00000339746475, 159.0, 22.0 ],
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
                    "patching_rect": [ 373.0, 100.5, 188.0, 22.0 ],
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
                    "patching_rect": [ 221.42682766914368, 441.3043394088745, 59.0, 22.0 ],
                    "text": "route text"
                }
            },
            {
                "box": {
                    "id": "obj-7",
                    "linecount": 4,
                    "maxclass": "textedit",
                    "numinlets": 1,
                    "numoutlets": 4,
                    "outlettype": [ "", "int", "", "" ],
                    "parameter_enable": 0,
                    "patching_rect": [ 221.73912620544434, 370.6521668434143, 286.95651626586914, 62.32345271110535 ],
                    "presentation": 1,
                    "presentation_linecount": 4,
                    "presentation_rect": [ 212.19512701034546, 373.17074060440063, 300.80487298965454, 69.5121967792511 ],
                    "text": "Fl Fl Fl Ob Ob Ob ClBb ClBb ClBb Bn Bn Bn Hn Hn Hn Hn Tp Tp Tp Tbn Tbn Tbn BTb|BTb+S Hp Vn Vn Vn Vn Vn Vn Vn Vn Vn Vn Vn Vn Vn Vn Vn Vn Va Va Va Va Va Va Va Va Vc Vc Vc Vc Vc Vc Cb Cb"
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
                    "patching_rect": [ 409.0, 37.0, 24.0, 24.0 ]
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
                        "rect": [ 134.0, 142.0, 991.0, 780.0 ],
                        "boxes": [
                            {
                                "box": {
                                    "id": "obj-16",
                                    "maxclass": "message",
                                    "numinlets": 2,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 29.0, 294.0, 189.0, 22.0 ],
                                    "text": "symbol FullSOL2020.spectrum.db"
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-6",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 3,
                                    "outlettype": [ "bang", "", "" ],
                                    "patching_rect": [ 83.0, 230.0, 41.0, 22.0 ],
                                    "text": "t b s s"
                                }
                            },
                            {
                                "box": {
                                    "comment": "",
                                    "id": "obj-5",
                                    "index": 1,
                                    "maxclass": "outlet",
                                    "numinlets": 1,
                                    "numoutlets": 0,
                                    "patching_rect": [ 203.33333998918533, 368.0, 30.0, 30.0 ]
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
                                    "patching_rect": [ 264.0, 57.0, 30.0, 30.0 ]
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-2",
                                    "maxclass": "newobj",
                                    "numinlets": 1,
                                    "numoutlets": 1,
                                    "outlettype": [ "bang" ],
                                    "patching_rect": [ 189.33333998918533, 57.0, 58.0, 22.0 ],
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
                                    "patching_rect": [ 290.0, 294.0, 85.0, 22.0 ],
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
                                    "patching_rect": [ 223.33333998918533, 187.0000056028366, 24.0, 24.0 ]
                                }
                            },
                            {
                                "box": {
                                    "id": "obj-11",
                                    "maxclass": "message",
                                    "numinlets": 2,
                                    "numoutlets": 1,
                                    "outlettype": [ "" ],
                                    "patching_rect": [ 87.0, 140.0, 249.0, 22.0 ],
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
                                    "patching_rect": [ 83.0, 188.0000056028366, 128.0, 22.0 ],
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
                                    "patching_rect": [ 235.0, 294.0, 39.0, 22.0 ],
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
                                    "patching_rect": [ 52.0, 61.0, 30.0, 30.0 ]
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
                                    "destination": [ "obj-5", 0 ],
                                    "source": [ "obj-16", 0 ]
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
                                    "destination": [ "obj-16", 0 ],
                                    "source": [ "obj-6", 0 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-3", 0 ],
                                    "source": [ "obj-6", 1 ]
                                }
                            },
                            {
                                "patchline": {
                                    "destination": [ "obj-33", 0 ],
                                    "source": [ "obj-6", 2 ]
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
                                    "destination": [ "obj-6", 0 ],
                                    "source": [ "obj-9", 0 ]
                                }
                            }
                        ],
                        "toolbaradditions": [ "packagemanager" ]
                    },
                    "patching_rect": [ 373.0, 72.5, 55.0, 22.0 ],
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
                    "patching_rect": [ 373.0, 140.0, 215.0, 64.0 ],
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
                    "patching_rect": [ 225.56228291988373, 498.91303396224976, 118.0, 22.0 ],
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
                    "patching_rect": [ 364.0, 24.0, 233.0, 188.0 ],
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
                    "patching_rect": [ 56.521738052368164, 359.7826018333435, 464.1304259300232, 178.26086616516113 ],
                    "presentation": 1,
                    "presentation_rect": [ 56.79267740249634, 359.75610613822937, 463.4146451950073, 141.46341800689697 ],
                    "proportion": 0.5
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
                    "destination": [ "obj-138", 1 ],
                    "source": [ "obj-106", 0 ]
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
                    "destination": [ "obj-138", 0 ],
                    "source": [ "obj-125", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-152", 0 ],
                    "source": [ "obj-138", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-47", 0 ],
                    "source": [ "obj-139", 0 ]
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
                    "destination": [ "obj-25", 0 ],
                    "source": [ "obj-15", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-91", 0 ],
                    "source": [ "obj-152", 7 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-152", 0 ],
                    "source": [ "obj-156", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 2 ],
                    "order": 0,
                    "source": [ "obj-16", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-57", 0 ],
                    "order": 1,
                    "source": [ "obj-16", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 2 ],
                    "midpoints": [ 467.0, 450.0, 334.0622829198837, 450.0 ],
                    "order": 0,
                    "source": [ "obj-176", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-57", 0 ],
                    "order": 1,
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
                    "destination": [ "obj-41", 1 ],
                    "midpoints": [ 42.5, 738.0, 205.9285798072815, 738.0 ],
                    "order": 0,
                    "source": [ "obj-22", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-41", 0 ],
                    "midpoints": [ 42.5, 408.0, 30.0, 408.0, 30.0, 720.4395633935928, 180.9285798072815, 720.4395633935928 ],
                    "order": 1,
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
                    "destination": [ "obj-98", 0 ],
                    "midpoints": [ 235.06228291988373, 531.0, 720.0, 531.0, 720.0, 72.0, 744.664871096611, 72.0 ],
                    "source": [ "obj-25", 0 ]
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
                    "destination": [ "obj-11", 0 ],
                    "source": [ "obj-31", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-10", 0 ],
                    "order": 0,
                    "source": [ "obj-32", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-12", 0 ],
                    "order": 1,
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
                    "destination": [ "obj-25", 0 ],
                    "source": [ "obj-35", 0 ]
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
                    "destination": [ "obj-106", 0 ],
                    "source": [ "obj-47", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-125", 0 ],
                    "source": [ "obj-47", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 0 ],
                    "source": [ "obj-48", 0 ]
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
                    "destination": [ "obj-52", 0 ],
                    "source": [ "obj-53", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-53", 0 ],
                    "source": [ "obj-54", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-25", 0 ],
                    "source": [ "obj-57", 0 ]
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
                    "destination": [ "obj-97", 1 ],
                    "source": [ "obj-75", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-97", 0 ],
                    "source": [ "obj-75", 0 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-75", 1 ],
                    "source": [ "obj-91", 1 ]
                }
            },
            {
                "patchline": {
                    "destination": [ "obj-75", 0 ],
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
            "obj-22": [ "gain[2]", "gain", 0 ],
            "obj-42": [ "gain[1]", "gain", 0 ],
            "obj-75": [ "live.gain~[1]", "live.gain~", 0 ],
            "inherited_shortname": 1
        },
        "autosave": 0
    }
}
