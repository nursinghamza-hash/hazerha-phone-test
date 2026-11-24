/* Original memory-path tiles. Both teams receive the same single preview. */
window.TeamMemory={validPath:p=>Array.isArray(p)&&p.length>=5&&p.length<=7&&new Set(p).size===p.length&&p.every((c,i)=>Number.isInteger(c)&&c>=0&&c<16&&(!i||Math.abs(c%4-p[i-1]%4)+Math.abs((c/4|0)-(p[i-1]/4|0))===1)),grid(path,reveal){const grid=document.createElement('div');grid.className='memorygrid';grid.setAttribute('aria-label',reveal?'المسار المرقم':'إحداثيات الخلايا');for(let i=0;i<16;i++){const cell=document.createElement('div'),n=path.indexOf(i);cell.className='memorycell'+(reveal&&n>=0?' lit':'');cell.textContent=reveal&&n>=0?String(n+1):String((i/4|0)+1)+','+String(i%4+1);cell.setAttribute('aria-label','صف '+((i/4|0)+1)+' عمود '+(i%4+1)+(reveal&&n>=0?' خطوة '+(n+1):''));grid.appendChild(cell)}return grid}};
BANK.push({id:'memory',name:'ذاكرة المسار',color:'#8bd6b4',q:[
{p:200,t:'memory',q:'احفظوا مسار 5 خلايا بالترتيب.',a:'المسار المرقّم',path:[0,1,5,6,10]},
{p:200,t:'memory',q:'احفظوا مسار 5 خلايا بالترتيب.',a:'المسار المرقّم',path:[15,14,10,9,5]},
{p:400,t:'memory',q:'احفظوا مسار 6 خلايا بالترتيب.',a:'المسار المرقّم',path:[3,2,6,5,9,13]},
{p:400,t:'memory',q:'احفظوا مسار 6 خلايا بالترتيب.',a:'المسار المرقّم',path:[12,8,9,10,6,7]},
{p:600,t:'memory',q:'احفظوا مسار 7 خلايا بالترتيب.',a:'المسار المرقّم',path:[0,4,8,9,5,6,7]},
{p:600,t:'memory',q:'احفظوا مسار 7 خلايا بالترتيب.',a:'المسار المرقّم',path:[15,11,7,6,10,9,8]}
]});
