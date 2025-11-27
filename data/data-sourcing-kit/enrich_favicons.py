#!/usr/bin/env python3
import os, csv
from urllib.parse import urlparse
BASE = os.path.dirname(os.path.dirname(__file__)) or "."
DATA = os.path.join(BASE, "data", "AI_Ecosystems_launch_list.csv")
if not os.path.exists(DATA): raise SystemExit("Run init_master.py first")
def domain(u):
    u=(u or '').strip()
    if not u: return ''
    if '://' not in u: u='https://' + u
    p=urlparse(u); h=p.netloc or p.path
    return h[4:] if h.startswith('www.') else h
def s2(d, sz=128): return f'https://www.google.com/s2/favicons?domain={d}&sz={sz}' if d else ''
rows=[]; 
with open(DATA,'r',encoding='utf-8') as f:
    r=csv.DictReader(f); headers=r.fieldnames
    for row in r:
        purl=(row.get('Parent Company URL') or '').strip()
        ourl=(row.get('Orbiting Entity URL') or '').strip() or purl
        dp=domain(purl); do=domain(ourl)
        row['Parent Favicon URL']=row.get('Parent Favicon URL') or s2(dp)
        row['Parent Favicon (fallback)']=row.get('Parent Favicon (fallback)') or (f'https://{dp}/favicon.ico' if dp else '')
        row['Orbiting Entity Favicon URL']=row.get('Orbiting Entity Favicon URL') or (s2(do) if do else row['Parent Favicon URL'])
        row['Orbiting Entity Favicon (fallback)']=row.get('Orbiting Entity Favicon (fallback)') or (f'https://{do}/favicon.ico' if do else row['Parent Favicon (fallback)'])
        rows.append(row)
with open(DATA,'w',encoding='utf-8',newline='') as f:
    w=csv.DictWriter(f, fieldnames=headers); w.writeheader()
    for r in rows: w.writerow(r)
print('Favicons enriched:', len(rows))
