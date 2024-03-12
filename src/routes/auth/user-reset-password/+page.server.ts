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

	let token = url.searchParams.get('token') || '';

	const form = await superValidate(zod(resetSchema));

	return {
		token,
		form
	};
};

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		// handle form data
		const form = await superValidate(request, zod(resetSchema));
		// server side validation
		if (!form.valid) return message(form, { type: 'warning', text: 'Invalid form' });
		// build payload
		const { token, email, password } = form.data;
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
