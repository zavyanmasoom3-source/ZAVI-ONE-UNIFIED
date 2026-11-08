/* ZAVI ONE minimal settings; moves existing live nodes, never clones or deletes forms. */
(() => {
  'use strict';
  const root = document.getElementById('content');
  if (!root) return;
  const openState = new Map([['store',true]]);
  const order = ['account','store','appearance','security','cloud','invoices','subscription','advanced'];
  const captions = {
    fa:['حساب و پروفایل','فروشگاه و کسب‌وکار','ظاهر و زبان','امنیت و دسترسی','ابر و دستگاه‌ها','حسابداری و فاکتورها','اشتراک و پشتیبانی','پیشرفته و پشتیبان‌گیری'],
    ps:['حساب او پېژندپاڼه','دوکان او کاروبار','بڼه او ژبه','امنیت او لاسرسی','کلاوډ او وسایل','حسابداري او بلونه','ګډون او ملاتړ','پرمختللي او بیک اپ'],
    en:['Account & profile','Store & business','Appearance & language','Security & access','Cloud & devices','Accounting & invoices','Subscription & support','Advanced & backups']
  };
  function language(){const l=String(document.documentElement.lang||'fa').toLowerCase();return l.startsWith('en')?'en':l.startsWith('ps')?'ps':'fa'}
  function classify(node){
    const key=String(node.id||'')+' '+String(node.className||'');
    const title=String(node.querySelector(':scope > h3, :scope > .panel-head h3, :scope > h2')?.textContent||node.textContent||'').slice(0,145);
    if(/z20CloudPanel|z652DevicePanel|device|cloud|sync|offline|zavi-staff/i.test(key)||/دستگاه|ابر و دستگاه|همکار|وسایل|کلاوډ|device|cloud|sync/i.test(title))return 'cloud';
    if(/zavi-rename-card|profile|z644-suite/.test(key)&&!/thermal|invoice|csv/i.test(key))return 'store';
    if(/font|theme|custom-card|customize|appearance|language|z6515/i.test(key)||/فونت|ظاهر|زبان|شیشه|روښانه|ژبه|font|theme|appearance|language/i.test(title))return 'appearance';
    if(/z6527-studio|invoice|receipt|thermal|csv/i.test(key)||/فاکتور|رسید|چاپ|Excel|CSV|صندوق|حساب‌های نقدی|بلونه|invoice|receipt|cash accounts/i.test(title))return 'invoices';
    if(/security|access|permission|staff|biometric|pin/i.test(key)||/امنیت|دسترسی|رمز|صلاحیت|security|permission|password/i.test(title))return 'security';
    if(/subscription|license|support|billing/i.test(key)||/اشتراک|پشتیبانی|تمدید|ګډون|subscription|support/i.test(title))return 'subscription';
    if(/shop|store|business|z642-smart/i.test(key)||/فروشگاه|کسب‌وکار|تجارت|دوکان|دکان|business|store/i.test(title))return 'store';
    if(/حساب و پروفایل|profile|avatar/i.test(title))return 'account';
    return 'advanced';
  }
  function simplify(){
    const active=document.querySelector('.nav-btn.active[data-go="settings"],.bottom-btn.active[data-go="settings"]');
    if(!active)return;
    if(root.querySelector(':scope > .zavi-simple-group'))return;
    const nodes=[...root.children].filter(el=>!el.matches('.page-head,.zavi-simple-group'));
    if(nodes.length<4)return;
    const groups=new Map();
    for(const key of order){
      const wrapper=document.createElement('section');wrapper.className='zavi-simple-group';wrapper.dataset.settingsSection=key;
      const details=document.createElement('details');details.className='zavi-simple-settings-group';
      details.open=openState.get(key)??(key==='store');
      const summary=document.createElement('summary');summary.textContent=captions[language()][order.indexOf(key)];
      const body=document.createElement('div');body.className='zavi-simple-settings-body';
      details.append(summary,body);wrapper.append(details);groups.set(key,{wrapper,details,body});
      details.addEventListener('toggle',()=>openState.set(key,details.open));
    }
    for(const el of nodes)groups.get(classify(el)).body.append(el);
    for(const key of order){const g=groups.get(key);if(g.body.children.length)root.append(g.wrapper)}
    root.classList.add('zavi-simple-workspace');
  }
  let queued=false;
  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;try{simplify()}catch(err){console.warn('ZAVI settings grouping:',err.message)}});
  }
  const observer=new MutationObserver(mutations=>{
    if(mutations.some(m=>m.type==='childList'&&m.target===root))schedule();
  });
  observer.observe(root,{childList:true});
  document.addEventListener('zavi:page',schedule);
  document.addEventListener('zavi:language-changed',schedule);
  schedule();
})();
