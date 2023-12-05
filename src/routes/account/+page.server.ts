import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import medusa from '$lib/server/medusa';
import { superValidate, message } from 'sveltekit-superforms/server';
import { editUser, changePassword, addShippingAddress } from '$lib/validators/account';
import type { Address, Customer } from '@dukerupert/sveltekit-medusa-client';

export const load: PageServerLoad = async function ({ url, locals }) {
	if (!locals.user) throw redirect(307, '/auth');
	return {
		user: locals.user,
		currentPage: parseInt(url.searchParams?.get('page') as string) || 1
	};
};

export const actions: Actions = {
	editInfo: async ({ request, locals }) => {
		console.log('Edit User Info');
		const form = await superValidate(request, editUser);
		if (!form.valid) return message(form, 'Invalid form', { status: 400 });
		const customer = form.data as Customer;
		const success = await medusa.editCustomer(locals, customer);
		if (!success) return message(form, 'Something went wrong', { status: 500 });
		return { success };
	},

	addAddress: async ({ request, locals }) => {
		console.log('Add Address action');
		const form = await superValidate(request, addShippingAddress);
		if (!form.valid) return message(form, 'Invalid address', { status: 400 });
		const address = form.data as Address;
		const success = (await medusa.addShippingAddress(locals, address)) as boolean;
		if (!success) return message(form, 'Something went wrong', { status: 500 });
		return { success };
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
		const form = await superValidate(request, changePassword); // Validator checks that newPassword === confirmPassword
		if (!form.valid) return message(form, 'Invalid form', { status: 400 });
		const { newPassword } = form.data as { newPassword: string };
		const success = await medusa.editCustomer(locals, { password: newPassword });
		if (!success) return message(form, 'Something went wrong', { status: 500 });
		return { success };
	}
};
