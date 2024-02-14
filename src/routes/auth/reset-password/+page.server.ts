import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import type { Infer } from 'sveltekit-superforms';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { resetPostReq } from '$lib/validators/auth';
import medusa from '$lib/server/medusa';

export const load: PageServerLoad = async ({ locals, url }) => {
	let rurl = url.searchParams.get('rurl') || '';
	let code = url.searchParams.get('code') || '';

	// If logged in, redirect to return url or home
	if (locals.user) {
		throw redirect(302, `/${rurl}`);
	}

	const form = await superValidate<Infer<typeof resetPostReq>>(zod(resetPostReq));

	return {
		rurl,
		code,
		form
	};
};

export const actions: Actions = {
	reset: async ({ request, locals, cookies }) => {
		const form = await superValidate(request, zod(resetPostReq));
		if (!form.valid) return message(form, { type: 'error', text: 'Something went wrong' }); // this shouldn't happen because of client-side validation
		if (await medusa.login(locals, cookies, form.data.email, form.data.password)) {
			throw redirect(302, `/${form.data.rurl}`);
		} else {
			return message(form, { type: 'error', text: 'Invalid email/password combination' });
		}
	}
};
