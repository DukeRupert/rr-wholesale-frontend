import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import medusa from '$lib/server/medusa';
import { superValidate, message } from 'sveltekit-superforms/server';
import { editUserSchema, changePasswordSchema, addShippingAddressSchema } from '$lib/validators/account';
import type { Address, Customer } from '@dukerupert/sveltekit-medusa-client';

export const load: PageServerLoad = async function ({ url, locals }) {
	if (!locals.user) throw redirect(307, '/auth');

	// Setup forms
	const editUserForm = await superValidate(locals.user, editUserSchema)
	const changePasswordForm = await superValidate(changePasswordSchema)
	const addAddressForm = await superValidate(addShippingAddressSchema)

	return {
		user: locals.user,
		currentPage: parseInt(url.searchParams?.get('page') as string) || 1,
		editUserForm,
		changePasswordForm,
		addAddressForm
	};
};

export const actions: Actions = {
	editUserInfo: async ({ request, locals }) => {
		console.log('Edit User Info');
		const editUserForm = await superValidate(request, editUserSchema);
		if (!editUserForm.valid) return message(editUserForm, 'Invalid form', { status: 400 });
		const customer = editUserForm.data as Customer;
		const success = await medusa.editCustomer(locals, customer);
		if (!success) return message(editUserForm, 'Please try again later.', { status: 500 });
		return { editUserForm };
	},

	addAddress: async ({ request, locals }) => {
		console.log('Add Address action');
		const addAddressForm = await superValidate(request, addShippingAddressSchema);
		if (!addAddressForm.valid) return message(addAddressForm, 'Invalid address', { status: 400 });
		const address = addAddressForm.data as Address;
		const success = (await medusa.addShippingAddress(locals, address)) as boolean;
		if (!success) return message(addAddressForm, 'Something went wrong', { status: 500 });
		return { addAddressForm };
	},

	deleteAddress: async ({ request, locals }) => {
		const data = await request.formData();
		const addressId = data.get('addressId') as string;
		if (!addressId) {
			return fail(400, { addressId, missing: true });
		}
		const success = await medusa.deleteAddress(locals, addressId);
		return { success };
	},

	changePassword: async ({ request, locals }) => {
		console.log('Change Password action');
		const changePasswordForm = await superValidate(request, changePasswordSchema); // Validator checks that newPassword === confirmPassword
		if (!changePasswordForm.valid) return message(changePasswordForm, 'Invalid form', { status: 400 });
		const { newPassword } = changePasswordForm.data as { newPassword: string };
		const success = await medusa.editCustomer(locals, { password: newPassword });
		if (!success) return message(changePasswordForm, 'Something went wrong', { status: 500 });
		return { changePasswordForm };
	}
};
