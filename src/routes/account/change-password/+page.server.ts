import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import medusa from '$lib/server/medusa';
import { superValidate, message } from 'sveltekit-superforms/server';
import { updatePasswordSchema } from '$lib/validators/account';

export const load: PageServerLoad = async function ({ url, locals }) {
	if (!locals.user) throw redirect(307, '/auth');

	// Setup forms
	const form = await superValidate(updatePasswordSchema)

	return {
		user: locals.user,
		form
	};
};

export const actions: Actions = {
	updatePassword: async ({ request, locals }) => {
		console.log('Update Password action');
		// Validator checks that newPassword === confirmPassword
		const form = await superValidate(request, updatePasswordSchema);
		if (!form.valid) return message(form, 'Invalid form', { status: 400 });
		const { newPassword } = form.data as { newPassword: string };
		const success = await medusa.editCustomer(locals, { password: newPassword });
		if (!success) return message(form, 'Something went wrong', { status: 500 });
		return { form };
	},
};