function renderRoleCards(){
  const wrap = document.getElementById('roleCards');
  wrap.innerHTML = roles.map(r => `
    <div class="setup-option ${r.id===selectedRole?'selected':''}" onclick="chooseRole('${r.id}')">
      <div class="emoji">${r.emoji}</div>
      <h3>${r.title}</h3>
      <p>${r.desc}</p>
    </div>`).join('');
}
function chooseRole(id){ selectedRole = id; renderRoleCards(); }
function enterApp(role){
  currentRole = role || selectedRole;
  document.getElementById('setupOverlay').classList.remove('open');
  renderRoleBar();
  renderDashboard();
  renderProject();
  go(currentRole === 'newpm' ? 'setup' : 'dashboard');
}
function buildWizard(){
  const out = document.getElementById('s-setup');
  out.innerHTML = topbar('Guided Setup','Project Setup Intelligence · out-of-the-box PM structure', [button('Generate Workspace','ti-sparkles','openSetupResult()','primary')]) + `
  <div class="content">
    <div class="hero-panel" style="margin-bottom:14px">
      <div>
        <span class="hero-kicker"><i class="ti ti-sparkles"></i> Project Setup Intelligence</span>
        <h1 class="hero-title">Start with structure. <em>Not a blank form.</em></h1>
        <p class="hero-copy">VeloClear asks a few practical questions, then generates phases, starter risks, stakeholders, governance and sprint defaults. The PM still decides — the system removes the empty-page problem.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px">
          <button class="btn btn-primary" onclick="openSetupResult()"><i class="ti ti-wand"></i> Generate demo setup</button>
          <button class="btn btn-ghost" onclick="showModal('PM Coaching Layer','Guided prompts help users improve project inputs.','${coachModal()}')"><i class="ti ti-message-question"></i> See coaching prompts</button>
        </div>
      </div>
      <div class="card card-p">
        <div class="form-grid">
          ${field('Project type','select','Mobile app integration')}
          ${field('Delivery model','select','Hybrid Agile')}
          ${field('Team size','select','12–25 people')}
          ${field('Governance level','select','Steering monthly')}
          <div class="field" style="grid-column:1/-1"><label>What are you delivering?</label><textarea placeholder="Example: customer mobile app with third-party payment integration">Customer mobile app with vendor API integration and branch training rollout.</textarea></div>
        </div>
      </div>
    </div>
    <div class="g3">
      ${setupMini('Phases created','Discovery → Build → Integrate → Test → Launch')}
      ${setupMini('RAID starters','8 risks · 3 assumptions · 4 dependencies')}
      ${setupMini('Governance defaults','RAG cadence · CR thresholds · escalation rules')}
    </div>
  </div>`;
}
function openSetupResult(){
  showModal('Generated workspace','Starter structure created from the setup inputs.', `
    <div class="info-strip"><i class="ti ti-circle-check"></i><div><strong>Workspace generated:</strong> Apex Mobile Platform with 5 phases, 8 starter RAID items, 6 stakeholder roles, a steering cadence and an initial delivery health narrative.</div></div>
    <div class="flow-card">
      ${flowStep(1,'Starter risks','Vendor API delay, UAT readiness, branch training adoption, data migration quality.')}
      ${flowStep(2,'Stakeholders','Sponsor, vendor lead, branch ops manager, compliance, QA, product owner.')}
      ${flowStep(3,'Next best action','Validate the top 3 triggers and assign owners before sprint 1 closes.')}
    </div>`);
}
function coachModal(){
  return `<div class="flow-card">${flowStep(1,'Weak input','“Vendor may delay.”')}${flowStep(2,'Coaching prompt','“What observable event proves the risk has happened?”')}${flowStep(3,'Stronger input','“Vendor misses sprint 4 API certification milestone by 2 working days.”')}</div>`;
}
