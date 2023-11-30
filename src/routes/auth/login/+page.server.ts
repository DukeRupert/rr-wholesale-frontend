import type { PageServerLoad, Actions } from './$types'
import { error, redirect } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms/server'
import { loginPostReq } from '$lib/validators/auth'
import medusa from '$lib/server/medusa'

export const load: PageServerLoad = async ({ locals, url }) => {
   let rurl = url.searchParams.get('rurl') || ''
   let code = url.searchParams.get('code') || ''

   if (locals.user) { throw redirect(302, `/${rurl}`) }

   const form = await superValidate(loginPostReq, { id: 'login' })

   return {
      rurl,
      code,
      form
   }
}

export const actions: Actions = {
   login: async ({ request, locals, cookies }) => {
      const form = await superValidate(request, loginPostReq, { id: 'login' })
      if (!form.valid) return message(form, 'Something went wrong', { status: 500}) // this shouldn't happen because of client-side validation
      if (await medusa.login(locals, cookies, form.data.email, form.data.password)) {
         throw redirect(302, `/${form.data.rurl}`)
      } else { 
         return message(form, 'Invalid email/password combination', { status: 401 })
      }
   },

   logout: async ({ locals, cookies }) => {
      if (await medusa.logout(locals, cookies)) {
         throw redirect(302, '/auth')
      }
      else throw error(500, 'server error')
   }
}