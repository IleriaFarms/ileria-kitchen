const PLANNING_STORAGE_KEY = "ileriaPlanningV1";

const OCTOBER_2026_SEED = [
  {date:"2026-10-01",brand:"LAD",title:"Live Podcast #1",type:"Live Podcast",channels:"Zoom · Instagram · LinkedIn",cta:"Register / Attend",owner:"",status:"Planned",notes:"Day-of reminder + live Zoom event."},
  {date:"2026-10-02",brand:"IF",title:"October Harvest",type:"Farm / Food",channels:"Instagram",cta:"Engage",owner:"",status:"Planned",notes:"Harvest Reel or photo carousel."},
  {date:"2026-10-05",brand:"LAD",title:"Live Podcast Takeaway",type:"Thought Leadership",channels:"LinkedIn · Instagram",cta:"Engage",owner:"",status:"Planned",notes:"Quote or leadership insight from Live #1."},
  {date:"2026-10-06",brand:"IF",title:"What's Growing?",type:"Farm / Food",channels:"Instagram",cta:"Engage",owner:"",status:"Planned",notes:"Seasonal farm/food post."},
  {date:"2026-10-07",brand:"LAD",title:"Recording #1 Teaser",type:"Podcast Clip",channels:"Instagram · YouTube Shorts · LinkedIn",cta:"Watch",owner:"",status:"Planned",notes:"30–60 second clip from the edited recording."},
  {date:"2026-10-08",brand:"IF",title:"CSA Teaser",type:"CSA",channels:"Instagram Stories",cta:"Build Interest",owner:"",status:"Planned",notes:"Something fresh is coming…"},
  {date:"2026-10-09",brand:"LAD",title:"Recording #1 Release",type:"Podcast Release",channels:"YouTube · LinkedIn · Instagram",cta:"Watch Full Episode",owner:"",status:"Planned",notes:"October recording #1 is already edited and ready."},
  {date:"2026-10-10",brand:"IF",title:"Community / Farm Story",type:"Community",channels:"Instagram",cta:"Engage",owner:"",status:"Planned",notes:"Market, people, or seasonal moment."},
  {date:"2026-10-12",brand:"LAD",title:"Leadership Insight",type:"Thought Leadership",channels:"LinkedIn · Instagram",cta:"Engage / Consulting Awareness",owner:"",status:"Planned",notes:"Derived from Recording #1."},
  {date:"2026-10-13",brand:"IF",title:"Recipe / Produce Spotlight",type:"Food",channels:"Instagram · YouTube Shorts",cta:"Save / Share",owner:"",status:"Planned",notes:"Repurpose one vertical video across both channels."},
  {date:"2026-10-14",brand:"LAD",title:"Live Podcast #2 Push",type:"Live Podcast Promo",channels:"LinkedIn · Instagram",cta:"Register",owner:"",status:"Planned",notes:"Guest + topic + registration CTA."},
  {date:"2026-10-15",brand:"LAD",title:"Live Podcast #2",type:"Live Podcast",channels:"Zoom · Instagram · LinkedIn",cta:"Register / Attend",owner:"",status:"Planned",notes:"Day-of reminder + live Zoom event."},
  {date:"2026-10-16",brand:"IF",title:"What Is a CSA?",type:"CSA",channels:"Instagram",cta:"Learn / Join Interest List",owner:"",status:"Planned",notes:"Educational carousel explaining CSA membership."},
  {date:"2026-10-19",brand:"LAD",title:"Live Podcast Takeaway",type:"Thought Leadership",channels:"LinkedIn · Instagram",cta:"Engage",owner:"",status:"Planned",notes:"Strong quote or actionable insight from Live #2."},
  {date:"2026-10-20",brand:"IF",title:"From the Farm — YouTube #1",type:"YouTube",channels:"YouTube · Instagram",cta:"Watch / Subscribe",owner:"",status:"Planned",notes:"First Ileria Farms YouTube video + IG teaser."},
  {date:"2026-10-21",brand:"LAD",title:"Recording #2 Teaser",type:"Podcast Clip",channels:"Instagram · YouTube Shorts · LinkedIn",cta:"Watch",owner:"",status:"Planned",notes:"Short/Reel + quote from the edited recording."},
  {date:"2026-10-22",brand:"IF",title:"Meet the CSA Shares",type:"CSA",channels:"Instagram",cta:"Build Interest",owner:"",status:"Planned",notes:"Introduce Little Harvest ($30) vs Ileria Harvest ($42)."},
  {date:"2026-10-23",brand:"LAD",title:"Recording #2 Release",type:"Podcast Release",channels:"YouTube · LinkedIn · Instagram",cta:"Watch Full Episode",owner:"",status:"Planned",notes:"October recording #2 is already edited and ready."},
  {date:"2026-10-24",brand:"IF",title:"Farm / Community",type:"Community",channels:"Instagram",cta:"Engage",owner:"",status:"Planned",notes:"Photo carousel or Reel."},
  {date:"2026-10-26",brand:"LAD",title:"Consulting Insight",type:"Consulting",channels:"LinkedIn · Instagram",cta:"Consulting Inquiry",owner:"",status:"Planned",notes:"Useful LAD idea with a soft consulting CTA."},
  {date:"2026-10-27",brand:"IF",title:"Fall Recipe",type:"Food",channels:"Instagram · YouTube Shorts",cta:"Save / Share",owner:"",status:"Planned",notes:"Food-first Reel / Short."},
  {date:"2026-10-28",brand:"Joint",title:"Cultivation",type:"Retreat / Brand",channels:"LinkedIn · Instagram",cta:"Retreat Awareness",owner:"",status:"Planned",notes:"First LAD × IF retreat / brand crossover post."},
  {date:"2026-10-29",brand:"IF",title:"CSA Interest Push",type:"CSA",channels:"Instagram · Website",cta:"Join / Express Interest",owner:"",status:"Planned",notes:"Explain pickup, delivery, weekly and biweekly options."},
  {date:"2026-10-30",brand:"IF",title:"Merch Spotlight",type:"Merch",channels:"Instagram",cta:"Shop",owner:"",status:"Planned",notes:"Lifestyle/community framing rather than a hard product ad."},
  {date:"2026-10-31",brand:"IF",title:"Seasonal Farm Story",type:"Stories",channels:"Instagram Stories",cta:"Engage",owner:"",status:"Optional",notes:"Optional Halloween/seasonal farm Story."}
].map(item => ({id: crypto.randomUUID(), ...item}));

