import { z } from 'zod'

export const loginPostReq = z.object({
   email: z.string().email().refine((val) => val.length > 0, {
      message: 'Email is required'
   }),
   password: z.string().min(6),
   rurl: z.string()
})

export const loginSchema = z.object({
   email: z.string().email().refine((val) => val.length > 0, {
      message: 'Email is required'
   }),
   password: z.string().min(6),
   rurl: z.string()
})

export const registerSchema = z.object({
   email: z.string().email().refine((val) => val.length > 0, {
      message: 'Email is required'
   }),
   first_name: z.string().min(1),
   last_name: z.string().min(1),
   password: z.string().min(6),
   passwordConfirm: z.string().min(6),
   rurl: z.string()
}).superRefine(({ passwordConfirm, password }, ctx) => {
   if (passwordConfirm !== password) {
      ctx.addIssue({
         code: z.ZodIssueCode.custom,
         message: 'The passwords did not match'
      })
   }
})

export const forgotPostReq = z.object({
   email: z.string().email().refine((val) => val.length > 0, {
      message: 'Email is required'
   }),
   rurl: z.string()
})

export const resetPostReq = z.object({
   email: z.string().email().refine((val) => val.length > 0, {
      message: 'Email is required'
   }),
   password: z.string().min(6),
   passwordConfirm: z.string().min(6),
   code: z.string().min(1),
   rurl: z.string()
}).superRefine(({ passwordConfirm, password }, ctx) => {
   if (passwordConfirm !== password) {
      ctx.addIssue({
         code: z.ZodIssueCode.custom,
         message: 'The passwords did not match'
      })
   }
})

export type LoginSchema = typeof loginSchema
export type RegisterSchema = typeof registerSchema