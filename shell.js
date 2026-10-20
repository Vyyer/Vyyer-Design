/* ============================================================================
   VYYER DASHBOARD SHELL — shared top navigation
   Pair with shell.css. A page carries one placeholder:

       <header class="sh-nav" data-tab="branding"></header>

   and loads this file; the tabs, the account control, its menus and the theme
   switcher are built here. Add a tab once, in TABS, and all three pages get it.

   The theme is the DASHBOARD's own light/dark, stored in localStorage so it
   follows the user from page to page. It is not the client's widget theme —
   that is a branding setting and lives in the Branding studio's inspector.
   To avoid a flash of the wrong theme, each page sets data-theme in <head>
   before this script runs.
   ============================================================================ */
(function(){
'use strict';

/* ---- tabs. Branding is top level; it used to live inside Settings. ---- */
const I = {
  /* a bar chart reads as "the numbers page" faster than a house does */
  dashboard:'<path d="M3.2 20.4h17.6"/><path d="M6.6 20.4v-5.8"/><path d="M11.4 20.4V7.4"/><path d="M16.2 20.4v-9.2"/>',
  history:'<circle cx="12" cy="12" r="9"/><path d="M12 6.8V12l3.6 2.1"/>',
  /* branching steps — a workflow is a shape, not a grid of squares */
  workflows:'<rect x="9" y="2.9" width="6" height="4.6" rx="1.4"/><rect x="2.5" y="16.5" width="6" height="4.6" rx="1.4"/><rect x="15.5" y="16.5" width="6" height="4.6" rx="1.4"/><path d="M12 7.5v3.2"/><path d="M5.5 16.5v-2.1a1.7 1.7 0 011.7-1.7h9.6a1.7 1.7 0 011.7 1.7v2.1"/>',
  branding:'<path d="M12 3.2c-4.9 0-8.8 3.7-8.8 8.4 0 4.7 3.9 8.4 8.8 8.4 1.3 0 2.2-.8 2.2-1.9 0-.5-.2-1-.6-1.3-.3-.3-.5-.7-.5-1.2 0-.9.8-1.7 1.7-1.7h1.5c2.5 0 4.5-2 4.5-4.5 0-3.4-3.7-6.2-8.8-6.2z"/><circle cx="7.6" cy="12.4" r="1.05"/><circle cx="9.6" cy="8.4" r="1.05"/><circle cx="14.4" cy="8" r="1.05"/>',
  apikeys:'<circle cx="8.2" cy="15.4" r="3.9"/><path d="M11 12.6l8.2-8.2M16.6 6.9l2.2 2.2M14.5 9l2.2 2.2"/>',
  settings:'<circle cx="12" cy="12" r="3.1"/><path d="M19.1 14.6a1.5 1.5 0 00.3 1.65l.05.06a1.82 1.82 0 11-2.58 2.58l-.06-.06a1.5 1.5 0 00-1.65-.3 1.5 1.5 0 00-.91 1.37v.17a1.82 1.82 0 11-3.64 0v-.09a1.5 1.5 0 00-.98-1.37 1.5 1.5 0 00-1.65.3l-.06.06A1.82 1.82 0 114.8 16.4l.06-.06a1.5 1.5 0 00.3-1.65 1.5 1.5 0 00-1.37-.91h-.17a1.82 1.82 0 110-3.64h.09a1.5 1.5 0 001.37-.98 1.5 1.5 0 00-.3-1.65l-.06-.06A1.82 1.82 0 117.3 4.8l.06.06a1.5 1.5 0 001.65.3h.07a1.5 1.5 0 00.91-1.37v-.17a1.82 1.82 0 113.64 0v.09a1.5 1.5 0 00.91 1.37 1.5 1.5 0 001.65-.3l.06-.06a1.82 1.82 0 112.58 2.58l-.06.06a1.5 1.5 0 00-.3 1.65v.07a1.5 1.5 0 001.37.91h.17a1.82 1.82 0 110 3.64h-.09a1.5 1.5 0 00-1.37.91z"/>',
};
const TABS = [
  {id:'dashboard', label:'Dashboard', href:'dashboard.html'},
  {id:'history',   label:'History',   href:'history.html'},
  {id:'workflows', label:'Workflow',  href:'workflow.html'},
  {id:'branding',  label:'Branding',  href:'branding.html'},
  {id:'apikeys',   label:'API Keys',  href:'#'},
  {id:'settings',  label:'Settings',  href:'#'},
];

const ACCOUNT = {name:'Dev User', email:'devuser@vyyer.com'};
/* The first profile is the account's own and can't be deleted — everything
   else was created by the user, so it can be renamed or removed. */
let PROFILES = ['Default profile','Adams Campaign','Alliance','aNtoniotestbraidng','Cuomo Campaign','Daniel'];
let active = 0;

const MARK = '<svg viewBox="0 0 208 208" aria-hidden="true">'
  + '<path d="M104,0 C161.437614,0 208,46.562386 208,104 C208,161.437614 161.437614,208 104,208 C46.562386,208 0,161.437614 0,104 C0,46.562386 46.562386,0 104,0 Z" fill="#000000"/>'
  + '<path d="M116.756787,50.1428571 L30.5093537,50.1428571 C29.7672292,50.1428571 29.4939453,50.6427765 29.9073789,51.2722817 L43.8028445,72.4298926 C44.2125074,73.0536566 45.1544907,73.5593172 45.8944239,73.5593172 L72.3948927,73.5593172 C73.1403776,73.5593172 73.4192985,74.0613204 73.0106877,74.6916702 L59.8786829,94.9499375 C59.4732921,95.5753191 59.4702798,96.5849156 59.8739194,97.2079676 L103.675563,164.819542 C104.078323,165.441236 104.728497,165.441581 105.129432,164.817722 L178.102926,51.2703529 C178.503116,50.6476542 178.224008,50.1428571 177.482209,50.1428571 L151.277266,50.1428571 C150.534264,50.1428571 149.6044,50.6519098 149.207627,51.2685577 L105.129139,119.773571 C104.729111,120.395277 104.080685,120.399377 103.676063,119.775359 L88.9066685,96.9976564 C88.5041851,96.3769374 88.5037541,95.3757513 88.9175719,94.7433123 L117.360858,51.2732898 C117.769363,50.6489691 117.497161,50.1428571 116.756787,50.1428571 Z" fill="#A0D959"/></svg>';
const TICK  = '<svg class="sh-tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5l5 5 10-11"/></svg>';
const TRASH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M9.5 7V5.2A1.2 1.2 0 0110.7 4h2.6a1.2 1.2 0 011.2 1.2V7"/><path d="M6.5 7l.8 12.1A1.8 1.8 0 009.1 20.8h5.8a1.8 1.8 0 001.8-1.7L17.5 7"/></svg>';
const SUN   = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.6v2.1M12 19.3v2.1M2.6 12h2.1M19.3 12h2.1M5.3 5.3l1.5 1.5M17.2 17.2l1.5 1.5M18.7 5.3l-1.5 1.5M6.8 17.2l-1.5 1.5"/></svg>';
const MOON  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M20.5 14.6A8.6 8.6 0 019.4 3.5a8.6 8.6 0 1011.1 11.1z"/></svg>';

const $  = id => document.getElementById(id);
const attr = t => String(t).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const initials = n => (n.trim().slice(0,2) || '··').toUpperCase();
const icon = d => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+d+'</svg>';

/* ---- theme ---- */
function setTheme(t){
  t = t === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = t;
  try{ localStorage.setItem('vyyer.dashTheme', t); }catch(e){}
  const l = $('shLight'), d = $('shDark');
  if(l) l.classList.toggle('on', t==='light');
  if(d) d.classList.toggle('on', t==='dark');
  /* pages with canvas charts can't re-read CSS on their own */
  dispatchEvent(new CustomEvent('vyyer:theme', {detail:{theme:t}}));
}

/* ---- markup ---- */
function build(nav){
  const current = nav.dataset.tab || '';
  nav.innerHTML =
    '<a class="sh-brand" href="index.html" aria-label="Vyyer">'+MARK+'<span>vyyer</span></a>'
  + '<nav class="sh-tabs" aria-label="Sections">'
  +   TABS.map(t =>
        '<a href="'+t.href+'"'+(t.id===current?' class="on" aria-current="page"':'')+'>'
        + icon(I[t.id]) + '<span>'+t.label+'</span></a>').join('')
  + '</nav>'
  + '<span class="sh-sp"></span>'
  + '<a class="sh-docs" href="#">Docs</a>'
  + '<div class="sh-themesw" role="group" aria-label="Dashboard theme">'
  +   '<button id="shLight" type="button" title="Light mode" aria-label="Light mode">'+SUN+'</button>'
  +   '<button id="shDark" type="button" title="Dark mode" aria-label="Dark mode">'+MOON+'</button>'
  + '</div>'
  + '<div class="sh-acct" id="shAcct">'
  +   '<button class="sh-acctbtn" id="shAcctBtn" type="button" aria-haspopup="menu" aria-expanded="false">'
  +     '<span class="sh-av" id="shAv"></span>'
  +     '<span class="sh-who"><b id="shName"></b><i id="shProfile"></i></span>'
  +     '<svg class="sh-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>'
  +   '</button>'
  +   '<div class="sh-pop" id="shMenu" role="menu">'
  +     '<div class="sh-ph"><div class="sh-em" id="shEmail"></div>'
  +       '<button class="sh-lnk" type="button" id="shEdit">Edit Profile</button></div>'
  +     '<div class="sh-div"></div><div class="sh-plist" id="shList"></div><div class="sh-div"></div>'
  +     '<button class="sh-act" type="button" id="shAdd">'
  +       icon('<path d="M12 5v14M5 12h14"/>')+'Add New Profile</button>'
  +     '<div class="sh-div"></div>'
  +     '<button class="sh-act quiet" type="button" id="shOut">'
  +       icon('<path d="M15 17l5-5-5-5"/><path d="M20 12H9"/><path d="M12 20H5.8A1.8 1.8 0 014 18.2V5.8A1.8 1.8 0 015.8 4H12"/>')
  +       'Log out</button>'
  +   '</div>'
  +   '<div class="sh-pop sh-confirm" id="shConfirm" role="alertdialog">'
  +     '<h4 id="shCfTitle"></h4><p id="shCfDesc"></p>'
  +     '<div class="sh-acts"><button class="sh-btn" type="button" id="shCfNo">Cancel</button>'
  +     '<button class="sh-btn danger" type="button" id="shCfYes"></button></div>'
  +   '</div>'
  + '</div>';

  const extra = document.createElement('div');
  extra.innerHTML =
    '<div class="sh-modal" id="shModal"><div class="sh-sheet" role="dialog" aria-modal="true" aria-labelledby="shMTitle">'
  +   '<h2 id="shMTitle"></h2><p id="shMDesc"></p>'
  +   '<label class="sh-f"><span>Profile Name</span>'
  +     '<input type="text" id="shMInput" placeholder="Enter profile name" autocomplete="off" maxlength="48"></label>'
  +   '<div class="sh-acts"><button class="sh-btn" type="button" id="shMNo">Cancel</button>'
  +   '<button class="sh-btn primary" type="button" id="shMOk"></button></div>'
  + '</div></div><div class="sh-toast" id="shToast"></div>';
  while(extra.firstChild) document.body.appendChild(extra.firstChild);
}

/* ---- account ---- */
function renderAcct(){
  $('shAv').textContent = initials(ACCOUNT.name);
  $('shName').textContent = ACCOUNT.name;
  $('shEmail').textContent = ACCOUNT.email;
  $('shProfile').textContent = PROFILES[active];
  $('shProfile').title = PROFILES[active];
  $('shList').innerHTML = PROFILES.map((name,i) =>
    '<div class="sh-prow'+(i===active?' on':'')+'">'
    + '<button class="sh-pick" type="button" data-i="'+i+'" title="'+attr(name)+'">'
    +   (i===active ? TICK : '<span class="sh-gap"></span>')
    +   '<span class="sh-nm">'+attr(name)+'</span></button>'
    + (i===0 ? '' : '<button class="sh-trash" type="button" data-del="'+i+'" title="Delete profile" aria-label="Delete '+attr(name)+'">'+TRASH+'</button>')
    + '</div>').join('');
}
function openAcct(){ $('shAcct').classList.add('open'); $('shMenu').classList.add('open');
  $('shAcctBtn').setAttribute('aria-expanded','true'); }
function closeAcct(){ $('shAcct').classList.remove('open'); $('shMenu').classList.remove('open');
  $('shConfirm').classList.remove('open'); $('shAcctBtn').setAttribute('aria-expanded','false'); }

function pick(i){
  if(i === active){ closeAcct(); return; }
  active = i; renderAcct(); closeAcct();
  /* each profile carries its own branding, workflows and keys in the product —
     switching would reload those here. */
  toast('Switched to '+PROFILES[i]);
}

/* ---- confirmations ---- */
let onYes = null;
function askConfirm(title, desc, label, fn){
  $('shCfTitle').textContent = title; $('shCfDesc').textContent = desc;
  $('shCfYes').textContent = label; onYes = fn;
  $('shMenu').classList.remove('open');
  $('shAcct').classList.add('open'); $('shConfirm').classList.add('open');
}
function closeConfirm(){ $('shConfirm').classList.remove('open'); onYes = null; openAcct(); }

/* ---- new / rename profile ---- */
let kind = 'new';
function openModal(k){
  kind = k;
  const isNew = k === 'new';
  $('shMTitle').textContent = isNew ? 'Create New Profile' : 'Edit Profile';
  $('shMDesc').textContent = isNew
    ? 'Have multiple companies or locations? Add individually customizable profiles to your dashboard and easily switch between them!'
    : 'Rename the profile you’re working in. Its branding, workflows and API keys stay as they are.';
  $('shMOk').textContent = isNew ? 'Create' : 'Save';
  $('shMInput').value = isNew ? '' : PROFILES[active];
  closeAcct();
  $('shModal').classList.add('open');
  validate();
  setTimeout(()=>{ $('shMInput').focus(); $('shMInput').select(); }, 0);
}
function closeModal(){ $('shModal').classList.remove('open'); }
function validate(){ $('shMOk').disabled = !$('shMInput').value.trim(); }
function submit(){
  const name = $('shMInput').value.trim(); if(!name) return;
  if(kind === 'new'){ PROFILES.push(name); active = PROFILES.length-1; toast('Profile created'); }
  else { PROFILES[active] = name; toast('Profile renamed'); }
  renderAcct(); closeModal();
}

/* ---- export ----------------------------------------------------------------
   Every export offers the same two formats. Excel is a tab-separated .xls,
   which Excel, Numbers and Sheets all open; PDF is rendered as a clean
   document and handed to the browser's own print-to-PDF, so there is no
   dependency to ship and the output matches what the user sees.
   --------------------------------------------------------------------------- */
const EXPORT_FORMATS = [
  {id:'excel', label:'Excel', ext:'.xls',
   icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6.6A1.6 1.6 0 005 4.6v14.8A1.6 1.6 0 006.6 21h10.8a1.6 1.6 0 001.6-1.6V8z"/><path d="M14 3v5h5"/><path d="M9 12.5l5 5M14 12.5l-5 5"/></svg>'},
  {id:'pdf', label:'PDF', ext:'.pdf',
   icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6.6A1.6 1.6 0 005 4.6v14.8A1.6 1.6 0 006.6 21h10.8a1.6 1.6 0 001.6-1.6V8z"/><path d="M14 3v5h5"/><path d="M8.5 16.5v-4h1.3a1.2 1.2 0 010 2.4H8.5M13.5 16.5v-4h1a2 2 0 010 4zM18.4 12.5h-1.6v4M16.8 14.5h1.4"/></svg>'},
];
function exportButton(label){
  return '<button type="button">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M12 3v11M8 10.5l4 4 4-4M4 17v2.4A1.6 1.6 0 005.6 21h12.8a1.6 1.6 0 001.6-1.6V17"/></svg>'
    + (label||'Export')
    + '<svg class="cv" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg></button>'
    + '<div class="sh-expmenu">'
    + EXPORT_FORMATS.map(f=>`<button type="button" data-fmt="${f.id}">${f.icon}${f.label}<span class="ext">${f.ext}</span></button>`).join('')
    + '</div>';
}
/* Wires a `.sh-exp` container: builds the button and menu, then calls back with
   'excel' or 'pdf'. */
function wireExport(el, onPick, label){
  if(typeof el === 'string') el = $(el);
  if(!el) return;
  el.classList.add('sh-exp');
  el.innerHTML = exportButton(label);
  el.addEventListener('click', e=>{
    e.stopPropagation();
    const pick = e.target.closest('[data-fmt]');
    if(pick){ el.classList.remove('open'); onPick(pick.dataset.fmt); return; }
    if(e.target.closest('button')) el.classList.toggle('open');
  });
  document.addEventListener('click', ()=>el.classList.remove('open'));
}
const escCell = v => String(v==null?'':v).replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function exportTable(o){
  const rows = o.rows || [];
  if(o.format !== 'pdf'){
    const all = (o.headers ? [o.headers] : []).concat(rows);
    const tsv = all.map(r=>(r||[]).map(c=>String(c==null?'':c)).join('\t')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([tsv], {type:'text/tab-separated-values'}));
    a.download = o.filename + '.xls';
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
    return;
  }
  /* a one-column row is a section heading, which is how the dashboard's
     report is already shaped */
  const widest = rows.reduce((n,r)=>Math.max(n,(r||[]).length), (o.headers||[]).length||1);
  const tr = (cells, tag)=>'<tr>'+cells.map(c=>`<${tag}>${escCell(c)}</${tag}>`).join('')+'</tr>';
  const body = rows.map(r=>{
    if(!r || !r.length) return '<tr class="sp"><td colspan="'+widest+'"></td></tr>';
    if(r.length===1) return `<tr class="hd"><td colspan="${widest}">${escCell(r[0])}</td></tr>`;
    return tr(r,'td');
  }).join('');
  const doc = `<!doctype html><html><head><meta charset="utf-8"><title>${escCell(o.filename)}</title><style>
    *{box-sizing:border-box}
    body{font:12px -apple-system,'Segoe UI',Roboto,sans-serif;color:#15181c;margin:28px}
    h1{font-size:17px;margin:0 0 2px}
    .meta{font-size:11px;color:#6b7280;margin-bottom:16px}
    table{width:100%;border-collapse:collapse}
    th{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#6b7280;text-align:left;
       border-bottom:1.5px solid #d4d8de;padding:7px 8px}
    td{padding:7px 8px;border-bottom:1px solid #eceff3;vertical-align:top}
    tr.hd td{font-weight:700;font-size:10px;letter-spacing:.07em;text-transform:uppercase;color:#4C7A15;
       border-bottom:1.5px solid #d4d8de;padding-top:16px}
    tr.sp td{border:0;height:6px;padding:0}
    @page{margin:14mm}
  </style></head><body>
    <h1>${escCell(o.title || o.filename)}</h1>
    <div class="meta">${escCell(o.subtitle || '')}${o.subtitle?' · ':''}Exported ${new Date().toLocaleString()}</div>
    <table>${o.headers?'<thead>'+tr(o.headers,'th')+'</thead>':''}<tbody>${body}</tbody></table>
  </body></html>`;
  /* an iframe rather than a popup — popup blockers don't fire on this */
  const fr = document.createElement('iframe');
  fr.setAttribute('aria-hidden','true');
  fr.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0';
  document.body.appendChild(fr);
  fr.contentDocument.open(); fr.contentDocument.write(doc); fr.contentDocument.close();
  const go = ()=>{ try{ fr.contentWindow.focus(); fr.contentWindow.print(); }catch(_){}
                   setTimeout(()=>fr.remove(), 60000); };
  fr.contentWindow.addEventListener('load', go);
  setTimeout(go, 350);                       /* about:blank may not fire load */
}

/* ---- toast ---- */
let tT = null;
function toast(msg){
  const t = $('shToast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(tT); tT = setTimeout(()=>t.classList.remove('on'), 2200);
}

/* ---- wiring ---- */
function init(){
  const nav = document.querySelector('.sh-nav');
  if(!nav) return;
  build(nav);
  renderAcct();
  let stored = null; try{ stored = localStorage.getItem('vyyer.dashTheme'); }catch(e){}
  setTheme(stored || document.documentElement.dataset.theme || 'light');

  $('shLight').onclick = ()=>setTheme('light');
  $('shDark').onclick  = ()=>setTheme('dark');
  $('shAcctBtn').onclick = e=>{ e.stopPropagation();
    $('shMenu').classList.contains('open') ? closeAcct() : openAcct(); };
  $('shEdit').onclick = ()=>openModal('edit');
  $('shAdd').onclick  = ()=>openModal('new');
  $('shOut').onclick  = ()=>askConfirm('Log out?',
    'You’ll be logged out of '+ACCOUNT.email+' and returned to the login screen.',
    'Log out', ()=>{ closeAcct(); toast('Logged out'); });
  $('shList').onclick = e=>{
    const p = e.target.closest('.sh-pick'), d = e.target.closest('.sh-trash');
    if(d){ const i = +d.dataset.del;
      askConfirm('Delete this profile?',
        '“'+PROFILES[i]+'” and its branding, workflows and API keys are removed. This can’t be undone.',
        'Delete', ()=>{
          PROFILES.splice(i,1);
          if(active === i) active = 0; else if(active > i) active--;
          renderAcct(); $('shConfirm').classList.remove('open'); openAcct(); toast('Profile deleted');
        });
      return; }
    if(p) pick(+p.dataset.i);
  };
  $('shCfNo').onclick  = closeConfirm;
  $('shCfYes').onclick = ()=>{ const f = onYes; onYes = null; if(f) f(); };
  $('shMNo').onclick   = closeModal;
  $('shMOk').onclick   = submit;
  $('shMInput').oninput = validate;
  $('shMInput').onkeydown = e=>{ if(e.key === 'Enter'){ e.preventDefault(); submit(); } };
  $('shModal').onclick = e=>{ if(e.target.id === 'shModal') closeModal(); };

  /* the shell owns clicks inside itself; pages close their own pickers on the
     document, so stop ours from reaching them */
  $('shAcct').addEventListener('click', e=>e.stopPropagation());
  document.addEventListener('click', closeAcct);
  addEventListener('keydown', e=>{
    if(e.key !== 'Escape') return;
    if($('shModal').classList.contains('open')) closeModal();
    else if($('shConfirm').classList.contains('open')) closeConfirm();
    else closeAcct();
  });

  window.VyyerShell = {setTheme, toast, wireExport, exportTable,
    get theme(){ return document.documentElement.dataset.theme; },
    get profile(){ return PROFILES[active]; }};
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
