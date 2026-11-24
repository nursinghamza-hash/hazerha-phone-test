// Isolated transport-independent controller, not loaded in the normal room UI.
// The server remains authoritative for membership, epoch, scoring and deadlines.
export function previewController303({transport,now=()=>performance.now(),store,onChange=()=>{},visible=()=>true}){
let state='idle',identity=null,until=0,preview=null,inflight=false,seq=0,server=null;
const key=()=>identity?'preview303:'+identity.room+':'+identity.member+':'+identity.epoch:'';
const save=phase=>store.set(key(),phase);const read=()=>store.get(key());
function notify(){onChange({state,preview,until,server})}
function valid(s){return identity&&s?.epoch===identity.epoch}
function interrupt(){if(!identity||['idle','final','cancelled'].includes(state))return;seq++;preview=null;until=0;state='cancel-pending';save('cancel');notify()}
async function send(phase,value){if(!identity)throw Error('No preview round');if(inflight)return false;inflight=true;const request=++seq,route={...identity};try{const result=await transport({...route,phase,value});if(request!==seq||!valid(result))return false;server=result;if(!visible()&&phase!=='cancel'){interrupt();return false}if(result.finalized){preview=null;until=0;state='final';save('final');notify();return true}if(result.voided){preview=null;until=0;state='cancelled';save('cancelled');notify();return true}if(phase==='cancel'){preview=null;until=0;state='cancelled';save('cancelled')}else if(phase==='ready'){
if(read()!=='ready'){interrupt();return false}if(!result.preview||result.ack){interrupt();return false}preview=result.preview;until=now()+result.preview_seconds*1000;state='showing';save('showing');
}else if(phase==='ack'){
preview=null;until=0;if(!result.ack){state='ack-pending';save('ack')}else{state='answering';save('answering')}
}else if(['answer','finish'].includes(phase)){
preview=null;if(result.done){state='waiting';save('waiting')}else throw Error('Answer not confirmed');
}notify();return true}catch(error){if(request===seq){if(phase==='ready'){interrupt()}else if(phase==='ack'){preview=null;until=0;state='ack-pending';save('ack');notify()}else if(phase==='cancel'){state='cancel-pending';save('cancel');notify()}else{state='unknown';save(phase==='finish'?'finish':JSON.stringify({phase:'answer',value}));notify()}}return false}finally{inflight=false}}
function attach(route){seq++;identity={...route};preview=null;until=0;server=null;const previous=read();if(previous&&previous!=='final'&&previous!=='cancelled'){state='cancel-pending';save('cancel')}else state=previous==='final'?'final':previous==='cancelled'?'cancelled':'idle';notify()}
async function ready(){if(state!=='idle'||!visible())return false;state='ready-pending';save('ready');notify();return send('ready')}
async function tick(){if(state==='showing'&&!visible())interrupt();if(state==='showing'&&now()>=until){preview=null;until=0;state='ack-pending';save('ack');notify()}if(state==='ack-pending')return send('ack');if(state==='cancel-pending')return send('cancel');return false}
async function answer(value){if(state!=='answering'||!visible())return false;state='submitting';save(JSON.stringify({phase:'answer',value}));notify();return send('answer',value)}
async function finish(){if(state!=='answering'||!visible())return false;state='submitting';save('finish');notify();return send('finish')}
// Unknown committed answers are reconciled by a read; never start a new answer.
async function reconcile(){if(!identity||inflight)return false;const version=seq;try{const s=await transport({...identity,phase:'read'});if(version!==seq||!valid(s))return false;server=s;if(s.finalized){preview=null;state='final';save('final')}else if(s.voided){preview=null;state='cancelled';save('cancelled')}else if(s.done){preview=null;state='waiting';save('waiting')}else if(state==='unknown'){interrupt()}notify();return true}catch{return false}}
return{attach,ready,tick,answer,finish,interrupt,reconcile,snapshot:()=>({state,preview,until,server})};
}
