'use strict';
const $ = id => document.getElementById(id);
function selectTab(update){$('newTab').setAttribute('aria-selected',String(!update));$('updateTab').setAttribute('aria-selected',String(update));$('newPanel').hidden=update;$('updatePanel').hidden=!update;}
$('newTab').addEventListener('click',()=>selectTab(false));$('updateTab').addEventListener('click',()=>selectTab(true));
for(const id of ['newTab','updateTab'])$(id).addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();const update=id==='newTab';selectTab(update);$(update?'updateTab':'newTab').focus();}});
let toastTimer;
function toast(text){$('toast').textContent=text;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,4500);}
$('copyAddress').addEventListener('click',async()=>{const value=$('browser').value;try{await navigator.clipboard.writeText(value);toast('已复制，请粘贴到浏览器顶部地址栏并回车。');}catch{window.prompt('请复制地址，粘贴到浏览器顶部地址栏：',value);}});
let enabled=true,inside=false,progress=22;
function updateDemo(){const playing=enabled||inside;$('demoToggle').setAttribute('aria-pressed',String(enabled));$('demoToggle').firstChild.textContent=enabled?'随心听课：开 ':'随心听课：关 ';$('demoStatus').textContent=playing?'正在播放':'鼠标离开，播放暂停';$('playSymbol').textContent=playing?'Ⅱ':'▶';}
$('demoToggle').addEventListener('click',()=>{enabled=!enabled;updateDemo();});$('demo').addEventListener('mouseenter',()=>{inside=true;updateDemo();});$('demo').addEventListener('mouseleave',()=>{inside=false;updateDemo();});
setInterval(()=>{if(!document.hidden&&(enabled||inside)){progress+=.16;if(progress>96)progress=10;$('progress').style.width=progress+'%';}},150);
updateDemo();
