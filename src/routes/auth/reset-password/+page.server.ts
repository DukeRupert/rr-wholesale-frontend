import type { PageServerLoad, Actions } from './$types'
import { error, redirect } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms/server'
import { resetPostReq } from '$lib/validators/auth'
import medusa from '$lib/server/medusa'

export const load: PageServerLoad = async ({ locals, url }) => {
   let rurl = url.searchParams.get('rurl') || ''
   let code = url.searchParams.get('code') || ''

   // If logged in, redirect to return url or home
   if (locals.user) { throw redirect(302, `/${rurl}`) }

   const form = await superValidate(resetPostReq)

   return {
      rurl,
      code,
      form
   }
}

export const actions: Actions = {
   reset: async ({ request, locals, cookies }) => {
      const form = await superValidate(request, resetPostReq)
      if (!form.valid) return message(form, 'Something went wrong', { status: 500}) // this shouldn't happen because of client-side validation
      if (await medusa.login(locals, cookies, form.data.email, form.data.password)) {
         throw redirect(302, `/${form.data.rurl}`)
      } else { 
         return message(form, 'Invalid email/password combination', { status: 401 })
      }
   },
}