import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import type { Infer } from 'sveltekit-superforms';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { forgotPostReq } from '$lib/validators/auth';
import medusaClient from '$lib/medusaClient';

export const load: PageServerLoad = async ({ locals, url }) => {
	let rurl = url.searchParams.get('rurl') || '';
	let code = url.searchParams.get('code') || '';

	// If logged in, redirect to return url or home
	if (locals.user) {
		throw redirect(302, `/${rurl}`);
	}

	const form = await superValidate<Infer<typeof forgotPostReq>>(zod(forgotPostReq));

	return {
		rurl,
		code,
		form
	};
};

export const actions: Actions = {
	forgot: async ({ request }) => {
		const form = await superValidate(request, zod(forgotPostReq));
		if (!form.valid) return message(form, { type: 'error', text: 'Something went wrong' });
		const res = await medusaClient.generatePasswordToken(form.data.email);
		if (res === null) return message(form, { type: 'error', text: 'Failed to send email' });
		return message(form, {
			type: 'success',
			text: 'A reset code has been sent to your email address'
		});
	}
};
