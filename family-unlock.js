const rememberedAccess = {
  async database() {
    return new Promise((resolve,reject)=>{
      const request=indexedDB.open('family-guide-access',1);
      request.onupgradeneeded=()=>request.result.createObjectStore('keys');
      request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);
    });
  },
  async use(mode,action) {
    const db=await this.database();
    try{return await new Promise((resolve,reject)=>{
      const transaction=db.transaction('keys',mode),request=action(transaction.objectStore('keys'));
      transaction.oncomplete=()=>resolve(request.result);transaction.onerror=()=>reject(transaction.error);transaction.onabort=()=>reject(transaction.error);
    });}finally{db.close();}
  },
  get(){return this.use('readonly',store=>store.get('unlock'));},
  save(key){return this.use('readwrite',store=>store.put(key,'unlock'));},
  clear(){return this.use('readwrite',store=>store.delete('unlock'));}
};
async function openFamilyGuide(material,remember=false){
  const key=await crypto.subtle.deriveKey({name:'PBKDF2',salt:bytes(bundle.salt),iterations:bundle.iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['decrypt']);
  const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(bundle.iv)},key,bytes(bundle.ciphertext));
  const payload=JSON.parse(new TextDecoder().decode(plain));
  let saved=false;
  if(remember){try{await rememberedAccess.save(material);saved=true;}catch{}}
  document.getElementById('password').value='';window.__FAMILY_DATA__=payload;
  const supplementalPage=payload.screenedPages?.[location.pathname.split('/').pop()];if(supplementalPage){payload.html=supplementalPage.html;payload.css=supplementalPage.css;payload.js=supplementalPage.js;}
  const doc=new DOMParser().parseFromString(payload.html,'text/html');
  document.documentElement.replaceChildren(...Array.from(doc.documentElement.childNodes).map(n=>document.importNode(n,true)));
  const style=document.createElement('style');style.textContent=payload.css;document.head.append(style);
  const script=document.createElement('script');script.textContent=payload.js;document.body.append(script);
  if(location.pathname.endsWith('/screened-brooklyn.html')){const gradesScript=document.createElement('script');gradesScript.src='niche-grades.js';document.body.append(gradesScript);}
  if(!document.querySelector('header a[href="open-edopt-manhattan.html"]')){const link=document.createElement('a');link.href='open-edopt-manhattan.html';link.textContent='Manhattan Open & Ed Opt';document.querySelector('header')?.append(link);}
  const lock=document.createElement('button');lock.type='button';lock.className='guide-lock';lock.textContent='Lock guide';
  lock.addEventListener('click',async()=>{lock.disabled=true;try{await rememberedAccess.clear();location.reload();}catch{lock.disabled=false;lock.textContent='Could not lock — try again';}});
  document.querySelector('header')?.append(lock);
  if(remember&&!saved){const message=document.createElement('p');message.textContent='This browser could not remember access. You may need to unlock again next time.';document.querySelector('main').prepend(message);}
}
document.getElementById('unlock').addEventListener('submit',async event=>{
  event.preventDefault();const button=document.getElementById('submit');button.disabled=true;button.textContent='Opening…';document.getElementById('error').textContent='';
  try{
    const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(document.getElementById('password').value),'PBKDF2',false,['deriveKey']);
    const remember=document.getElementById('remember').checked;
    if(!remember)await rememberedAccess.clear().catch(()=>{});
    await openFamilyGuide(material,remember);
  }catch{document.getElementById('error').textContent='Unable to open the guide. Check the password and try again.';button.disabled=false;button.textContent='Open guide';}
});
(async()=>{
  try{const key=await rememberedAccess.get();if(key)await openFamilyGuide(key);}catch{await rememberedAccess.clear().catch(()=>{});}
})();
