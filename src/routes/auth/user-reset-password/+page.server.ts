import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { resetSchema } from './reset-form.svelte';
import medusa from '$lib/medusa';

export const load: PageServerLoad = async ({ locals, url }) => {
	// If logged in, redirect to return url or home
	if (locals.user) {
		throw redirect(302, '/');
	}

	const form = await superValidate(zod(resetSchema));

	return {
		form
	};
};

export const actions: Actions = {
	default: async ({ request, url }) => {
		let token = url.searchParams.get('token') || '';
		// handle form data
		const form = await superValidate(request, zod(resetSchema));
		// server side validation
		if (!form.valid) return message(form, { type: 'warning', text: 'Invalid form' });
		// build payload
		const { password } = form.data;
		const payload = {
			token,
			password
		};
		console.log(`Payload: `)
		console.log(payload)
		// call medusa
		const res = await medusa.client.client.admin.users.resetPassword(payload)
		console.log(res)
		// handle error
		if (res === null) return message(form, { type: 'error', text: 'Invalid credentials' });
		return message(form, { type: 'success', text: 'Password updated' });
	}
};
