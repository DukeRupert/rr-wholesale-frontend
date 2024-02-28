import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import type { Infer } from 'sveltekit-superforms';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { updateCustomerSchema } from './profile-form.svelte';
import medusa from '$lib/medusa';

export const load: PageServerLoad = async function ({ url, locals }) {
	if (!locals.user) throw redirect(307, '/auth');

	// Setup forms
	const form = await superValidate<Infer<typeof updateCustomerSchema>>(
		locals.user,
		zod(updateCustomerSchema)
	);

	return {
		user: locals.user,
		form
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		console.log('Update Customer action');
		const update_customer_form = await superValidate(request, zod(updateCustomerSchema));
		if (!update_customer_form.valid)
			return message(update_customer_form, { type: 'error', text: 'Invalid data' });
		const payload = { ...update_customer_form.data };
		const res = await medusa.customers.updateCustomer(locals, payload);
		if (res === null) return message(update_customer_form, { type: 'error', text: 'Server error' });
		locals.user = Object.assign({}, locals.user, res.customer);
		return message(update_customer_form, { type: 'success', text: 'User information updated' });
	}
};
