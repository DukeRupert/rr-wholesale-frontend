import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import type { Infer } from 'sveltekit-superforms';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
	updatePasswordSchema,
} from '$lib/validators/account';
import medusa from '$lib/medusa';

export const load: PageServerLoad = async function ({ url, locals }) {
	if (!locals.user) throw redirect(307, '/auth');
    let rurl = url.searchParams.get('rurl') || '';

	// Setup forms
	const form = await superValidate<Infer<typeof updatePasswordSchema>>(
		zod(updatePasswordSchema)
	);

	return {
		user: locals.user,
		form,
        rurl
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		console.log('Update Password action');
		// Validator checks that newPassword === confirmPassword
		const update_password_form = await superValidate(request, zod(updatePasswordSchema));
		if (!update_password_form.valid)
			return message(update_password_form, { type: 'error', text: 'Invalid form' });
		const payload = { password: update_password_form.data.newPassword };
		const res = await medusa.customers.updateCustomer(locals, payload);
		if (res === null) return message(update_password_form, { type: 'error', text: 'Server error' });
		throw redirect(302, "/")
	}
};