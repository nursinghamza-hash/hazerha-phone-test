// Original daily generators. Same date and kind produce the same puzzles.
export const kinds=['odd-colour','remember','sharp-eye','complete-grid','gradient','in-order','cups'];
export const total=k=>k==='gradient'?5:10;
export function random(seed){let n=2166136261;for(const c of seed){n^=c.charCodeAt(0);n=Math.imul(n,16777619)}return()=>{n^=n<<13;n^=n>>>17;n^=n<<5;return(n>>>0)/4294967296}}
export function shuffled(a,r){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
export function puzzle(kind,day,stage){if(!kinds.includes(kind)||!Number.isInteger(stage)||stage<0||stage>=total(kind))throw Error('Invalid puzzle');const r=random('hazerha-original-301|'+kind+'|'+day+'|'+stage),pick=n=>Math.floor(r()*n);
if(kind==='odd-colour')return{answer:pick(9),hue:pick(360),difference:Math.max(6,24-stage*2)};
if(kind==='remember')return{sequence:Array.from({length:Math.min(7,3+Math.floor(stage/2))},()=>pick(9))};
if(kind==='in-order')return{sequence:shuffled(Array.from({length:16},(_,i)=>i),r).slice(0,Math.min(8,4+Math.floor(stage/2)))};
if(kind==='sharp-eye')return{angle:25+pick(131),tolerance:Math.max(3,10-stage)};
if(kind==='complete-grid'){const step=1+pick(3),start=pick(9),cells=Array.from({length:9},(_,i)=>(start+i*step)%9),answer=cells[8],choices=shuffled(Array.from({length:9},(_,i)=>i).filter(i=>i!==answer),r).slice(0,5);choices.push(answer);return{cells,answer,choices:shuffled(choices,r)}}
if(kind==='gradient'){let tiles=shuffled(Array.from({length:16},(_,i)=>i),r);if(tiles.every((v,i)=>v===i))[tiles[0],tiles[1]]=[tiles[1],tiles[0]];return{hue:pick(360),tiles}}
const swaps=Array.from({length:4+stage},()=>shuffled([0,1,2],r).slice(0,2)),start=pick(3);let answer=start;for(const[a,b]of swaps)answer=answer===a?b:answer===b?a:answer;return{start,swaps,answer};
}
export function check(kind,p,answer){if(kind==='sharp-eye')return Number.isFinite(answer)&&Math.abs(answer-p.angle)<=p.tolerance;if(kind==='gradient')return Array.isArray(answer)&&answer.length===16&&answer.every((v,i)=>v===i);return Number.isInteger(answer)&&answer===p.answer}
