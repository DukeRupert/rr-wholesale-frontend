import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { contactSalesSchema } from '$lib/validators/auth';

export const load: PageServerLoad = async ({ locals, url }) => {
	let rurl = url.searchParams.get('rurl') || '';

	// If logged in, redirect to return url or home
	if (locals.user) {
		throw redirect(302, `/${rurl}`);
	}

	const form = await superValidate(contactSalesSchema);

	return {
		rurl,
		form
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		console.log('Contact sales action');
		const form = await superValidate(request, contactSalesSchema);
		if (!form.valid) return message(form, 'Something went wrong', { status: 500 }); // this shouldn't happen because of client-side validation
		console.log('Form valid. Checking for bots');
		// Todo
		console.log('Sending message');
		return { success: true, form}
		// if (res) {
		// 	throw redirect(302, `/${form.data.rurl}`);
		// } else {
		// 	return message(form, 'Invalid email/password combination', { status: 401 });
		// }
	},
};
