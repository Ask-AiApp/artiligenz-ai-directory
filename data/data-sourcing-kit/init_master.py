#!/usr/bin/env python3
import os, csv
BASE = os.path.dirname(os.path.dirname(__file__)) or "."
DATA_DIR = os.path.join(BASE, "data")
TPL = os.path.join(BASE, "data-sourcing-kit", "templates", "master_schema.csv")
os.makedirs(DATA_DIR, exist_ok=True)
DEST = os.path.join(DATA_DIR, "AI_Ecosystems_launch_list.csv")
if not os.path.exists(DEST):
    with open(TPL, "r", encoding="utf-8") as s, open(DEST, "w", encoding="utf-8") as d:
        d.write(s.read())
    print("Created", DEST)
else:
    print("Exists", DEST)
