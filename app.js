// VeloClear App Functions — loads after data

function go(id) {
  document.querySelectorAll('.sec').forEach(function(s){ s.classList.remove('active'); });
  var sec = document.getElementById('s-' + id);
  if (sec) sec.classList.add('active');
  document.querySelectorAll('.sb-item').forEach(function(n){ n.classList.remove('active'); });
  var nav = document.querySelector('[data-sec="' + id + '"]');
  if (nav) nav.classList.add('active');
  cur = id;
  try { RENDER[id] && RENDER[id](); } catch(e) { console.error('render ' + id + ':', e); }
  var content = sec ? sec.querySelector('.content') : null;
  if (content) content.scrollTop = 0;
}

function showM(id){ var e=document.getElementById(id); if(e) e.classList.add('open'); }
function openM(id){ showM(id); }
function closeM(id){ var e=document.getElementById(id); if(e) e.classList.remove('open'); }
function toggleSidebar(){
  var sb=document.getElementById('sidebar'), so=document.getElementById('sb-overlay');
  if(sb){ sb.classList.toggle('open'); if(so) so.classList.toggle('open'); }
}

function toast(msg, type) {
  var c = document.getElementById('toast-container');
  if (!c) { c=document.createElement('div'); c.id='toast-container'; c.className='toast-container'; document.body.appendChild(c); }
  var t = document.createElement('div');
  t.className = 'toast ' + (type||'info');
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(function(){
    t.style.opacity='0'; t.style.transform='translateY(8px)'; t.style.transition='all .3s';
    setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 300);
  }, 3500);
}

