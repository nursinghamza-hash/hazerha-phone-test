function queueSync(){if(syncSuspended||sessionUnavailable)return;pendingSync=true;if(busy||syncTimer)return;const delay=Math.max(150,1000-(performance.now()-lastSignal));syncTimer=setTimeout(()=>{syncTimer=null;if(busy)return;pendingSync=false;lastSignal=performance.now();act(refresh)},delay)}
let joinedSync=false,joinTimer=null,heartbeatDeadline=null,syncSuspended=false;
function syncStatus(text){$('liveStatus').textContent=text}
function connectSync(topicName){
 if(syncSuspended)return;
 if(channelCode===topicName&&ws&&(ws.readyState===0||ws.readyState===1))return;
 channelCode=topicName;joinedSync=false;clearTimeout(retry);clearTimeout(joinTimer);clearInterval(heartbeat);clearTimeout(heartbeatDeadline);if(ws){ws.onclose=null;ws.close()}
 syncStatus('جار وصل التحديث التلقائي...');
 const socket=ws=new WebSocket(BASE.replace('https:','wss:')+'/realtime/v1/websocket?apikey='+encodeURIComponent(PUB)+'&vsn=1.0.0');
 let ref=1,pendingHeartbeat=null;const topic='realtime:'+topicName;
 const emit=(event,payload,t=topic)=>{if(socket.readyState===1)socket.send(JSON.stringify({topic:t,event,payload,ref:String(ref++),join_ref:'1'}))};
 joinTimer=setTimeout(()=>{if(ws===socket&&!joinedSync)socket.close()},10000);
 socket.onopen=()=>{if(ws!==socket)return;emit('phx_join',{config:{broadcast:{ack:false,self:false},presence:{enabled:false},private:false}});heartbeat=setInterval(()=>{if(pendingHeartbeat!==null||socket.readyState!==1)return;pendingHeartbeat=String(ref);emit('heartbeat',{},'phoenix');heartbeatDeadline=setTimeout(()=>{if(ws===socket&&pendingHeartbeat!==null){joinedSync=false;syncStatus('لم يتأكد اتصال التحديث التلقائي. نحاول الوصل؛ قد تكون الحالة المعروضة قديمة.');socket.close()}},10000)},25000)};
 socket.onmessage=e=>{if(ws!==socket)return;try{const m=JSON.parse(e.data);if(m.event==='phx_reply'&&m.topic==='phoenix'&&m.ref===pendingHeartbeat){if(m.payload?.status==='ok'){pendingHeartbeat=null;clearTimeout(heartbeatDeadline)}else socket.close()}if(m.event==='phx_reply'&&m.ref==='1'&&m.topic===topic){if(m.payload?.status==='ok'){joinedSync=true;clearTimeout(joinTimer);syncStatus('التحديث التلقائي متصل.');queueSync()}else socket.close()}if(m.event==='broadcast'&&m.topic===topic&&m.payload?.event==='changed')queueSync();if(m.event==='phx_error'||m.event==='phx_close')socket.close()}catch(e){}};
 socket.onclose=()=>{if(ws!==socket)return;joinedSync=false;clearTimeout(joinTimer);clearInterval(heartbeat);clearTimeout(heartbeatDeadline);syncStatus(navigator.onLine?'التحديث التلقائي منقطع. نحاول الوصل؛ يمكنك تحديث الغرفة يدوياً.':'أنت غير متصل. قد تكون الحالة المعروضة قديمة.');retry=setTimeout(()=>{if(session&&!sessionUnavailable&&navigator.onLine)connectSync(channelCode)},5000)};
}
window.addEventListener('offline',()=>{joinedSync=false;syncStatus('أنت غير متصل. قد تكون الحالة المعروضة قديمة.');if(ws)ws.close()});
// Background return is a resync, never evidence that the old state is current.
function canResumeSync(){return !!session&&!sessionUnavailable&&!$('room').hidden&&$('resumeEntry').hidden}
function resumeSync(){syncSuspended=false;if(!canResumeSync())return;channelCode=null;syncStatus(navigator.onLine?'نحدّث حالة الغرفة بعد الرجوع...':'أنت غير متصل. قد تكون الحالة المعروضة قديمة.');if(navigator.onLine)queueSync()}
window.addEventListener('pagehide',()=>{syncSuspended=true;clearTimeout(retry);clearTimeout(joinTimer);clearTimeout(syncTimer);syncTimer=null;pendingSync=false;clearInterval(heartbeat);clearTimeout(heartbeatDeadline);joinedSync=false;if(ws){ws.onmessage=null;ws.onclose=null;ws.close()}channelCode=null});
window.addEventListener('pageshow',e=>{if(e.persisted)resumeSync()});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')resumeSync()});
window.addEventListener('online',resumeSync);

function stopSync(){clearTimeout(retry);clearTimeout(joinTimer);clearTimeout(syncTimer);syncTimer=null;pendingSync=false;clearInterval(heartbeat);clearTimeout(heartbeatDeadline);joinedSync=false;if(ws){ws.onclose=null;ws.close()}syncStatus('التحديث التلقائي متوقف لهذا الدخول.')}
