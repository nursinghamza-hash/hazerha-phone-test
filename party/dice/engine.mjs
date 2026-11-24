export const KEY='hazerha_dice314';const int=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b;
export function valid(s){return s?.v===314&&int(s.n,2,12)&&Array.isArray(s.dice)&&s.dice.length===s.n&&s.dice.every(a=>Array.isArray(a)&&a.length===3&&a.every(x=>int(x,1,6)))&&int(s.dealt,0,s.n)&&int(s.turn,0,s.n-1)&&int(s.round,1,1000000)&&['deal','play','end'].includes(s.phase)&&(s.phase==='deal'?s.dealt<s.n:s.dealt===s.n)&&Array.isArray(s.scores)&&s.scores.length===s.n&&s.scores.every(x=>int(x,0,1000000))&&(s.bid===null||(int(s.bid.q,1,s.n*3)&&int(s.bid.face,1,6)&&int(s.bid.by,0,s.n-1)))&&(s.phase==='deal'?s.bid===null:true)&&(s.phase==='end'?(int(s.loser,0,s.n-1)&&s.bid!==null):s.loser===null)}
export function create(dice,turn=0,scores=Array(dice.length).fill(0),round=1){const s={v:314,n:dice.length,dice:dice.map(a=>[...a]),turn,scores:[...scores],round,phase:'deal',dealt:0,bid:null,loser:null};if(!valid(s))throw Error('invalid game');return s}
export function hide(s){if(s.phase!=='deal')return s;const dealt=s.dealt+1;return {...s,dealt,phase:dealt===s.n?'play':'deal'}}
export const legal=(s,q,face)=>s.phase==='play'&&int(q,1,s.n*3)&&int(face,1,6)&&(!s.bid||q>s.bid.q||(q===s.bid.q&&face>s.bid.face));
export function bid(s,q,face){return legal(s,q,face)?{...s,bid:{q,face,by:s.turn},turn:(s.turn+1)%s.n}:s}
export const count=s=>s.bid?s.dice.flat().filter(x=>x===s.bid.face).length:0;
export function challenge(s){if(s.phase!=='play'||!s.bid)return s;const loser=count(s)>=s.bid.q?s.turn:s.bid.by;const scores=[...s.scores];scores[loser]++;return {...s,phase:'end',loser,scores}}