function loadPlanning() {
  try {
    const stored = localStorage.getItem(PLANNING_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {items: OCTOBER_2026_SEED};
  } catch (e) {
    return {items: OCTOBER_2026_SEED};
  }
}
let planningDB = loadPlanning();
function savePlanning(){ localStorage.setItem(PLANNING_STORAGE_KEY, JSON.stringify(planningDB)); }

function esc(value=""){ return String(value).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c])); }
function brandClass(brand){ return brand==="IF"?"brand-if":brand==="LAD"?"brand-lad":"brand-joint"; }

function planningView(){
  const items=[...planningDB.items].sort((a,b)=>a.date.localeCompare(b.date));
  const days=Array.from({length:31},(_,i)=>i+1);
  const offset=3; // Oct 1, 2026 = Thursday when Monday is column 0
  const cells=[...Array(offset).fill(null),...days];
  while(cells.length%7) cells.push(null);
  return '<div class="planning-toolbar"><div><p class="planning-intro">October theme: <strong>Harvest + Community</strong> · LAD rhythm: <strong>Live → Recording → Live → Recording</strong></p><p class="muted">Edits autosave in this browser. Click any content card to edit it.</p></div><button class="primary" id="addPlanItem">+ Add Content</button></div>'+
  '<div class="planning-legend"><span class="legend-if">Ileria Farms</span><span class="legend-lad">Leading Across Difference</span><span class="legend-joint">LAD × IF</span></div>'+
  '<div class="calendar-wrap"><div class="calendar-grid calendar-head">'+["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d=>'<div>'+d+'</div>').join("")+'</div>'+
  '<div class="calendar-grid">'+cells.map(day=>{if(!day)return '<div class="calendar-day empty"></div>';const date="2026-10-"+String(day).padStart(2,"0");const dayItems=items.filter(i=>i.date===date);return '<div class="calendar-day"><div class="day-number">'+day+'</div><div class="day-items">'+dayItems.map(i=>'<button class="plan-card '+brandClass(i.brand)+'" data-plan-id="'+i.id+'"><span class="plan-brand">'+esc(i.brand)+'</span><strong>'+esc(i.title)+'</strong><small>'+esc(i.channels)+'</small><span class="status '+(i.status==="Done"?"done":"")+'">'+esc(i.status)+'</span></button>').join("")+'</div></div>';}).join("")+'</div></div>'+
  '<div class="grid two planning-bottom"><section class="card"><div class="section-title"><h2>October priorities</h2></div><div class="list"><div class="list-item"><strong>🎙️ LAD</strong><br><span class="muted">2 live Zoom podcasts + 2 recording releases. Turn each recording into reusable clips, quotes and thought leadership.</span></div><div class="list-item"><strong>🌱 Ileria Farms</strong><br><span class="muted">Establish regular social cadence, launch YouTube content, and move CSA messaging from teaser → education → shares → signup.</span></div><div class="list-item"><strong>🌾 Joint</strong><br><span class="muted">Introduce Cultivation / retreat crossover messaging without overwhelming either brand.</span></div></div></section>'+
  '<section class="card"><div class="section-title"><h2>CSA rollout</h2></div><div class="list"><div class="list-item"><strong>Oct 8</strong> · Tease</div><div class="list-item"><strong>Oct 16</strong> · Explain CSA</div><div class="list-item"><strong>Oct 22</strong> · Introduce $30 / $42 shares</div><div class="list-item"><strong>Oct 29</strong> · Explain pickup, delivery + frequency</div></div></section></div>';
}

function planningModal(existing){
  const item=existing?{...existing}:{id:crypto.randomUUID(),date:"2026-10-01",brand:"IF",title:"",type:"",channels:"Instagram",cta:"",owner:"",status:"Planned",notes:""};
  document.querySelector("#modalBody").innerHTML='<p class="eyebrow">CONTENT PLANNER</p><h2>'+(existing?"Edit Content":"Add Content")+'</h2><div class="form-grid">'+
  '<div><label>Date</label><input id="pDate" type="date" value="'+esc(item.date)+'"></div>'+
  '<div><label>Brand</label><select id="pBrand">'+["IF","LAD","Joint"].map(x=>'<option '+(x===item.brand?"selected":"")+'>'+x+'</option>').join("")+'</select></div>'+
  '<div><label>Title</label><input id="pTitle" value="'+esc(item.title)+'"></div>'+
  '<div><label>Content Type</label><input id="pType" value="'+esc(item.type)+'"></div>'+
  '<div><label>Channels</label><input id="pChannels" value="'+esc(item.channels)+'"></div>'+
  '<div><label>CTA / Goal</label><input id="pCta" value="'+esc(item.cta)+'"></div>'+
  '<div><label>Owner</label><input id="pOwner" value="'+esc(item.owner)+'" placeholder="Assign later"></div>'+
  '<div><label>Status</label><select id="pStatus">'+["Planned","Drafting","Ready","Scheduled","Done","Optional"].map(x=>'<option '+(x===item.status?"selected":"")+'>'+x+'</option>').join("")+'</select></div></div>'+
  '<div style="margin-top:14px"><label>Notes</label><textarea id="pNotes" rows="5">'+esc(item.notes)+'</textarea></div>'+
  '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:18px">'+(existing?'<button class="danger" id="deletePlanItem">Delete</button>':'')+'<button class="primary" id="savePlanItem">Save</button></div>';
  document.querySelector("#modal").classList.remove("hidden");
  document.querySelector("#savePlanItem").onclick=()=>{
    Object.assign(item,{date:document.querySelector("#pDate").value,brand:document.querySelector("#pBrand").value,title:document.querySelector("#pTitle").value.trim()||"Untitled Content",type:document.querySelector("#pType").value,channels:document.querySelector("#pChannels").value,cta:document.querySelector("#pCta").value,owner:document.querySelector("#pOwner").value,status:document.querySelector("#pStatus").value,notes:document.querySelector("#pNotes").value});
    const index=planningDB.items.findIndex(x=>x.id===item.id); if(index>=0)planningDB.items[index]=item; else planningDB.items.push(item);
    savePlanning(); closeModal(); render("planning");
  };
  if(existing) document.querySelector("#deletePlanItem").onclick=()=>{planningDB.items=planningDB.items.filter(x=>x.id!==item.id);savePlanning();closeModal();render("planning");};
}
function bindPlanning(){
  document.querySelector("#addPlanItem").onclick=()=>planningModal();
  document.querySelectorAll(".plan-card").forEach(card=>card.onclick=()=>planningModal(planningDB.items.find(i=>i.id===card.dataset.planId)));
}
window.planningView=planningView;
window.bindPlanning=bindPlanning;
