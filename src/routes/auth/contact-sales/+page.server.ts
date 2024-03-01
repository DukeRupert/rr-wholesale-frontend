import type { PageServerLoad, Actions } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import { contactSchema } from './contact-form.svelte';

export const load: PageServerLoad = async ({ locals, url }) => {
	// If logged in, redirect to return url or home
	if (locals.user) {
		throw redirect(302, '/');
	}

	const form = await superValidate(zod(contactSchema));

	return {
		form
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		// handle form data
		const form = await superValidate(request, zod(contactSchema));
		// server side validation
		if (!form.valid) return message(form, { type: 'warning', text: 'Invalid form' }); // this shouldn't happen because of client-side validation
		// Todo: Check for bots
		// Todo: Connect to email provider
		return message(form, { type: 'success', text: 'We will reach out to you soon!' });
	}
};
