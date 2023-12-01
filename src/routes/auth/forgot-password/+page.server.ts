import type { PageServerLoad, Actions } from './$types'
import { redirect } from '@sveltejs/kit'
import { message, superValidate } from 'sveltekit-superforms/server'
import { forgotPostReq } from '$lib/validators/auth'
import medusa from '$lib/server/medusa'

export const load: PageServerLoad = async ({ locals, url }) => {
   let rurl = url.searchParams.get('rurl') || ''
   let code = url.searchParams.get('code') || ''

   // If logged in, redirect to return url or home
   if (locals.user) { throw redirect(302, `/${rurl}`) }

   const form = await superValidate(forgotPostReq)

   return {
      rurl,
      code,
      form
   }
}

export const actions: Actions = {
   forgot: async ({ request }) => {
      const form = await superValidate(request, forgotPostReq)
      if (!form.valid) return message(form, 'Something went wrong', { status: 500}) // this shouldn't happen because of client-side validation
      if (await medusa.requestResetPassword(form.data.email)) {
         return message(form, 'If an account with that email exists, a reset code has been sent to your email address')
      } else {
         return message(form, 'Unable to send reset code', { status: 400 })
      }
   },
}