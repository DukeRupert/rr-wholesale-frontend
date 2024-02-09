import type { PageServerLoad, Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { loginPostReq } from '$lib/validators/auth';
import medusa from '$lib/server/medusa';
import medusaClient from '$lib/medusaClient';

export const load: PageServerLoad = async ({ locals, url }) => {
	let rurl = url.searchParams.get('rurl') || '';
	let code = url.searchParams.get('code') || '';
	let username = url.searchParams.get('username') || '';
	let pwd = url.searchParams.get('pwd') || '';

	// If logged in, redirect to return url or home
	if (locals.user) {
		throw redirect(302, `/${rurl}`);
	}

	const form = await superValidate({ email: username, password: pwd }, loginPostReq);

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
		const res = await medusaClient.login(locals, cookies, form.data.email, form.data.password);
		console.log('Medusa response', res);
		if (res) {
			throw redirect(302, `/${form.data.rurl}`);
		} else {
			return message(form, 'Invalid email/password combination', { status: 401 });
		}
	},

	logout: async ({ locals, cookies }) => {
		if (await medusaClient.logout(locals, cookies)) {
			console.log(`Locals after logout: ${JSON.stringify(locals, null, 2)}`)
			throw redirect(302, '/auth/login');
		} else throw error(500, 'server error');
	}
};
