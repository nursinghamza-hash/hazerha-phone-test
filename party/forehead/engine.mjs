export const KEY='hazerha_forehead312';
export const words=['قط','أسد','فيل','زرافة','بطريق','دلفين','حصان','أرنب','نحلة','فراشة','سلحفاة','طاووس','تفاحة','موزة','بطيخة','برتقالة','فراولة','جزرة','بطاطا','خيار','طماطم','عنب','ليمونة','كرزة','طائرة','دراجة','قطار','سفينة','حافلة','مظلة','قلم','كتاب','كرسي','طاولة','ساعة','مصباح','كرة','شطرنج','بيانو','طبلة','كاميرا','هاتف','مفتاح','مرآة','حقيبة','تاج','نظارة','قبعة'];
const int=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;
export function valid(s){return s?.v===312&&int(s.n,2,12)&&int(s.turn,0,s.n-1)&&int(s.card,0,2)&&['ready','card','end'].includes(s.phase)&&Array.isArray(s.deck)&&s.deck.length===words.length&&new Set(s.deck).size===words.length&&s.deck.every(x=>int(x,0,words.length-1))&&Array.isArray(s.scores)&&s.scores.length===s.n&&s.scores.every(x=>int(x,0,3))&&(s.phase!=='end'||(s.turn===s.n-1&&s.card===2))}
export function create(n,deck){const s={v:312,n,deck:[...deck],turn:0,card:0,phase:'ready',scores:Array(n).fill(0)};if(!valid(s))throw Error('invalid game');return s}
export function reveal(s){return s.phase==='ready'?{...s,phase:'card'}:s}
export function conceal(s){return s.phase==='card'?{...s,phase:'ready'}:s}
export function answer(s,correct){if(s.phase!=='card'||typeof correct!=='boolean')return s;const scores=[...s.scores];if(correct)scores[s.turn]++;if(s.card<2)return {...s,scores,card:s.card+1,phase:'ready'};if(s.turn<s.n-1)return {...s,scores,turn:s.turn+1,card:0,phase:'ready'};return {...s,scores,phase:'end'}}
export const word=s=>words[s.deck[s.turn*3+s.card]];
