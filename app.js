'use strict';
const searches={teddy:{name:'Teddy',level:'middle school'},edith:{name:'Edith',level:'high school'}};
const cache={},reviews={};let selected='teddy',rows=[];
const $=id=>document.getElementById(id);
const local=['localhost','127.0.0.1','::1'].includes(location.hostname);
function safeURL(v){try{const u=new URL(v);return ['https:','http:'].includes(u.protocol)?u.href:'';}catch{return '';}}
function text(tag,value,cls){const n=document.createElement(tag);n.textContent=value||'';if(cls)n.className=cls;return n;}
function describe(v){if(v==null)return '';if(typeof v==='string'||typeof v==='number')return String(v);if(Array.isArray(v))return v.map(describe).join('\n');return Object.entries(v).map(([k,x])=>`${k.replaceAll('_',' ')}: ${describe(x)}`).join('\n');}
function link(label,url){const a=text('a',label);a.href=safeURL(url);a.target='_blank';a.rel='noopener noreferrer';return a;}
function normalize(s){return {...s,name:s.name||s.school_name||'Unnamed school',dbn:s.dbn||s.DBN||'',district:String(s.district||''),grades:String(s.grades||''),url:s.source_url||s.url||''};}
function schoolCode(s){return s.dbn.startsWith('private-')?'Private school':s.dbn;}
function getReview(dbn){return (reviews[selected]?.schools||reviews[selected]?.reviews||[]).find(r=>r.dbn===dbn);}
function ranks(){try{return JSON.parse(localStorage.getItem(`family-ranks-${selected}`)||'{}');}catch{return {};}}
function rank(s){return Number(ranks()[s.dbn]||getReview(s.dbn)?.family_rank||999);}
function schoolVisit(s,r){
 const panel=text('section','','school-visit');panel.append(text('h3','Location & visits'));
 if(s.address){const query=encodeURIComponent(`${s.name}, ${s.address}`),map=document.createElement('iframe');map.title=`Map of ${s.name}`;map.loading='lazy';map.referrerPolicy='no-referrer';map.src=`https://www.google.com/maps?q=${query}&output=embed`;map.className='school-map';panel.append(map,link('Open larger map ↗',`https://www.google.com/maps/search/?api=1&query=${query}`));}
 const actions=text('div','','visit-links');
 if(safeURL(r?.visit_url))actions.append(link('Schedule a tour / open-house information ↗',r.visit_url));
 else if(safeURL(s.website_url))actions.append(link('School website · check tour dates ↗',s.website_url));
 else if(safeURL(s.url))actions.append(link('MySchools · check visit information ↗',s.url));
 if(safeURL(r?.video_tour_url))actions.append(link('Watch video / take a virtual tour ↗',r.video_tour_url));
 else actions.append(text('span','Video tour not yet verified.','school-meta'));
 panel.append(actions);if(r?.video_tour_label)panel.append(text('p',r.video_tour_label,'school-meta'));if(r?.visit_note)panel.append(text('p',r.visit_note,'school-meta'));return panel;
}
function details(s,r){const d=text('section','','school-detail-content');d.append(text('h3',s.name,'expanded-school-title'),text('p',`${schoolCode(s)} · ${s.school_type||'Public school'} · District ${s.district} (location) · Grades ${s.grades}`,'school-meta'));if(s.address)d.append(text('p',s.address,'school-meta'));if(s.intersection)d.append(text('p',s.intersection,'school-meta'));if(s.entrance_note)d.append(text('p',s.entrance_note,'school-meta'));if(s.intersection_method)d.append(text('p',s.intersection_method,'school-meta'));for(const source of s.address_sources||[])if(safeURL(source.url))d.append(link(source.title||'Location source',source.url));d.append(schoolVisit(s,r),schoolFeedback(s));if(!r){d.append(text('p','Not reviewed yet. Additional school reviews are being checked.'));return d;}
if(r.review_status==='needs_verification')d.append(text('p','Initial admissions review — some eligibility, location or tour details still need verification.','school-meta'));
for(const [label,value] of [['Why consider it',r.fit_summary],['Admission outlook',r.admission_assessment],['Filter classification',r.admission_category_note],['Prior-year admissions data',r.last_year||r.programs||r.admissions_data],['Evidence and limits',r.evidence],['What to check next',r.next_steps||r.questions]]){if(value){d.append(text('h3',label),text('p',describe(value),'review-copy'));}}

if(r.sources){d.append(text('h3','Sources'));const list=document.createElement('ul');for(const source of r.sources){const url=typeof source==='string'?source:source.url||source.href;if(safeURL(url)){const li=document.createElement('li');li.append(link(typeof source==='string'?source:source.title||source.label||url,url));list.append(li);}}d.append(list);}return d;}
function preferenceStore(){try{return JSON.parse(localStorage.getItem(`family-considering-${selected}`)||'{}');}catch{return {};}}
function orderedRows(){return [...rows].sort((a,b)=>rank(a)-rank(b)||a.name.localeCompare(b.name));}
function moveSchool(dbn,other){const ordered=orderedRows(),a=ordered.findIndex(s=>s.dbn===dbn),b=ordered.findIndex(s=>s.dbn===other);[ordered[a],ordered[b]]=[ordered[b],ordered[a]];const saved={};ordered.forEach((s,i)=>saved[s.dbn]=i+1);localStorage.setItem(`family-ranks-${selected}`,JSON.stringify(saved));render();}
const admissionLabels={likely:'Likely',maybe:'Maybe',unlikely:'Unlikely',unassessed:'Not yet assessed',unreviewed:'Not reviewed'};
function admissionCategory(s){const review=getReview(s.dbn);return review?(review.admission_category||'unassessed'):'unreviewed';}
function render(){
 const term=$('search').value.trim().toLowerCase(),district=$('district').value,admissions=$('admissions-filter').value,ordered=orderedRows();
 const open=new Set([...document.querySelectorAll('.school-toggle[aria-expanded="true"]')].map(button=>button.dataset.dbn));
 const shown=ordered.filter(s=>(!term||`${s.name} ${s.dbn} ${s.address||''} ${s.intersection||''}`.toLowerCase().includes(term))&&(!district||s.district===district)&&(!admissions||admissionCategory(s)===admissions)&&(!$('reviewed-only').checked||getReview(s.dbn)));
 $('schools').replaceChildren();
 shown.forEach((s,index)=>{
  const r=getReview(s.dbn),tr=document.createElement('tr');tr.className='school-row';
  const nameCell=text('td','','school-name-cell'),toggle=text('button',s.name,'school-toggle');toggle.type='button';toggle.setAttribute('aria-label',s.name);toggle.dataset.dbn=s.dbn;toggle.setAttribute('aria-controls',`school-detail-${selected}-${s.dbn}`);nameCell.append(toggle);if(s.school_type)nameCell.append(text('span',s.school_type,'school-intersection'));
  const address=s.address||r?.address,intersection=s.intersection||r?.intersection;if(address){const locationLine=text('span','','school-address');locationLine.append(link(address,`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`));nameCell.append(locationLine);}nameCell.append(text('span',intersection||'Cross streets: verification pending','school-intersection'));if(s.entrance_note)nameCell.append(text('span',s.entrance_note,'school-intersection')); 
  const rankCell=text('td','','school-rank-cell'),controls=text('div','','rank-controls');controls.append(text('span',String(ordered.indexOf(s)+1),'rank-number'));
  for(const [label,delta] of [['↑',-1],['↓',1]]){const button=text('button',label,'rank-button');button.type='button';button.setAttribute('aria-label',`Move ${s.name} ${delta<0?'up':'down'}`);button.disabled=!shown[index+delta];button.addEventListener('click',()=>moveSchool(s.dbn,shown[index+delta].dbn));controls.append(button);}rankCell.append(controls);
  const consideringCell=text('td','','school-choice-cell');consideringCell.append(schoolChoice(s));
  const outlookCell=text('td','','school-outlook-cell'),category=admissionCategory(s);outlookCell.append(text('span',admissionLabels[category],`admission-badge ${category}`));if(r)outlookCell.append(text('small',r.quick_outlook||'Expand for evidence','outlook-summary'));
  const sourceCell=text('td','','school-source-cell');if(safeURL(s.url))sourceCell.append(link('Directory ↗',s.url));
  tr.append(nameCell,rankCell,consideringCell,text('td',schoolCode(s),'school-dbn-cell'),text('td',s.district,'school-district-cell'),outlookCell,sourceCell);
  const detailRow=document.createElement('tr');detailRow.className='school-detail-row';detailRow.id=`school-detail-${selected}-${s.dbn}`;const detailCell=text('td','','school-detail-cell');detailCell.colSpan=7;detailRow.append(detailCell);let built=false;
  function expand(value){toggle.setAttribute('aria-expanded',String(value));detailRow.hidden=!value;if(value&&!built){detailCell.append(details(s,r));built=true;}}
  toggle.addEventListener('click',()=>expand(toggle.getAttribute('aria-expanded')!=='true'));expand(open.has(s.dbn));$('schools').append(tr,detailRow);
 });
 $('count').textContent=`${shown.length} of ${rows.length} schools`;$('status').textContent=shown.length?'':'No schools match these filters.';
}
async function choose(student){selected=student;for(const btn of document.querySelectorAll('.tab')){btn.classList.toggle('active',btn.dataset.student===student);btn.setAttribute('aria-pressed',String(btn.dataset.student===student));}$('directory-title').textContent=`${searches[student].name}’s schools`;$('level-label').textContent=`The ${searches[student].level} search`;$('search').value='';$('admissions-filter').value='';$('schools').replaceChildren();$('district').replaceChildren(new Option('All districts',''));$('count').textContent='Loading schools…';try{if(!cache[student]){const response=await fetch(`data/${student}-schools.json`);if(!response.ok)throw Error();cache[student]=await response.json();}if(local&&!reviews[student]){try{const resp=await fetch(`/family-review-data/${student}`);if(resp.ok)reviews[student]=await resp.json();}catch{}}if(selected!==student)return;const data=cache[student];rows=(Array.isArray(data)?data:data.schools||[]).map(normalize);for(const district of [...new Set(rows.map(s=>s.district))].sort((a,b)=>Number(a)-Number(b)))$('district').append(new Option(`District ${district}`,district));const n=(reviews[student]?.schools||reviews[student]?.reviews||[]).length;$('reviewed-only').disabled=!n;$('reviewed-only').checked=Boolean(n);$('private-note').textContent=n?`Family review: ${n} schools. Profiles and random numbers verified in MySchools on October 16, 2026. Use the arrows to change family order and choose Considering or Not considering. Family notes and choices are shared; ranking arrows are saved in this browser. It is not an admissions ranking or a change to MySchools. Personal assessments are excluded from the public website package.`:'Directory view. Personal reviews load only through the private local preview.';$('data-note').textContent=`Source checked: ${data.checked_on||'2026-10-16'}. ${data.scope||''}`;render();}catch{$('count').textContent='Directory unavailable';}}
for(const btn of document.querySelectorAll('.tab'))btn.addEventListener('click',()=>choose(btn.dataset.student));$('search').addEventListener('input',render);$('district').addEventListener('change',render);$('admissions-filter').addEventListener('change',render);$('reviewed-only').addEventListener('change',render);$('clear').addEventListener('click',()=>{$('search').value='';$('district').value='';$('admissions-filter').value='';render();});choose('teddy');
