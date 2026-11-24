/* Original local comparison game. Pure deterministic rules, not tournament scoring. */
(function(root){
const rounds=10;
function pairs(date,pool){let seed=2166136261;for(const c of 'area-compare-v1-'+date){seed^=c.charCodeAt(0);seed=Math.imul(seed,16777619)}const rng=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296};const all=[];for(let a=0;a<pool.length;a++)for(let b=a+1;b<pool.length;b++)if(pool[a].area!==pool[b].area)all.push([a,b]);for(let i=all.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[all[i],all[j]]=[all[j],all[i]]}return all.slice(0,Math.min(rounds,all.length)).map(p=>rng()<.5?p:[p[1],p[0]])}
function valid(answers,plan){return Array.isArray(answers)&&answers.length<=plan.length&&answers.every((a,i)=>Number.isInteger(a)&&plan[i].includes(a))}
function winner(pair,pool){return pool[pair[0]].area>pool[pair[1]].area?pair[0]:pair[1]}
function score(answers,plan,pool){if(!valid(answers,plan))throw Error('Invalid answers');return answers.reduce((s,a,i)=>s+Number(winner(plan[i],pool)===a),0)}
const api={pairs,valid,winner,score};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.CompareCore=api;
})(typeof window!=='undefined'?window:globalThis);
