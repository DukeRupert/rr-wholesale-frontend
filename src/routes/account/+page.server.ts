import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import medusa from '$lib/server/medusa';
import { superValidate, message } from 'sveltekit-superforms/server';
import { updateUserSchema, updatePasswordSchema, shippingAddressSchema } from '$lib/validators/account';
import { registerSchema } from '$lib/validators/auth';
import type { Address, Customer } from '@dukerupert/sveltekit-medusa-client';

export const load: PageServerLoad = async function ({ url, locals }) {
	if (!locals.user) throw redirect(307, '/auth');

	// Setup forms
	const updateUserForm = await superValidate(locals.user, updateUserSchema)
	const updatePasswordForm = await superValidate(updatePasswordSchema)
	const createAddressForm = await superValidate(shippingAddressSchema)

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
		const updateUserForm = await superValidate(request, updateUserSchema);
		if (!updateUserForm.valid) return message(updateUserForm, 'Invalid form', { status: 400 });
		const customer = updateUserForm.data as Customer;
		const success = await medusa.editCustomer(locals, customer);
		if (!success) return message(updateUserForm, 'Please try again later.', { status: 500 });
		return { updateUserForm };
	},

	createAddress: async ({ request, locals }) => {
		console.log('Create Address action');
		const createAddressForm = await superValidate(request, shippingAddressSchema);
		if (!createAddressForm.valid) return message(createAddressForm, 'Invalid address', { status: 400 });
		const address = createAddressForm.data as Address;
		const success = (await medusa.addShippingAddress(locals, address)) as boolean;
		if (!success) return message(createAddressForm, 'Something went wrong', { status: 500 });
		return { createAddressForm };
	},

	deleteAddress: async ({ request, locals }) => {
		console.log('Delete Address action')
		const data = await request.formData();
		const addressId = data.get('addressId') as string;
		if (!addressId) {
			return fail(400, { addressId, missing: true });
		}
		const success = await medusa.deleteAddress(locals, addressId);
		return { success };
	},

	updatePassword: async ({ request, locals }) => {
		console.log('Update Password action');
		// Validator checks that newPassword === confirmPassword
		const updatePasswordForm = await superValidate(request, updatePasswordSchema);
		if (!updatePasswordForm.valid) return message(updatePasswordForm, 'Invalid form', { status: 400 });
		const { newPassword } = updatePasswordForm.data as { newPassword: string };
		const success = await medusa.editCustomer(locals, { password: newPassword });
		if (!success) return message(updatePasswordForm, 'Something went wrong', { status: 500 });
		return { updatePasswordForm };
	},
};
