#!/usr/bin/env python3
import os, csv, json
BASE = os.path.dirname(os.path.dirname(__file__)) or "."
DATA = os.path.join(BASE, "data", "AI_Ecosystems_launch_list.csv")
CHIPS = os.path.join(BASE, "data-sourcing-kit", "templates", "chips.json")
if not os.path.exists(DATA): raise SystemExit("Run init_master.py first")
chips = json.load(open(CHIPS, "r", encoding="utf-8"))
def prompt(msg, default=""):
    v = input(f"{msg}{' ['+default+']' if default else ''}: ").strip()
    return v or default
def domain(url):
    url = (url or '').lower().strip()
    if not url: return ''
    if '://' not in url: url = 'https://' + url
    from urllib.parse import urlparse
    host = urlparse(url).netloc or urlparse(url).path
    return host.replace('www.','')
def s2(d): return f'https://www.google.com/s2/favicons?domain={d}&sz=128' if d else ''
parent = prompt("Parent Company")
orbit  = prompt("Orbiting Entity (blank ok)","")
purl   = prompt("Parent Company URL")
ourl   = prompt("Orbiting Entity URL (blank=parent)","")
chip   = prompt("chip_category (" + ", ".join(chips.keys()) + ")")
label  = chips.get(chip,{}).get("label","")
country= prompt("Country","")
region = prompt("Region","")
dp = domain(purl); do = domain(ourl) if ourl else dp
pfav = s2(dp); pfavfb = (f'https://{dp}/favicon.ico' if dp else '')
ofav = s2(do) if do else pfav; ofavfb = (f'https://{do}/favicon.ico' if do else pfavfb)
row = [parent, orbit, purl, (ourl or purl), pfav, pfavfb, ofav, ofavfb, chip, label, country, region]
with open(DATA, 'a', encoding='utf-8', newline='') as f:
    csv.writer(f).writerow(row)
print("Added:", parent, "→", orbit or "(no orbit)")
