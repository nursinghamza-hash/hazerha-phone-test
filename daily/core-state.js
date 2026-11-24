/* Restore only fields the two core widgets understand. This is recovery, not score attestation. */
window.CoreDailyState={
 clean(d){const r={n:null,m:null};if(!d||typeof d!=='object'||Array.isArray(d))return r;
 if(d.n&&typeof d.n.won==='boolean'&&Number.isInteger(d.n.tries)&&d.n.tries>=1&&d.n.tries<=32)r.n={won:d.n.won,tries:d.n.tries};
 if(Array.isArray(d.nGuesses)&&d.nGuesses.length<=32&&d.nGuesses.every(n=>Number.isInteger(n)&&n>=0&&n<=9999999))r.nGuesses=[...d.nGuesses];
 const m=d.m,p=m?.pin;if(m&&Number.isFinite(m.km)&&m.km>=0&&m.km<=21000&&p&&Number.isFinite(p.lat)&&Math.abs(p.lat)<=90&&Number.isFinite(p.lon)&&Math.abs(p.lon)<=180)r.m={km:m.km,pin:{lat:p.lat,lon:p.lon}};
 return r}
};
