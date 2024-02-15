import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import type { Infer } from 'sveltekit-superforms';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { resetPostReq } from '$lib/validators/auth';
import medusaClient from '$lib/medusaClient';

export const load: PageServerLoad = async ({ locals, url }) => {
	let rurl = url.searchParams.get('rurl') || '';
	let token = url.searchParams.get('token') || '';
	let email = url.searchParams.get('email') || '';

	// If logged in, redirect to return url or home
	if (locals.user) {
		throw redirect(302, `/${rurl}`);
	}

	const form = await superValidate<Infer<typeof resetPostReq>>(
		{ token, email },
		zod(resetPostReq),
		{ errors: false }
	);

	return {
		rurl,
		token,
		form
	};
};

export const actions: Actions = {
	reset: async ({ request, locals, cookies }) => {
		const form = await superValidate(request, zod(resetPostReq));
		if (!form.valid) return message(form, { type: 'error', text: 'Something went wrong' });
		const { token, email, password } = form.data;
		const payload = {
			token,
			email,
			password
		};
		const res = await medusaClient.resetPassword(payload);
		if (res === null) return message(form, { type: 'error', text: 'Failed to update password' });

		throw redirect(302, `/${form.data.rurl}`);
	}
};
