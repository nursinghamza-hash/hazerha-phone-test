/* Validate recoverable browser state before it reaches the turn controller. */
function validMemoryState(s){
 if(!s||!Array.isArray(s.players)||s.players.length<2||s.players.length>8||!s.players.every(p=>p&&typeof p.name==='string'&&p.name.trim().length>0&&p.name.length<=20&&Number.isInteger(p.score)&&p.score>=0&&p.score<=18))return false;
 if(!Number.isInteger(s.seed)||s.seed<1||s.seed>4294967295||!Number.isInteger(s.round)||s.round<0||s.round>2||!Number.isInteger(s.turn)||s.turn<0||s.turn>=s.players.length||!['ready','preview','recall','result','finished'].includes(s.stage))return false;
 const expected=generate(5+s.round,(s.seed+s.round*12345)>>>0||1);
 if(!Array.isArray(s.path)||s.path.length!==expected.length||!s.path.every((v,i)=>v===expected[i])||!Array.isArray(s.picks)||s.picks.length>s.path.length||!s.picks.every((v,i)=>v===s.path[i]))return false;
 const completed=s.picks.length===s.path.length,wrong=s.wrong!=null;
 if(wrong&&(!Number.isInteger(s.wrong)||s.wrong<0||s.wrong>15||s.picks.includes(s.wrong)||s.wrong===s.path[s.picks.length]||completed))return false;
 if(['ready','preview'].includes(s.stage)&&(s.picks.length||wrong))return false;
 if(s.stage==='preview'&&(!Number.isFinite(s.until)||s.until<0))return false;
 if(s.stage==='recall'&&(completed||wrong))return false;
 if(['result','finished'].includes(s.stage)&&!completed&&!wrong)return false;
 if(s.stage==='finished'&&(s.round!==2||s.turn!==0))return false;
 return true;
}
