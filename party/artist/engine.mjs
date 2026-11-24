export const KEY='hazerha_artist313';
export const words=['بيت','شجرة','سمكة','سيارة','شمس','زهرة','سفينة','فراشة','كوب','تاج','مظلة','قطار','صاروخ','بيتزا','ساعة','نجمة','كتاب','جبل','حذاء','كرة'];
const int=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;const point=p=>Array.isArray(p)&&p.length===2&&p.every(x=>Number.isFinite(x)&&x>=0&&x<=1);
export function valid(s){return s?.v===313&&int(s.n,3,12)&&int(s.outsider,0,s.n-1)&&int(s.word,0,words.length-1)&&int(s.dealt,0,s.n)&&['deal','draw','vote','end'].includes(s.phase)&&(s.phase==='deal'?s.dealt<s.n:s.dealt===s.n)&&Array.isArray(s.strokes)&&s.strokes.length<=s.n*2&&s.strokes.every(a=>Array.isArray(a)&&a.length<=128&&a.every(point))&&(s.phase==='deal'?s.strokes.length===0:s.phase==='draw'?s.strokes.length<s.n*2:s.strokes.length===s.n*2)&&(s.suspect===null||int(s.suspect,0,s.n-1))&&(s.phase==='end'?s.suspect!==null:s.suspect===null)}
export function create(n,outsider,word){const s={v:313,n,outsider,word,dealt:0,phase:'deal',strokes:[],suspect:null};if(!valid(s))throw Error('invalid game');return s}
export const role=s=>s.dealt===s.outsider?'أنت رسام برا السالفة. لا تعرف الكلمة؛ ارسم لتندمج.':'الكلمة: '+words[s.word];
export function hide(s){if(s.phase!=='deal')return s;const dealt=s.dealt+1;return {...s,dealt,phase:dealt===s.n?'draw':'deal'}}
export function commit(s,stroke){if(s.phase!=='draw'||!Array.isArray(stroke)||stroke.length>128||!stroke.every(point))return s;const strokes=[...s.strokes,stroke.map(p=>[...p])];return {...s,strokes,phase:strokes.length===s.n*2?'vote':'draw'}}
export function vote(s,suspect){return s.phase==='vote'&&int(suspect,0,s.n-1)?{...s,suspect,phase:'end'}:s}
