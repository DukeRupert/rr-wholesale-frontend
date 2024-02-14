import type { PageServerLoad, Actions } from './$types';
import type { Infer } from 'sveltekit-superforms';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { redirect } from '@sveltejs/kit';
import { contactSalesSchema } from '$lib/validators/auth';

export const load: PageServerLoad = async ({ locals, url }) => {
	let rurl = url.searchParams.get('rurl') || '';

	// If logged in, redirect to return url or home
	if (locals.user) {
		throw redirect(302, `/${rurl}`);
	}

	const form = await superValidate<Infer<typeof contactSalesSchema>>(zod(contactSalesSchema));

	return {
		rurl,
		form
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		console.log('Contact sales action');
		const form = await superValidate(request, zod(contactSalesSchema));
		if (!form.valid) return message(form, { type: 'error', text: 'Something went wrong' }); // this shouldn't happen because of client-side validation
		console.log('Form valid. Checking for bots');
		// Todo: Connect to postmark
		console.log('Sending message');
		return { success: true, form}
	},
};
