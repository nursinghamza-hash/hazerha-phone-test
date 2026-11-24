/* Original charades prompts. No external text, characters or media. */
BANK.push({id:'acting',name:'مثّلها بصمت',color:'#e8a7cb',q:[
{p:200,t:'acting',q:'مثّل حركة يومية بلا كلام.',a:'تنظيف الأسنان'},
{p:200,t:'acting',q:'مثّل حركة يومية بلا كلام.',a:'فتح مظلة تحت المطر'},
{p:400,t:'acting',q:'مثّل موقفاً بلا كلام.',a:'طباخ يعجن الخبز ثم يخرجه من الفرن'},
{p:400,t:'acting',q:'مثّل موقفاً بلا كلام.',a:'مصور يحاول تصوير طائر يطير بعيداً'},
{p:600,t:'acting',q:'مثّل قصة قصيرة بلا كلام.',a:'مسافر يفوته القطار ثم يكتشف أنه نسي حقيبته'},
{p:600,t:'acting',q:'مثّل قصة قصيرة بلا كلام.',a:'شخص يصلح تسرب ماء فيغمره الماء من مكان آخر'}
]});
function drawActing(body,who,q){const o=S.open;tUI(false);$('tools').style.display='';body.innerHTML='<div class="qtext">'+esc(q.q)+'</div><p class="memorynote">يمثّل لاعب من '+esc(nm(o.first))+'. مرّروا الجهاز للممثّل وحده. لا كلام أو كتابة أو تهجئة أو عرض الإجابة للفريق. يحكم المضيف، واقبلوا المعنى لا نفس الكلمات. لا تنتقل الفرصة للفريق الثاني. إخفاء محلي لحماية التمرير المعتاد، وليس حماية من فحص الصفحة.</p><div class="judge"><button class="big" id="actorPeek">أنا الممثّل، أظهر الفكرة لي</button></div><div id="actorSecret" class="card" hidden><div class="ans"></div><div class="judge"><button class="ghost" id="actorHide">أخفِ الفكرة وأعد الجهاز</button></div></div><p class="memorynote" id="actorStatus"></p><div class="judge"><button class="big" id="actorStart" hidden>ابدأ التمثيل</button><button class="ghost" id="actorDone" hidden>انتهينا، اكشف الفكرة</button></div>';$('actorSecret').querySelector('.ans').textContent=q.a;
 const started=Number.isFinite(o.actorUntil);function status(){const n=started?Math.max(0,Math.ceil((o.actorUntil-Date.now())/1000)):0;$('actorStatus').textContent=started?(n?'وقت التمثيل: '+n+' ثوانٍ':'انتهى الوقت. ثبّتوا الحكم ثم اكشفوا الفكرة.'):'المدة 60 ثانية بعد إعادة الجهاز. يمكن فتح الفكرة للممثّل قبل البدء فقط.';$('actorStart').hidden=started||!o.actorSeen;$('actorDone').hidden=!started;$('actorPeek').hidden=started}
 $('actorPeek').onclick=()=>{if(Number.isFinite(o.actorUntil))return;$('actorSecret').hidden=false;$('actorPeek').hidden=true;$('actorStart').hidden=true};$('actorHide').onclick=()=>{o.actorSeen=true;save();$('actorSecret').hidden=true;status()};$('actorStart').onclick=()=>{if(!o.actorSeen||Number.isFinite(o.actorUntil))return;o.actorUntil=Date.now()+60000;save();drawQ()};$('actorDone').onclick=()=>{if(!Number.isFinite(o.actorUntil))return;o.phase='reveal';save();drawQ()};status();if(started)tick=setInterval(status,250)
}
