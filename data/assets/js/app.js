
const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>Array.from(el.querySelectorAll(s));
const saveFile = (name, text)=>{ const blob=new Blob([text],{type:"application/json"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=name; a.click(); URL.revokeObjectURL(a.href); };
const loadJSONFile = (file)=>new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>{ try{res(JSON.parse(r.result))}catch(e){rej(e)} }; r.onerror=rej; r.readAsText(file); });

const STORE_KEY = "aiDirectoryMgr.v1";
const initState = {
  companies: [],             // array of company objects
  signals: [],               // from watcher
  status_changes: [],        // from watcher
  new_companies: [],         // from watcher
  handledSignals: {},        // id/url -> true
  acceptedChanges: [],       // list of change ids (or JSON string hashes)
  acceptedNewCos: [],        // list of new-company objects already merged
  filters: { q:"", country:"", bucket:"" },
  editIndex: null            // index of company being edited
};
let state = load();

function load(){
  try{ return JSON.parse(localStorage.getItem(STORE_KEY)) || structuredClone(initState); }
  catch{ return structuredClone(initState); }
}
function save(){ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

(function init(){
  bindGlobal();
  render("companies");
})();

function bindGlobal(){
  const tabs = $("#tabs");
  tabs.addEventListener("click", e=>{
    const b = e.target.closest("button[data-tab]"); if(!b) return;
    $$(".tabs button").forEach(x=>x.classList.remove("active"));
    b.classList.add("active"); render(b.dataset.tab);
  });

  $("#importBtn").addEventListener("click", ()=> $("#importFiles").click());
  $("#importFiles").addEventListener("change", async e=>{
    const files = Array.from(e.target.files||[]);
    for(const f of files){
      try{
        const js = await loadJSONFile(f);
        if(f.name.includes("companies")) state.companies = Array.isArray(js)? js : js.data || [];
        else if(f.name.includes("signals")) state.signals = js;
        else if(f.name.includes("status_changes")) state.status_changes = js;
        else if(f.name.includes("new_companies")) state.new_companies = js;
      }catch(err){ alert(`Failed to parse ${f.name}`); }
    }
    save(); render(currentTab());
    e.target.value="";
  });

  $("#saveWs").addEventListener("click", ()=>{
    saveFile("workspace.json", JSON.stringify(state,null,2));
  });
  $("#loadWs").addEventListener("click", ()=> $("#loadWsFile").click());
  $("#loadWsFile").addEventListener("change", async e=>{
    const f = e.target.files?.[0]; if(!f) return;
    try{ state = await loadJSONFile(f); save(); render(currentTab()); }
    catch{ alert("Invalid workspace file"); }
  });

  $("#resetBtn").addEventListener("click", ()=>{
    if(confirm("Reset all data in this console?")){ state = structuredClone(initState); save(); render(currentTab()); }
  });
}

function currentTab(){ return $(".tabs button.active").dataset.tab; }

function render(tab){
  const view = $("#view"); view.innerHTML = "";
  if(tab==="companies") return renderCompanies(view);
  if(tab==="signals") return renderSignals(view);
  if(tab==="changes") return renderChanges(view);
  if(tab==="newcos") return renderNewCos(view);
  if(tab==="export") return renderExport(view);
}

/** Companies **/
function renderCompanies(view){
  const card = el(`<div class="card">
    <h2>Companies</h2>
    <div class="searchrow">
      <input id="q" placeholder="Search name/summary/country" value="${state.filters.q||""}"/>
      <input id="bucket" placeholder="Bucket filter (e.g., foundation_models)" value="${state.filters.bucket||""}"/>
      <input id="country" placeholder="Country filter (e.g., United States)" value="${state.filters.country||""}"/>
      <button class="btn" id="addBtn">Add</button>
    </div>
    <table><thead><tr><th>Name</th><th>Bucket</th><th>Country</th><th>Summary</th><th></th></tr></thead><tbody id="coT"></tbody></table>
  </div>`);
  view.appendChild(card);

  $("#q", card).addEventListener("input", e=>{ state.filters.q = e.target.value; save(); render("companies"); });
  $("#bucket", card).addEventListener("input", e=>{ state.filters.bucket = e.target.value; save(); render("companies"); });
  $("#country", card).addEventListener("input", e=>{ state.filters.country = e.target.value; save(); render("companies"); });

  $("#addBtn", card).addEventListener("click", ()=>{
    state.editIndex = -1; openCompanyModal({ name:"", bucket:"", category:"", bucket_color:"#FFB347", summary:"", country:"", flag:"", parent_id:"" });
  });

  const tbody = $("#coT", card);
  const q = (state.filters.q||"").toLowerCase();
  const bucket = (state.filters.bucket||"").toLowerCase();
  const country = (state.filters.country||"").toLowerCase();

  const rows = state.companies.filter(c=>{
    const matchesQ = !q || JSON.stringify(c).toLowerCase().includes(q);
    const matchesB = !bucket || (c.bucket||"").toLowerCase().includes(bucket);
    const matchesC = !country || (c.country||"").toLowerCase().includes(country);
    return matchesQ && matchesB && matchesC;
  });

  for(const c of rows){
    const tr = el(`<tr>
      <td>${escape(c.name)}</td>
      <td><span class="badge" style="border-color:${escape(c.bucket_color||"#1f2937")}">${escape(c.bucket||"")}</span></td>
      <td>${escape(c.flag||"")} ${escape(c.country||"")}</td>
      <td>${escape((c.summary||"").slice(0,120))}${(c.summary||"").length>120?"…":""}</td>
      <td style="text-align:right"><button class="btn" data-id="${c.id||""}" data-act="edit">Edit</button> <button class="btn" data-id="${c.id||""}" data-act="del">Delete</button></td>
    </tr>`);
    tbody.appendChild(tr);
  }

  tbody.addEventListener("click", e=>{
    const btn = e.target.closest("button[data-act]"); if(!btn) return;
    const act = btn.dataset.act; const id = btn.dataset.id;
    const idx = state.companies.findIndex(x=>String(x.id)===String(id));
    if(act==="edit"){
      state.editIndex = idx;
      openCompanyModal(state.companies[idx]);
    } else if(act==="del"){
      if(confirm("Delete this company?")){
        state.companies.splice(idx,1); save(); render("companies");
      }
    }
  });
}

/** Signals **/
function renderSignals(view){
  const card = el(`<div class="card">
    <h2>Signals</h2>
    <div class="searchrow">
      <input id="sq" placeholder="Search signals" />
      <button class="btn" id="markAll">Mark All Handled</button>
    </div>
    <table><thead><tr><th>Company</th><th>Title</th><th>Link</th><th>Handled</th></tr></thead><tbody id="sigT"></tbody></table>
  </div>`);
  view.appendChild(card);

  const tbody = $("#sigT", card);
  const sq = $("#sq", card);
  sq.addEventListener("input", ()=> fill());
  $("#markAll", card).addEventListener("click", ()=>{ for(const s of state.signals){ state.handledSignals[s.link||s.title||""] = true; } save(); fill(); });

  function fill(){
    tbody.innerHTML="";
    const q = (sq.value||"").toLowerCase();
    for(const s of state.signals){
      const key = s.link || s.title || "";
      if(q && !JSON.stringify(s).toLowerCase().includes(q)) continue;
      const tr = el(`<tr>
        <td>${escape(s.company||"")}</td>
        <td>${escape(s.title||"")}</td>
        <td>${s.link? `<a href="${escape(s.link)}" target="_blank">open</a>`:""}</td>
        <td><label><input type="checkbox" data-key="${escape(key)}" ${state.handledSignals[key]?"checked":""}/> handled</label></td>
      </tr>`);
      tbody.appendChild(tr);
    }
  }
  tbody.addEventListener("change", e=>{
    const box = e.target.closest("input[type='checkbox']"); if(!box) return;
    state.handledSignals[box.dataset.key] = box.checked; save();
  });
  fill();
}

/** Changes **/
function renderChanges(view){
  const card = el(`<div class="card">
    <h2>Status/Field Changes</h2>
    <small>These come from your watcher (status_changes.json). Accept to apply to your directory.</small>
    <table><thead><tr><th>Company</th><th>Change</th><th>From</th><th>To</th><th>Accept</th></tr></thead><tbody id="chgT"></tbody></table>
  </div>`);
  view.appendChild(card);
  const tbody = $("#chgT", card);
  for(const ch of state.status_changes){
    const id = JSON.stringify(ch);
    const tr = el(`<tr>
      <td>${escape(ch.company||"")}</td>
      <td>${escape(ch.change||"")}</td>
      <td>${escape(ch.from||"")}</td>
      <td>${escape(ch.to||"")}</td>
      <td><button class="btn" data-id='${escape(id)}'>Accept</button></td>
    </tr>`);
    tbody.appendChild(tr);
  }
  tbody.addEventListener("click", e=>{
    const b = e.target.closest("button[data-id]"); if(!b) return;
    const ch = JSON.parse(b.dataset.id);
    applyChange(ch);
    // remove from list
    state.status_changes = state.status_changes.filter(x=> JSON.stringify(x)!==JSON.stringify(ch));
    save(); render("changes");
  });
}

function applyChange(ch){
  const idx = state.companies.findIndex(c=> (c.name||"").toLowerCase()===(ch.company||"").toLowerCase());
  if(idx<0) return alert("Company not found in directory.");
  if(ch.change==="summary_changed"){
    state.companies[idx].summary = ch.to;
  } else {
    // generic: if payload has 'field'
    if(ch.field && ch.to!==undefined){
      state.companies[idx][ch.field] = ch.to;
    }
  }
}

/** New Companies **/
function renderNewCos(view){
  const card = el(`<div class="card">
    <h2>New Company Candidates</h2>
    <small>Accept to add them to your directory.</small>
    <table><thead><tr><th>Name</th><th>Country</th><th>Summary</th><th>Accept</th></tr></thead><tbody id="ncT"></tbody></table>
  </div>`);
  view.appendChild(card);
  const tbody = $("#ncT", card);
  for(const nc of state.new_companies){
    const tr = el(`<tr>
      <td>${escape(nc.name||"")}</td>
      <td>${escape(nc.country||"")}</td>
      <td>${escape((nc.summary||"").slice(0,100))}</td>
      <td><button class="btn" data-id='${escape(JSON.stringify(nc))}'>Add</button></td>
    </tr>`);
    tbody.appendChild(tr);
  }
  tbody.addEventListener("click", e=>{
    const b = e.target.closest("button[data-id]"); if(!b) return;
    const nc = JSON.parse(b.dataset.id);
    const nextId = String(nextCompanyId());
    const obj = Object.assign({
      id: nextId,
      bucket_color: "#FFB347",
      bucket: "foundation_models",
      category: "Foundation Models & Providers",
      flag: ""
    }, nc);
    state.companies.push(obj);
    // remove from candidates
    state.new_companies = state.new_companies.filter(x=> JSON.stringify(x)!==JSON.stringify(nc));
    save(); render("newcos");
  });
}

function nextCompanyId(){
  const ids = state.companies.map(c=>parseInt(c.id,10)).filter(n=>!isNaN(n));
  return (Math.max(0, ...ids) + 1);
}

/** Export **/
function renderExport(view){
  const card = el(`<div class="card">
    <h2>Export</h2>
    <div class="row">
      <button class="btn primary" id="expCompanies">Download companies.json</button>
      <button class="btn" id="expChangelog">Download changelog.md</button>
      <button class="btn" id="expWorkspace">Download workspace.json</button>
    </div>
    <div class="split">
      <div class="card">
        <h2>Directory Snapshot</h2>
        <div class="code" id="dirOut">${escape(JSON.stringify(state.companies, null, 2))}</div>
      </div>
      <div class="card">
        <h2>Summary</h2>
        <div class="code">${escape(makeSummary())}</div>
      </div>
    </div>
  </div>`);
  view.appendChild(card);

  $("#expCompanies", card).addEventListener("click", ()=>{
    saveFile("companies.json", JSON.stringify(state.companies, null, 2));
  });
  $("#expChangelog", card).addEventListener("click", ()=>{
    const md = `# Directory Changelog\n\n${makeSummary()}`;
    saveFile("changelog.md", md);
  });
  $("#expWorkspace", card).addEventListener("click", ()=>{
    saveFile("workspace.json", JSON.stringify(state, null, 2));
  });
}

function makeSummary(){
  const total = state.companies.length;
  const newCnt = (state.acceptedNewCos||[]).length; // placeholder if you want
  const changed = (state.acceptedChanges||[]).length;
  const handled = Object.values(state.handledSignals||{}).filter(Boolean).length;
  return `Total companies: ${total}
Signals handled: ${handled}
Changes applied: ${changed}
New companies accepted: ${newCnt}`;
}

/** Modal **/
function openCompanyModal(c){
  const dlg = $("#companyModal");
  $("#cmTitle").textContent = (state.editIndex===-1) ? "Add Company" : "Edit Company";
  $("#cmName").value = c.name||"";
  $("#cmBucket").value = c.bucket||"";
  $("#cmCategory").value = c.category||"";
  $("#cmColor").value = c.bucket_color||"#FFB347";
  $("#cmCountry").value = c.country||"";
  $("#cmFlag").value = c.flag||"";
  $("#cmParent").value = c.parent_id||"";
  $("#cmSummary").value = c.summary||"";
  dlg.showModal();
  $("#cmSave").onclick = ()=>{
    const obj = {
      id: (state.editIndex===-1) ? String(nextCompanyId()) : state.companies[state.editIndex].id,
      name: $("#cmName").value.trim(),
      bucket: $("#cmBucket").value.trim(),
      category: $("#cmCategory").value.trim(),
      bucket_color: $("#cmColor").value.trim(),
      country: $("#cmCountry").value.trim(),
      flag: $("#cmFlag").value.trim(),
      parent_id: $("#cmParent").value.trim() || undefined,
      summary: $("#cmSummary").value.trim()
    };
    if(state.editIndex===-1) state.companies.push(obj);
    else state.companies[state.editIndex] = obj;
    save(); dlg.close(); render("companies");
  };
}

function el(html){ const d=document.createElement("div"); d.innerHTML=html.trim(); return d.firstChild; }
function escape(s){ return String(s).replace(/[&<>"']/g, m=>({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[m])); }
