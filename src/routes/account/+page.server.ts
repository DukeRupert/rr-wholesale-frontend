import type { PageServerLoad, Actions } from './$types'
import { fail, redirect } from '@sveltejs/kit'
import medusa from '$lib/server/medusa'
import { superValidate, message } from 'sveltekit-superforms/server'
import { addShippingAddress } from '$lib/validators/account'
import type { Address } from '@dukerupert/sveltekit-medusa-client'

export const load: PageServerLoad = async function ({ url, locals }) {
   if (!locals.user) throw redirect(307, '/auth')
   return {
      user: locals.user,
      currentPage: parseInt(url.searchParams?.get('page') as string) || 1
   }
}

export const actions: Actions = {

   editInfo: async ({ request, locals }) => {
      const data = await request.formData()
      const first_name = data.get('firstName') as string
      const last_name = data.get('lastName') as string
      const email = data.get('email') as string
      const phone = data.get('phone') as string
      if (!first_name || !last_name || !email) {
         return fail(400, { first_name, missing: true })
      }
      const success = await medusa.editCustomer(locals, { first_name, last_name, email, phone })
      return { success }
   },

   addAddress: async ({ request, locals }) => {
      console.log('Add Address action');
		const form = await superValidate(request, addShippingAddress);
      if (!form.valid) return message(form, 'Invalid address', { status: 400 })
      const address = form.data as Address
      const success = await medusa.addShippingAddress(locals, address) as boolean
      if (!success) return message(form, 'Something went wrong', { status: 500 })
      return { success }
   },

   deleteAddress: async ({ request, locals }) => {
      const data = await request.formData()
      const addressId = data.get('addressId') as string
      if (!addressId) {
         return fail(400, { addressId, missing: true })
      }
      const success = await medusa.deleteAddress(locals, addressId)
      return { success }
   },

   changePassword: async ({ request, locals }) => {
      const data = await request.formData()
      const currentPassword = data.get('currentPassword') as string
      const newPassword = data.get('newPassword') as string
      const confirmPassword = data.get('confirmPassword')
      if (!currentPassword || !newPassword || !confirmPassword) {
         return fail(400, { currentPassword, newPassword, confirmPassword, missing: true })
      }
      if (newPassword !== confirmPassword) {
         return fail(400, { currentPassword, newPassword, confirmPassword, mismatch: true })
      }
      const success = await medusa.editCustomer(locals, { password: newPassword })
      return { success }
   }
}