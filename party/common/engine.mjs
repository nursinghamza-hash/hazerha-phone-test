export const KEY='hazerha_common316';
export const BANK=[
['شيء تضعه قرب باب البيت',['حذاء','مظلة','مفاتيح','سجادة','نبات'],[['احذية','جزمة'],['شمسيه','شمسية'],['مفتاح'],['دعاسة'],['نبتة','زرع']]],
['شيء تأخذه في رحلة قصيرة للحديقة',['ماء','طعام','بطانية','كرة','قبعة'],[['مياه','مي'],['اكل','سندويش'],['فرشة'],['طابة','كورة'],['طاقية']]],
['شيء يصدر صوتاً في المطبخ',['خلاط','غلاية','ثلاجة','مؤقت','شفاط'],[[],['ابريق','كاتل'],['براد'],['منبه'],[]]],
['شيء تبحث عنه قبل مغادرة البيت',['مفاتيح','هاتف','محفظة','نظارة','ساعة'],[['مفتاح'],['جوال','تلفون','موبايل'],['جزدان'],['نظارات'],[]]],
['شيء قد ترسمه على ورقة فارغة',['بيت','شجرة','وجه','قلب','شمس'],[['منزل'],['شجر'],['وجه انسان'],[],[]]],
['شيء تنساه على مكتبك',['قلم','دفتر','هاتف','كوب','شاحن'],[[],['كراسة'],['جوال','تلفون'],['كاسة'],['وصلة شحن']]],
['شيء يمكن أن يطير في الهواء',['طائر','طائرة','بالون','ورقة','فراشة'],[['عصفور','حمامة'],['طيارة'],['بالونة'],['ورق'],[]]],
['شيء نضعه داخل درج',['أقلام','أوراق','مفاتيح','بطاريات','شاحن'],[['قلم'],['ورق'],['مفتاح'],['بطارية'],[]]],
['شيء نراه في محطة قطار',['قطار','رصيف','تذاكر','ساعة','حقائب'],[[],[],['تذكرة'],[],['حقيبة','شنط','شنطة']]],
['شيء نجده في حقيبة رياضة',['حذاء','منشفة','ماء','ملابس','سماعات'],[['جزمة'],['فوطة'],['مياه','مي'],['تياب'],['سماعة']]],
['شيء نفعله في يوم ممطر بالبيت',['قراءة','مشاهدة فيلم','طبخ','لعب','نوم'],[['اقرا','قراءة كتاب'],['فيلم','تلفزيون'],['اطبخ'],['العاب'],['انام']]],
['شيء قد يحتاج إلى بطارية',['ريموت','ساعة','مصباح','لعبة','كاميرا'],[['جهاز تحكم'],[],['كشاف'],[],['الة تصوير']]]
].map(([q,a,aliases],id)=>({id,q,answers:a.map((text,i)=>({text,aliases:aliases[i],points:[30,25,20,15,10][i]}))}));
export const norm=x=>String(x).trim().replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[\u064B-\u065F\u0670]/g,'').replace(/\s+/g,' ');
export function match(q,text){const t=norm(text);return t?BANK[q].answers.findIndex(a=>[a.text,...a.aliases].some(x=>norm(x)===t)):-1}
const int=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;
export function valid(s){return s?.v===316&&Array.isArray(s.order)&&s.order.length===6&&new Set(s.order).size===6&&s.order.every(x=>int(x,0,BANK.length-1))&&int(s.round,0,5)&&['face0','face1','decision','play','steal','roundEnd','end'].includes(s.phase)&&Array.isArray(s.scores)&&s.scores.length===2&&s.scores.every(x=>int(x,0,600))&&Array.isArray(s.revealed)&&new Set(s.revealed).size===s.revealed.length&&s.revealed.every(x=>int(x,0,4))&&Array.isArray(s.face)&&s.face.length===2&&s.face.every(x=>int(x,-2,4))&&int(s.strikes,0,3)&&int(s.control,0,1)&&int(s.winner,-1,1)}
export function create(order){const s={v:316,order,round:0,phase:'face0',scores:[0,0],revealed:[],face:[-2,-2],strikes:0,control:0,winner:-1};if(!valid(s))throw Error('invalid');return s}
export function face(s,index){if(!['face0','face1'].includes(s.phase)||!int(index,-1,4))return s;const turn=s.phase==='face0'?s.round%2:1-s.round%2,face=[...s.face];face[turn]=index;if(s.phase==='face0')return {...s,face,phase:'face1'};const rank=x=>x<0?99:x,control=rank(face[0])===rank(face[1])?s.round%2:rank(face[0])<rank(face[1])?0:1;return {...s,face,control,phase:'decision',revealed:[...new Set(face.filter(x=>x>=0))]}}
export const pot=s=>s.revealed.reduce((sum,i)=>sum+BANK[s.order[s.round]].answers[i].points,0);
export function choose(s,pass){return s.phase==='decision'?{...s,phase:'play',control:pass?1-s.control:s.control}:s}
function finish(s,winner){const scores=[...s.scores];scores[winner]+=pot(s);return {...s,scores,winner,phase:s.round===5?'end':'roundEnd'}}
export function guess(s,index){if(!['play','steal'].includes(s.phase)||!int(index,-1,4))return s;const hit=index>=0&&!s.revealed.includes(index);if(s.phase==='steal')return finish(hit?{...s,revealed:[...s.revealed,index]}:s,hit?1-s.control:s.control);if(hit){const t={...s,revealed:[...s.revealed,index]};return t.revealed.length===5?finish(t,s.control):t}const strikes=s.strikes+1;return {...s,strikes,phase:strikes===3?'steal':'play'}}
export function next(s){return s.phase==='roundEnd'?{...s,round:s.round+1,phase:'face0',revealed:[],face:[-2,-2],strikes:0,control:0,winner:-1}:s}
