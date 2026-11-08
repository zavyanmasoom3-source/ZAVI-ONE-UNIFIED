/* ZAVI ONE: collapse existing settings groups; retain original forms & handlers. */
(() => {
  'use strict';
  const root=document.getElementById('content');
  if(!root)return;
  const openState=new Map([['store',true]]);
  function simplify(){
    const sections=[...root.querySelectorAll(':scope > .zavi-settings-6546-group[data-section]')];
    if(sections.length<3)return;
    for(const section of sections){
      if(section.querySelector(':scope > details.zavi-simple-settings-group'))continue;
      const heading=section.querySelector(':scope > h3');
      if(!heading)continue;
      const key=section.dataset.section;
      const panel=document.createElement('details');
      panel.className='zavi-simple-settings-group';panel.dataset.zaviSettingsGroup=key;
      panel.open=openState.get(key)??(key==='store');
      const summary=document.createElement('summary');summary.textContent=heading.textContent;
      const body=document.createElement('div');body.className='zavi-simple-settings-body';
      for(const child of [...section.children]){if(child!==heading)body.append(child)}
      heading.replaceWith(panel);panel.append(summary,body);
      panel.addEventListener('toggle',()=>openState.set(key,panel.open));
    }
    root.classList.add('zavi-simple-workspace');
  }
  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;try{simplify()}catch(e){console.warn('ZAVI settings layout:',e.message)}})};
  const observer=new MutationObserver(records=>{if(records.some(r=>r.target===root&&r.type==='childList'))schedule()});
  observer.observe(root,{childList:true});
  document.addEventListener('zavi:page',schedule);
  document.addEventListener('zavi:language-changed',schedule);
  schedule();
})();
