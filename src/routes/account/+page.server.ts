import type { PageServerLoad, Actions } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { customerSchema } from './profile-form.svelte';
import medusa from '$lib/medusa';

export const load: PageServerLoad = async function ({ url, locals }) {
	
	// Setup forms
	const form = await superValidate(
		locals.user,
		zod(customerSchema)
	);

	return {
		user: locals.user,
		form
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		console.log('Update Customer action');
		// handle form data
		const form = await superValidate(request, zod(customerSchema));
		// server side validation
		if (!form.valid) return message(form, { type: 'error', text: 'Invalid data' });
		// build payload
		const payload = { ...form.data };
		// call medusa
		const res = await medusa.customers.updateCustomer(locals, payload);
		// handle error
		if (res === null) return message(form, { type: 'error', text: 'Server error' });
		// handle success
		return message(form, { type: 'success', text: 'User information updated' });
	}
};
