import type { PageServerLoad, Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { loginPostReq } from '$lib/validators/auth';
import medusa from '$lib/server/medusa';

export const load: PageServerLoad = async ({ locals, url }) => {
	let rurl = url.searchParams.get('rurl') || '';
	let code = url.searchParams.get('code') || '';

	// If logged in, redirect to return url or home
	if (locals.user) {
		throw redirect(302, `/${rurl}`);
	}

	const form = await superValidate(loginPostReq);

	return {
		rurl,
		code,
		form
	};
};

export const actions: Actions = {
	login: async ({ request, locals, cookies }) => {
		console.log('Login action');
		const form = await superValidate(request, loginPostReq);
		if (!form.valid) return message(form, 'Something went wrong', { status: 500 }); // this shouldn't happen because of client-side validation
		console.log('Form valid. Calling medusa');
		const res = await medusa.login(locals, cookies, form.data.email, form.data.password);
		console.log('Medusa response', res);
		if (res) {
			throw redirect(302, `/${form.data.rurl}`);
		} else {
			return message(form, 'Invalid email/password combination', { status: 401 });
		}
	},

	logout: async ({ locals, cookies }) => {
		if (await medusa.logout(locals, cookies)) {
			throw redirect(302, '/auth/login');
		} else throw error(500, 'server error');
	}
};
