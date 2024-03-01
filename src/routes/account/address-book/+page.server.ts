import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { addressSchema } from './address-form.svelte';
import medusa from '$lib/medusa';

export const load: PageServerLoad = async function ({ url, locals }) {
	if (!locals.user) throw redirect(307, '/auth');

	// Setup forms
	const form = await superValidate(zod(addressSchema));

	return {
		user: locals.user,
		form
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		// handle form
		const form = await superValidate(request, zod(addressSchema));
		// server side validation
		if (!form.valid) return message(form, { type: 'error', text: 'Invalid address' });
		// build payload
		const payload = { ...form.data, metadata: {} };
		// call medusa
		const res = await medusa.customers.addresses.addAddress(locals, { address: payload });
		// handle error
		if (res === null) return message(form, { type: 'error', text: 'Server error' });
		// handle success
		return message(form, { type: 'success', text: 'Address added' });
	}
};
