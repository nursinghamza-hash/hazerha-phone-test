/* Original team-board scoring helpers. Legacy saves receive no new power charges. */
(function(root){
function raidAvailable(s,o,q,t){return !!s&&!!o&&q?.t==='t'&&o.phase==='ask'&&Object.keys(o.guess).length===0&&!o.dbl&&!o.steal&&!o.raid&&!o.challenge&&!o.take&&!o.rest&&['a','b'].includes(t)&&s.pw[t]?.raid===1}
function activateRaid(s,o,q,t){if(!raidAvailable(s,o,q,t))return false;o.raid=t;s.pw[t].raid=0;return true}
function challengeAvailable(s,o,q,t){return !!s&&!!o&&q?.t==='t'&&o.phase==='ask'&&Object.keys(o.guess).length===0&&!o.dbl&&!o.steal&&!o.raid&&!o.challenge&&!o.take&&!o.rest&&['a','b'].includes(t)&&t!==o.first&&s.pw[t]?.challenge===1}
function activateChallenge(s,o,q,t){if(!challengeAvailable(s,o,q,t))return false;o.challenge=t;s.pw[t].challenge=0;return true}
function takeAvailable(s,o,q,t){return !!s&&!!o&&q?.t==='t'&&o.phase==='ask'&&Object.keys(o.guess).length===0&&!o.dbl&&!o.steal&&!o.raid&&!o.challenge&&!o.take&&!o.rest&&['a','b'].includes(t)&&t!==o.first&&s.pw[t]?.take===1}
function activateTake(s,o,q,t){if(!takeAvailable(s,o,q,t))return false;o.take=t;s.pw[t].take=0;return true}
function restAvailable(s,o,q,t){return !!s&&!!o&&q?.t==='t'&&o.phase==='ask'&&Object.keys(o.guess).length===0&&!o.dbl&&!o.steal&&!o.raid&&!o.challenge&&!o.take&&!o.rest&&['a','b'].includes(t)&&t!==o.first&&s.pw[t]?.rest===1}
function activateRest(s,o,q,t,name,agreed){if(!restAvailable(s,o,q,t)||agreed!==true||typeof name!=='string'||name.trim().length<1||name.trim().length>40)return false;o.rest={by:t,name:name.trim()};s.pw[t].rest=0;return true}
function validWinner(o,w){return ['a','b','n'].includes(w)&&(!o.take||w==='n'||w===o.take)}
function score(o,q,w,sp){const pts=q.p*(o.dbl===w?2:1);let a=w==='a'?pts:0,b=w==='b'?pts:0;if(o.steal&&['a','b'].includes(w)&&w!==o.steal){const half=Math.round(pts/2);if(w==='a'){a=half;b=pts-half}else{b=half;a=pts-half}}if(o.raid===w){if(w==='a')b-=q.p;else if(w==='b')a-=q.p}if(o.challenge){const target=o.challenge==='a'?'b':'a';if(w!==target){if(target==='a')a-=q.p;else b-=q.p}}if(sp==='t'&&['a','b'].includes(w)){if(w==='a')a+=200;else b+=200}if(sp==='b'&&w==='n'){if(o.first==='a')a-=100;else b-=100}return{a,b}}
const api={restAvailable,activateRest,takeAvailable,activateTake,validWinner,challengeAvailable,activateChallenge,raidAvailable,activateRaid,score};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TeamPowers=api;
})(typeof window!=='undefined'?window:globalThis);
