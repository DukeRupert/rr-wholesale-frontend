import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { forgotSchema } from './forgot-form.svelte';
import medusa from '$lib/medusa';

export const load: PageServerLoad = async ({ locals, url }) => {
	// If logged in, redirect to return url or home
	if (locals.user) {
		throw redirect(302, `/`);
	}

	const form = await superValidate(zod(forgotSchema));

	return {
		form
	};
};



export const actions: Actions = {
	default: async ({ request }) => {
		// handle form data
		const form = await superValidate(request, zod(forgotSchema));
		// server side validation
		if (!form.valid) return message(form, { type: 'warning', text: 'Invalid form' });
		// call medusa
		await medusa.customers.generatePasswordToken(form.data.email);
		// don't leak client info
		return message(form, {
			type: 'success',
			text: 'Please check your email'
		});
	}
};
