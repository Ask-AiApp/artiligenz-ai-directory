#!/usr/bin/env python3
import os, csv, json, hashlib, colorsys
BASE = os.path.dirname(os.path.dirname(__file__)) or '.'
DATA = os.path.join(BASE, 'data', 'AI_Ecosystems_launch_list.csv')
OUT_JS = os.path.join(BASE, 'data', 'directory.js')
OUT_JSON = os.path.join(BASE, 'data', 'directory.json')
CHIPS = os.path.join(BASE, 'data-sourcing-kit', 'templates', 'chips.json')
if not os.path.exists(DATA): raise SystemExit('Run init_master.py first')
chips = json.load(open(CHIPS,'r',encoding='utf-8'))
def s(v): 
    if v is None: return ''
    vs=str(v).strip()
    return '' if vs.lower() in ('nan','none','null') else vs
def stable_color(cid):
    cid=s(cid)
    if cid in chips: return chips[cid]['color']
    h=(int(hashlib.sha1(cid.encode('utf-8')).hexdigest()[:6],16)%360)/360.0 if cid else 0.58
    r,g,b=colorsys.hls_to_rgb(h,0.55,0.6)
    return f'#{int(r*255):02x}{int(g*255):02x}{int(b*255):02x}'
rows=list(csv.DictReader(open(DATA,'r',encoding='utf-8')))
parents={}
for row in rows:
    p=s(row.get('Parent Company')); 
    if not p: continue
    if p not in parents:
        cid=s(row.get('chip_category'))
        parents[p]={
            'id': f'parent:{p}','name': p,
            'bucket': cid,
            'bucket_label': chips.get(cid,{}).get('label', s(row.get('chip_label'))),
            'bucket_color': stable_color(cid),
            'url': s(row.get('Parent Company URL')),
            'favicon': s(row.get('Parent Favicon URL')),
            'type':'parent','override_tier':'sun'
        }
nodes=[{'data':v} for v in parents.values()]; edges=[]
for row in rows:
    parent=s(row.get('Parent Company')); orbit=s(row.get('Orbiting Entity'))
    if not parent or not orbit: continue
    if parent not in parents: continue
    pid=parents[parent]['id']; cid=s(row.get('chip_category'))
    node={'id': f'orbit:{parent}|{orbit}','name': orbit,'bucket': cid,
          'bucket_label': chips.get(cid,{}).get('label', s(row.get('chip_label'))),
          'bucket_color': stable_color(cid),
          'url': s(row.get('Orbiting Entity URL')) or s(row.get('Parent Company URL')),
          'favicon': s(row.get('Orbiting Entity Favicon URL')) or s(row.get('Parent Favicon URL')),
          'type':'orbit','parent_id': pid,'override_tier':'planet'}
    nodes.append({'data': node})
    edges.append({'data': {'id': f'e:{pid}->{node["id"]}', 'source': pid, 'target': node['id']}})
payload={'nodes':nodes,'edges':edges}
open(OUT_JS,'w',encoding='utf-8').write('// Auto-generated Directory (global)\nwindow.Directory = '+json.dumps(payload, ensure_ascii=False)+';\n')
json.dump(payload, open(OUT_JSON,'w',encoding='utf-8'), ensure_ascii=False, indent=2)
print('Wrote', OUT_JS, 'and', OUT_JSON, 'nodes=',len(nodes),'edges=',len(edges))
