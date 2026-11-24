/* Limited original pool, using Natural Earth geometry already bundled with this project. */
window.CountryPool=['JOR','EGY','SAU','MAR','DZA','TUN','LBY','IRQ','SYR','LBN','TUR','ITA','ESP','DEU','GBR','BRA','ARG','AUS','IND','CHN'].map(iso=>WORLD.find(c=>c.iso===iso));
window.CountryGeo=(()=>{
 const inside=(p,r)=>{let yes=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const a=r[i],b=r[j];if((a[1]>p.lat)!==(b[1]>p.lat)&&p.lon<(b[0]-a[0])*(p.lat-a[1])/(b[1]-a[1])+a[0])yes=!yes}return yes};
 const area=r=>Math.abs(r.reduce((a,p,i)=>{const q=r[(i+1)%r.length];return a+p[0]*q[1]-q[0]*p[1]},0));
 function point(co){const ring=[...co.r].sort((a,b)=>area(b)-area(a))[0];let a=0,x=0,y=0;for(let i=0;i<ring.length;i++){const p=ring[i],q=ring[(i+1)%ring.length],v=p[0]*q[1]-q[0]*p[1];a+=v;x+=(p[0]+q[0])*v;y+=(p[1]+q[1])*v}const c={lon:x/(3*a),lat:y/(3*a)};if(Number.isFinite(c.lat)&&Number.isFinite(c.lon)&&inside(c,ring))return c;const xs=ring.map(p=>p[0]),ys=ring.map(p=>p[1]),xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);let best=null,score=Infinity;for(let i=1;i<64;i++)for(let j=1;j<64;j++){const p={lon:xmin+(xmax-xmin)*i/64,lat:ymin+(ymax-ymin)*j/64},d=(p.lon-(xmin+xmax)/2)**2+(p.lat-(ymin+ymax)/2)**2;if(d<score&&inside(p,ring)){best=p;score=d}}if(!best)throw Error('No representative point');return best}
 const rad=x=>x*Math.PI/180;
 function distance(a,b){const h=Math.sin(rad(b.lat-a.lat)/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(rad(b.lon-a.lon)/2)**2;return 12742*Math.asin(Math.sqrt(Math.max(0,Math.min(1,h))))}
 function direction(a,b){const x=Math.sin(rad(b.lon-a.lon))*Math.cos(rad(b.lat)),y=Math.cos(rad(a.lat))*Math.sin(rad(b.lat))-Math.sin(rad(a.lat))*Math.cos(rad(b.lat))*Math.cos(rad(b.lon-a.lon));const bearing=(Math.atan2(x,y)*180/Math.PI+360)%360,index=Math.round(bearing/45)%8;return {bearing,index,label:['شمال','شمال شرق','شرق','جنوب شرق','جنوب','جنوب غرب','غرب','شمال غرب'][index],arrow:['↑','↗','→','↘','↓','↙','←','↖'][index]}}
 return {inside,point,distance,direction};
})();
