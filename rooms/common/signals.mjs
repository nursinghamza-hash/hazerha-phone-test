import{TEST_BACKEND,TEST_KEY}from'./test-config.mjs';
// Change signals are hints only. Never accept game state from this channel.
export function roomSignals({origin,onSignal,onStatus=()=>{},Socket=WebSocket,delay=1000,retryDelay=5000}){
 const base=new URL(TEST_BACKEND);
 let ws=null,topic=null,stopped=false,retry=null,beat=null,queued=null,ref=0;
 const queue=()=>{if(!queued)queued=setTimeout(()=>{queued=null;onSignal()},delay)};
 function disconnect(){clearTimeout(retry);retry=null;clearInterval(beat);if(ws){ws.onclose=null;ws.close();ws=null}}
 function connect(){if(stopped||!topic)return;disconnect();const url=new URL('/realtime/v1/websocket?apikey='+encodeURIComponent(TEST_KEY)+'&vsn=1.0.0',base);url.protocol=base.protocol==='https:'?'wss:':'ws:';onStatus('connecting');const socket=ws=new Socket(url);const channel='realtime:'+topic;
 const emit=(event,payload,t=channel)=>{if(socket.readyState===1)socket.send(JSON.stringify({topic:t,event,payload,ref:String(++ref),join_ref:'1'}))};
 socket.onopen=()=>{onStatus('connecting');emit('phx_join',{config:{broadcast:{ack:false,self:false},presence:{enabled:false},private:false}});beat=setInterval(()=>emit('heartbeat',{},'phoenix'),25000)};
 socket.onmessage=e=>{try{const m=JSON.parse(e.data);if(m.topic!==channel)return;if(m.event==='phx_reply'&&m.payload?.status==='ok'){onStatus('connected');queue()}if(m.event==='broadcast'&&m.payload?.event==='changed')queue()}catch{}};
 socket.onerror=()=>onStatus('retry');socket.onclose=()=>{clearInterval(beat);onStatus('retry');if(!stopped)retry=setTimeout(connect,retryDelay)};
 }
 return{watch(value){if(!/^hub-private:[a-f0-9]{64}$/.test(value||''))return;if(value===topic&&ws&&(ws.readyState===0||ws.readyState===1))return;topic=value;stopped=false;connect()},pause(){stopped=true;disconnect();clearTimeout(queued);queued=null},resume(){stopped=false;connect()},close(){stopped=true;topic=null;disconnect();clearTimeout(queued);queued=null}};
}
