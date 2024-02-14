import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import medusa from '$lib/server/medusa';
import medusaClient from '$lib/medusaClient';
import type { Infer } from 'sveltekit-superforms';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	updateCustomerSchema,
	updatePasswordSchema,
	shippingAddressSchema
} from '$lib/validators/account';

export const load: PageServerLoad = async function ({ url, locals }) {
	if (!locals.user) throw redirect(307, '/auth');

	// Setup forms
	const update_customer_form = await superValidate<Infer<typeof updateCustomerSchema>>(
		locals.user,
		zod(updateCustomerSchema),
		{ errors: false }
	);
	const update_password_form = await superValidate<Infer<typeof updatePasswordSchema>>(
		zod(updatePasswordSchema)
	);
	const update_address_form = await superValidate<Infer<typeof shippingAddressSchema>>(
		zod(shippingAddressSchema)
	);

	return {
		user: locals.user,
		update_customer_form,
		update_password_form,
		update_address_form
	};
};

export const actions: Actions = {
	updateCustomer: async ({ request, locals }) => {
		console.log('Update Customer action');
		const update_customer_form = await superValidate(request, zod(updateCustomerSchema));
		if (!update_customer_form.valid)
			return message(update_customer_form, { type: 'error', text: 'Invalid data' });
		const payload = { ...update_customer_form.data}
		const res = await medusaClient.updateCustomer(locals, payload);
		if (res === null) return message(update_customer_form, { type: 'error', text: 'Server error' });
		locals.user = Object.assign({}, locals.user, res.customer);
		return message(update_customer_form, { type: 'success', text: 'User information updated' });
	},

	addAddress: async ({ request, locals }) => {
		console.log('Create Address action');
		const createAddressForm = await superValidate(request, zod(shippingAddressSchema));
		if (!createAddressForm.valid)
			return message(createAddressForm, { type: 'error', text: 'Invalid address' });
		const payload = { ...createAddressForm.data, metadata: {} };
		const res = await medusaClient.addAddress(locals, payload);
		if (res === null) return message(createAddressForm, { type: 'error', text: 'Server error' });
		locals.user = Object.assign({}, locals.user, res.customer);
		return message(createAddressForm, { type: 'success', text: 'Address added' });
	},

	deleteAddress: async ({ request, locals }) => {
		console.log('Delete Address action');
		const data = await request.formData();
		const addressId = data.get('addressId') as string;
		if (!addressId) {
			return fail(400, { addressId, missing: true });
		}
		const res = await medusaClient.deleteAddress(locals, addressId);
		if (res === null) return fail(400, { addressId, success: false});
		locals.user = Object.assign({}, locals.user, res.customer);
		return { success: true };
	},

	updatePassword: async ({ request, locals }) => {
		console.log('Update Password action');
		// Validator checks that newPassword === confirmPassword
		const update_password_form = await superValidate(request, zod(updatePasswordSchema));
		if (!update_password_form.valid)
			return message(update_password_form, { type: 'error', text: 'Invalid form' });
		const payload = { password: update_password_form.data.newPassword}
		const res = await medusaClient.updateCustomer(locals, payload)
		if (res === null) return message(update_password_form, { type: 'error', text: 'Server error' });
		return message(update_password_form, { type: 'success', text: 'Password updated' });
	}
};
