#!/usr/bin/env python3
import os, csv, json, sys
BASE = os.path.dirname(os.path.dirname(__file__)) or "."
DATA = os.path.join(BASE, "data", "AI_Ecosystems_launch_list.csv")
CHIPS = os.path.join(BASE, "data-sourcing-kit", "templates", "chips.json")
if not os.path.exists(DATA): raise SystemExit("Run init_master.py first")
chips = json.load(open(CHIPS, "r", encoding="utf-8"))
with open(DATA, "r", encoding="utf-8") as f:
    r = csv.DictReader(f); rows = list(r)
errs=[]; 
for i,row in enumerate(rows, start=2):
    p=row.get('Parent Company','').strip()
    c=row.get('chip_category','').strip()
    if not p: errs.append((i,'Parent Company blank'))
    if not c or c not in chips: errs.append((i,f'chip_category "{c}" invalid'))
if errs:
    print('Validation errors:')
    for ln,msg in errs: print(' line',ln,':',msg)
    sys.exit(1)
print('Validation OK, rows=',len(rows))
