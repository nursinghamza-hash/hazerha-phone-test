// Simple equirectangular world map on canvas. Data: Natural Earth 1:110m (public domain), see world.js
window.RoomMapView=function(host,opts){
 opts=opts||{};
 const cv=document.createElement('canvas');cv.style.cssText='width:100%;height:100%;touch-action:none;border-radius:16px;background:#11283b';
 host.innerHTML='';host.appendChild(cv);
 const LAT_TOP=84,LAT_BOT=-58;
 let W=0,H=0,dpr=window.devicePixelRatio||1,sc=1,ox=0,oy=0,pin=null,marks=[],hi=null,lines=[];
 function base(){return Math.min(W/360,H/(LAT_TOP-LAT_BOT))}
 function proj(lon,lat){const b=base()*sc;return [W/2+(lon-0)*b+ox,H/2+(((LAT_TOP+LAT_BOT)/2)-lat)*b+oy]}
 function unproj(x,y){const b=base()*sc;return [(x-W/2-ox)/b,((LAT_TOP+LAT_BOT)/2)-(y-H/2-oy)/b]}
 function size(){const r=host.getBoundingClientRect();W=Math.max(200,r.width);H=Math.max(160,r.height);cv.width=W*dpr;cv.height=H*dpr;draw()}
 function ringPath(c,ring){c.beginPath();ring.forEach((p,i)=>{const [x,y]=proj(p[0],p[1]);i?c.lineTo(x,y):c.moveTo(x,y)});c.closePath()}
 function draw(){const c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,W,H);
  c.lineWidth=.6;c.strokeStyle='#a6bcc6';
  for(const co of WORLD.filter(co=>!MapCountries.some(c=>c.iso===co.iso))){const isHi=hi&&(co.n===hi||co.iso===hi);c.fillStyle=isHi?'#ffd23f':'#557a83';for(const r of co.r){ringPath(c,r);c.fill();c.stroke()}}
  for(const co of MapCountries){c.beginPath();for(const poly of co.polygons)for(const ring of poly){ring.forEach((p,i)=>{const[x,y]=proj(p[0],p[1]);i?c.lineTo(x,y):c.moveTo(x,y)});c.closePath()}c.fillStyle=hi===co.iso?'#ffd23f':'#557a83';c.fill('evenodd');c.stroke()}
  if(hi&&window.WORLD_DETAIL&&WORLD_DETAIL[hi]){c.fillStyle='#ffd23f';for(const r of WORLD_DETAIL[hi]){ringPath(c,r);c.fill()}}
  for(const l of lines){const a=proj(l.a[1],l.a[0]),b=proj(l.b[1],l.b[0]);c.strokeStyle=l.color;c.lineWidth=2;c.setLineDash([6,5]);c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();c.setLineDash([])}
  const dot=(lat,lon,col,big)=>{const [x,y]=proj(lon,lat);c.fillStyle=col;c.strokeStyle=big?'#111':'#fff';c.lineWidth=big?3:2;c.beginPath();c.arc(x,y,big?11:7,0,7);c.fill();c.stroke();if(big){c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.arc(x,y,16,0,7);c.stroke()}};
  for(const m of marks)dot(m.lat,m.lon,m.color,m.big);
  if(pin)dot(pin.lat,pin.lon,opts.pinColor||'#ffcf72')}
 let drag=null,moved=0;const ptrs=new Map();let pinch=null;
 cv.addEventListener('pointerdown',e=>{try{cv.setPointerCapture(e.pointerId)}catch(_){}ptrs.set(e.pointerId,[e.clientX,e.clientY]);if(ptrs.size===2){const [p,q]=[...ptrs.values()];pinch={d:Math.hypot(p[0]-q[0],p[1]-q[1]),sc};drag=null;moved=99;return}drag={x:e.clientX,y:e.clientY,ox,oy};moved=0});
 cv.addEventListener('pointermove',e=>{if(ptrs.has(e.pointerId))ptrs.set(e.pointerId,[e.clientX,e.clientY]);if(pinch&&ptrs.size>=2){const [p,q]=[...ptrs.values()];const d=Math.hypot(p[0]-q[0],p[1]-q[1]);sc=Math.min(12,Math.max(1,pinch.sc*d/pinch.d));if(sc===1){ox=0;oy=0}draw();return}if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;moved=Math.max(moved,Math.abs(dx)+Math.abs(dy));if(moved>6){ox=drag.ox+dx;oy=drag.oy+dy;draw()}});
 cv.addEventListener('pointercancel',e=>{ptrs.delete(e.pointerId);pinch=null;drag=null});
 cv.addEventListener('pointerup',e=>{ptrs.delete(e.pointerId);if(pinch){if(ptrs.size<2)pinch=null;drag=null;return}if(drag&&moved<=6&&!opts.readonly){const r=cv.getBoundingClientRect();const [lon,lat]=unproj(e.clientX-r.left,e.clientY-r.top);if(lat<=90&&lat>=-90&&lon>=-180&&lon<=180){pin={lat,lon};draw();opts.onPin&&opts.onPin(pin)}}drag=null});
 cv.addEventListener('wheel',e=>{e.preventDefault();zoom(e.deltaY<0?1.2:1/1.2)},{passive:false});
 function zoom(f){sc=Math.min(12,Math.max(1,sc*f));if(sc===1){ox=0;oy=0}draw()}
 window.addEventListener('resize',size);
 const api={project:(lon,lat)=>proj(lon,lat),getView:()=>({sc,ox,oy,W,H}),setView:(s,x,y)=>{sc=s;ox=x;oy=y;draw()},zoomIn:()=>zoom(1.4),zoomOut:()=>zoom(1/1.4),getPin:()=>pin,setPin(p){pin=p?{lat:p.lat,lon:p.lon}:null;draw()},clear(){pin=null;marks=[];hi=null;lines=[];draw()},
  setMarks(m,l,h){marks=m;lines=l||[];hi=h||null;pin=null;draw()},
  fit(pts){if(!W)size();const P=pts.filter(Boolean);if(!P.length)return;let a=Infinity,b=-Infinity,c2=Infinity,d=-Infinity;for(const p of P){a=Math.min(a,p.lon);b=Math.max(b,p.lon);c2=Math.min(c2,p.lat);d=Math.max(d,p.lat)}
   const dl=Math.max(b-a,6),dt=Math.max(d-c2,6),bs=base();sc=Math.min(12,Math.max(1,Math.min(W*0.75/(dl*bs),H*0.7/(dt*bs))));ox=0;oy=0;const [x,y]=proj((a+b)/2,(c2+d)/2);ox-=x-W/2;oy-=y-H/2;if(sc===1){ox=0;oy=0}draw()},
  focus(lat,lon,z){sc=z||3;const [x,y]=proj(lon,lat);ox-=x-W/2;oy-=y-H/2;draw()},resize:size};
 setTimeout(size,0);return api};
