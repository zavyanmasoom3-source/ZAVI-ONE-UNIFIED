/* ZAVI ONE 65.59 UI-only upgrade: keep every form, module and auth handler. */
(()=>{'use strict';
const D={
fa:{title:'تنظیمات مرتب',desc:'هر گزینه در بخش خودش قرار دارد.',search:'جست‌وجوی تنظیمات',placeholder:'مثلاً فاکتور، فونت، پشتیبان...',help:'برای دیدن گزینه‌ها یک گروه را باز کنید.',none:'نتیجه‌ای پیدا نشد.',found:'گزینه پیدا شد',groups:[['store','🏪 فروشگاه و حساب‌ها','نام، ارز و حساب‌ها'],['look','🎨 ظاهر و زبان','قلم، حالت روشن و تیره'],['invoice','🧾 فاکتور و چاپ','قالب و چاپ'],['features','🧩 امکانات و نوع تجارت','ابزارها و بخش‌ها'],['cloud','☁️ حساب و پشتیبان','ورود، قفل، بازیابی'],['advanced','🛠️ پیشرفته','بررسی و گزینه‌های حساس']]},
en:{title:'Organized settings',desc:'All settings are available in clear groups.',search:'Search settings',placeholder:'E.g. invoice, font, backup...',help:'Open a group to view its settings.',none:'No matching settings.',found:'matching settings',groups:[['store','🏪 Store and accounts','Shop and money'],['look','🎨 Appearance and language','Theme and font'],['invoice','🧾 Invoices and printing','Design and printing'],['features','🧩 Features and business type','Available tools'],['cloud','☁️ Account and backup','Security and recovery'],['advanced','🛠️ Advanced','Sensitive settings']]},
ps:{title:'منظم تنظیمات',desc:'ټول انتخابونه په جلا برخو کې شته.',search:'تنظیمات ولټوئ',placeholder:'بېلګه: فونټ، فاکتور، بیک اپ...',help:'د انتخابونو لپاره یوه برخه پرانیزئ.',none:'کومه پایله نشته.',found:'انتخابونه وموندل شول',groups:[['store','🏪 دوکان او حسابونه','د دوکان او پیسو معلومات'],['look','🎨 بڼه او ژبه','رڼا، تیاره او فونټ'],['invoice','🧾 فاکتور او چاپ','ډیزاین او چاپ'],['features','🧩 امکانات او کاروبار','د کار وسایل'],['cloud','☁️ حساب او بیک اپ','امنیت او بیا راګرځول'],['advanced','🛠️ پرمختللي','حساس انتخابونه']]}
};
function locale(){const v=(document.querySelector('#zaviTopLanguage')?.value||document.documentElement.lang||'fa').toLowerCase();return v.startsWith('en')?'en':v.startsWith('ps')?'ps':'fa'}
function group(el){
const s=((el.querySelector('h1,h2,h3,h4')?.textContent||el.getAttribute('aria-label')||'')+'').trim();
if(/آغاز دوباره|پاک.کردن|حذف همه|reset|danger|ریست/i.test(s))return 'advanced';
if(/سلامت|بررسی|آزمایش|integrity|testing/i.test(s))return 'advanced';
if(/فونت|ظاهر|زبان|شخصی|انیمیشن|theme|appearance|language|font|رنګ|ژبه/i.test(s))return 'look';
if(/فاکتور|چاپ|رسید|invoice|print|چاپول/i.test(s))return 'invoice';
if(/امکانات|نوع تجارت|بخش|صنف|business|feature|tools|وسیلو/i.test(s))return 'features';
if(/پشتیبان|بازیابی|امنیت|قفل|رمز|ابری|sync|backup|security|cloud|بیک اپ/i.test(s))return 'cloud';
return 'store';
}
function removeBulkActions(root){
root.querySelectorAll('#zaviEnableAllFeatures,.zavi-enable-all').forEach(x=>x.remove());
root.querySelectorAll('button,a').forEach(x=>{const t=x.textContent.replace(/\s+/g,' ').trim();if(/^(همه بخش‌ها|همه بخش ها|نمایش همه بخش‌ها|روشن‌کردن تمام بخش‌ها و امکانات)$/u.test(t))x.remove()});
}
function shorten(root){
const map={'فونت دلخواه خود را انتخاب کنید؛ این انتخاب برای همین حساب در این دستگاه محفوظ می‌ماند.':'فونت دلخواه را انتخاب کنید.','تنظیم بخش‌ها و امکانات فروشگاه.':'مدیریت امکانات','زبان و بخش‌های دلخواه خود را انتخاب کنید.':'زبان و بخش‌ها را انتخاب کنید.','انتخاب رنگ یا چیدمان را تغییر دهید تا پیش‌نمایش را ببینید.':'پیش‌نمایش ظاهر'};
if(locale()!=='fa')return;
root.querySelectorAll('p,.tiny-note').forEach(el=>{if(el.children.length)return;const r=map[el.textContent.trim()];if(r)el.textContent=r});
}
function enhance(){
const root=document.getElementById('content');if(!root||root.querySelector('.zavi-clean-settings-hub'))return;
const cards=Array.from(root.children).filter(el=>el.matches?.('section.settings-card'));if(cards.length<5)return;
const lang=D[locale()];const hub=document.createElement('section');hub.className='zavi-clean-settings-hub';
hub.innerHTML='<div class="zavi-clean-settings-title"><strong></strong><span></span></div><label class="zavi-clean-search-label" for="zaviCleanSettingsSearch"></label><input type="search" id="zaviCleanSettingsSearch" autocomplete="off"><p class="zavi-clean-search-help"></p><div class="zavi-clean-settings-groups"></div>';
hub.querySelector('strong').textContent=lang.title;hub.querySelector('.zavi-clean-settings-title span').textContent=lang.desc;
hub.querySelector('label').textContent=lang.search;hub.querySelector('input').placeholder=lang.placeholder;hub.querySelector('.zavi-clean-search-help').textContent=lang.help;
cards[0].before(hub);const list=hub.querySelector('.zavi-clean-settings-groups');const groups=new Map();
for(const [id,title,sub] of lang.groups){const d=document.createElement('details');d.className='zavi-clean-settings-group';d.dataset.group=id;const summary=document.createElement('summary');summary.innerHTML='<span></span><small></small><span class="zavi-clean-count"></span>';summary.children[0].textContent=title;summary.children[1].textContent=sub;d.append(summary);const body=document.createElement('div');body.className='zavi-clean-settings-stack';d.append(body);list.append(d);groups.set(id,d)}
cards.forEach(el=>{shorten(el);groups.get(group(el)).lastElementChild.append(el)});removeBulkActions(root);
groups.forEach((d,id)=>{const c=d.querySelectorAll('.settings-card').length;d.querySelector('.zavi-clean-count').textContent=c||'';if(!c)d.hidden=true});
const initial=groups.get('store');if(initial&&!initial.hidden)initial.open=true;
hub.querySelector('input').addEventListener('input',ev=>{const q=ev.target.value.trim().toLowerCase();let total=0;
for(const d of list.children){let found=0;d.querySelectorAll('.settings-card').forEach(c=>{const h=c.querySelector('h1,h2,h3,h4')?.textContent||'';const ok=!q||(h+' '+c.textContent.slice(0,500)).toLowerCase().includes(q);c.hidden=!ok;if(ok)found++});d.hidden=found===0;if(q&&found)d.open=true;total+=found}
hub.querySelector('.zavi-clean-search-help').textContent=q?(total?total+' '+lang.found:lang.none):lang.help});
}
function ready(){const root=document.getElementById('content');if(!root)return;let wait=false;
new MutationObserver(()=>{if(wait)return;wait=true;queueMicrotask(()=>{wait=false;try{enhance()}catch(e){console.warn('ZAVI settings:',e)}})}).observe(root,{childList:true});enhance()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();