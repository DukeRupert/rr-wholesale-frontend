import type { PageServerLoad, Actions } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { resetSchema } from './reset-form.svelte';
import medusa from '$lib/medusa';

export const load: PageServerLoad = async () => {

	const form = await superValidate(zod(resetSchema));

	return {
		form
	};
};

export const actions: Actions = {
	default: async ({ request, url }) => {
		// handle form data
		const form = await superValidate(request, zod(resetSchema));
		// server side validation
		if (!form.valid) return message(form, { type: 'warning', text: 'Invalid form' });
		// check for valid token
		const token = url.searchParams.get('token') || '';
		if (!token) return message(form, { type: 'warning', text: 'Invalid token.' });
		// build payload
		const { password } = form.data;
		const payload = {
			token,
			password
		};
		// call medusa
		const res = await medusa.client.client.admin.users.resetPassword(payload)
		// handle error
		if (res === null) return message(form, { type: 'error', text: 'Invalid credentials' });
		return message(form, { type: 'success', text: 'Password updated' });
	}
};
