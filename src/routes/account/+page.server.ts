import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import medusa from '$lib/server/medusa';
import medusaClient from '$lib/medusaClient';
import type { Infer } from 'sveltekit-superforms';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	updateUserSchema,
	updatePasswordSchema,
	shippingAddressSchema
} from '$lib/validators/account';
import type { Address, Customer } from '@dukerupert/sveltekit-medusa-client';

export const load: PageServerLoad = async function ({ url, locals }) {
	if (!locals.user) throw redirect(307, '/auth');

	// Setup forms
	const updateUserForm = await superValidate<Infer<typeof updateUserSchema>>(
		locals.user,
		zod(updateUserSchema),
		{ errors: false }
	);
	const updatePasswordForm = await superValidate<Infer<typeof updatePasswordSchema>>(
		zod(updatePasswordSchema)
	);
	const createAddressForm = await superValidate<Infer<typeof shippingAddressSchema>>(
		zod(shippingAddressSchema)
	);

	return {
		user: locals.user,
		updateUserForm,
		updatePasswordForm,
		createAddressForm
	};
};

export const actions: Actions = {
	updateUser: async ({ request, locals }) => {
		console.log('Update User action');
		const updateUserForm = await superValidate(request, zod(updateUserSchema));
		if (!updateUserForm.valid)
			return message(updateUserForm, { type: 'error', text: 'Invalid data' });
		const customer = updateUserForm.data as Customer;
		const success = await medusa.editCustomer(locals, customer);
		if (!success) return message(updateUserForm, { type: 'error', text: 'Server error' });
		return { updateUserForm };
	},

	createAddress: async ({ request, locals }) => {
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
		const updatePasswordForm = await superValidate(request, zod(updatePasswordSchema));
		if (!updatePasswordForm.valid)
			return message(updatePasswordForm, { type: 'error', text: 'Invalid form' });
		const { newPassword } = updatePasswordForm.data as { newPassword: string };
		const success = await medusa.editCustomer(locals, { password: newPassword });
		if (!success) return message(updatePasswordForm, { type: 'error', text: 'Server error' });
		return { updatePasswordForm };
	}
};