function rDash() {
  var active = DB.projects.filter(function(p){ return p.status==='Active'; });
  var closed = DB.projects.filter(function(p){ return p.status==='Closed'; });
  var highRisk = (DB.risks||[]).filter(function(r){ return r.score>=9 && r.status!=='Closed'; });
  var pendingCR = (DB.crs||[]).filter(function(c){ return c.status==='Pending CCB'; });
  var openEsc = (DB.escalations||[]).filter(function(e){ return e.status==='Open'; });
  var green = active.filter(function(p){ return p.ragOverall==='green'; }).length;
  var amber = active.filter(function(p){ return p.ragOverall==='amber'; }).length;
  var red   = active.filter(function(p){ return p.ragOverall==='red'; }).length;
  var cpiSum=0, cpiN=0;
  active.forEach(function(p){ if(p.ac>0){ cpiSum+=p.ev/p.ac; cpiN++; } });
  var avgCpi = cpiN>0 ? (cpiSum/cpiN).toFixed(2) : '1.00';
  var cpiOk = parseFloat(avgCpi)>=1;

  // KPI Strip
  var kpiEl = document.getElementById('dash-kpi');
  if (kpiEl) {
    kpiEl.innerHTML = [
      { bar:'linear-gradient(90deg,#6366F1,#8B5CF6)', iconBg:'#EEF2FF', iconCol:'#6366F1', icon:'folders',
        tagBg:'#DCFCE7', tagCol:'#15803D', tag: closed.length + ' closed',
        valCol:'#0F172A', val: active.length, label:'Active Projects', dest:'rag' },
      { bar:'linear-gradient(90deg,#EF4444,#F87171)', iconBg:'#FEF2F2', iconCol:'#EF4444', icon:'shield-x',
        tagBg:'#FEF2F2', tagCol:'#B91C1C', tag: openEsc.length + ' escalated',
        valCol:'#EF4444', val: highRisk.length, label:'High Risks', dest:'raid' },
      { bar:'linear-gradient(90deg,#10B981,#34D399)', iconBg:'#ECFDF5', iconCol:'#10B981', icon:'chart-bar',
        tagBg:'#ECFDF5', tagCol:'#065F46', tag: cpiOk ? 'Under budget' : 'Over budget',
        valCol: cpiOk ? '#10B981':'#EF4444', val: avgCpi, label:'Portfolio CPI', dest:'evm' },
      { bar:'linear-gradient(90deg,#F59E0B,#FCD34D)', iconBg:'#FFFBEB', iconCol:'#F59E0B', icon:'clipboard-list',
        tagBg:'#FEF3C7', tagCol:'#92400E', tag: red + 'r · ' + amber + 'a',
        valCol:'#F59E0B', val: pendingCR.length, label:'Pending CRs', dest:'cr' },
    ].map(function(k){
      return '<div class="kpi-card" data-dest="'+k.dest+'">' +
        '<div class="kpi-bar" style="background:'+k.bar+'"></div>' +
        '<div class="kpi-icon" style="background:'+k.iconBg+'"><i class="ti ti-'+k.icon+'" style="color:'+k.iconCol+'"></i></div>' +
        '<div class="kpi-value" style="color:'+k.valCol+'">'+k.val+'</div>' +
        '<div class="kpi-label">'+k.label+'</div>' +
        '<span class="kpi-tag" style="background:'+k.tagBg+';color:'+k.tagCol+'">'+k.tag+'</span>' +
      '</div>';
    }).join('');
    kpiEl.querySelectorAll('.kpi-card').forEach(function(el){
      var dest = el.getAttribute('data-dest');
      el.addEventListener('click', function(){ go(dest); });
    });
  }

  // Health bar
  var hbEl = document.getElementById('dash-health');
  if (hbEl) {
    var total = DB.projects.length;
    hbEl.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">' +
        '<span style="font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.08em">Portfolio Health</span>' +
        '<div style="display:flex;gap:14px">' +
          ['<span style="color:#059669">&#9679; '+green+' Green</span>',
           '<span style="color:#D97706">&#9679; '+amber+' Amber</span>',
           '<span style="color:#DC2626">&#9679; '+red+' Red</span>',
           '<span style="color:#94A3B8">&#9679; '+closed.length+' Closed</span>'].join('') +
        '</div>' +
      '</div>' +
      '<div class="health-track">' +
        '<div class="health-seg" style="flex:'+Math.max(green,.1)+';background:#10B981"></div>' +
        '<div class="health-seg" style="flex:'+Math.max(amber,.1)+';background:#F59E0B"></div>' +
        '<div class="health-seg" style="flex:'+Math.max(red,.1)+';background:#EF4444"></div>' +
        '<div class="health-seg" style="flex:'+Math.max(closed.length,.1)+';background:#E2E8F0"></div>' +
      '</div>';
  }

  // RAG table
  var ragEl = document.getElementById('dash-rag-body');
  if (ragEl) {
    ragEl.innerHTML = '';
    DB.projects.forEach(function(p) {
      var rag = p.ragOverall || 'green';
      var isClosed = p.status === 'Closed';
      var ragCol = isClosed ? '#CBD5E1' : rag==='green'?'#10B981':rag==='amber'?'#F59E0B':'#EF4444';
      var cpi = p.ac>0 ? (p.ev/p.ac).toFixed(2) : '—';
      var spi = p.pv>0 ? (p.ev/p.pv).toFixed(2) : '—';
      var cpiCol = isClosed?'#CBD5E1':parseFloat(cpi)>=1?'#059669':parseFloat(cpi)>=0.85?'#D97706':'#DC2626';
      var spiCol = isClosed?'#CBD5E1':parseFloat(spi)>=1?'#059669':parseFloat(spi)>=0.85?'#D97706':'#DC2626';
      var sprint = p.currentSprint ? (p.currentSprint+'/'+p.totalSprints) : '—';
      var badgeCls = isClosed?'badge-grey':rag==='green'?'badge-green':rag==='amber'?'badge-amber':'badge-red';
      var tr = document.createElement('tr');
      tr.addEventListener('click', function(){ go('rag'); });
      tr.innerHTML =
        '<td><span style="font-weight:500;color:var(--ink-2)">'+p.name+'</span></td>' +
        '<td style="text-align:center"><span class="rag-dot" style="background:'+ragCol+'"></span></td>' +
        '<td><span class="badge '+badgeCls+'">'+(isClosed?'CLOSED':rag.toUpperCase())+'</span></td>' +
        '<td style="text-align:center;color:var(--muted);font-family:var(--mono)">'+sprint+'</td>' +
        '<td style="text-align:center;font-family:var(--mono);font-weight:600;color:'+cpiCol+'">'+cpi+'</td>' +
        '<td style="text-align:center;font-family:var(--mono);font-weight:600;color:'+spiCol+'">'+spi+'</td>';
      ragEl.appendChild(tr);
    });
  }

  // EVM
  var evmEl = document.getElementById('dash-evm');
  if (evmEl) {
    evmEl.innerHTML = DB.projects.map(function(p){
      var isClosed = p.status==='Closed';
      var cpiV = p.ac>0?p.ev/p.ac:1, spiV = p.pv>0?p.ev/p.pv:1;
      var cpiPct = Math.min((cpiV/1.3)*100,100).toFixed(1);
      var spiPct = Math.min((spiV/1.3)*100,100).toFixed(1);
      var cpiC = isClosed?'#CBD5E1':cpiV>=1?'#10B981':cpiV>=0.85?'#F59E0B':'#EF4444';
      var spiC = isClosed?'#CBD5E1':spiV>=1?'#10B981':spiV>=0.85?'#F59E0B':'#EF4444';
      var nm = p.name.split(' ').slice(0,2).join(' ');
      return '<div style="margin-bottom:14px">' +
        '<div style="font-size:11px;font-weight:500;color:var(--ink-2);margin-bottom:5px">'+nm+
          (isClosed?'<span class="badge badge-grey" style="margin-left:6px;font-size:9px">Closed</span>':'')+
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:3px">' +
          '<span style="font-size:9px;color:var(--muted);width:22px;text-align:right">CPI</span>' +
          '<div class="evm-track"><div class="evm-fill" style="width:'+cpiPct+'%;background:'+cpiC+'"></div></div>' +
          '<span style="font-size:10px;font-weight:600;width:32px;text-align:right;color:'+cpiC+';font-family:var(--mono)">'+cpiV.toFixed(2)+'</span>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px">' +
          '<span style="font-size:9px;color:var(--muted);width:22px;text-align:right">SPI</span>' +
          '<div class="evm-track"><div class="evm-fill" style="width:'+spiPct+'%;background:'+spiC+'"></div></div>' +
          '<span style="font-size:10px;font-weight:600;width:32px;text-align:right;color:'+spiC+';font-family:var(--mono)">'+spiV.toFixed(2)+'</span>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  // Mini heat map
  if (typeof rHeat === 'function') rHeat('dash-hm', true);
}

function rRaid() {
  const rb=document.getElementById('tb-risks');
  if(rb) rb.innerHTML=DB.risks.map(r=>`<tr><td style="font-family:'JetBrains Mono',monospace;font-size:10px">${r.id}</td><td><span style="font-size:11px">${r.desc.substring(0,70)}${r.desc.length>70?'...':''}</span></td><td><span class="badge badge-indigo">${r.cat}</span></td><td style="font-family:'JetBrains Mono',monospace;font-weight:700">${r.prob}</td><td style="font-family:'JetBrains Mono',monospace;font-weight:700">${r.impact}</td><td><span class="badge ${scoreClass(r.score)}">${r.score}</span></td><td style="font-size:10px;color:var(--muted);max-width:130px">${r.trigger||'⚠️ No trigger set!'}</td><td><span class="badge badge-indigo">${r.response}</span></td><td style="font-size:11px">${r.owner}</td><td>${statusBadge(r.status)}</td><td><button class="btn btn-ghost btn-sm btn-icon" onclick="fireTrigger('${r.id}')" title="Fire trigger → converts to Issue" ${r.status==='TRIGGERED'?'disabled':''}>🎯</button></td></tr>`).join('');
  const ab=document.getElementById('tb-assumptions');
  if(ab) ab.innerHTML=DB.assumptions.map(a=>`<tr><td style="font-family:'JetBrains Mono',monospace;font-size:10px">${a.id}</td><td style="font-size:11px">${a.desc}</td><td style="font-size:10px;color:var(--muted)">${a.wrong}</td><td style="font-size:11px">${a.owner}</td><td style="font-family:'JetBrains Mono',monospace;font-size:10px">${a.date}</td><td>${statusBadge(a.status)}</td></tr>`).join('');
  const ib=document.getElementById('tb-issues-raid');
  if(ib) ib.innerHTML=DB.issues.map(i=>`<tr><td style="font-family:'JetBrains Mono',monospace;font-size:10px">${i.id}</td><td style="font-size:11px">${i.desc.substring(0,70)}</td><td><span class="badge badge-indigo" style="font-size:9px">${i.source.substring(0,20)}</span></td><td style="font-size:10px;color:var(--red-d)">${i.impact}</td><td>${i.owner}</td><td style="font-family:'JetBrains Mono',monospace;font-size:10px">${i.targetClose}</td><td><span class="badge badge-red">Stage ${i.stage}</span></td><td>${statusBadge(i.status)}</td></tr>`).join('');
  const db=document.getElementById('tb-deps');
  if(db) db.innerHTML=DB.dependencies.map(d=>`<tr><td style="font-family:'JetBrains Mono',monospace;font-size:10px">${d.id}</td><td style="font-size:11px">${d.desc}</td><td style="font-size:11px">${d.team}</td><td>${d.owner}</td><td style="font-family:'JetBrains Mono',monospace;font-size:10px">${d.requiredBy}</td><td><span class="badge ${d.risk.includes('High')?'badge-red':d.risk.includes('Medium')?'badge-amber':'badge-green'}" style="font-size:9px">${d.risk}</span></td><td>${statusBadge(d.status)}</td></tr>`).join('');
  const tcs=[['tc-r',DB.risks.filter(r=>r.status!=='Closed').length],['tc-a',DB.assumptions.length],['tc-i',DB.issues.filter(i=>i.status!=='Closed').length],['tc-d',DB.dependencies.length]];
  tcs.forEach(([id,n])=>{const el=document.getElementById(id);if(el)el.textContent=n;});
}
function rHeat(cid,mini=false) {
  const c=document.getElementById(cid); if(!c) return;
  const sz=mini?28:42, fs=mini?8:10;
  const cls=[['low','low','low','med-low','med'],['low','low','med-low','med','med-high'],['low','med-low','med','med-high','high'],['med-low','med','med-high','high','very-high'],['med','med-high','high','very-high','extreme']];
  let h=`<div style="display:flex;gap:3px;"><div style="display:flex;flex-direction:column;justify-content:space-around;margin-right:4px;">${[5,4,3,2,1].map(p=>`<div style="height:${sz}px;display:flex;align-items:center;justify-content:flex-end;font-size:8px;color:var(--muted);font-weight:600;width:10px">${p}</div>`).join('')}</div><div><div style="display:grid;grid-template-columns:repeat(5,${sz}px);gap:3px;">`;
  for(let p=5;p>=1;p--){for(let i=1;i<=5;i++){const s=p*i,cl=cls[p-1][i-1],plotted=DB.risks.find(r=>r.prob===p&&r.impact===i);h+=`<div class="heat-cell ${cl}${plotted?' plotted':''}" style="width:${sz}px;height:${sz}px;font-size:${fs}px;" data-tip="${plotted?plotted.id+': '+plotted.desc.substring(0,40):'P='+p+' × I='+i+' = '+s}">${s}${plotted?`<span style="position:absolute;top:-3px;right:-3px;width:9px;height:9px;background:var(--ink);border-radius:50%;font-size:6px;display:flex;align-items:center;justify-content:center;color:#fff;">${plotted.id.slice(-1)}</span>`:''}</div>`;}}
  h+=`</div><div style="display:grid;grid-template-columns:repeat(5,${sz}px);gap:3px;margin-top:3px;">${[1,2,3,4,5].map(i=>`<div style="width:${sz}px;text-align:center;font-size:8px;color:var(--muted);font-weight:600;">${i}</div>`).join('')}</div><div style="text-align:center;font-size:8px;color:var(--muted);margin-top:2px;font-weight:600;">IMPACT →</div></div></div>`;
  if(!mini){h+=`<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;"><div class="heat-cell low" style="width:auto;padding:2px 9px;font-size:9px;cursor:default;">1–4 Low</div><div class="heat-cell med" style="width:auto;padding:2px 9px;font-size:9px;cursor:default;">5–9 Medium</div><div class="heat-cell high" style="width:auto;padding:2px 9px;font-size:9px;cursor:default;">10–14 High</div><div class="heat-cell extreme" style="width:auto;padding:2px 9px;font-size:9px;cursor:default;">15–25 Extreme</div></div>`;
  const total=DB.risks.length||1,hi=DB.risks.filter(r=>r.score>=15).length,me=DB.risks.filter(r=>r.score>=5&&r.score<15).length,lo=DB.risks.filter(r=>r.score<5).length;
  ['cnt-high','cnt-med','cnt-low'].forEach((id,idx)=>{const el=document.getElementById(id);if(el)el.textContent=[hi,me,lo][idx];});
  ['bar-high','bar-med','bar-low'].forEach((id,idx)=>{const el=document.getElementById(id);if(el)el.style.width=Math.round([hi,me,lo][idx]/total*100)+'%';});
  }
  c.innerHTML=h;
}
function rFullIssues() {
  const b=document.getElementById('tb-full-issues'); if(!b) return;
  b.innerHTML=DB.issues.map(i=>`<tr><td style="font-family:'JetBrains Mono',monospace;font-size:10px">${i.id}</td><td style="font-size:11px">${i.desc.substring(0,70)}</td><td style="font-size:10px">${i.source}</td><td style="font-size:10px;color:var(--red-d)">${i.impact}</td><td>${i.owner}</td><td style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--amber-d)">${i.opened}</td><td style="font-family:'JetBrains Mono',monospace;font-size:10px">${i.targetClose}</td><td><span class="badge badge-amber">Stage ${i.stage} — ${['','PM','PM+Sponsor','Steering','Executive'][i.stage]}</span></td><td>${statusBadge(i.status)}</td></tr>`).join('');
}
function rStakeholders() {
  const b=document.getElementById('tb-stakeholders'); if(!b) return;
  const levels=['Unaware','Resistant','Neutral','Supportive','Leading'];
  b.innerHTML=DB.stakeholders.map(s=>{const gap=levels.indexOf(s.target)-levels.indexOf(s.current);return`<tr><td><strong style="font-size:12px">${s.name}</strong><br><span style="font-size:10px;color:var(--muted)">${s.role}</span></td><td style="font-size:11px">${s.org}</td><td><div class="rag"><div class="rag-dot ${s.power>=4?'red':s.power>=3?'amber':'green'}"></div>${s.power}</div></td><td><div class="rag"><div class="rag-dot ${s.interest>=4?'red':s.interest>=3?'amber':'green'}"></div>${s.interest}</div></td><td style="font-size:11px;font-weight:600;color:${s.power>=3&&s.interest>=3?'var(--red-d)':s.power>=3?'var(--amber-d)':s.interest>=3?'var(--emerald-d)':'var(--muted)'}">${getStrategy(s.power,s.interest)}</td><td><span class="badge" style="background:${engCol(s.current)}22;color:${engCol(s.current)}">● ${s.current}</span></td><td><span class="badge" style="background:${engCol(s.target)}22;color:${engCol(s.target)}">● ${s.target}</span></td><td>${gap>0?`<span class="badge badge-amber">+${gap} levels</span>`:`<span class="badge badge-green">✓ At target</span>`}</td><td><button class="btn btn-ghost btn-sm" style="font-size:10px">Edit</button></td></tr>`;}).join('');
}
function rPIGrid() {
  const c=document.getElementById('pi-dots'); if(!c) return;
  c.innerHTML='';
  const stratCol={'🔴 Manage Closely':'#EF4444','🟡 Keep Satisfied':'#F59E0B','🟢 Keep Informed':'#10B981','⬜ Monitor':'#94A3B8'};
  DB.stakeholders.forEach(s=>{const pct=v=>((v-1)/4*78+11);const x=pct(s.power),y=100-pct(s.interest),strat=getStrategy(s.power,s.interest),d=document.createElement('div');d.className='pi-dot';d.style.cssText=`left:${x}%;top:${y}%;background:${stratCol[strat]};`;d.setAttribute('data-tip',`${s.name} (${s.role}) — Power:${s.power} Interest:${s.interest}`);d.textContent=s.name.split(' ').map(w=>w[0]).join('').substring(0,2);c.appendChild(d);});
}
function rEngagement() {
  const c=document.getElementById('engagement-body'); if(!c) return;
  const levels=['Unaware','Resistant','Neutral','Supportive','Leading'];
  let h=`<div class="table-wrap"><table class="data-table"><thead><tr><th>Stakeholder</th>${levels.map(l=>`<th style="text-align:center">${l}</th>`).join('')}<th>Action Plan</th></tr></thead><tbody>`;
  DB.stakeholders.forEach(s=>{h+=`<tr><td><strong style="font-size:12px">${s.name}</strong><br><span style="font-size:10px;color:var(--muted)">${s.role}</span></td>${levels.map(l=>{const iC=l===s.current,iT=l===s.target;return`<td style="text-align:center">${iC?`<div style="width:24px;height:24px;border-radius:50%;background:${engCol(l)};margin:auto;display:flex;align-items:center;justify-content:center;color:#fff;font-size:8px;font-weight:700;" title="Current level">NOW</div>`:iT?`<div style="width:24px;height:24px;border-radius:50%;border:2px solid ${engCol(l)};margin:auto;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:700;color:${engCol(l)};" title="Target level">TGT</div>`:`<div style="width:7px;height:7px;border-radius:50%;background:var(--border);margin:auto;"></div>`}</td>`;}).join('')}<td style="font-size:10px;color:var(--muted);max-width:160px">${s.action||'No action plan'}</td></tr>`;});
  h+='</tbody></table></div>';
  c.innerHTML=h;
}
function rRaci() {
  const c=document.getElementById('raci-body'); if(!c) return;
  const cols={'R':'#4F46E5','A':'#EF4444','C':'#10B981','I':'#F59E0B','':'#E2E8F0'};
  let h=`<div class="table-wrap"><table class="data-table"><thead><tr><th>Task / Deliverable</th>${DB.raciRoles.map(r=>`<th style="text-align:center;font-size:9px">${r}</th>`).join('')}</tr></thead><tbody>`;
  DB.raciMatrix.forEach((row,ri)=>{const hasA=row.includes('A');h+=`<tr><td style="font-weight:600;font-size:12px">${DB.raciTasks[ri]}${!hasA?` <span class="badge badge-red" style="margin-left:5px;font-size:8px">Missing A!</span>`:''}</td>${row.map((cell,ci)=>`<td style="text-align:center"><select style="border:none;background:${(cols[cell]||cols[''])}22;color:${cols[cell]||'var(--muted)'};font-weight:700;font-size:11px;padding:3px 7px;border-radius:5px;cursor:pointer;font-family:inherit;" onchange="updateRaci(${ri},${ci},this.value)">${['','R','A','C','I'].map(v=>`<option value="${v}"${cell===v?' selected':''}>${v||'—'}</option>`).join('')}</select></td>`).join('')}</tr>`;});
  h+=`</tbody></table></div><div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap;">${Object.entries({'R':'Responsible — does the work','A':'Accountable — ONE person owns the outcome','C':'Consulted — input before decisions','I':'Informed — updates after decisions'}).map(([k,v])=>`<div style="display:flex;align-items:center;gap:5px;font-size:10px;"><span style="width:18px;height:18px;border-radius:4px;background:${(cols[k]||cols[''])}22;color:${cols[k]};display:flex;align-items:center;justify-content:center;font-weight:700;">${k}</span>${v}</div>`).join('')}</div>`;
  c.innerHTML=h;
}
function rComms() {
  const c=document.getElementById('comms-body'); if(!c) return;
  c.innerHTML=`<div class="table-wrap"><table class="data-table"><thead><tr><th>What</th><th>Who</th><th>How</th><th>Frequency</th><th>Owner</th><th>Next Due</th><th>Status</th></tr></thead><tbody>${DB.comms.map(c=>`<tr><td style="font-weight:600;font-size:12px">${c.what}</td><td style="font-size:11px">${c.who}</td><td><span class="badge badge-indigo">${c.how}</span></td><td style="font-size:11px">${c.when}</td><td style="font-size:11px">${c.owner}</td><td style="font-family:'JetBrains Mono',monospace;font-size:10px;${c.status==='Overdue'?'color:var(--red-d)':''}">${c.next||'—'}</td><td>${statusBadge(c.status)}</td></tr>`).join('')}</tbody></table></div>`;
}
function rRAG() {
  const c=document.getElementById('rag-body'); if(!c) return;
  const areas=[{key:'scope',icon:'📦',label:'Scope'},{key:'schedule',icon:'📅',label:'Schedule (SPI→)'},{key:'cost',icon:'💰',label:'Cost (CPI→)'},{key:'quality',icon:'✅',label:'Quality'},{key:'risk',icon:'🎯',label:'Risk (RAID→)'},{key:'resources',icon:'👥',label:'Resources'},{key:'stakeholders',icon:'🤝',label:'Stakeholders'}];
  const ragC={green:'var(--emerald)',amber:'var(--amber)',red:'var(--red)'};
  const ragBG={green:'var(--emerald-bg)',amber:'var(--amber-bg)',red:'var(--red-bg)'};
  c.innerHTML=`<div style="display:flex;flex-direction:column;gap:10px;">${areas.map(a=>{const r=DB.rag[a.key];return`<div style="background:var(--surface);border:1.5px solid ${ragC[r.status]};border-radius:12px;padding:14px 16px;display:grid;grid-template-columns:auto auto 1fr auto;align-items:center;gap:12px;"><div style="font-size:18px">${a.icon}</div><div><div style="font-size:11px;font-weight:700;color:var(--ink);margin-bottom:2px">${a.label}</div><div class="rag"><div class="rag-dot ${r.status}"></div><span style="font-size:10px;font-weight:700;color:${ragC[r.status]};text-transform:uppercase">${r.status}</span>${r.auto?'<span style="font-size:8px;color:var(--muted);margin-left:4px;background:var(--bg-2);padding:1px 5px;border-radius:10px;">AUTO</span>':''}</div></div><textarea style="width:100%;font-family:Inter,system-ui,-apple-system,sans-serif;font-size:11px;border:1px solid var(--border);border-radius:6px;padding:5px 8px;resize:none;min-height:44px;color:var(--ink-3);background:${ragBG[r.status]}" onchange="updateRAG('${a.key}',this.value)">${r.commentary}</textarea><div style="display:flex;flex-direction:column;gap:4px;">${['green','amber','red'].map(s=>`<button onclick="setRAG('${a.key}','${s}')" style="width:24px;height:24px;border-radius:50%;border:2px solid ${s==='green'?'#10B981':s==='amber'?'#F59E0B':'#EF4444'};background:${r.status===s?ragC[s]:'transparent'};cursor:pointer;transition:all .15s;" title="Set to ${s}"></button>`).join('')}</div></div>`;}).join('')}<div class="alert info"><span class="alert-icon">💡</span><div>Fields marked <strong>AUTO</strong> update automatically from RAID, EVM, and Change Control inputs. Click the coloured circles on any row to manually override. All changes log in the Audit Trail.</div></div></div>`;
}
function rCR() {
  const b=document.getElementById('tb-cr'); if(!b) return;
  b.innerHTML=DB.crs.map(cr=>`<tr><td style="font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:700">${cr.id}</td><td style="font-size:11px;max-width:150px">${cr.desc.substring(0,70)}${cr.desc.length>70?'...':''}</td><td style="font-size:11px">${cr.by}</td><td style="font-family:'JetBrains Mono',monospace;font-size:10px">${cr.date}</td><td style="font-family:'JetBrains Mono',monospace;font-weight:700;color:${cr.sched>5?'var(--red-d)':'var(--amber-d)'}">+${cr.sched}d</td><td style="font-family:'JetBrains Mono',monospace;font-weight:700;color:${cr.cost>100000?'var(--red-d)':'var(--amber-d)'}">₹${(cr.cost/1000).toFixed(0)}K</td><td style="font-size:10px">${cr.qual}</td><td>${statusBadge(cr.status)}</td><td style="display:flex;gap:4px;"><button class="btn btn-secondary btn-sm" onclick="decideCR('${cr.id}','Approved')">✅</button><button class="btn btn-danger btn-sm" onclick="decideCR('${cr.id}','Rejected')">❌</button></td></tr>`).join('');
}
function rEscalation() {
  const c=document.getElementById('esc-body'); if(!c) return;
  c.innerHTML=DB.escalations.map(esc=>`<div class="card" style="margin-bottom:14px;"><div class="card-header"><div class="card-icon red">📣</div><div><div class="card-title">${esc.id} — ${esc.issue}</div></div></div><div class="card-body"><div class="esc-timeline">${esc.stages.filter(s=>s.label).map(s=>`<div class="esc-stage"><div class="esc-dot ${s.status}">${s.status==='done'?'✅':s.status==='active'?'🔴':'⭕'}</div><div class="esc-content"><div class="esc-title">Stage ${s.n} — ${s.label}</div><div class="esc-meta">${s.date?'📅 '+s.date:'Not yet triggered'} ${s.owner?'· 👤 '+s.owner:''}</div>${s.action?`<div style="font-size:10px;color:var(--muted);margin-top:4px">${s.action}</div>`:''}${s.status==='active'&&s.n<4?`<div style="margin-top:6px"><button class="btn btn-secondary btn-sm" onclick="escalateStage('${esc.id}',${s.n})">Escalate to Stage ${s.n+1} →</button></div>`:''}</div></div>`).join('')}</div></div></div>`).join('');
}
function rDecisions() {
  const c=document.getElementById('decisions-body'); if(!c) return;
  c.innerHTML=`<div class="table-wrap"><table class="data-table"><thead><tr><th>Decision Type</th><th>Description</th><th>PM Authority</th><th>Sponsor Authority</th><th>Steering Committee</th><th>Response Target</th></tr></thead><tbody>${DB.decisions.map(d=>`<tr><td style="font-weight:700;font-size:12px">${d.type}</td><td style="font-size:11px;color:var(--muted)">${d.desc}</td><td><span class="badge badge-indigo">${d.pm}</span></td><td><span class="badge badge-amber">${d.sponsor}</span></td><td><span class="badge badge-red">${d.steering}</span></td><td style="font-size:10px;color:var(--muted)">${d.resp}</td></tr>`).join('')}</tbody></table></div><div class="alert info" style="margin-top:14px;"><span class="alert-icon">💡</span><div><strong>Automation:</strong> When a CR is raised, it routes automatically based on these thresholds. Cost ≤5% BAC → PM approval. 5–15% → Sponsor. >15% or any scope change → Steering Committee required before any work starts.</div></div>`;
}
function rAudit() {
  const c=document.getElementById('audit-body'); if(!c) return;
  c.innerHTML=`<div class="table-wrap"><table class="data-table"><thead><tr><th>Timestamp</th><th>User</th><th>Module</th><th>Action</th></tr></thead><tbody>${DB.audit.map(a=>`<tr><td style="font-family:'JetBrains Mono',monospace;font-size:10px;white-space:nowrap">${a.ts}</td><td><span class="badge badge-indigo">${a.user}</span></td><td><span class="badge badge-gray">${a.mod}</span></td><td style="font-size:11px">${a.action}</td></tr>`).join('')}</tbody></table></div>`;
}
function rReports() {
  const el = document.getElementById('s-reports');
  if (!el) return;
  const reports = [
    {id:'RPT001',name:'Portfolio RAG Summary',type:'Governance',freq:'Weekly',lastRun:'2024-03-15',owner:'TM001',format:'PDF'},
    {id:'RPT002',name:'EVM Performance Dashboard',type:'Financial',freq:'Fortnightly',lastRun:'2024-03-08',owner:'TM001',format:'Excel'},
    {id:'RPT003',name:'Sprint Velocity Tracker',type:'Agile',freq:'Per Sprint',lastRun:'2024-03-10',owner:'TM001',format:'PDF'},
    {id:'RPT004',name:'Risk & Issue Register',type:'Risk',freq:'Weekly',lastRun:'2024-03-14',owner:'TM001',format:'PDF'},
    {id:'RPT005',name:'Steering Committee Pack',type:'Executive',freq:'Fortnightly',lastRun:'2024-03-08',owner:'TM001',format:'PPT'},
    {id:'RPT006',name:'Delay Trace Report',type:'Intelligence',freq:'On demand',lastRun:'2024-03-12',owner:'TM001',format:'PDF'},
    {id:'RPT007',name:'Learning Library Export',type:'Intelligence',freq:'Monthly',lastRun:'2024-03-01',owner:'TM001',format:'PDF'},
    {id:'RPT008',name:'Team Capacity Report',type:'Resource',freq:'Per Sprint',lastRun:'2024-03-10',owner:'TM001',format:'Excel'},
  ];
  const typeCol = {Governance:'var(--indigo)',Financial:'var(--emerald)',Agile:'var(--teal)',
    Risk:'var(--amber)',Executive:'var(--purple)',Intelligence:'#00D4AA',Resource:'var(--blue)'};
  const cards = reports.map(r => `
    <div class="card vc-enter" style="margin-bottom:12px;">
      <div class="card-body" style="padding:16px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--ink);margin-bottom:4px;">${r.name}</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <span style="font-size:10px;font-weight:600;padding:2px 8px;border-radius:50px;background:${typeCol[r.type]||'var(--muted)'};color:#fff;">${r.type}</span>
            <span style="font-size:11px;color:var(--muted);">📅 ${r.freq}</span>
            <span style="font-size:11px;color:var(--muted);">Last: ${r.lastRun}</span>
            <span style="font-size:11px;color:var(--muted);">📄 ${r.format}</span>
          </div>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-ghost btn-sm" onclick="toast('Generating ${r.name}...','info')">▶ Run Now</button>
          <button class="btn btn-ghost btn-sm" onclick="toast('${r.name} scheduled','success')">🔔 Schedule</button>
          <button class="btn btn-primary btn-sm" onclick="toast('Downloading ${r.name}','success')">⬇ Download</button>
        </div>
      </div>
    </div>`).join('');

  const body = el.querySelector('.page-content') || el;
  // Target the reports-list div or page-content
  var target = document.getElementById('reports-list') || el.querySelector('.page-content');
  if (target) {
    target.innerHTML = cards;
  } else {
    var div = document.createElement('div');
    div.id = 'reports-list';
    div.innerHTML = cards;
    el.appendChild(div);
  }
}
function rImport() {
  const el = document.getElementById('s-import');
  if (!el) return;
  const integrations = [
    {name:'Jira',icon:'🔵',status:'Connected',lastSync:'2 mins ago',records:'847 stories synced'},
    {name:'Azure DevOps',icon:'🟣',status:'Connected',lastSync:'5 mins ago',records:'312 work items'},
    {name:'MS Project',icon:'🟦',status:'Not connected',lastSync:'—',records:'—'},
    {name:'Excel / CSV',icon:'🟢',status:'Ready',lastSync:'—',records:'Upload to import'},
    {name:'Confluence',icon:'🔷',status:'Connected',lastSync:'1 hr ago',records:'24 pages synced'},
    {name:'Slack',icon:'🟡',status:'Connected',lastSync:'Live',records:'Notifications active'},
  ];
  const cards = integrations.map(i => `
    <div class="card vc-enter" style="margin-bottom:12px;">
      <div class="card-body" style="padding:16px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="font-size:28px;">${i.icon}</span>
          <div>
            <div style="font-size:13px;font-weight:700;color:var(--ink);">${i.name}</div>
            <div style="font-size:11px;color:var(--muted);">${i.records}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <div style="text-align:right;">
            <div style="font-size:10px;font-weight:700;color:${i.status==='Connected'?'var(--emerald)':i.status==='Ready'?'var(--blue)':'var(--muted)'};">${i.status.toUpperCase()}</div>
            <div style="font-size:10px;color:var(--muted);">Last sync: ${i.lastSync}</div>
          </div>
          <button class="btn btn-${i.status==='Connected'?'ghost':'primary'} btn-sm"
            onclick="toast('${i.name} ${i.status==='Connected'?'sync triggered':'connection initiated'}','${i.status==='Connected'?'success':'info'}')">
            ${i.status==='Connected'?'⟳ Sync':'Connect'}
          </button>
        </div>
      </div>
    </div>`).join('');

  var iel = document.getElementById('import-list') || el.querySelector('.page-content');
  if (iel) { iel.innerHTML = cards; }
  else { var id2 = document.createElement('div'); id2.id='import-list'; id2.innerHTML=cards; el.appendChild(id2); }
}
function rBacklog() {
  populateEpicSelects();
  const fEpic = document.getElementById('bl-filter-epic')?.value;
  const fStatus = document.getElementById('bl-filter-status')?.value;
  const fPri = document.getElementById('bl-filter-priority')?.value;

  let stories = [...DB.stories];
  if (fEpic) stories = stories.filter(s => s.epic === fEpic);
  if (fStatus) stories = stories.filter(s => s.status === fStatus);
  if (fPri) stories = stories.filter(s => s.priority === fPri);

  // Sort by WSJF descending (cod / points)
  stories.sort((a,b) => (b.cod/b.points) - (a.cod/a.points));

  const priCol = {'Must Have':'badge-red','Should Have':'badge-amber','Could Have':'badge-indigo','Won\'t Have':'badge-gray'};
  const statusCol = {'Backlog':'badge-gray','Ready':'badge-indigo','In Sprint':'badge-amber','Done':'badge-green'};
  const ptsCls = p => p<=2?'pts-1':p<=5?'pts-3':'pts-8';

  const tb = document.getElementById('tb-backlog');
  if (!tb) return;
  tb.innerHTML = stories.map(s => {
    const epic = DB.epics.find(e => e.id === s.epic);
    const wsjf = (s.cod / s.points).toFixed(1);
    return `<tr>
      <td style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--muted)">${s.id}</td>
      <td>${epic ? `<div style="display:flex;align-items:center;gap:5px;"><div class="epic-dot" style="background:${epic.colour}"></div><span style="font-size:10px;font-weight:600">${epic.name}</span></div>` : '—'}</td>
      <td>
        <div style="font-size:12px;font-weight:600;color:var(--ink);margin-bottom:2px">${s.title}</div>
        ${s.ac ? `<div style="font-size:10px;color:var(--muted);line-height:1.4">${s.ac.substring(0,70)}...</div>` : ''}
      </td>
      <td><span class="badge ${priCol[s.priority]}">${s.priority}</span></td>
      <td><span class="badge ${ptsCls(s.points)}" style="font-family:'JetBrains Mono',monospace">${s.points}pt</span></td>
      <td style="font-family:'JetBrains Mono',monospace;font-weight:700;color:${wsjf>=5?'var(--red-d)':wsjf>=3?'var(--amber-d)':'var(--muted)'}">${wsjf}</td>
      <td style="font-size:11px">${s.owner}</td>
      <td><span class="badge ${statusCol[s.status]}">${s.status}</span></td>
      <td>
        ${s.status === 'Backlog' || s.status === 'Ready' ?
          `<button class="btn btn-secondary btn-sm" onclick="moveToSprint('${s.id}')" title="Add to current sprint">🏃 Sprint</button>` : ''}
        ${s.status === 'In Sprint' ?
          `<button class="btn btn-ghost btn-sm" onclick="removeFromSprint('${s.id}')" title="Remove from sprint">↩</button>` : ''}
      </td>
    </tr>`;
  }).join('');

  // Stats bar
  const total = DB.stories.reduce((s,x) => s + x.points, 0);
  const done = DB.stories.filter(s => s.status==='Done').reduce((s,x) => s+x.points, 0);
  const inSprint = DB.stories.filter(s => s.status==='In Sprint').reduce((s,x) => s+x.points, 0);
  const backlog = DB.stories.filter(s => s.status==='Backlog').reduce((s,x) => s+x.points, 0);
  const statsEl = document.getElementById('bl-stats');
  if (statsEl) statsEl.innerHTML = [
    ['Total Backlog','📦',total,'pts'],
    ['In Sprint','🏃',inSprint,'pts'],
    ['Done','✅',done,'pts'],
    ['Remaining','📋',backlog,'pts']
  ].map(([l,i,v,u]) => `<div class="bl-stat">${i} ${l}: <span>${v}</span> <span style="font-size:10px;color:var(--muted)">${u}</span></div>`).join('');

  // Populate epic filter
  const epSel = document.getElementById('bl-filter-epic');
  if (epSel && epSel.children.length === 1) {
    DB.epics.forEach(e => {
      const opt = document.createElement('option');
      opt.value = e.id; opt.textContent = e.name;
      epSel.appendChild(opt);
    });
  }

  // Update badge
  const sprintCount = DB.stories.filter(s => s.status==='In Sprint').length;
  const badge = document.getElementById('b-sprint');
  if (badge) badge.textContent = sprintCount;
}
function rSprint() {
  const cols = ['To Do','In Progress','In Review','Done'];
  const colIds = {'To Do':'todo','In Progress':'inprogress','In Review':'inreview','Done':'done'};

  cols.forEach(status => {
    const colId = colIds[status];
    const container = document.getElementById(`cards-${colId}`);
    const countEl = document.getElementById(`count-${colId}`);
    if (!container) return;
    const cards = DB.sprintCards.filter(c => c.status === status);
    if (countEl) countEl.textContent = cards.length;
    container.innerHTML = cards.map(c => `
      <div class="kcard" draggable="true" id="kcard-${c.id}"
           style="border-left-color:${c.epicCol}"
           ondragstart="dragStart(event,'${c.id}')"
           ondragend="dragEnd(event)">
        <div class="kcard-title">${c.title}</div>
        <div class="kcard-meta">
          ${c.points > 0 ? `<span class="kcard-pts">${c.points}pt</span>` : ''}
          ${c.owner ? `<span class="kcard-owner">👤 ${c.owner}</span>` : ''}
          ${c.epic ? `<span class="kcard-epic" style="background:${c.epicCol}22;color:${c.epicCol}">${c.epic}</span>` : ''}
        </div>
      </div>`).join('');
  });

  updateSprintStats();
}
function rBurndown() {
  const container = document.getElementById('burndown-chart-container');
  if (!container) return;
  const data = DB.burndownData;
  const W=540, H=220, ml=50, mr=20, mt=20, mb=40;
  const maxY = 50, days = 14;
  const chartW = W-ml-mr, chartH = H-mt-mb;
  const xStep = chartW/(days-1);
  const yScale = v => mt + chartH - (v/maxY)*chartH;
  const xScale = d => ml + (d-1)*xStep;

  // Build path data
  let idealPath = '', actualPath = '';
  data.forEach((d,i) => {
    const x = xScale(d.day), iy = yScale(d.ideal);
    idealPath += (i===0?`M${x},${iy}`:`L${x},${iy}`);
    if (d.actual !== null) {
      const ay = yScale(d.actual);
      actualPath += (actualPath===''?`M${x},${ay}`:`L${x},${ay}`);
    }
  });

  // Find flat section (blocker D4-D7)
  const flatStart = data.find((d,i) => i>0 && d.actual!==null && d.actual===data[i-1].actual);
  const flatX = flatStart ? xScale(flatStart.day) : null;

  const svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="Inter,system-ui,sans-serif" class="chart-svg">
  <!-- Grid lines -->
  ${[0,10,20,30,40,50].map(v=>`<line x1="${ml}" y1="${yScale(v)}" x2="${W-mr}" y2="${yScale(v)}" stroke="#E2E8F0" stroke-width="1"/>`).join('')}
  <!-- Axes -->
  <line x1="${ml}" y1="${mt}" x2="${ml}" y2="${H-mb}" stroke="#CBD5E1" stroke-width="1.5"/>
  <line x1="${ml}" y1="${H-mb}" x2="${W-mr}" y2="${H-mb}" stroke="#CBD5E1" stroke-width="1.5"/>
  <!-- Y labels -->
  ${[0,10,20,30,40,50].map(v=>`<text x="${ml-8}" y="${yScale(v)+4}" font-size="10" fill="#94A3B8" text-anchor="end" font-family="'JetBrains Mono',monospace">${v}</text>`).join('')}
  <!-- X labels -->
  ${[1,4,7,10,14].map(d=>`<text x="${xScale(d)}" y="${H-mb+14}" font-size="10" fill="#94A3B8" text-anchor="middle" font-family="'JetBrains Mono',monospace">D${d}</text>`).join('')}
  <!-- Axis labels -->
  <text x="${ml-32}" y="${H/2}" font-size="9" fill="#94A3B8" text-anchor="middle" transform="rotate(-90,${ml-32},${H/2})">Pts Remaining</text>
  <!-- Blocker zone highlight -->
  ${flatX ? `<rect x="${xScale(4)}" y="${mt}" width="${xScale(7)-xScale(4)}" height="${chartH}" fill="#EF4444" opacity=".06" rx="2"/>` : ''}
  <!-- Ideal line (dashed) -->
  <path d="${idealPath}" fill="none" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="8,5"/>
  <!-- Actual line -->
  <path d="${actualPath}" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- Actual area fill -->
  <path d="${actualPath}L${xScale(data.filter(d=>d.actual!==null).slice(-1)[0].day)},${H-mb}L${xScale(1)},${H-mb}Z" fill="#EF4444" opacity=".06"/>
  <!-- Data points -->
  ${data.filter(d=>d.actual!==null).map(d=>`<circle cx="${xScale(d.day)}" cy="${yScale(d.actual)}" r="4" fill="${d.actual===0?'#10B981':'#EF4444'}" stroke="#fff" stroke-width="1.5"/>`).join('')}
  <!-- Blocker annotation -->
  ${flatX ? `
    <line x1="${xScale(4)}" y1="${mt}" x2="${xScale(4)}" y2="${H-mb}" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="4,3"/>
    <rect x="${xScale(4)-52}" y="${mt+4}" width="100" height="28" fill="#EF4444" rx="5"/>
    <text x="${xScale(4)+(-2)}" y="${mt+15}" font-size="10" fill="#fff" text-anchor="middle" font-weight="700">🎯 Flat D4–D7</text>
    <text x="${xScale(4)+(-2)}" y="${mt+27}" font-size="9" fill="#fca5a5" text-anchor="middle">Escalated D4 morning</text>
  ` : ''}
  <!-- Recovery annotation -->
  <rect x="${xScale(8)-50}" y="${yScale(18)-34}" width="100" height="28" fill="#10B981" rx="5"/>
  <text x="${xScale(8)}" y="${yScale(18)-23}" font-size="10" fill="#fff" text-anchor="middle" font-weight="700">✅ Recovery</text>
  <text x="${xScale(8)}" y="${yScale(18)-11}" font-size="9" fill="#6ee7b7" text-anchor="middle">6 of 8 pts back</text>
  <!-- Legend -->
  <line x1="${ml+8}" y1="${H-8}" x2="${ml+28}" y2="${H-8}" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="5,4"/>
  <text x="${ml+33}" y="${H-4}" font-size="10" fill="#64748B">Ideal</text>
  <line x1="${ml+80}" y1="${H-8}" x2="${ml+100}" y2="${H-8}" stroke="#EF4444" stroke-width="2.5"/>
  <text x="${ml+105}" y="${H-4}" font-size="10" fill="#64748B">Actual</text>
</svg>`;
  container.innerHTML = svg;

  // Stats
  const statsEl = document.getElementById('burndown-stats');
  if (!statsEl) return;
  const cards = DB.sprintCards;
  const done = cards.filter(c=>c.status==='Done').reduce((s,c)=>s+c.points,0);
  const rem = cards.reduce((s,c)=>s+c.points,0) - done;
  const activeSp = DB.sprints.find(s=>s.status==='Active');
  statsEl.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:10px;">
      ${[
        ['Total Committed',cards.reduce((s,c)=>s+c.points,0)+' pts','var(--indigo)'],
        ['Done ✅',done+' pts','var(--emerald-d)'],
        ['Remaining 📋',rem+' pts','var(--red-d)'],
        ['Sprint Day','Day 4 of 14','var(--muted)'],
        ['Avg pts/day needed',(rem/10).toFixed(1)+' pts/day','var(--amber-d)']
      ].map(([l,v,c])=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--bg-2);border-radius:8px;">
          <span style="font-size:12px;font-weight:600;color:var(--muted)">${l}</span>
          <span style="font-family:'JetBrains Mono',monospace;font-weight:800;font-size:15px;color:${c}">${v}</span>
        </div>`).join('')}
      <div class="alert warn" style="margin-top:6px;">
        <span class="alert-icon">💡</span>
        <div style="font-size:11px;"><strong>Sprint 3 story:</strong> Burn-down went flat on D4. Escalated that morning — not at stand-up on D7. Recovered 6 of 8 blocked points before sprint end.</div>
      </div>
    </div>`;
}
function rVelocity() {
  const container = document.getElementById('velocity-chart-container');
  if (!container) return;
  const hist = DB.velocityHistory;
  const W=540,H=200,ml=50,mr=40,mt=20,mb=40;
  const maxV = 50;
  const chartW=W-ml-mr, chartH=H-mt-mb;
  const barW = (chartW/hist.length)*0.55;
  const gap = chartW/hist.length;
  const yScale = v => mt+chartH-(v/maxV)*chartH;

  // Calculate average from completed sprints
  const completed = hist.filter(s=>s.completed!==null);
  const avg = completed.length ? Math.round(completed.reduce((s,x)=>s+x.completed,0)/completed.length) : 42;
  const avgY = yScale(avg);

  const svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="Inter,system-ui,sans-serif" class="chart-svg">
  <!-- Grid -->
  ${[0,10,20,30,40,50].map(v=>`<line x1="${ml}" y1="${yScale(v)}" x2="${W-mr}" y2="${yScale(v)}" stroke="#E2E8F0" stroke-width="1"/>`).join('')}
  <!-- Axes -->
  <line x1="${ml}" y1="${mt}" x2="${ml}" y2="${H-mb}" stroke="#CBD5E1" stroke-width="1.5"/>
  <line x1="${ml}" y1="${H-mb}" x2="${W-mr}" y2="${H-mb}" stroke="#CBD5E1" stroke-width="1.5"/>
  <!-- Y labels -->
  ${[0,10,20,30,40,50].map(v=>`<text x="${ml-6}" y="${yScale(v)+4}" font-size="10" fill="#94A3B8" text-anchor="end" font-family="'JetBrains Mono',monospace">${v}</text>`).join('')}
  <!-- Average line -->
  <line x1="${ml}" y1="${avgY}" x2="${W-mr}" y2="${avgY}" stroke="#4F46E5" stroke-width="2" stroke-dasharray="8,4"/>
  <text x="${W-mr+4}" y="${avgY+4}" font-size="10" fill="#4F46E5" font-weight="700" font-family="'JetBrains Mono',monospace">${avg}</text>
  <!-- Bars -->
  ${hist.map((s,i) => {
    const x = ml + i*gap + gap/2;
    const completed = s.completed;
    const committed = s.committed;
    const cY = yScale(committed);
    const vY = completed!==null ? yScale(completed) : null;
    const colour = completed===null?'#CBD5E1':completed>=committed*0.9?'#10B981':'#F59E0B';
    return `
      <!-- Committed (outline) -->
      <rect x="${x-barW/2-2}" y="${cY}" width="${barW+4}" height="${H-mb-cY}" fill="none" stroke="#CBD5E1" stroke-width="1.5" rx="3"/>
      <!-- Completed (filled) -->
      ${completed!==null?`<rect x="${x-barW/2}" y="${vY}" width="${barW}" height="${H-mb-vY}" fill="${colour}" opacity=".85" rx="3"/>
      <text x="${x}" y="${vY-6}" font-size="12" fill="${colour}" text-anchor="middle" font-weight="800" font-family="'JetBrains Mono',monospace">${completed}</text>`
      :`<rect x="${x-barW/2}" y="${mt+10}" width="${barW}" height="${chartH-10}" fill="#F1F5F9" rx="3" opacity=".7"/>
      <text x="${x}" y="${H/2+5}" font-size="10" fill="#94A3B8" text-anchor="middle">Pending</text>`}
      <!-- X label -->
      <text x="${x}" y="${H-mb+14}" font-size="10" fill="#64748B" text-anchor="middle">${s.name.split(' ')[0]+' '+s.name.split(' ')[1]}</text>
    `;
  }).join('')}
  <!-- Legend -->
  <rect x="${ml}" y="${H-6}" width="12" height="8" fill="#10B981" opacity=".85" rx="2"/>
  <text x="${ml+16}" y="${H-0}" font-size="9" fill="#64748B">Completed</text>
  <line x1="${ml+90}" y1="${H-2}" x2="${ml+102}" y2="${H-2}" stroke="#4F46E5" stroke-width="2" stroke-dasharray="5,3"/>
  <text x="${ml+106}" y="${H-0}" font-size="9" fill="#64748B">Avg (${avg} pts)</text>
</svg>`;
  container.innerHTML = svg;

  // Forecast
  const fEl = document.getElementById('velocity-forecast');
  if (!fEl) return;
  const remaining = DB.stories.filter(s=>s.status!=='Done').reduce((s,x)=>s+x.points,0);
  const sprints = Math.ceil(remaining/avg);
  const weeks = sprints*2;
  fEl.innerHTML = `
    <div style="display:flex;flex-direction:column;gap:10px;">
      <div style="padding:14px;background:var(--indigo-bg);border-radius:var(--r);border:1px solid rgba(79,70,229,.2);text-align:center;">
        <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:6px;">Forecast to Release</div>
        <div style="font-size:36px;font-weight:800;color:var(--indigo);font-family:'JetBrains Mono',monospace;letter-spacing:-2px">${sprints}</div>
        <div style="font-size:12px;color:var(--muted)">sprints · ~${weeks} weeks</div>
      </div>
      ${[
        ['Average Velocity',avg+' pts/sprint','var(--indigo)'],
        ['Remaining Points',remaining+' pts','var(--amber-d)'],
        ['Forecast Formula',remaining+' ÷ '+avg+' = '+sprints+' sprints','var(--muted)'],
        ['Sprints Completed',completed.length,'var(--emerald-d)']
      ].map(([l,v,c])=>`
        <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg-2);border-radius:8px;">
          <span style="font-size:11px;font-weight:600;color:var(--muted)">${l}</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;color:${c}">${v}</span>
        </div>`).join('')}
      <div class="alert info">
        <span class="alert-icon">💡</span>
        <div style="font-size:11px;">This forecast updates every sprint. Range narrows as real data accumulates. Never give a single date — give a range: ${sprints}–${sprints+1} sprints.</div>
      </div>
    </div>`;
}
function rRetro() {
  const sprintSel = document.getElementById('retro-sprint-sel')?.value || 'S3';
  const data = DB.retroItems[sprintSel] || {well:[],improve:[],actions:[]};

  const renderCards = (items, col) => {
    const el = document.getElementById(`retro-${col}`);
    if (!el) return;
    el.innerHTML = items.map(item => `
      <div class="retro-card ${col==='actions'?'retro-card-action':''}">
        <div style="font-size:12px;line-height:1.5">${item.desc}</div>
        ${col!=='actions' ? `<div style="margin-top:6px;display:flex;align-items:center;gap:6px;"><span style="font-size:10px;color:var(--muted)">👍 ${item.votes||0} votes</span></div>` : ''}
        ${col==='actions' ? `
          <div class="retro-action-meta">
            <span class="badge ${item.status==='Closed'?'badge-green':'badge-amber'}">● ${item.status||'Open'}</span>
            <span style="font-size:10px;color:var(--muted)">👤 ${item.owner}</span>
            <span style="font-size:10px;color:var(--muted)">📅 ${item.date}</span>
          </div>` : ''}
      </div>`).join('') || `<div style="text-align:center;padding:20px;color:var(--muted-l);font-size:12px">No items yet — click ➕ Add Item</div>`;
    const countEl = document.getElementById(`rc-${col}`);
    if (countEl) countEl.textContent = items.length;
  };

  renderCards(data.well,'well');
  renderCards(data.improve,'improve');
  renderCards(data.actions,'actions');

  // History
  const hist = document.getElementById('retro-history');
  if (!hist) return;
  const pastSprints = Object.keys(DB.retroItems).filter(k => k !== sprintSel);
  hist.innerHTML = pastSprints.map(sp => {
    const d = DB.retroItems[sp];
    return `<div style="padding:12px;border:1px solid var(--border);border-radius:var(--r-sm);margin-bottom:8px;background:var(--surface);">
      <div style="font-size:12px;font-weight:700;color:var(--ink);margin-bottom:6px;">Sprint ${sp.slice(1)} Retrospective</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;font-size:11px;color:var(--muted);">
        <span>😊 ${d.well.length} went well</span>
        <span>🔧 ${d.improve.length} to improve</span>
        <span>✅ ${d.actions.length} actions (${d.actions.filter(a=>a.status==='Closed').length} closed)</span>
      </div>
    </div>`;
  }).join('') || '<div style="font-size:12px;color:var(--muted)">No previous retrospectives.</div>';
}
function rDelivery() {
  // Burn-Up Chart
  const buEl = document.getElementById('burnup-chart');
  if (buEl) {
    const W=500,H=180,ml=46,mr=20,mt=16,mb=36;
    const scope=[200,200,200,220,220,220,235,235];
    const done=[0,38,74,100,120,136,155,null];
    const maxY=250,S=8;
    const cW=W-ml-mr,cH=H-mt-mb;
    const xs=i=>ml+i*(cW/(S-1));
    const ys=v=>mt+cH-(v/maxY)*cH;
    let sPath='',dPath='';
    scope.forEach((v,i)=>{sPath+=(i===0?`M${xs(i)},${ys(v)}`:`L${xs(i)},${ys(v)}`);});
    done.forEach((v,i)=>{if(v!==null)dPath+=(dPath===''?`M${xs(i)},${ys(v)}`:`L${xs(i)},${ys(v)}`);});
    buEl.innerHTML=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="Inter,system-ui,sans-serif" class="chart-svg">
      ${[0,50,100,150,200,235].map(v=>`<line x1="${ml}" y1="${ys(v)}" x2="${W-mr}" y2="${ys(v)}" stroke="#E2E8F0" stroke-width="1"/>`).join('')}
      <line x1="${ml}" y1="${mt}" x2="${ml}" y2="${H-mb}" stroke="#CBD5E1" stroke-width="1.5"/>
      <line x1="${ml}" y1="${H-mb}" x2="${W-mr}" y2="${H-mb}" stroke="#CBD5E1" stroke-width="1.5"/>
      ${[0,100,200].map(v=>`<text x="${ml-4}" y="${ys(v)+4}" font-size="9" fill="#94A3B8" text-anchor="end" font-family="'JetBrains Mono',monospace">${v}</text>`).join('')}
      <!-- Scope additions -->
      <line x1="${xs(3)}" y1="${ys(220)}" x2="${xs(3)}" y2="${ys(200)}" stroke="#EF4444" stroke-width="2"/>
      <text x="${xs(3)}" y="${ys(222)-4}" font-size="9" fill="#EF4444" text-anchor="middle" font-weight="700">+20 S3</text>
      <line x1="${xs(6)}" y1="${ys(235)}" x2="${xs(6)}" y2="${ys(220)}" stroke="#EF4444" stroke-width="2"/>
      <text x="${xs(6)}" y="${ys(237)-4}" font-size="9" fill="#EF4444" text-anchor="middle" font-weight="700">+15 S6</text>
      <path d="${sPath}" fill="none" stroke="#F59E0B" stroke-width="2" stroke-dasharray="7,4"/>
      <path d="${dPath}" fill="none" stroke="#10B981" stroke-width="2.5"/>
      <path d="${dPath}L${xs(6)},${H-mb}L${xs(0)},${H-mb}Z" fill="#10B981" opacity=".07"/>
      <!-- Gap indicator -->
      <line x1="${xs(7)}" y1="${ys(235)}" x2="${xs(7)}" y2="${ys(155)}" stroke="#F59E0B" stroke-width="2"/>
      <text x="${xs(7)+10}" y="${ys(195)}" font-size="9" fill="#F59E0B" font-weight="700">Gap</text>
      ${[1,2,3,4,5,6,7,8].map((s,i)=>`<text x="${xs(i)}" y="${H-mb+13}" font-size="9" fill="#64748B" text-anchor="middle">S${s}</text>`).join('')}
      <line x1="${ml}" y1="${H-6}" x2="${ml+20}" y2="${H-6}" stroke="#F59E0B" stroke-width="2" stroke-dasharray="5,3"/>
      <text x="${ml+25}" y="${H-2}" font-size="8" fill="#64748B">Total Scope</text>
      <line x1="${ml+100}" y1="${H-6}" x2="${ml+120}" y2="${H-6}" stroke="#10B981" stroke-width="2.5"/>
      <text x="${ml+125}" y="${H-2}" font-size="8" fill="#64748B">Work Done</text>
    </svg>`;
  }

  // Throughput chart
  const thEl = document.getElementById('throughput-chart');
  if (thEl) {
    const thr=[10,12,11,13,11];
    const avg=Math.round(thr.reduce((s,v)=>s+v,0)/thr.length);
    const W=500,H=180,ml=42,mr=30,mt=16,mb=36;
    const maxV=18;cW=W-ml-mr;cH=H-mt-mb;
    const bW=cW/thr.length*0.55;
    const xs=i=>ml+i*(cW/thr.length)+(cW/thr.length)/2;
    const ys=v=>mt+cH-(v/maxV)*cH;
    const avgY=ys(avg);
    thEl.innerHTML=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="Inter,system-ui,sans-serif" class="chart-svg">
      ${[0,5,10,15].map(v=>`<line x1="${ml}" y1="${ys(v)}" x2="${W-mr}" y2="${ys(v)}" stroke="#E2E8F0" stroke-width="1"/>`).join('')}
      <line x1="${ml}" y1="${mt}" x2="${ml}" y2="${H-mb}" stroke="#CBD5E1" stroke-width="1.5"/>
      <line x1="${ml}" y1="${H-mb}" x2="${W-mr}" y2="${H-mb}" stroke="#CBD5E1" stroke-width="1.5"/>
      <line x1="${ml}" y1="${avgY}" x2="${W-mr}" y2="${avgY}" stroke="#7C3AED" stroke-width="2" stroke-dasharray="7,4"/>
      <text x="${W-mr+4}" y="${avgY+4}" font-size="10" fill="#7C3AED" font-weight="700" font-family="'JetBrains Mono',monospace">${avg}</text>
      ${thr.map((v,i)=>`
        <rect x="${xs(i)-bW/2}" y="${ys(v)}" width="${bW}" height="${H-mb-ys(v)}" fill="#7C3AED" opacity=".8" rx="3"/>
        <text x="${xs(i)}" y="${ys(v)-5}" font-size="11" fill="#7C3AED" text-anchor="middle" font-weight="800" font-family="'JetBrains Mono',monospace">${v}</text>
        <text x="${xs(i)}" y="${H-mb+13}" font-size="9" fill="#64748B" text-anchor="middle">S${i+1}</text>
      `).join('')}
      ${[0,5,10,15].map(v=>`<text x="${ml-4}" y="${ys(v)+4}" font-size="9" fill="#94A3B8" text-anchor="end" font-family="'JetBrains Mono',monospace">${v}</text>`).join('')}
      <line x1="${ml}" y1="${H-6}" x2="${ml+20}" y2="${H-6}" stroke="#7C3AED" stroke-width="2" stroke-dasharray="5,3"/>
      <text x="${ml+25}" y="${H-2}" font-size="8" fill="#64748B">Avg Throughput (${avg} items)</text>
    </svg>`;
  }

  // Predictability chart
  const predEl = document.getElementById('predictability-chart');
  if (predEl) {
    const pred=[{pi:'PI 1',v:84,c:'#10B981'},{pi:'PI 2',v:78,c:'#F59E0B'},{pi:'PI 3',v:65,c:'#EF4444'},{pi:'PI 4',v:82,c:'#10B981'}];
    const W=500,H=200,ml=46,mr=30,mt=20,mb=40;
    const maxV=110,bW=50;
    const cW=W-ml-mr,cH=H-mt-mb;
    const xs=i=>ml+i*(cW/pred.length)+(cW/pred.length)/2;
    const ys=v=>mt+cH-(v/maxV)*cH;
    predEl.innerHTML=`<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="Inter,system-ui,sans-serif" class="chart-svg">
      ${[0,25,50,70,80,100].map(v=>`<line x1="${ml}" y1="${ys(v)}" x2="${W-mr}" y2="${ys(v)}" stroke="#E2E8F0" stroke-width="1"/>`).join('')}
      <line x1="${ml}" y1="${mt}" x2="${ml}" y2="${H-mb}" stroke="#CBD5E1" stroke-width="1.5"/>
      <line x1="${ml}" y1="${H-mb}" x2="${W-mr}" y2="${H-mb}" stroke="#CBD5E1" stroke-width="1.5"/>
      <!-- 80% target line -->
      <line x1="${ml}" y1="${ys(80)}" x2="${W-mr}" y2="${ys(80)}" stroke="#10B981" stroke-width="2" stroke-dasharray="7,4"/>
      <text x="${W-mr+4}" y="${ys(80)+4}" font-size="10" fill="#10B981" font-weight="700" font-family="'JetBrains Mono',monospace">80%</text>
      <!-- 70% danger line -->
      <line x1="${ml}" y1="${ys(70)}" x2="${W-mr}" y2="${ys(70)}" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="5,4"/>
      <text x="${W-mr+4}" y="${ys(70)+4}" font-size="10" fill="#EF4444" font-family="'JetBrains Mono',monospace">70%</text>
      ${pred.map((p,i)=>`
        <rect x="${xs(i)-bW/2}" y="${ys(p.v)}" width="${bW}" height="${H-mb-ys(p.v)}" fill="${p.c}" opacity=".85" rx="3"/>
        <text x="${xs(i)}" y="${ys(p.v)-7}" font-size="13" fill="${p.c}" text-anchor="middle" font-weight="800" font-family="'JetBrains Mono',monospace">${p.v}%</text>
        <text x="${xs(i)}" y="${H-mb+14}" font-size="10" fill="${p.c==='#EF4444'?p.c:'#64748B'}" text-anchor="middle" font-weight="${p.c==='#EF4444'?'700':'400'}">${p.pi}${p.v<70?' ↓RCA':''}</text>
      `).join('')}
      ${[0,50,80,100].map(v=>`<text x="${ml-4}" y="${ys(v)+4}" font-size="9" fill="#94A3B8" text-anchor="end" font-family="'JetBrains Mono',monospace">${v}%</text>`).join('')}
      <!-- RCA → Recovery arc -->
      <path d="M${xs(2)+10} ${ys(65)+10} Q${(xs(2)+xs(3))/2} ${ys(65)+30} ${xs(3)-10} ${ys(82)+10}" fill="none" stroke="#10B981" stroke-width="1.5" stroke-dasharray="4,3"/>
      <text x="${(xs(2)+xs(3))/2}" y="${ys(65)+48}" font-size="9" fill="#10B981" text-anchor="middle">RCA worked</text>
      <line x1="${ml}" y1="${H-6}" x2="${ml+20}" y2="${H-6}" stroke="#10B981" stroke-width="2" stroke-dasharray="5,3"/>
      <text x="${ml+25}" y="${H-2}" font-size="8" fill="#64748B">80% target</text>
      <line x1="${ml+100}" y1="${H-6}" x2="${ml+120}" y2="${H-6}" stroke="#EF4444" stroke-width="1.5" stroke-dasharray="4,3"/>
      <text x="${ml+125}" y="${H-2}" font-size="8" fill="#64748B">70% RCA threshold</text>
    </svg>`;
  }
}
function rTimeline() {
  const container = document.getElementById('timeline-container');
  const pillsEl = document.getElementById('timeline-proj-pills');
  if (!container || !pillsEl) return;

  // Project pills
  pillsEl.innerHTML = DB.projects.map(p => `
    <div style="display:flex;align-items:center;gap:8px;padding:7px 14px;border-radius:20px;background:${p.ragOverall==='red'?'var(--red-bg)':p.ragOverall==='amber'?'var(--amber-bg)':'var(--emerald-bg)'};border:1px solid ${p.ragOverall==='red'?'rgba(239,68,68,.3)':p.ragOverall==='amber'?'rgba(245,158,11,.3)':'rgba(16,185,129,.3)'};cursor:pointer;" onclick="scrollToProject('${p.id}')">
      <div class="rag-dot ${p.ragOverall}" style="${p.ragOverall==='in-progress'?'background:var(--indigo)':''}"></div>
      <span style="font-size:12px;font-weight:700;color:var(--ink)">${p.name}</span>
      <span style="font-size:10px;color:var(--muted)">S${p.currentSprint?.slice(1)||'?'} · ${p.completedSprints}/${p.totalSprints} sprints</span>
    </div>`).join('');

  // Timeline per project
  container.innerHTML = DB.projects.map(p => {
    const sprints = DB.sprintIntelligence[p.id] || [];
    const totalSprints = p.totalSprints;
    const cpiVal = cpi(p.ev, p.ac);
    const spiVal = spi(p.ev, p.pv);

    // EVM colour
    const cpiNum = parseFloat(cpiVal);
    const spiNum = parseFloat(spiVal);
    const cpiCol = cpiNum>=1?'var(--emerald-d)':cpiNum>=0.85?'var(--amber-d)':'var(--red-d)';
    const spiCol = spiNum>=1?'var(--emerald-d)':spiNum>=0.85?'var(--amber-d)':'var(--red-d)';

    return `
    <div class="card" style="margin-bottom:18px;" id="proj-${p.id}">
      <!-- Project Header -->
      <div style="padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:flex-start;gap:14px;flex-wrap:wrap;">
        <div style="flex:1;min-width:200px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            ${ragDot(p.ragOverall)}
            <span style="font-size:15px;font-weight:800;color:var(--ink)">${p.name}</span>
            ${p.tags.map(t=>`<span class="badge badge-indigo" style="font-size:8px">${t}</span>`).join('')}
          </div>
          <div style="font-size:11px;color:var(--muted)">Client: ${p.client} · PM: ${memberName(p.pm)} · Phase: ${p.phase}</div>
          <div style="font-size:11px;color:var(--muted);margin-top:2px">📅 ${p.start} → ${p.end} · Team: ${p.team.length} members</div>
        </div>
        <!-- EVM strip -->
        <div style="display:flex;gap:14px;flex-wrap:wrap;">
          ${[['BAC',formatL(p.bac),'var(--muted)'],['EV',formatL(p.ev),'var(--ink)'],['AC',formatL(p.ac),'var(--ink)'],['CPI',cpiVal,cpiCol],['SPI',spiVal,spiCol],['EAC',eac(p.bac,cpiVal),cpiNum<1?'var(--red-d)':'var(--emerald-d)']].map(([l,v,c])=>`
            <div style="text-align:center;">
              <div style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px">${l}</div>
              <div style="font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:800;color:${c}">${v}</div>
            </div>`).join('')}
          <button class="btn btn-secondary btn-sm" onclick="go('evm')" style="align-self:center">📊 Enter EVM</button>
        </div>
        <!-- Team avatars -->
        <div style="display:flex;gap:3px;flex-wrap:wrap;max-width:200px;align-self:center;">
          ${p.team.slice(0,8).map(tid=>memberAvatar(tid)).join('')}
          ${p.team.length>8?`<div style="width:28px;height:28px;border-radius:50%;background:var(--bg-2);display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:var(--muted)">+${p.team.length-8}</div>`:''}
        </div>
      </div>

      <!-- Sprint Timeline Track -->
      <div style="padding:14px 16px;">
        <div style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Sprint Timeline — click any block to view full intelligence</div>

        <!-- Progress bar -->
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
          <div style="flex:1;height:6px;background:var(--border);border-radius:3px;overflow:hidden;">
            <div style="height:100%;width:${Math.round(p.completedSprints/p.totalSprints*100)}%;background:linear-gradient(90deg,var(--indigo),var(--purple));border-radius:3px;transition:width .8s;"></div>
          </div>
          <span style="font-size:10px;font-weight:700;color:var(--muted);white-space:nowrap">${p.completedSprints}/${p.totalSprints} sprints · ${Math.round(p.completedSprints/p.totalSprints*100)}%</span>
        </div>

        <!-- Sprint blocks row -->
        <div style="display:flex;gap:4px;flex-wrap:nowrap;overflow-x:auto;padding-bottom:8px;">
          ${Array.from({length:p.totalSprints},(_,i)=>{
            const sNum = i+1;
            const si = sprints.find(s=>s.sprintId===`S${sNum}`);
            const isActive = p.currentSprint===`S${sNum}`;
            const isFuture = sNum > p.completedSprints + 1;
            const hasDelay = si?.delayTraceIds?.length>0;
            const rag = si?.ragAtClose||'future';

            const bgMap = {
              green:'#10B981', amber:'#F59E0B', red:'#EF4444',
              'in-progress':'#4F46E5', future:'#E2E8F0'
            };
            const fgMap = {
              green:'#fff',amber:'#fff',red:'#fff','in-progress':'#fff',future:'#94A3B8'
            };

            return `<div
              data-siid="${si ? si.id : ''}"
              style="
                min-width:72px;max-width:72px;height:64px;border-radius:8px;
                background:${bgMap[rag]||bgMap.future};
                color:${fgMap[rag]||fgMap.future};
                display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;
                cursor:${si?'pointer':'default'};
                transition:all var(--transition);
                position:relative;
                opacity:${isFuture?0.35:1};
                border:${isActive?'2.5px solid var(--ink)':'1.5px solid transparent'};
                box-shadow:${isActive?'0 0 0 2px rgba(79,70,229,.3)':hasDelay?'0 0 0 2px rgba(239,68,68,.4)':''};
              "
              title="${si?.name||'Sprint '+sNum+' — Not started'}"
            >
              <div style="font-size:9px;font-weight:700;letter-spacing:.5px">S${sNum}</div>
              <div style="font-size:11px;font-weight:800;font-family:'JetBrains Mono',monospace">
                ${si?.completed!==null&&si?.completed!==undefined?si.completed:si?.committed||'—'}
              </div>
              <div style="font-size:8px;opacity:.8">pts</div>
              ${hasDelay?'<div style="position:absolute;top:-3px;right:-3px;width:10px;height:10px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:7px;">⚠</div>':''}
              ${isActive?'<div style="position:absolute;bottom:-5px;left:50%;transform:translateX(-50%);width:6px;height:6px;border-radius:50%;background:var(--ink)"></div>':''}
            </div>`;
          }).join('')}
          <!-- Future sprints placeholder -->
        </div>

        <!-- Sprint legend -->
        <div style="display:flex;gap:12px;margin-top:8px;flex-wrap:wrap;">
          ${[['#10B981','Healthy'],['#F59E0B','Issues'],['#EF4444','Delayed'],['#4F46E5','Active'],['#E2E8F0','Not started']].map(([c,l])=>`
            <div style="display:flex;align-items:center;gap:4px;font-size:9px;color:var(--muted);">
              <div style="width:10px;height:10px;border-radius:3px;background:${c}"></div>${l}
            </div>`).join('')}
          <div style="display:flex;align-items:center;gap:4px;font-size:9px;color:var(--muted);">
            <div style="width:10px;height:10px;border-radius:3px;background:#EF4444;position:relative;"><span style="position:absolute;top:-3px;right:-3px;font-size:7px">⚠</span></div>Delay recorded
          </div>
        </div>

        <!-- Epic progress bars -->
        <div style="margin-top:14px;border-top:1px solid var(--border);padding-top:12px;">
          <div style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Epic Progress</div>
          <div style="display:flex;flex-direction:column;gap:6px;">
            ${[...DB.epics.filter(e=>e.projectId===p.id), ...DB.portfolioEpics.filter(e=>e.projectId===p.id)].map(e=>{
              const done = e.pointsDone||0, total = e.points||1;
              const pct = Math.round(done/total*100);
              return `<div style="display:flex;align-items:center;gap:10px;">
                <div style="display:flex;align-items:center;gap:5px;min-width:160px;">
                  <div style="width:8px;height:8px;border-radius:50%;background:${e.colour};flex-shrink:0"></div>
                  <span style="font-size:11px;font-weight:600;color:var(--ink-3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${e.name}</span>
                </div>
                <div style="flex:1;height:5px;background:var(--border);border-radius:3px;overflow:hidden;">
                  <div style="height:100%;width:${pct}%;background:${e.colour};border-radius:3px;transition:width .8s;"></div>
                </div>
                <span style="font-size:10px;font-weight:700;color:var(--muted);min-width:36px;text-align:right">${pct}%</span>
                <span style="font-size:9px;color:var(--muted);min-width:50px">${done}/${total}pt</span>
              </div>`;
            }).join('') || '<div style="font-size:11px;color:var(--muted)">No epics defined yet</div>'}
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  // Event delegation for sprint blocks
  setTimeout(function() {
    document.querySelectorAll('[data-siid]').forEach(function(el) {
      var sid = el.getAttribute('data-siid');
      if (sid && sid.length > 0) {
        el.style.cursor = 'pointer';
        el.onclick = function(e) { e.stopPropagation(); openDrawer(sid); };
      }
    });
  }, 150);
}
function rIntelligence() {
  const c = document.getElementById('intelligence-container');
  if (!c) return;
  const projF = document.getElementById('si-proj-filter')?.value;
  const ragF = document.getElementById('si-rag-filter')?.value;

  let allSprints = Object.entries(DB.sprintIntelligence).flatMap(([projId,sprints])=>
    sprints.map(s=>({...s, project:getProject(projId)}))
  );
  if (projF) allSprints = allSprints.filter(s=>s.projectId===projF);
  if (ragF) allSprints = allSprints.filter(s=>s.ragAtClose===ragF);

  const countEl = document.getElementById('si-count');
  if (countEl) countEl.textContent = `Showing ${allSprints.length} sprint${allSprints.length!==1?'s':''}`;

  const ragBg = {green:'var(--emerald-bg)',amber:'var(--amber-bg)',red:'var(--red-bg)','in-progress':'var(--indigo-bg)',future:'var(--bg-2)'};
  const ragBdr = {green:'var(--emerald)',amber:'var(--amber)',red:'var(--red)','in-progress':'var(--indigo)',future:'var(--border)'};

  c.innerHTML = allSprints.length === 0
    ? `<div class="alert info"><span class="alert-icon">ℹ️</span><div>No sprints match the current filters.</div></div>`
    : allSprints.map(si => {
    const delays = (si.delayTraceIds||[]).map(id=>DB.delayTrace.find(d=>d.id===id)).filter(Boolean);
    const velocityPct = si.completed!==null&&si.completed!==undefined ? Math.round(si.completed/si.committed*100) : null;

    return `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;margin-bottom:12px;overflow:hidden;border-left:4px solid ${ragBdr[si.ragAtClose]||ragBdr.future};">
      <!-- Sprint header -->
      <div style="padding:12px 16px;background:${ragBg[si.ragAtClose]||ragBg.future};display:flex;align-items:center;gap:12px;flex-wrap:wrap;cursor:pointer;" onclick="openDrawer('${si.id}')">
        <div style="flex:1;min-width:200px;">
          <div style="font-size:13px;font-weight:700;color:var(--ink)">${si.name}</div>
          <div style="font-size:10px;color:var(--muted);margin-top:1px">${si.project?.name||''} · ${si.project?.client||''}</div>
        </div>
        ${ragDot(si.ragAtClose)}
        <!-- Velocity -->
        <div style="text-align:center;min-width:80px;">
          <div style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase">Velocity</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:800;color:${velocityPct===null?'var(--muted)':velocityPct>=90?'var(--emerald-d)':velocityPct>=80?'var(--amber-d)':'var(--red-d)'}">
            ${velocityPct!==null?velocityPct+'%':'Active'}
          </div>
        </div>
        <div style="text-align:center;min-width:100px;">
          <div style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase">Points</div>
          <div style="font-family:'JetBrains Mono',monospace;font-size:13px;font-weight:700;color:var(--ink)">
            ${si.completed!==null&&si.completed!==undefined?si.completed:si.completed===null&&si.ragAtClose==='in-progress'?'—':si.completed||'—'} / ${si.committed}
          </div>
        </div>
        ${delays.length>0?`<span class="badge badge-red">⚠ ${delays.length} delay${delays.length>1?'s':''} traced</span>`:''}
        <span style="font-size:11px;color:var(--muted)">Click to drill in →</span>
      </div>

      <!-- Blockers + actions summary -->
      ${si.blockers?.length>0||si.retroActions?.length>0?`
      <div style="padding:10px 16px;border-top:1px solid var(--border-l);display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        ${si.blockers?.length>0?`
        <div>
          <div style="font-size:9px;font-weight:700;color:var(--red-d);text-transform:uppercase;margin-bottom:4px">Blockers</div>
          ${si.blockers.map(b=>`<div style="font-size:10px;color:var(--muted);padding:2px 0;border-bottom:1px solid var(--border-l)">⚠ ${b.substring(0,80)}${b.length>80?'...':''}</div>`).join('')}
        </div>`:'<div></div>'}
        ${si.retroActions?.length>0?`
        <div>
          <div style="font-size:9px;font-weight:700;color:var(--indigo);text-transform:uppercase;margin-bottom:4px">Retro Actions</div>
          ${si.retroActions.map(a=>`<div style="display:flex;gap:6px;align-items:flex-start;padding:2px 0;border-bottom:1px solid var(--border-l);">
            <span class="badge ${a.status==='Done'?'badge-green':'badge-amber'}" style="font-size:8px;flex-shrink:0">● ${a.status}</span>
            <span style="font-size:10px;color:var(--muted)">${a.text.substring(0,60)}...</span>
          </div>`).join('')}
        </div>`:''}
      </div>`:''}
    </div>`;
  }).join('');
}
function rImpact() {
  const c = document.getElementById('impact-container');
  if (!c) return;

  if (DB.delayTrace.length === 0) {
    c.innerHTML = `<div class="alert success"><span class="alert-icon">✅</span><div>No delays traced yet. This view will populate as risks trigger and issues are logged and resolved.</div></div>`;
    return;
  }

  c.innerHTML = DB.delayTrace.map(dt => {
    const proj = getProject(dt.projectId);
    const owner = getMember(dt.owner);
    const issueOwner = getMember(dt.issueCreatedBy);

    return `<div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;margin-bottom:20px;overflow:hidden;">
      <!-- Impact header -->
      <div style="padding:14px 18px;background:var(--red-bg);border-bottom:1px solid rgba(239,68,68,.15);display:flex;align-items:flex-start;gap:12px;flex-wrap:wrap;">
        <div style="flex:1;min-width:200px;">
          <div style="font-size:14px;font-weight:800;color:var(--red-d)">${dt.id} — ${dt.daysSlipped} days slipped · ${dt.pointsAffected} points affected</div>
          <div style="font-size:11px;color:var(--muted);margin-top:3px">${proj?.name||''} · ${dt.sprintName}</div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <span class="badge badge-red">📅 ${dt.daysSlipped}d slip</span>
          <span class="badge badge-amber">📦 ${dt.pointsAffected}pts blocked</span>
          <span class="badge ${dt.recurrenceResult==='prevented'?'badge-green':'badge-red'}">${dt.recurrenceResult==='prevented'?'✓ Learning applied':'⚠ Check '+dt.recurrenceCheck}</span>
        </div>
      </div>

      <!-- The full chain -->
      <div style="padding:16px 18px;">
        <div style="display:flex;gap:0;overflow-x:auto;padding-bottom:8px;">

          <!-- STEP 1: BLOCKER -->
          ${impactStep('1','🔗','Blocker',dt.blockerType,[
            ['Type',dt.blockerType],
            ['Description',dt.blockerDesc],
            ['Linked Risk',dt.linkedRiskId||'None']
          ],'#F59E0B')}
          ${impactArrow()}

          <!-- STEP 2: RISK TRIGGER -->
          ${impactStep('2','🎯','Risk Trigger',dt.triggerFired?'FIRED':'Not fired',[
            ['Risk ID',dt.linkedRiskId||'—'],
            ['Trigger',dt.riskTrigger],
            ['Status',dt.triggerFired?'Fired on '+dt.triggerFiredDate:'Did not fire']
          ],dt.triggerFired?'#EF4444':'#94A3B8')}
          ${impactArrow()}

          <!-- STEP 3: ISSUE + OWNER -->
          ${impactStep('3','⚠️','Issue Created',dt.linkedIssueId||'New issue',[
            ['Issue ID',dt.linkedIssueId||'Created fresh'],
            ['Created by',memberName(dt.issueCreatedBy)],
            ['Date',dt.issueCreatedDate],
            ['Story affected',dt.storyTitle?dt.storyTitle.substring(0,40)+'...':'N/A']
          ],'#EF4444')}
          ${impactArrow()}

          <!-- STEP 4: ESCALATION PATH -->
          <div style="min-width:180px;max-width:180px;flex-shrink:0;">
            <div style="background:var(--purple-bg);border:1px solid rgba(124,58,237,.2);border-radius:8px;padding:10px 12px;height:100%;">
              <div style="font-size:8px;font-weight:700;color:var(--purple);text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px">4 · Escalation Path</div>
              ${dt.escalationStages.map(s=>`
                <div style="display:flex;gap:6px;margin-bottom:6px;align-items:flex-start;">
                  <span style="width:16px;height:16px;border-radius:50%;background:var(--purple);color:#fff;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">S${s.stage}</span>
                  <div>
                    <div style="font-size:9px;font-weight:700;color:var(--ink-3)">${s.owner}</div>
                    <div style="font-size:9px;color:var(--muted);line-height:1.4">${s.outcome}</div>
                  </div>
                </div>`).join('')}
            </div>
          </div>
          ${impactArrow()}

          <!-- STEP 5: RESOLUTION -->
          ${impactStep('5','✅','Resolution',dt.resolvedBy?memberName(dt.resolvedBy):'—',[
            ['Resolved by',memberName(dt.resolvedBy)],
            ['Date',dt.resolvedDate],
            ['Action',dt.resolution.substring(0,80)+'...'],
            ['Actual impact',dt.actualImpact.substring(0,60)+'...']
          ],'#10B981')}
          ${impactArrow()}

          <!-- STEP 6: LEARNING -->
          ${impactStep('6','🎓','Retro Learning',dt.retroSprint,[
            ['Captured in',dt.retroSprint+' Retrospective'],
            ['Action',dt.retroAction.substring(0,60)+'...'],
            ['Owner',memberName(dt.retroOwner)],
            ['Due',dt.retroDueDate]
          ],'#4F46E5')}
          ${impactArrow()}

          <!-- STEP 7: DID IT RECUR? -->
          ${impactStep('7',dt.recurrenceResult==='prevented'?'🛡':'🔴','Did It Recur?',
            dt.recurrenceResult==='prevented'?'PREVENTED':'CHECK NEEDED',
            [
              ['Check sprint',dt.recurrenceCheck],
              ['Result',dt.recurrenceResult==='prevented'?'Learning applied successfully':'Requires follow-up'],
              ['Evidence',dt.recurrenceNote.substring(0,80)+'...']
            ],dt.recurrenceResult==='prevented'?'#10B981':'#EF4444')}
        </div>
      </div>

      <!-- Footer with owner attribution -->
      <div style="padding:10px 18px;background:var(--bg-2);border-top:1px solid var(--border);display:flex;gap:12px;align-items:center;flex-wrap:wrap;">
        <div style="font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase">Accountability Chain</div>
        ${[
          ['Risk Owner',dt.owner],
          ['Issue Owner',dt.issueCreatedBy],
          ['Resolution',dt.resolvedBy],
          ['Retro Owner',dt.retroOwner]
        ].filter(([,id])=>id).map(([label,id])=>`
          <div style="display:flex;align-items:center;gap:5px;">
            <span style="font-size:9px;color:var(--muted)">${label}:</span>
            ${memberAvatar(id)}
            <span style="font-size:10px;font-weight:600;color:var(--ink-3)">${memberName(id)}</span>
          </div>`).join('')}
      </div>
    </div>`;
  }).join('');
}
function rPeople() {
  const deptF = document.getElementById('ppl-dept')?.value;
  const projF = document.getElementById('ppl-proj')?.value;
  const riskF = document.getElementById('ppl-risk')?.value;

  let members = [...DB.team];
  if (deptF) members = members.filter(m=>m.dept===deptF);
  if (projF) members = members.filter(m=>m.projects.includes(projF));
  if (riskF) {
    if (riskF==='over') members = members.filter(m=>m.utilisation>90);
    else if (riskF==='high') members = members.filter(m=>m.utilisation>=75&&m.utilisation<=90);
    else if (riskF==='low') members = members.filter(m=>m.utilisation<75);
  }

  // Stats
  const statsEl = document.getElementById('ppl-stats');
  if (statsEl) {
    const over90 = DB.team.filter(m=>m.utilisation>90).length;
    const avg = Math.round(DB.team.reduce((s,m)=>s+m.utilisation,0)/DB.team.length);
    statsEl.innerHTML = `
      <div class="stat-card indigo"><div class="stat-icon">👥</div><div class="stat-value">${DB.team.length}</div><div class="stat-label">Total Members</div></div>
      <div class="stat-card ${over90>0?'red':'green'}"><div class="stat-icon">🔥</div><div class="stat-value">${over90}</div><div class="stat-label">Over 90% — At Risk</div></div>
      <div class="stat-card amber"><div class="stat-icon">📊</div><div class="stat-value">${avg}%</div><div class="stat-label">Avg Utilisation</div></div>
      <div class="stat-card green"><div class="stat-icon">🏢</div><div class="stat-value">${DB.projects.length}</div><div class="stat-label">Active Projects</div></div>`;
  }

  const grid = document.getElementById('people-grid');
  if (!grid) return;

  grid.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;">
    ${members.map(m => {
      const utilCol = m.utilisation>90?'var(--red)':m.utilisation>=75?'var(--amber)':'var(--emerald)';
      const utilBg = m.utilisation>90?'var(--red-bg)':m.utilisation>=75?'var(--amber-bg)':'var(--emerald-bg)';
      const openActions = DB.audit.filter(a=>a.user===m.name&&!a.action.includes('closed')).length;

      return `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:14px;transition:all var(--transition);" onmouseover="this.style.boxShadow='var(--shadow)'" onmouseout="this.style.boxShadow='none'">
        <!-- Member header -->
        <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;">
          <div style="width:40px;height:40px;border-radius:50%;background:${m.colour};display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;flex-shrink:0">${m.avatar}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;font-weight:700;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${m.name}</div>
            <div style="font-size:10px;color:var(--muted)">${m.role}</div>
            <div style="display:flex;gap:4px;margin-top:3px;flex-wrap:wrap;">
              <span class="badge badge-gray" style="font-size:8px">${m.dept}</span>
              <span class="badge ${m.status==='Active'?'badge-green':'badge-indigo'}" style="font-size:8px">${m.status}</span>
            </div>
          </div>
        </div>

        <!-- Utilisation bar -->
        <div style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
            <span style="font-size:10px;font-weight:600;color:var(--muted)">Utilisation</span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:800;color:${utilCol}">${m.utilisation}%</span>
          </div>
          <div style="height:5px;background:var(--border);border-radius:3px;overflow:hidden;">
            <div style="height:100%;width:${m.utilisation}%;background:${utilCol};border-radius:3px;transition:width .8s;"></div>
          </div>
          ${m.utilisation>90?'<div style="font-size:9px;color:var(--red-d);margin-top:3px;font-weight:600">⚠ Burnout risk — review workload</div>':''}
        </div>

        <!-- Capacity -->
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
          <span style="font-size:10px;color:var(--muted)">Sprint Capacity</span>
          <span style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:700;color:var(--ink)">${m.capacity} pts</span>
        </div>

        <!-- Projects assigned -->
        <div style="margin-bottom:8px;">
          <div style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:4px">Projects</div>
          <div style="display:flex;gap:4px;flex-wrap:wrap;">
            ${m.projects.map(pid=>{const p=getProject(pid);return p?`<span class="badge badge-indigo" style="font-size:8px">${p.name.split(' ').slice(0,2).join(' ')}</span>`:''}).join('')}
          </div>
        </div>

        <!-- Skills -->
        <div>
          <div style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:4px">Skills</div>
          <div style="display:flex;gap:4px;flex-wrap:wrap;">
            ${m.skills.slice(0,4).map(s=>`<span style="font-size:8px;padding:2px 6px;background:var(--bg-2);border-radius:10px;color:var(--muted-l);font-weight:600">${s}</span>`).join('')}
            ${m.skills.length>4?`<span style="font-size:8px;color:var(--muted)">+${m.skills.length-4}</span>`:''}
          </div>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}
function rEVM() {
  const c = document.getElementById('evm-forms-container');
  if (!c) return;

  c.innerHTML = DB.projects.map(p => {
    const cpiVal = parseFloat(cpi(p.ev, p.ac));
    const spiVal = parseFloat(spi(p.ev, p.pv));
    const eacVal = p.ac + (p.bac - p.ev) / (isNaN(cpiVal)?1:cpiVal);
    const vacVal = p.bac - eacVal;
    const etcVal = eacVal - p.ac;

    const cpiCol = cpiVal>=1?'var(--emerald-d)':cpiVal>=0.85?'var(--amber-d)':'var(--red-d)';
    const spiCol = spiVal>=1?'var(--emerald-d)':spiVal>=0.85?'var(--amber-d)':'var(--red-d)';

    return `<div class="card" style="margin-bottom:18px;">
      <div class="card-header">
        <div class="card-icon ${p.ragOverall==='red'?'red':p.ragOverall==='amber'?'amber':'emerald'}">📊</div>
        <div><div class="card-title">${p.name}</div><div class="card-sub">${p.client} · PM: ${memberName(p.pm)}</div></div>
        ${ragDot(p.ragOverall)}
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
          <!-- Input section -->
          <div>
            <div style="font-size:11px;font-weight:700;color:var(--indigo);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Enter Values (₹ Lakhs)</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${[
                ['bac','BAC — Budget at Completion','Total approved project budget'],
                ['pv','PV — Planned Value','Value of work planned to be completed by today'],
                ['ev','EV — Earned Value','Value of work actually completed to date'],
                ['ac','AC — Actual Cost','Actual money spent to date']
              ].map(([field,label,hint])=>`
                <div>
                  <label style="font-size:10px;font-weight:600;color:var(--ink-3);display:block;margin-bottom:2px">${label}</label>
                  <div style="display:flex;align-items:center;gap:6px;">
                    <span style="font-size:12px;color:var(--muted);font-weight:600">₹</span>
                    <input type="number" style="font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--ink);background:var(--surface);border:1.5px solid var(--border);border-radius:6px;padding:6px 10px;width:100%;outline:none;transition:all var(--transition);"
                      value="${(p[field]/100000).toFixed(1)}"
                      onchange="updateEVM('${p.id}','${field}',this.value*100000)"
                      onfocus="this.style.borderColor='var(--indigo)'"
                      onblur="this.style.borderColor='var(--border)'"
                      placeholder="e.g. 30.0">
                    <span style="font-size:10px;color:var(--muted);white-space:nowrap">Lakhs</span>
                  </div>
                  <div style="font-size:9px;color:var(--muted);margin-top:1px">${hint}</div>
                </div>`).join('')}
            </div>
          </div>
          <!-- Auto-calculated outputs -->
          <div>
            <div style="font-size:11px;font-weight:700;color:var(--emerald-d);text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">Auto-Calculated ⟶</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${[
                ['CPI = EV ÷ AC',cpiVal.toFixed(2),cpiCol,'Above 1.0 = delivering more value per rupee than planned'],
                ['SPI = EV ÷ PV',spiVal.toFixed(2),spiCol,'Above 1.0 = ahead of schedule'],
                ['EAC = BAC ÷ CPI','₹'+(eacVal/100000).toFixed(1)+'L',cpiVal<1?'var(--red-d)':'var(--emerald-d)','Forecast total cost at current performance'],
                ['VAC = BAC − EAC','₹'+(vacVal/100000).toFixed(1)+'L',vacVal>=0?'var(--emerald-d)':'var(--red-d)','Variance at completion — positive = under budget'],
                ['ETC = EAC − AC','₹'+(etcVal/100000).toFixed(1)+'L','var(--indigo)','Remaining cost to complete']
              ].map(([formula,value,colour,desc])=>`
                <div style="padding:8px 10px;background:var(--bg-2);border-radius:8px;display:flex;align-items:center;gap:10px;">
                  <div style="flex:1;">
                    <div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--muted)">${formula}</div>
                    <div style="font-size:9px;color:var(--muted);margin-top:1px">${desc}</div>
                  </div>
                  <div style="font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:800;color:${colour}" id="evm-${p.id}-${formula.split('=')[0].trim()}">${value}</div>
                </div>`).join('')}
            </div>
            <!-- Steering narrative auto-draft -->
            <div style="margin-top:12px;padding:10px;background:var(--indigo-bg);border-left:3px solid var(--indigo);border-radius:0 8px 8px 0;">
              <div style="font-size:9px;font-weight:700;color:var(--indigo);text-transform:uppercase;margin-bottom:4px">Steering Narrative (auto-drafted)</div>
              <div style="font-size:11px;color:var(--indigo-d);line-height:1.6" id="evm-narrative-${p.id}">
                "${p.name}: CPI ${cpiVal.toFixed(2)} — ${cpiVal>=1?'delivering '+((cpiVal-1)*100).toFixed(0)+'% more value per rupee than planned':'over budget — '+((1-cpiVal)*100).toFixed(0)+'% efficiency gap'}. SPI ${spiVal.toFixed(2)} — ${spiVal>=1?'ahead of schedule':'minor schedule lag'}. EAC ₹${(eacVal/100000).toFixed(1)}L vs ₹${(p.bac/100000).toFixed(1)}L baseline. VAC ${vacVal>=0?'+':''}₹${(vacVal/100000).toFixed(1)}L ${vacVal>=0?'favourable':'unfavourable'}."
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}
function rNewProject() {
  populateTemplateGrid();
}
function rDeliveryAnswer() {
  const c = document.getElementById('delivery-answer-container');
  if (!c) return;
  const p = DB.projects.find(x => x.id === VC.currentProject) || DB.projects[0];
  const cpiVal = parseFloat(cpi(p.ev, p.ac));
  const spiVal = parseFloat(spi(p.ev, p.pv));
  const delays = DB.delayTrace.filter(d => d.projectId === p.id);
  const totalDaysSlipped = delays.reduce((s, d) => s + d.daysSlipped, 0);
  const met = totalDaysSlipped === 0;

  c.innerHTML = `
    <!-- LEVEL 1: BINARY -->
    <div class="dae-card">
      <div class="dae-header" style="background:${met?'var(--emerald-bg)':'var(--red-bg)'};">
        <div style="font-size:32px">${met?'✅':'⚠️'}</div>
        <div>
          <div class="dae-level" style="color:${met?'var(--emerald-d)':'var(--red-d)'}">Level 1 — The Binary Answer (for the client)</div>
          <div class="dae-met" style="color:${met?'var(--emerald-d)':'var(--red-d)'}">
            ${met ? 'DELIVERED ON TIME' : `DELIVERED LATE — ${totalDaysSlipped} day${totalDaysSlipped!==1?'s':''}`}
          </div>
          <div style="font-size:12px;color:var(--muted);margin-top:4px">${p.name} · Target: ${p.end||'TBC'}</div>
        </div>
      </div>
      <div class="dae-body" style="padding-top:14px;">
        <div style="display:flex;gap:16px;flex-wrap:wrap;">
          ${[['CPI',cpiVal.toFixed(2),cpiVal>=1?'var(--emerald-d)':'var(--red-d)'],['SPI',spiVal.toFixed(2),spiVal>=1?'var(--emerald-d)':'var(--amber-d)'],['Budget',cpiVal>=1?'Under budget':'Over budget',cpiVal>=1?'var(--emerald-d)':'var(--red-d)'],['Schedule',spiVal>=1?'On track':'Minor lag',spiVal>=1?'var(--emerald-d)':'var(--amber-d)']].map(([k,v,col]) =>
            `<div style="text-align:center;padding:8px 14px;background:var(--bg-2);border-radius:8px;">
              <div style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase">${k}</div>
              <div style="font-family:'JetBrains Mono',monospace;font-size:16px;font-weight:800;color:${col}">${v}</div>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <!-- LEVEL 2: INTELLIGENCE -->
    <div class="dae-card">
      <div class="dae-header" style="background:var(--indigo-bg);">
        <div style="font-size:28px">🧠</div>
        <div>
          <div class="dae-level" style="color:var(--indigo)">Level 2 — The Intelligence Answer (for the PM and Steering Committee)</div>
          <div style="font-size:16px;font-weight:700;color:var(--ink);margin-top:3px">Why, what mitigated it, and the real impact</div>
        </div>
      </div>
      <div class="dae-body" style="padding-top:14px;">
        ${delays.length === 0
          ? `<div class="alert success"><span class="alert-icon">✅</span><div>No delays were traced on this project. All risks were managed within the sprint without impacting the delivery date.</div></div>`
          : delays.map(d => `
            <div style="padding:12px;background:var(--bg-2);border-radius:10px;margin-bottom:10px;">
              <div style="font-size:12px;font-weight:700;color:var(--red-d);margin-bottom:6px">⚠ ${d.daysSlipped} day slip — ${d.sprintName}</div>
              <div style="font-size:12px;color:var(--ink-3);line-height:1.6;margin-bottom:6px">${d.blockerDesc}</div>
              <div class="dae-chain">
                <div class="dae-node" style="background:var(--amber-bg);color:var(--amber-d)">Risk ${d.linkedRiskId}</div>
                <span style="color:var(--muted)">→</span>
                <div class="dae-node" style="background:var(--red-bg);color:var(--red-d)">Trigger fired ${d.triggerFiredDate}</div>
                <span style="color:var(--muted)">→</span>
                <div class="dae-node" style="background:var(--emerald-bg);color:var(--emerald-d)">Resolved ${d.resolvedDate}</div>
              </div>
              <div style="font-size:11px;color:var(--emerald-d);margin-top:8px;font-weight:600">✓ Risk management reduced impact: ${d.resolution.substring(0,100)}...</div>
            </div>`).join('')}
      </div>
    </div>

    <!-- LEVEL 3: LEARNING -->
    <div class="dae-card">
      <div class="dae-header" style="background:var(--purple-bg);">
        <div style="font-size:28px">🎓</div>
        <div>
          <div class="dae-level" style="color:var(--purple)">Level 3 — The Learning Answer (for the organisation)</div>
          <div style="font-size:16px;font-weight:700;color:var(--ink);margin-top:3px">What was captured and did it prevent recurrence?</div>
        </div>
      </div>
      <div class="dae-body" style="padding-top:14px;">
        ${DB.learnings.filter(l => l.project === p.name).map(l => `
          <div style="padding:12px;background:var(--bg-2);border-radius:10px;margin-bottom:10px;border-left:3px solid ${l.outcome==='prevented'?'var(--emerald)':'var(--amber)'};">
            <div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:4px">${l.category} — ${l.sprint}</div>
            <div style="font-size:12px;color:var(--ink-3);line-height:1.6;margin-bottom:6px">${l.lesson}</div>
            <div style="font-size:11px;color:${l.outcome==='prevented'?'var(--emerald-d)':'var(--amber-d)'};font-weight:600">
              ${l.outcome==='prevented'?'🛡 Learning applied successfully':'⚠ Verification pending'} — ${l.outcomeEvidence}
            </div>
          </div>`).join('') || `<div class="alert info"><span class="alert-icon">💡</span><div>No learnings captured yet for this project. Complete a sprint retrospective to start building the learning record.</div></div>`}
        <div style="margin-top:14px;padding:12px;background:var(--indigo-bg);border-radius:10px;border-left:3px solid var(--indigo);">
          <div style="font-size:11px;font-weight:700;color:var(--indigo);margin-bottom:4px">📚 Added to Learning Library</div>
          <div style="font-size:11px;color:var(--muted)">These learnings are now available to all PMs starting similar projects. The next team will see these risks pre-loaded in their RAID log.</div>
        </div>
      </div>
    </div>`;
}
function rLearning() {
  const c = document.getElementById('learning-library-container');
  if (!c) return;
  const search = document.getElementById('ll-search')?.value?.toLowerCase() || '';
  const category = document.getElementById('ll-category')?.value || '';
  const outcome = document.getElementById('ll-outcome')?.value || '';

  let items = [...DB.learnings];
  if (search) items = items.filter(l => l.lesson.toLowerCase().includes(search) || l.context.toLowerCase().includes(search));
  if (category) items = items.filter(l => l.category === category);
  if (outcome) items = items.filter(l => l.outcome === outcome);

  if (items.length === 0) {
    c.innerHTML = `<div class="empty-state"><div class="empty-icon">📚</div><div class="empty-title">No learnings found</div><div class="empty-desc">Learnings are captured automatically from sprint retrospectives and delay traces. Complete a sprint retrospective to add your first learning.</div></div>`;
    return;
  }

  const outcomeIcon = {prevented:'🛡',recurred:'⚠️',pending:'⏳'};
  const outcomeLabel = {prevented:'Prevented recurrence',recurred:'Recurred — needs follow-up',pending:'Not yet verified'};
  const outcomeCol = {prevented:'var(--emerald-d)',recurred:'var(--red-d)',pending:'var(--amber-d)'};

  c.innerHTML = items.map(l => `
    <div class="learning-card">
      <div class="lc-meta">
        <span class="badge badge-indigo">${l.category}</span>
        <span class="badge badge-gray">${l.project}</span>
        <span class="badge badge-gray">${l.sprint}</span>
        <span style="font-size:10px;color:var(--muted);margin-left:auto">${l.date}</span>
      </div>
      <div class="lc-text"><strong>📖 Learning:</strong> ${l.lesson}</div>
      <div style="font-size:11px;color:var(--muted);margin-top:5px;line-height:1.5;padding:6px 10px;background:var(--bg-2);border-radius:6px;"><strong>Context:</strong> ${l.context}</div>
      <div class="lc-outcome" style="color:${outcomeCol[l.outcome]}">
        ${outcomeIcon[l.outcome]} ${outcomeLabel[l.outcome]}
        ${l.outcomeEvidence ? `<span style="font-weight:400;color:var(--muted);font-size:10px">— ${l.outcomeEvidence}</span>` : ''}
      </div>
      ${l.usedInTemplates?.length > 0 ? `<div style="font-size:10px;color:var(--indigo);margin-top:6px;">✓ Added to ${l.usedInTemplates.length} project template(s)</div>` : ''}
    </div>`).join('');
}
function rIntegrations() {
  rConnectedIntegrations();
  rAvailableIntegrations();
}

function selectOrgType(type, el) {
  selectedOrgType = type;
  document.querySelectorAll('#setup-step-1 .setup-option').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
}
function toggleMethod(method, el) {
  const check = document.getElementById(`method-${method}-check`);
  if (selectedMethods.includes(method)) {
    selectedMethods = selectedMethods.filter(m => m !== method);
    el.classList.remove('active');
    check.style.cssText = 'width:20px;height:20px;border-radius:50%;border:2px solid rgba(255,255,255,.3);flex-shrink:0;display:flex;align-items:center;justify-content:center;';
    check.textContent = '';
  } else {
    selectedMethods.push(method);
    el.classList.add('active');
    check.style.cssText = 'width:20px;height:20px;border-radius:50%;border:2px solid #4F46E5;background:#4F46E5;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;';
    check.textContent = '✓';
  }
}
function selectSetupRole(role, el) {
  selectedSetupRole = role;
  document.querySelectorAll('#setup-step-3 .setup-option').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
}
function setupNext(step) {
  document.querySelectorAll('[id^="setup-step-"]').forEach(s => s.style.display = 'none');
  const stepEl = document.getElementById(`setup-step-${step}`);
  if (stepEl) stepEl.style.display = 'block';
  if (step === 4) {
    const orgName = document.getElementById('setup-org-name')?.value || 'your organisation';
    const orgDisplay = document.getElementById('setup-org-display');
    if (orgDisplay) orgDisplay.textContent = orgName;
    VC.org.name = orgName;
    VC.org.type = selectedOrgType;
    VC.org.methods = selectedMethods;
  }
}
function completeSetup() {
  VC.org.setupDone = true;
  VC.currentRole = selectedSetupRole || 'pm';
  markSetupDone();
  const overlay = document.getElementById('vc-setup-overlay');
  if (overlay) overlay.style.display = 'none';
  // Go to dashboard first, then open wizard
  rDash();
  document.querySelectorAll('.sec').forEach(s => s.style.display = 'none');
  const dash = document.getElementById('s-dashboard');
  if (dash) dash.style.display = 'block';
  cur = 'dashboard';
  // Small delay to ensure DOM is ready before wizard opens
  setTimeout(() => {
    startWizard(null);
    toast('🎯 Wizard started — answer each question to set up your project.', 'success');
  }, 150);
}
function skipSetupToApp() {
  VC.org.setupDone = true;
  markSetupDone();
  document.getElementById('vc-setup-overlay').style.display = 'none';
  updateRoleView('pm');
  logAudit('Setup', 'Enterprise setup completed — skipped to dashboard');
}
function markSetupDone() {
  localStorage.setItem('vc_setup_done', '1');
}
function startWizard(templateId) {
  VC.wizardTemplate = templateId ? TEMPLATES.find(t => t.id === templateId) : null;
  wizStep = 1;
  Object.keys(wizAnswers).forEach(k => delete wizAnswers[k]);
  if (VC.wizardTemplate) {
    wizAnswers.method = VC.wizardTemplate.method;
  }
  document.getElementById('vc-wizard-overlay').style.display = 'block';
  renderWizStep(wizStep);
}
function closeWizard() {
  document.getElementById('vc-wizard-overlay').style.display = 'none';
  go('dashboard');
}
function renderWizStep(step) {
  const q = WIZ_QUESTIONS[step - 1];
  if (!q) return;

  const pct = Math.round((step / WIZ_QUESTIONS.length) * 100);
  document.getElementById('wiz-progress').style.width = pct + '%';
  document.getElementById('wiz-step-count').textContent = `Question ${step} of ${WIZ_QUESTIONS.length}`;
  document.getElementById('wiz-conv-label').textContent = q.conv;

  let inputHTML = '';

  if (q.type === 'text') {
    inputHTML = `<input class="conv-input" id="wiz-input" placeholder="${q.placeholder||''}" value="${wizAnswers[q.field]||''}">`;
  } else if (q.type === 'textarea') {
    inputHTML = `<textarea class="conv-input conv-textarea" id="wiz-input" placeholder="${q.placeholder||''}">${wizAnswers[q.field]||''}</textarea>`;
  } else if (q.type === 'options') {
    inputHTML = `<div class="option-grid">${q.options.map(o =>
      `<div class="option-card${wizAnswers[q.field]===o.value?' selected':''}" onclick="selectWizOption('${q.field}','${o.value}',this)">
        <div class="oc-check">✓</div>
        <div class="oc-icon">${o.icon}</div>
        <div class="oc-body"><div class="oc-title">${o.title}</div><div class="oc-desc">${o.desc}</div></div>
      </div>`).join('')}</div>`;
  } else if (q.type === 'date_with_type') {
    inputHTML = `<div style="display:flex;flex-direction:column;gap:12px;">
      <div><label class="form-label" style="font-size:12px;font-weight:600;color:#334155;margin-bottom:5px;display:block">${q.dateLabel}</label>
      <input type="date" class="conv-input" id="wiz-date" value="${wizAnswers[q.dateField]||''}"></div>
      <div><label class="form-label" style="font-size:12px;font-weight:600;color:#334155;margin-bottom:5px;display:block">What type of deadline is this?</label>
      <div class="option-grid">${q.dateTypes.map(dt =>
        `<div class="option-card${wizAnswers[q.typeField]===dt.value?' selected':''}" onclick="selectWizOption('${q.typeField}','${dt.value}',this)" style="padding:10px 12px;">
          <div class="oc-check">✓</div>
          <div class="oc-body"><div class="oc-title" style="font-size:12px">${dt.label}</div></div>
        </div>`).join('')}</div></div></div>`;
  } else if (q.type === 'currency') {
    inputHTML = `<div>
      <label style="font-size:12px;font-weight:600;color:#334155;display:block;margin-bottom:6px">${q.label}</label>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:18px;font-weight:700;color:#64748B">₹</span>
        <input type="number" class="conv-input" id="wiz-input" placeholder="${q.placeholder}" value="${wizAnswers[q.field]||''}" style="font-family:'JetBrains Mono',monospace;font-size:18px;font-weight:700;">
      </div>
      <div style="font-size:11px;color:#94A3B8;margin-top:5px">${q.hint}</div>
    </div>`;
  } else if (q.type === 'triple_constraint') {
    const constraints = ['Scope', 'Schedule', 'Cost'];
    inputHTML = `<div style="display:flex;flex-direction:column;gap:8px;">
      ${constraints.map(c =>
        `<div class="option-card${wizAnswers[q.field]===c.toLowerCase()?' selected':''}" onclick="selectWizOption('${q.field}','${c.toLowerCase()}',this)">
          <div class="oc-check">✓</div>
          <div class="oc-body">
            <div class="oc-title">${c} is fixed</div>
            <div class="oc-desc">${c==='Scope'?'The deliverables cannot change. Schedule and cost must absorb any issues.':c==='Schedule'?'The deadline cannot move. Scope and cost must flex to meet it.':'The budget is the hard limit. Scope and timeline adjust to fit within it.'}</div>
          </div>
        </div>`).join('')}
      <div style="font-size:11px;color:#94A3B8;margin-top:4px;padding:8px;background:#F8FAFF;border-radius:8px;">
        💡 <strong>Note:</strong> Quality stays in the middle — it is affected by all three. The other two constraints flex around the one you fix.
      </div>
    </div>`;
  } else if (q.type === 'yesno_detail') {
    const currentVal = wizAnswers[q.field];
    inputHTML = `<div style="display:flex;flex-direction:column;gap:10px;">
      <div style="display:flex;gap:10px;">
        <div class="option-card${currentVal==='no'?' selected':''}" onclick="selectYesNo('${q.field}','no')" style="flex:1;">
          <div class="oc-check">✓</div>
          <div class="oc-body"><div class="oc-title">No</div></div>
        </div>
        <div class="option-card${currentVal&&currentVal!=='no'?' selected':''}" onclick="selectYesNo('${q.field}','yes')" style="flex:1;">
          <div class="oc-check">✓</div>
          <div class="oc-body"><div class="oc-title">Yes</div></div>
        </div>
      </div>
      <div id="yesno-detail" style="${(!currentVal||currentVal==='no')?'display:none':''}">
        <div style="font-size:12px;font-weight:600;color:#334155;margin-bottom:6px">${q.yesPrompt}</div>
        <textarea class="conv-input conv-textarea" id="wiz-yesno-detail" placeholder="${q.yesPlaceholder}">${wizAnswers[q.field+'_detail']||''}</textarea>
      </div>
    </div>`;
  } else if (q.type === 'person') {
    inputHTML = `<div style="display:flex;flex-direction:column;gap:10px;">
      <div style="font-size:11px;color:#64748B;padding:8px 12px;background:#F8FAFF;border-radius:8px;">${q.hint}</div>
      <input class="conv-input" id="wiz-person-name" placeholder="Full name" value="${wizAnswers[q.nameField]||''}">
      <input class="conv-input" id="wiz-person-role" placeholder="Role / title" value="${wizAnswers[q.roleField]||''}">
      <input class="conv-input" id="wiz-person-email" placeholder="Email address" type="email" value="${wizAnswers[q.emailField]||''}">
    </div>`;
  } else if (q.type === 'method_select') {
    const methods = [
      {value:'agile',icon:'🏃',title:'Agile / Scrum',desc:'Sprints, backlog, velocity, retrospectives'},
      {value:'waterfall',icon:'📋',title:'Predictive / Waterfall',desc:'Phases, WBS, Gantt, phase gates'},
      {value:'hybrid',icon:'🔀',title:'Hybrid (Recommended)',desc:'PMBOK governance + Agile delivery'},
      {value:'safe',icon:'🏛️',title:'SAFe / Scaled Agile',desc:'ART, PI Planning, multiple teams'},
      {value:'ld',icon:'🎓',title:'L&D Programme',desc:'ADDIE, Bloom\'s, Kirkpatrick'}
    ];
    inputHTML = `<div class="option-grid">${methods.map(m =>
      `<div class="option-card${(wizAnswers[q.field]||'hybrid')===m.value?' selected':''}" onclick="selectWizOption('${q.field}','${m.value}',this)">
        <div class="oc-check">✓</div>
        <div class="oc-icon">${m.icon}</div>
        <div class="oc-body"><div class="oc-title">${m.title}</div><div class="oc-desc">${m.desc}</div></div>
      </div>`).join('')}</div>`;
  } else if (q.type === 'risk_checklist') {
    const risks = [
      {id:'vendor',icon:'🔗',title:'Depends on external vendors or APIs',impact:'Pre-loads vendor delivery risk with trigger',badge:'HIGH'},
      {id:'compliance',icon:'⚖️',title:'Regulatory or compliance approvals required',impact:'Pre-loads compliance review risk with buffer',badge:'HIGH'},
      {id:'scope',icon:'📦',title:'Requirements may change as we learn',impact:'Pre-loads scope creep risk with change control',badge:'MED'},
      {id:'shared',icon:'👥',title:'Shared team members with competing priorities',impact:'Pre-loads resource contention risk',badge:'MED'},
      {id:'tech',icon:'💻',title:'Technology we have not used before',impact:'Pre-loads technical risk with spike recommendation',badge:'MED'},
      {id:'distributed',icon:'🌍',title:'Multi-location or distributed team',impact:'Pre-loads communication and coordination risk',badge:'MED'},
      {id:'stakeholder',icon:'🤝',title:'Stakeholder engagement may be inconsistent',impact:'Pre-loads stakeholder resistance risk',badge:'MED'},
      {id:'legacy',icon:'🔌',title:'Integration with legacy systems or data migration',impact:'Pre-loads integration complexity risk',badge:'HIGH'},
      {id:'budget',icon:'💰',title:'Budget approval not yet confirmed',impact:'Pre-loads funding risk',badge:'MED'},
      {id:'decision',icon:'⏱️',title:'Key decisions depend on one hard-to-reach person',impact:'Pre-loads decision bottleneck risk',badge:'LOW'}
    ];
    const selected = wizAnswers[q.field] || [];
    inputHTML = `<div class="risk-check-grid">${risks.map(r =>
      `<div class="risk-check-item${selected.includes(r.id)?' checked':''}" onclick="toggleRiskCheck('${r.id}',this)">
        <div class="rci-box"></div>
        <div style="font-size:16px;margin:0 4px">${r.icon}</div>
        <div class="rci-content">
          <div class="rci-title">${r.title}<span class="rci-badge">${r.badge}</span></div>
          <div class="rci-impact">✓ ${r.impact}</div>
        </div>
      </div>`).join('')}
    </div>
    <div style="font-size:11px;color:#94A3B8;margin-top:8px;padding:8px;background:#F8FAFF;border-radius:8px;">
      💡 Each selection automatically adds a pre-built risk to your RAID log with suggested probability, impact, trigger, and mitigation. You review and adjust — you do not start from zero.
    </div>`;
  } else if (q.type === 'decision_rights') {
    inputHTML = `<div style="display:flex;flex-direction:column;gap:10px;">
      ${[
        ['PM can approve without escalation','pmThreshold','5'],
        ['Sponsor approval required above','sponsorThreshold','15'],
        ['Steering committee required above','steeringThreshold','20']
      ].map(([label,field,def]) =>
        `<div style="display:flex;align-items:center;gap:12px;padding:12px;background:#F8FAFF;border-radius:10px;">
          <div style="flex:1;font-size:12px;font-weight:600;color:#334155">${label}</div>
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="font-size:13px;font-weight:700;color:#64748B">%</span>
            <input type="number" class="conv-input" id="wiz-dr-${field}" value="${wizAnswers['dr_'+field]||def}" style="width:70px;text-align:center;font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:700;" min="0" max="100">
            <span style="font-size:11px;color:#94A3B8">of BAC</span>
          </div>
        </div>`).join('')}
      <div style="font-size:11px;color:#94A3B8;padding:8px;background:#F8FAFF;border-radius:8px;">
        💡 These thresholds drive automatic Change Request routing. A CR above the PM threshold gets flagged for Sponsor approval. Above the Steering threshold, no work can start until steering approves.
      </div>
    </div>`;
  } else if (q.type === 'escalation_contacts') {
    inputHTML = `<div style="display:flex;flex-direction:column;gap:8px;">
      ${[
        ['Stage 1','PM resolves','esc1'],
        ['Stage 2','PM + Sponsor','esc2'],
        ['Stage 3','Steering Committee','esc3'],
        ['Stage 4','Executive Sponsor','esc4']
      ].map(([stage,desc,field]) =>
        `<div style="padding:10px 12px;background:#F8FAFF;border-radius:10px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <div style="width:22px;height:22px;border-radius:50%;background:#4F46E5;color:#fff;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;">${stage.slice(-1)}</div>
            <span style="font-size:12px;font-weight:700;color:#334155">${stage} — ${desc}</span>
          </div>
          <input class="conv-input" id="wiz-${field}" placeholder="Name and contact (phone or email)" value="${wizAnswers[field]||''}" style="font-size:12px;">
        </div>`).join('')}
    </div>`;
  } else if (q.type === 'velocity_input') {
    inputHTML = `<div style="display:flex;flex-direction:column;gap:14px;">
      <div class="option-card selected" id="vel-known-option" onclick="selectVelOption('known')">
        <div class="oc-check">✓</div>
        <div class="oc-body">
          <div class="oc-title">I know our velocity</div>
          <div id="vel-known-input">
            <div class="conv-range-wrap" style="margin-top:8px;">
              <input type="range" class="conv-range" id="vel-range" min="10" max="100" value="${wizAnswers[q.field]||42}"
                oninput="document.getElementById('vel-val').textContent=this.value;wizAnswers['${q.field}']=parseInt(this.value);">
              <span class="conv-range-val" id="vel-val">${wizAnswers[q.field]||42}</span>
            </div>
            <div class="conv-range-labels"><span>10 pts</span><span>Very Small Team</span><span>Average</span><span>Large Team</span><span>100 pts</span></div>
            <div style="font-size:11px;color:#94A3B8;margin-top:6px;">Story points per 2-week sprint. Apex average: 42. Adjust for your team size.</div>
          </div>
        </div>
      </div>
      <div class="option-card" id="vel-unknown-option" onclick="selectVelOption('unknown')">
        <div class="oc-check"></div>
        <div class="oc-body">
          <div class="oc-title">I do not know yet — calibrate from data</div>
          <div class="oc-desc">VeloClear will set a starting estimate and recalibrate automatically after Sprint 1 and Sprint 2 using your actual delivery data.</div>
        </div>
      </div>
    </div>`;
  } else if (q.type === 'dod_builder') {
    const defaultDod = ['Code reviewed by at least one other developer','All unit tests passing (>85% coverage)','Acceptance criteria met and verified','Documentation updated','Deployed to staging environment','No critical defects open'];
    const current = wizAnswers[q.field] || defaultDod;
    inputHTML = `<div>
      <div style="font-size:11px;color:#64748B;margin-bottom:10px;">These are pre-loaded defaults. Edit, remove, or add criteria specific to your project.</div>
      <div id="dod-items" style="display:flex;flex-direction:column;gap:6px;">
        ${current.map((item,i) =>
          `<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:#F8FAFF;border-radius:8px;">
            <span style="color:#10B981;font-size:14px;">✓</span>
            <input class="conv-input" value="${item}" style="flex:1;padding:4px 8px;font-size:12px;" onchange="updateDodItem(${i},this.value)">
            <button onclick="removeDodItem(${i})" style="border:none;background:none;color:#EF4444;cursor:pointer;font-size:14px;">×</button>
          </div>`).join('')}
      </div>
      <button onclick="addDodItem()" style="margin-top:8px;padding:7px 14px;background:var(--indigo-bg);color:var(--indigo);border:1.5px dashed var(--indigo);border-radius:8px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:600;width:100%;">+ Add criterion</button>
    </div>`;
    if (!wizAnswers[q.field]) wizAnswers[q.field] = defaultDod;
  } else if (q.type === 'review_identity') {
    inputHTML = `<div style="display:flex;flex-direction:column;gap:10px;">
      ${[['Project Name',wizAnswers.name],['Purpose',wizAnswers.purpose],['Outcome',wizAnswers.outcome],['Success Criteria',wizAnswers.successCriteria],['Out of Scope',wizAnswers.outOfScope||'Not defined']].map(([k,v]) =>
        `<div style="padding:10px 12px;background:#F8FAFF;border-radius:8px;">
          <div style="font-size:9px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:.8px;margin-bottom:3px">${k}</div>
          <div style="font-size:12px;color:#334155;line-height:1.5">${v||'<span style="color:#94A3B8;font-style:italic">Not entered</span>'}</div>
        </div>`).join('')}
      <div class="alert info"><span class="alert-icon">💡</span><div>Review these answers. If anything needs changing, use the Back button to correct it.</div></div>
    </div>`;
  } else if (q.type === 'review_constraints') {
    inputHTML = `<div style="display:flex;flex-direction:column;gap:10px;">
      ${[['Target Date',wizAnswers.deliveryDate],['Budget (BAC)',wizAnswers.bac?'₹'+(wizAnswers.bac/100000).toFixed(1)+'L':'Not entered'],['Fixed Constraint',wizAnswers.fixedConstraint],['Delivery Method',wizAnswers.method||'Hybrid'],['Team Size',wizAnswers.teamSize]].map(([k,v]) =>
        `<div style="padding:10px 12px;background:#F8FAFF;border-radius:8px;">
          <div style="font-size:9px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:.8px;margin-bottom:3px">${k}</div>
          <div style="font-size:13px;font-weight:700;color:#334155">${v||'<span style="color:#94A3B8;font-style:italic">Not entered</span>'}</div>
        </div>`).join('')}
    </div>`;
  } else if (q.type === 'wizard_complete') {
    // Count what was auto-built
    const riskCount = (wizAnswers.riskCategories||[]).length + (wizAnswers.biggestRisk?1:0) + (wizAnswers.externalDeps&&wizAnswers.externalDeps!=='no'?1:0);
    const depsCount = wizAnswers.externalDeps&&wizAnswers.externalDeps!=='no'?2:0;
    const stakeholderCount = wizAnswers.sponsorName?2:1;
    inputHTML = `<div class="wizard-complete">
      <div class="wizard-complete-icon">🎉</div>
      <h2>Your project is ready.</h2>
      <p>VeloClear has built your complete project foundation from your answers. Here is what was created automatically:</p>
      <div class="wizard-complete-stats">
        <div class="wcs"><div class="wcs-num">${riskCount}</div><div class="wcs-label">Risks pre-loaded</div></div>
        <div class="wcs"><div class="wcs-num">${depsCount+1}</div><div class="wcs-label">Dependencies tracked</div></div>
        <div class="wcs"><div class="wcs-num">${stakeholderCount}</div><div class="wcs-label">Stakeholders added</div></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;margin:20px 0;text-align:left;">
        ${[['RAID Log',`${riskCount} risks pre-loaded with triggers and mitigations`],['Decision Rights','Approval thresholds configured and active'],['Escalation Protocol','4-stage contacts defined'],['Definition of Done',`${(wizAnswers.definitionOfDone||[]).length} criteria set`],['Communication Plan','Cadence configured from governance answers'],['Sprint Calendar',wizAnswers.sprintDays?`${wizAnswers.sprintDays}-day sprints`:'Milestone-based']].map(([k,v]) =>
          `<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:#F8FAFF;border-radius:8px;">
            <span style="color:#10B981;font-size:14px;flex-shrink:0">✓</span>
            <div><div style="font-size:12px;font-weight:700;color:#0F172A">${k}</div><div style="font-size:11px;color:#64748B">${v}</div></div>
          </div>`).join('')}
      </div>
      <button class="btn-wizard-next" style="width:100%;justify-content:center;font-size:14px;padding:14px;" onclick="finaliseProject()">
        🚀 Open My Project Dashboard
      </button>
    </div>`;
    return document.getElementById('wiz-content').innerHTML = `<div class="conv-card">${inputHTML}</div>`;
  }

  document.getElementById('wiz-content').innerHTML = `
    <div class="conv-card">
      <div class="conv-label">${q.conv}</div>
      <div class="conv-q">${q.q}</div>
      ${q.why ? `<div class="conv-why"><strong>Why this matters:</strong> ${q.why}</div>` : ''}
      ${inputHTML}
      <div class="wizard-nav">
        <button class="btn-wizard-back" onclick="wizBack()" ${wizStep===1?'style="visibility:hidden"':''}>← Back</button>
        <div style="display:flex;gap:8px;align-items:center;">
          ${!q.required ? `<button class="btn-wizard-skip" onclick="wizSkip()">Skip for now</button>` : ''}
          <button class="btn-wizard-next" onclick="wizNext()">
            ${wizStep === WIZ_QUESTIONS.length-1 ? 'Review & Finish →' : 'Next →'}
          </button>
        </div>
      </div>
    </div>`;
}
function finaliseProject() {
  // Build project from wizard answers
  const newProject = {
    id: 'P' + String(Date.now()).slice(-4),
    name: wizAnswers.name || 'New Project',
    client: wizAnswers.sponsorName || 'Client',
    pm: 'TM001',
    sponsor: wizAnswers.sponsorName || '',
    status: 'Active', phase: 'Planning',
    start: new Date().toISOString().split('T')[0],
    end: wizAnswers.deliveryDate || '',
    bac: wizAnswers.bac || 0,
    ev: 0, pv: 0, ac: 0,
    ragOverall: 'green',
    team: ['TM001'],
    priority: 'High',
    description: wizAnswers.purpose || '',
    currentSprint: 'S1', completedSprints: 0,
    totalSprints: Math.ceil((new Date(wizAnswers.deliveryDate) - new Date()) / (1000 * 60 * 60 * 24 * (wizAnswers.sprintDays || 14))),
    epicIds: [],
    tags: [wizAnswers.method || 'Hybrid']
  };

  DB.projects.push(newProject);

  // Pre-populate RAID from risk categories
  const riskMap = {
    vendor: {desc:'External vendor or API may fail to deliver on schedule',cat:'External',prob:3,impact:5,score:15,trigger:'Vendor misses first agreed milestone',response:'Mitigate',mitigation:'Identify internal fallback option in Sprint 1',contingency:'Activate fallback, brief sponsor within 24hrs'},
    compliance: {desc:'Regulatory or compliance approval cycle longer than estimated',cat:'Process',prob:4,impact:4,score:16,trigger:'Review not complete by Sprint Planning day',response:'Mitigate',mitigation:'Buffer 7 days per compliance item in sprint planning',contingency:'Async review process — PM pre-approves before formal sign-off'},
    scope: {desc:'Client or stakeholder may request significant scope additions',cat:'Commercial',prob:3,impact:3,score:9,trigger:'Any requirement raised that is not in agreed WBS',response:'Mitigate',mitigation:'Strict change control documented and agreed at kick-off',contingency:'Raise CR within 1 hour, CCB decision within 48hrs'},
    shared: {desc:'Shared team members may be unavailable due to competing project priorities',cat:'People',prob:3,impact:4,score:12,trigger:'Team member unavailable for more than 2 sprint days',response:'Mitigate',mitigation:'Agree time allocation per project upfront with all PMs',contingency:'Escalate to portfolio PM. Adjust sprint capacity immediately.'},
    tech: {desc:'New or unfamiliar technology may cause underestimation and delays',cat:'Technical',prob:3,impact:4,score:12,trigger:'Sprint 1 velocity below 70% of estimate',response:'Mitigate',mitigation:'Allocate spike stories in Sprint 1 to validate technical approach',contingency:'Rescope sprint, adjust estimate, brief steering'},
    distributed: {desc:'Multi-location team coordination challenges may impact delivery quality',cat:'Process',prob:2,impact:3,score:6,trigger:'More than 2 missed stand-ups per team member per sprint',response:'Mitigate',mitigation:'Establish single source of truth from day 1. Structured async updates.',contingency:'Increase synchronous check-in frequency'},
    stakeholder: {desc:'Key stakeholders may disengage or resist project outcomes',cat:'People',prob:3,impact:4,score:12,trigger:'Stakeholder misses 2 consecutive status updates without explanation',response:'Mitigate',mitigation:'Stakeholder engagement plan from Sprint 1. Regular 1-to-1s with at-risk stakeholders.',contingency:'Escalate to sponsor. Redesign engagement approach.'},
    legacy: {desc:'Legacy system complexity or data quality may cause integration delays',cat:'Technical',prob:3,impact:5,score:15,trigger:'Data migration test reveals >5% error rate',response:'Mitigate',mitigation:'Data profiling exercise in Sprint 1. Agree data quality acceptance criteria upfront.',contingency:'Data remediation sprint. Adjust go-live date. Brief steering.'},
    budget: {desc:'Budget approval delay may halt project before it begins',cat:'Commercial',prob:2,impact:5,score:10,trigger:'Budget not confirmed by Sprint 1 start date',response:'Escalate',mitigation:'Escalate budget approval to sponsor 2 weeks before Sprint 1',contingency:'Pause project formally. Do not proceed on informal approval.'},
    decision: {desc:'Key decision-maker unavailability creates bottlenecks',cat:'People',prob:3,impact:3,score:9,trigger:'Decision outstanding for more than 48 hours',response:'Mitigate',mitigation:'Decision rights documented at kick-off. Alternate approver named for each decision type.',contingency:'Escalate to Stage 2 immediately. Decisions cannot wait.'}
  };

  const selectedRisks = wizAnswers.riskCategories || [];
  selectedRisks.forEach((cat, i) => {
    if (riskMap[cat]) {
      const r = riskMap[cat];
      DB.risks.push({
        id: `R${String(DB.risks.length+1).padStart(3,'0')}`,
        ...r, owner: 'TM001', status: 'Open',
        projectId: newProject.id
      });
    }
  });

  // Add biggest risk
  if (wizAnswers.biggestRisk) {
    DB.risks.push({
      id: `R${String(DB.risks.length+1).padStart(3,'0')}`,
      desc: wizAnswers.biggestRisk, cat: 'Project-specific',
      prob: 3, impact: 4, score: 12,
      trigger: 'Review at Sprint 1 mid-point',
      response: 'Mitigate', owner: 'TM001', status: 'Open',
      mitigation: 'Define trigger and mitigation plan in Sprint 1 planning',
      contingency: 'Escalate immediately when trigger fires',
      projectId: newProject.id
    });
  }

  // Add external dependencies
  if (wizAnswers.externalDeps && wizAnswers.externalDeps !== 'no') {
    DB.dependencies.push({
      id: `D${String(DB.dependencies.length+1).padStart(3,'0')}`,
      desc: wizAnswers.externalDeps_detail || 'External dependency — details to be confirmed',
      team: 'External',
      owner: 'TM001',
      requiredBy: wizAnswers.deliveryDate || '',
      risk: 'High — project stops',
      status: 'On Track',
      projectId: newProject.id
    });
  }

  logAudit('Project Setup', `New project created via wizard: ${newProject.name} — ${selectedRisks.length + (wizAnswers.biggestRisk?1:0)} risks pre-loaded`);

  closeWizard();
  VC.currentProject = newProject.id;
  go('dashboard');
  toast(`🎉 "${newProject.name}" is ready — ${DB.risks.filter(r=>r.projectId===newProject.id).length} risks pre-loaded in your RAID log`, 'success');
}

function switchRole(role, btn) {
  VC.currentRole = role;
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  updateRoleView(role);
  const cfg = ROLE_CONFIGS[role];
  const indicator = document.getElementById('role-indicator');
  if (indicator) {
    indicator.textContent = `Viewing as: ${cfg.label}`;
    indicator.style.display = role === 'pm' ? 'none' : 'block';
  }
  toast(`Switched to ${cfg.label} view`, 'success');
}
function updateRoleView(role) {
  const cfg = ROLE_CONFIGS[role] || ROLE_CONFIGS.pm;
  // Hide nav items not in role
  document.querySelectorAll('.nav-item').forEach(ni => {
    const onclick = ni.getAttribute('onclick') || '';
    const match = onclick.match(/'([^']+)'/);
    if (match) {
      const section = match[1];
      ni.style.display = cfg.visible.includes(section) ? 'flex' : 'none';
    }
  });
  // If current section not visible, go to dashboard
  if (!cfg.visible.includes(cur)) go('dashboard');
}
function saveRisk() {
  const prob=+document.getElementById('r-prob').value, impact=+document.getElementById('r-impact').value;
  const r={id:'R'+String(DB.risks.length+1).padStart(3,'0'),desc:document.getElementById('r-desc').value||'New Risk',cat:document.getElementById('r-cat').value,prob,impact,score:prob*impact,trigger:document.getElementById('r-trigger').value,response:document.getElementById('r-response').value,owner:document.getElementById('r-owner').value||'Unassigned',status:'Open',mitigation:document.getElementById('r-mitigation').value,contingency:document.getElementById('r-contingency').value};
  DB.risks.push(r);
  logAudit('RAID',`${r.id} added — Score ${r.score} — ${r.cat}`);
  closeM('m-risk'); rRaid(); autoRAG(); updateBadges();
  toast(`${r.id} saved — Score: ${r.score} (${r.score>=15?'HIGH':r.score>=5?'MEDIUM':'LOW'})`, r.score>=15?'warn':'success');
}
function saveAssumption() {
  const a={id:'A'+String(DB.assumptions.length+1).padStart(3,'0'),desc:document.getElementById('a-desc').value,wrong:document.getElementById('a-wrong').value,owner:document.getElementById('a-owner').value,date:document.getElementById('a-date').value,method:document.getElementById('a-method').value,status:document.getElementById('a-status').value};
  DB.assumptions.push(a);
  logAudit('RAID',`${a.id} added`);
  closeM('m-assumption'); rRaid();
  toast(`${a.id} saved`,'success');
}
function saveIssue() {
  const i={id:'I'+String(DB.issues.length+1).padStart(3,'0'),desc:document.getElementById('i-desc').value,source:document.getElementById('i-source').value,impact:document.getElementById('i-impact').value,owner:document.getElementById('i-owner').value,opened:new Date().toISOString().split('T')[0],targetClose:document.getElementById('i-date').value,actions:document.getElementById('i-actions').value,stage:1,status:'In Progress'};
  DB.issues.push(i);
  logAudit('Issues',`${i.id} logged — owner: ${i.owner} — 48hr timer started`);
  closeM('m-issue'); rRaid(); rFullIssues(); autoRAG(); updateBadges();
  toast(`${i.id} logged — 48hr timer started. Auto-escalates if unresolved.`,'warn');
}
function saveStakeholder() {
  const s={id:'S'+String(DB.stakeholders.length+1).padStart(3,'0'),name:document.getElementById('s-name').value||'New Stakeholder',role:document.getElementById('s-role').value,org:document.getElementById('s-org').value,contact:document.getElementById('s-contact').value,power:+document.getElementById('s-pow').value,interest:+document.getElementById('s-int').value,current:document.getElementById('s-cur').value,target:document.getElementById('s-tgt').value,freq:document.getElementById('s-freq').value,chan:document.getElementById('s-chan').value,concerns:document.getElementById('s-concerns').value,action:document.getElementById('s-action').value};
  DB.stakeholders.push(s);
  DB.comms.push({id:'C'+String(DB.comms.length+1).padStart(3,'0'),what:`${s.freq} update — ${s.name}`,who:s.name,how:s.chan,when:s.freq,owner:'PM',next:'',status:'On Track'});
  logAudit('Stakeholders',`${s.name} added — ${getStrategy(s.power,s.interest)}`);
  closeM('m-stakeholder'); rStakeholders(); rPIGrid(); autoRAG();
  toast(`${s.name} added to Stakeholder Register`,'success');
}
function saveCR() {
  const cr={id:'CR-'+String(DB.crs.length+1).padStart(3,'0'),desc:document.getElementById('cr-desc').value||'New CR',by:document.getElementById('cr-by').value,date:document.getElementById('cr-date').value||new Date().toISOString().split('T')[0],cat:document.getElementById('cr-cat').value,pri:document.getElementById('cr-pri').value,scope:document.getElementById('cr-scope').value,sched:+document.getElementById('cr-sched').value||0,cost:+document.getElementById('cr-cost').value||0,qual:document.getElementById('cr-qual').value,rec:document.getElementById('cr-rec').value,status:'Pending CCB',decision:''};
  DB.crs.push(cr);
  logAudit('Change Control',`${cr.id} raised — ${cr.cat} — ₹${cr.cost.toLocaleString()}`);
  closeM('m-cr'); rCR(); autoRAG(); updateBadges();
  toast(`${cr.id} submitted to CCB — +${cr.sched} days · +₹${(cr.cost/1000).toFixed(0)}K`,'warn');
}
function saveEscalation() {
  const title = document.getElementById('esc-title').value.trim();
  if (!title) { toast('Please enter an escalation title', 'warning'); return; }
  const stage = document.getElementById('esc-stage').value;
  const priority = document.getElementById('esc-priority').value;
  const id = 'ESC' + String(Date.now()).slice(-4);
  DB.escalations.push({ id, title, stage: parseInt(stage), priority,
    status: 'Open', raised: new Date().toISOString().split('T')[0] });
  closeM('m-escalation');
  toast('Escalation ' + id + ' raised — Stage ' + stage, 'warning');
  if (typeof rEscalation === 'function') rEscalation();
}
function openDrawer(siId) {
  var allSI = [];
  Object.keys(DB.sprintIntelligence || {}).forEach(function(k) {
    var arr = DB.sprintIntelligence[k];
    if (Array.isArray(arr)) allSI = allSI.concat(arr);
  });
  var si = allSI.find(function(s) { return s && s.id === siId; });
  if (!si) { console.warn('No SI found for', siId); return; }

  var proj = DB.projects.find(function(p) { return p.id === si.projectId; }) || {};

  document.getElementById('drawer-sprint-name').textContent = si.name || siId;
  document.getElementById('drawer-sprint-sub').textContent =
    (proj.name || si.projectId) + '  \u00b7  Velocity: ' + (si.velocity || '\u2014') +
    ' pts  \u00b7  RAG: ' + (si.ragAtClose || '\u2014').toUpperCase();

  function makeCard(label, items, borderColor, bgColor) {
    if (!items || !items.length) return '';
    var h = '<div style="margin-bottom:16px;">';
    h += '<div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">' + label + '</div>';
    items.forEach(function(item) {
      h += '<div style="padding:10px 12px;background:' + bgColor + ';border-left:3px solid ' + borderColor + ';border-radius:0 8px 8px 0;font-size:12px;color:var(--ink);margin-bottom:6px;">' + item + '</div>';
    });
    h += '</div>';
    return h;
  }

  var dtHtml = '';
  (si.delayTraceIds || []).forEach(function(dtId) {
    var dt = (DB.delayTrace || []).find(function(d) { return d.id === dtId; });
    if (!dt) return;
    var slip = dt.daysSlipped === 0 ? '\u2705 ZERO DAYS SLIPPED' : '\u26a0\ufe0f ' + dt.daysSlipped + ' days slipped';
    var d = document.createElement('div');
    d.style.cssText = 'margin-top:12px;padding:14px;background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.2);border-radius:10px;cursor:pointer;';
    d.setAttribute('onclick', 'closeDrawer();go(\'impact\')');
    d.innerHTML =
      '<div style="font-size:11px;font-weight:700;color:var(--red-d);margin-bottom:4px;">' + dtId + ' \u2014 ' + slip + '</div>' +
      '<div style="font-size:12px;color:var(--ink);">' + (dt.storyTitle || '') + '</div>' +
      '<div style="font-size:11px;color:var(--muted);margin-top:4px;">' + dt.blockerType + ' blocker \u2192 Click to open Impact Trace \u2197</div>';
    dtHtml += d.outerHTML;
  });

  var retroActHtml = '';
  (si.retroActions || []).forEach(function(a) {
    retroActHtml +=
      '<div style="display:flex;align-items:flex-start;gap:10px;padding:10px;background:var(--surface-2);border-radius:8px;margin-bottom:6px;">' +
      '<span style="font-size:14px;">' + (a.status === 'Done' ? '\u2705' : '\u23f3') + '</span>' +
      '<div><div style="font-size:12px;color:var(--ink);">' + a.text + '</div>' +
      '<div style="font-size:10px;color:var(--muted);margin-top:2px;">Owner: ' + (a.owner || '\u2014') + ' \u00b7 Status: ' + (a.status || '\u2014') + '</div></div></div>';
  });

  var content = document.getElementById('drawer-content');

  content.innerHTML =
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;">' +
      '<div style="background:var(--surface-2);border-radius:10px;padding:14px;text-align:center;">' +
        '<div style="font-size:22px;font-weight:800;color:var(--ink);">' + (si.completed || 0) + '</div>' +
        '<div style="font-size:10px;color:var(--muted);margin-top:2px;">Points Completed</div>' +
      '</div>' +
      '<div style="background:var(--surface-2);border-radius:10px;padding:14px;text-align:center;">' +
        '<div style="font-size:22px;font-weight:800;color:var(--ink);">' + (si.committed || 0) + '</div>' +
        '<div style="font-size:10px;color:var(--muted);margin-top:2px;">Points Committed</div>' +
      '</div>' +
    '</div>' +
    makeCard('Blockers', si.blockers, 'var(--red-d)', 'rgba(239,68,68,.05)') +
    makeCard('Key Decisions', si.keyDecisions, 'var(--indigo)', 'rgba(79,70,229,.05)') +
    '<div style="margin-bottom:16px;">' +
      '<div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">Retrospective Summary</div>' +
      '<div style="padding:12px;background:var(--surface-2);border-radius:10px;font-size:12px;color:var(--ink);line-height:1.6;">' + (si.retroSummary || '\u2014') + '</div>' +
    '</div>' +
    (retroActHtml ? '<div style="margin-bottom:16px;"><div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">Retro Actions</div>' + retroActHtml + '</div>' : '') +
    (dtHtml ? '<div><div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">Delay Traces</div>' + dtHtml + '</div>' : '');

  var drawerEl = document.getElementById('sprint-drawer');
  var overlayEl = document.getElementById('drawer-overlay');
  drawerEl.style.display = 'block';
  drawerEl.style.transform = 'translateX(100%)';
  drawerEl.style.opacity = '0';
  overlayEl.style.display = 'block';
  overlayEl.style.opacity = '0';
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      drawerEl.style.transform = 'translateX(0)';
      drawerEl.style.opacity = '1';
      overlayEl.style.opacity = '1';
    });
  });
}
function closeDrawer() {
  const drawerEl = document.getElementById('sprint-drawer');
  const overlayEl = document.getElementById('drawer-overlay');
  if (!drawerEl) return;
  // Animate out
  drawerEl.style.transform = 'translateX(100%)';
  drawerEl.style.opacity = '0';
  if (overlayEl) overlayEl.style.opacity = '0';
  document.body.style.overflow = '';
  setTimeout(() => {
    drawerEl.style.display = 'none';
    drawerEl.style.transform = '';
    drawerEl.style.opacity = '';
    if (overlayEl) { overlayEl.style.display = 'none'; overlayEl.style.opacity = ''; }
  }, 320);
}
function countUp(el, target, duration, prefix, suffix) {
  if (!el) return;
  const start = 0;
  const startTime = performance.now();
  const isFloat = target % 1 !== 0;
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * eased;
    el.textContent = (prefix||'') + (isFloat ? current.toFixed(2) : Math.floor(current)) + (suffix||'');
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
function animateStatCards() {
  // Animate the 4 stat cards on dashboard
  const animations = [
    { id: 'st-projects',  target: DB.projects.filter(p=>p.status==='Active').length, suffix: '' },
    { id: 'st-highrisk',  target: DB.risks.filter(r=>r.score>=12&&r.status!=='Closed').length, suffix: '' },
    { id: 'st-crs',       target: DB.crs ? DB.crs.filter(c=>c.status==='Pending CCB').length : 2, suffix: '' },
  ];
  animations.forEach(({id, target, suffix}) => {
    const el = document.getElementById(id);
    if (el) countUp(el, target, 800, '', suffix);
  });
  // CPI average
  const cpiEl = document.querySelector('.stat-card.green .stat-value');
  if (cpiEl) {
    const activeProjects = DB.projects.filter(p => p.status === 'Active');
    const avgCpi = activeProjects.length > 0
      ? activeProjects.reduce((s, p) => s + (p.ac > 0 ? p.ev/p.ac : 1), 0) / activeProjects.length
      : 1.08;
    countUp(cpiEl, avgCpi, 900, '', '');
  }
}
function switchTab(group, tab, btn) {
  document.querySelectorAll('#s-'+group+' .tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('#s-'+group+' .tab-btn').forEach(b => b.classList.remove('active'));
  const pane = document.getElementById(group+'-'+tab);
  if (pane) pane.classList.add('active');
  if (btn) btn.classList.add('active');
}

var RENDER = {
  dashboard: rDash,
  raid: rRaid,
  heatmap: function(){ rHeat('full-hm', false); },
  issues: rFullIssues,
  stakeholders: rStakeholders,
  pigrid: rPIGrid,
  engagement: rEngagement,
  raci: rRaci,
  comms: rComms,
  rag: rRAG,
  cr: rCR,
  escalation: rEscalation,
  decisions: rDecisions,
  audit: rAudit,
  reports: rReports,
  import: rImport,
  backlog: rBacklog,
  sprint: rSprint,
  burndown: rBurndown,
  velocity: rVelocity,
  retro: rRetro,
  delivery: rDelivery,
  timeline: rTimeline,
  intelligence: rIntelligence,
  impact: rImpact,
  people: rPeople,
  evm: rEVM,
  newproject: rNewProject,
  'delivery-answer': rDeliveryAnswer,
  learning: rLearning,
  integrations: rIntegrations
};