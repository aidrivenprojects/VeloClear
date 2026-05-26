let currentRole = 'portfolio';
let selectedRole = 'portfolio';

function renderNav(){
  const wrap = document.getElementById('navGroups');
  wrap.innerHTML = nav.map(group => `
    <div class="sb-group">
      <div class="sb-group-label">${group.label}</div>
      ${group.items.map(item => `
        <a class="sb-item ${item.id === 'dashboard' ? 'active' : ''}" data-sec="${item.id}" onclick="go('${item.id}')">
          <i class="ti ${item.icon}"></i>${item.name}
          ${item.badge ? `<span class="sb-badge ${item.badgeClass || ''}">${item.badge}</span>` : ''}
        </a>`).join('')}
    </div>`).join('<div class="sb-divider"></div>');
}

function renderRoleBar(){
  const rb = document.getElementById('roleBar');
  rb.innerHTML = `<span class="role-label">View as:</span>` + roles.map(r => `<button class="role-btn ${r.id===currentRole?'active':''}" onclick="setRole('${r.id}')">${r.emoji} ${r.title.split(' ')[0]}</button>`).join('');
}

function setRole(id){
  currentRole = id;
  renderRoleBar();
  renderDashboard();
  renderProject();
}

function go(id){
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
  const sec = document.getElementById(`s-${id}`);
  if(sec) sec.classList.add('active');
  document.querySelectorAll('.sb-item').forEach(a => a.classList.toggle('active', a.dataset.sec === id));
  toggleSidebar(false);
  window.scrollTo({ top:0, behavior:'smooth' });
}

function toggleSidebar(force){
  const sb = document.getElementById('sidebar');
  const shade = document.getElementById('sidebarShade');
  const open = typeof force === 'boolean' ? force : !sb.classList.contains('open');
  sb.classList.toggle('open', open);
  shade.classList.toggle('open', open);
}
