import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
export const student = v.union(v.literal('teddy'),v.literal('edith'));
export const choice = v.union(v.literal('undecided'),v.literal('considering'),v.literal('not_considering'));
export default defineSchema({
  notes: defineTable({student,dbn:v.string(),body:v.string(),author:v.string(),requestId:v.string()}).index('by_student_and_dbn',['student','dbn']).index('by_requestId',['requestId']),
  choices: defineTable({student,dbn:v.string(),choice,updatedAt:v.number()}).index('by_student_and_dbn',['student','dbn']),
  choiceHistory: defineTable({student,dbn:v.string(),choice,requestId:v.string()}).index('by_student_and_dbn',['student','dbn']).index('by_requestId',['requestId']),
});
