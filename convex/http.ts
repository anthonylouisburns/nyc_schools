import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
const router=httpRouter();
// Private schools use explicit stable IDs; existing public-school note keys stay unchanged.
const privateSchools=new Set(['private-dominican-academy','private-notre-dame','private-blessed-sacrament','private-stephen-gaynor','private-gateway']);
function validSchool(value:unknown){return typeof value==='string'&&(/^0[1-6]M\d{3}$/.test(value)||value==='13K430'||privateSchools.has(value));}
const allowed=new Set(['https://anthonylouisburns.github.io','http://127.0.0.1:8765','http://127.0.0.1:8766','http://127.0.0.1:8767','http://127.0.0.1:8768']);
function headers(request:Request){const origin=request.headers.get('Origin');return {'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin',...(origin&&allowed.has(origin)?{'Access-Control-Allow-Origin':origin}:{}),'Access-Control-Allow-Headers':'Content-Type, Authorization','Access-Control-Allow-Methods':'POST, OPTIONS'};}
function reply(request:Request,value:unknown,status=200){return new Response(JSON.stringify(value),{status,headers:headers(request)});}
async function authorized(request:Request){
 const origin=request.headers.get('Origin');if(origin&&!allowed.has(origin))return false;
 const token=request.headers.get('Authorization')?.replace(/^Bearer /,'')??'';if(!/^[a-f0-9]{64}$/.test(token))return false;
 const expected=process.env.NOTES_TOKEN_SHA256;if(!expected||expected.length!==64)return false;
 const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token)))).map(x=>x.toString(16).padStart(2,'0')).join('');let diff=0;for(let i=0;i<64;i++)diff|=digest.charCodeAt(i)^expected.charCodeAt(i);return diff===0;
}
for(const path of ['/notes/read','/notes/add','/schools/status']){
 router.route({path,method:'OPTIONS',handler:httpAction(async(_ctx,request)=>new Response(null,{status:204,headers:headers(request)}))});
 router.route({path,method:'POST',handler:httpAction(async(ctx,request)=>{
  if(!await authorized(request))return reply(request,{error:'Please unlock family access.'},401);
  if(Number(request.headers.get('Content-Length')??'0')>24000)return reply(request,{error:'Note is too long.'},413);
  let body;try{const raw=await request.text();if(raw.length>24000)return reply(request,{error:'Note is too long.'},413);body=JSON.parse(raw);}catch{return reply(request,{error:'Invalid request.'},400);}
  if(!['teddy','edith'].includes(body.student)||!validSchool(body.dbn))return reply(request,{error:'Invalid school.'},400);
  const student=body.student as 'teddy'|'edith',dbn=body.dbn;
  try{
   if(path==='/notes/read'){
    if(body.cursor!=null&&(typeof body.cursor!=='string'||body.cursor.length>6000))return reply(request,{error:'Invalid cursor.'},400);
    return reply(request,await ctx.runQuery(internal.notes.read,{student,dbn,paginationOpts:{numItems:50,cursor:body.cursor??null}}));
   }
   if(typeof body.requestId!=='string'||!/^[a-f0-9-]{36}$/.test(body.requestId))return reply(request,{error:'Invalid save identifier.'},400);
   if(path==='/notes/add'){
    if(typeof body.body!=='string'||!body.body.trim()||body.body.length>10000||typeof body.author!=='string'||body.author.length>60)return reply(request,{error:'Enter a note of up to 10,000 characters.'},400);
    return reply(request,await ctx.runMutation(internal.notes.add,{student,dbn,body:body.body,author:body.author,requestId:body.requestId}));
   }
   if(!['undecided','considering','not_considering'].includes(body.choice))return reply(request,{error:'Invalid choice.'},400);
   await ctx.runMutation(internal.notes.setChoice,{student,dbn,choice:body.choice,requestId:body.requestId});return reply(request,{saved:true});
  }catch{return reply(request,{error:'Could not save or load. Your draft has been kept; please retry.'},500);}
 })});
}
export default router;
