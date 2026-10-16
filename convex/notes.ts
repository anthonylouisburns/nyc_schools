import { v } from 'convex/values';
import { paginationOptsValidator } from 'convex/server';
import { internalMutation, internalQuery } from './_generated/server';
import { student, choice } from './schema';
const note=v.object({id:v.string(),body:v.string(),author:v.string(),createdAt:v.number()});
export const read = internalQuery({
 args:{student,dbn:v.string(),paginationOpts:paginationOptsValidator},
 returns:v.object({notes:v.array(note),cursor:v.string(),isDone:v.boolean(),choice}),
 handler:async(ctx,args)=>{
  const page=await ctx.db.query('notes').withIndex('by_student_and_dbn',q=>q.eq('student',args.student).eq('dbn',args.dbn)).order('desc').paginate(args.paginationOpts);
  const current=await ctx.db.query('choices').withIndex('by_student_and_dbn',q=>q.eq('student',args.student).eq('dbn',args.dbn)).unique();
  return {notes:page.page.map(n=>({id:n._id,body:n.body,author:n.author,createdAt:n._creationTime})),cursor:page.continueCursor,isDone:page.isDone,choice:current?.choice??'undecided'};
 }
});
export const add = internalMutation({
 args:{student,dbn:v.string(),body:v.string(),author:v.string(),requestId:v.string()},returns:v.object({id:v.string()}),
 handler:async(ctx,args)=>{
  const prior=await ctx.db.query('notes').withIndex('by_requestId',q=>q.eq('requestId',args.requestId)).unique();
  if(prior){if(prior.student!==args.student||prior.dbn!==args.dbn||prior.body!==args.body||prior.author!==args.author)throw Error('Request id already used');return {id:prior._id};}
  if(!args.body.trim()||args.body.length>10000||args.author.length>60)throw Error('Invalid note');
  return {id:await ctx.db.insert('notes',args)};
 }
});
export const setChoice = internalMutation({
 args:{student,dbn:v.string(),choice,requestId:v.string()},returns:v.null(),
 handler:async(ctx,args)=>{
  const prior=await ctx.db.query('choiceHistory').withIndex('by_requestId',q=>q.eq('requestId',args.requestId)).unique();
  if(prior){if(prior.student!==args.student||prior.dbn!==args.dbn||prior.choice!==args.choice)throw Error('Request id already used');return null;}
  const current=await ctx.db.query('choices').withIndex('by_student_and_dbn',q=>q.eq('student',args.student).eq('dbn',args.dbn)).unique();
  await ctx.db.insert('choiceHistory',args);
  if(current)await ctx.db.patch(current._id,{choice:args.choice,updatedAt:Date.now()});
  else await ctx.db.insert('choices',{student:args.student,dbn:args.dbn,choice:args.choice,updatedAt:Date.now()});
  return null;
 }
});
