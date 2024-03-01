import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import type { Infer } from 'sveltekit-superforms';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { passwordSchema } from './password-form.svelte';
import medusa from '$lib/medusa';

export const load: PageServerLoad = async function ({ url, locals }) {
	if (!locals.user) throw redirect(307, '/auth');
    let rurl = url.searchParams.get('rurl') || '';

	const form = await superValidate(zod(passwordSchema));

	return {
		form,
		return_url: rurl
	};

};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		// handle form data
		const form = await superValidate(request, zod(passwordSchema));
		// server side validation
		if (!form.valid)
			return message(form, { type: 'error', text: 'Invalid form' });
		// build payload
		const payload = { password: form.data.newPassword };
		// call medusa
		const res = await medusa.customers.updateCustomer(locals, payload);
		// handle error
		if (res === null) return message(form, { type: 'error', text: 'Server error' });
		// handle success
			return message(form, { type: 'success', text: 'Password updated' });
	}
};