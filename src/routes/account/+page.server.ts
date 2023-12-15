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
	const addAddressForm = await superValidate(shippingAddressSchema)

	return {
		user: locals.user,
		currentPage: parseInt(url.searchParams?.get('page') as string) || 1,
		updateUserForm,
		updatePasswordForm,
		addAddressForm
	};
};

export const actions: Actions = {
	updateUser: async ({ request, locals }) => {
		console.log('Edit User Info');
		const updateUserForm = await superValidate(request, updateUserSchema);
		if (!updateUserForm.valid) return message(updateUserForm, 'Invalid form', { status: 400 });
		const customer = updateUserForm.data as Customer;
		const success = await medusa.editCustomer(locals, customer);
		if (!success) return message(updateUserForm, 'Please try again later.', { status: 500 });
		console.log("success")
		return { updateUserForm };
	},

	addAddress: async ({ request, locals }) => {
		console.log('Add Address action');
		const addAddressForm = await superValidate(request, shippingAddressSchema);
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

	updatePassword: async ({ request, locals }) => {
		console.log('Change Password action');
		const updatePasswordForm = await superValidate(request, updatePasswordSchema); // Validator checks that newPassword === confirmPassword
		if (!updatePasswordForm.valid) return message(updatePasswordForm, 'Invalid form', { status: 400 });
		const { newPassword } = updatePasswordForm.data as { newPassword: string };
		const success = await medusa.editCustomer(locals, { password: newPassword });
		if (!success) return message(updatePasswordForm, 'Something went wrong', { status: 500 });
		return { updatePasswordForm };
	},

	registerUser: async({ request, cookies, locals}) => {
		console.log('Register customer action');
		const form = await superValidate(request, registerSchema);
		if (!form.valid) return message(form, 'Something went wrong', { status: 500 }); // this shouldn't happen because of client-side validation
		const user = {
			first_name: form.data.first_name,
			last_name: form.data.last_name,
			email: form.data.email,
			password: form.data.password
		}
		const res = await medusa.register(locals, cookies, user);
		if (res) {
			return { success: true }	
		} else {
			return message(form, 'Failed to register new user.', { status: 401 });
		}
	}
};
