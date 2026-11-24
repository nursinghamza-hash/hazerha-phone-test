import{KEY,words,valid,create,reveal,conceal,answer,word}from'./engine.mjs';
const $=id=>document.getElementById(id);let state=null;
function save(){try{HubStorage.setItem(KEY,JSON.stringify(state));if(HubStorage.getItem(KEY)!==JSON.stringify(state))throw Error()}catch{$('status').textContent='تعذّر الحفظ. هذه الجولة في الصفحة فقط؛ لا تغلقها.'}}
try{const s=JSON.parse(HubStorage.getItem(KEY));if(valid(s)){state=conceal(s);save()}}catch{}
function random(n){const b=new Uint32Array(1),limit=Math.floor(4294967296/n)*n;do{crypto.getRandomValues(b)}while(b[0]>=limit);return b[0]%n}
function deck(){const a=words.map((_,i)=>i);for(let i=a.length-1;i>0;i--){const j=random(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function el(tag,t,cls=''){const x=document.createElement(tag);x.textContent=t;x.className=cls;return x}
function btn(t,id,fn,secondary=false){const b=el('button',t,secondary?'secondary':'');b.id=id;b.onclick=fn;return b}
function change(s){state=s;save();render();$('stage').focus()}
function render(){document.body.classList.toggle('compact',!!state&&state.phase!=='end');const root=$('stage');root.replaceChildren();const box=el('div','','card stack');root.append(box);
if(!state){const l=el('label','عدد اللاعبين');l.htmlFor='count';const s=el('select','');s.id='count';for(let n=2;n<=12;n++)s.add(new Option(String(n),String(n)));s.value='5';box.append(l,s,btn('جهّز الكلمات','create',()=>change(create(Number(s.value),deck()))))}
else if(state.phase==='end'){box.append(el('h2','انتهت بطاقات الجميع'),el('p','ثلاث بطاقات لكل لاعب. نقطة لكل تخمين صحيح، ولا خصم للتخطي.'));state.scores.forEach((score,i)=>{const row=el('div','','leader');row.append(el('span','اللاعب '+(i+1)),el('span',String(score)));box.append(row)});box.append(btn('جلسة جديدة بنفس العدد','next',()=>change(create(state.n,deck()))))}
else{box.append(el('h2','الدور للاعب '+(state.turn+1)),el('p','البطاقة '+(state.card+1)+' من 3','mut'));if(state.phase==='ready'){box.append(el('p','حامل الجهاز: وجّه الشاشة بعيداً عن نظر صاحب الدور وهو جالس. أنت من يكشف ويسجّل، لا صاحب الدور.'),btn('حامل الجهاز جاهز، اكشف الكلمة','reveal',()=>change(reveal(state))))}else{box.append(el('p',word(state),'word'),el('p','صاحب الدور يسأل بنعم أو لا، والآخرون يجيبون دون قول الكلمة.','mut'),btn('خمّنها صح، سجّل نقطة','correct',()=>change(answer(state,true))),btn('تخطّوا بلا خصم','skip',()=>change(answer(state,false)),true),btn('أخفِ الكلمة دون استهلاكها','conceal',()=>change(conceal(state)),true))}}
if(state&&state.phase!=='card'){const d=el('details','');d.append(el('summary','حذف الجلسة وتغيير العدد'),el('p','سيُحذف تقدم البطاقات والنقاط.'),btn('أؤكد حذف الجلسة','reset',()=>change(null),true));root.append(d)}}
function hide(){if(state?.phase==='card')change(conceal(state))}
window.addEventListener('blur',hide);window.addEventListener('pagehide',hide);document.addEventListener('visibilitychange',()=>{if(document.hidden)hide()});window.addEventListener('storage',e=>{if(e.key!==KEY)return;try{const s=JSON.parse(e.newValue);state=valid(s)?conceal(s):null}catch{state=null}render();$('status').textContent='تغيّرت الجولة من نافذة أخرى. تحققوا من صاحب الدور.'});render();
