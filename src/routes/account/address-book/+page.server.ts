import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import type { Infer } from 'sveltekit-superforms';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { shippingAddressSchema } from '$lib/validators/account';
import medusa from '$lib/medusa';

export const load: PageServerLoad = async function ({ url, locals }) {
	if (!locals.user) throw redirect(307, '/auth');

	// Setup forms
	const form = await superValidate<Infer<typeof shippingAddressSchema>>(zod(shippingAddressSchema));

	return {
		user: locals.user,
		form
	};
};

export const actions: Actions = {
	add: async ({ request, locals }) => {
		console.log('Create Address action');
		const createAddressForm = await superValidate(request, zod(shippingAddressSchema));
		if (!createAddressForm.valid)
			return message(createAddressForm, { type: 'error', text: 'Invalid address' });
		const payload = { ...createAddressForm.data, metadata: {} };
		const res = await medusa.customers.addresses.addAddress(locals, { address: payload });
		if (res === null) return message(createAddressForm, { type: 'error', text: 'Server error' });
		locals.user = Object.assign({}, locals.user, res.customer);
		return message(createAddressForm, { type: 'success', text: 'Address added' });
	},

	delete: async ({ request, locals }) => {
		console.log('Delete Address action');
		const data = await request.formData();
		const address_id = data.get('addressId') as string;
		if (!address_id) {
			return fail(400, { addressId: address_id, missing: true });
		}
		const res = await medusa.customers.addresses.deleteAddress(locals, address_id);
		if (res === null) return fail(400, { addressId: address_id, success: false });
		locals.user = Object.assign({}, locals.user, res.customer);
		return { success: true };
	}
};
