import type { PageServerLoad, Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import type { Infer } from 'sveltekit-superforms'
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginPostReq } from '$lib/validators/auth';
import medusa from '$lib/server/medusa';
import medusaClient from '$lib/medusaClient';

type Message = { status: 'success' | 'failure', text: string }

export const load: PageServerLoad = async ({ locals, url }) => {
	let rurl = url.searchParams.get('rurl') || '';
	let code = url.searchParams.get('code') || '';
	let username = url.searchParams.get('username') || '';
	let pwd = url.searchParams.get('pwd') || '';

	// If logged in, redirect to return url or home
	if (locals.user) {
		throw redirect(302, `/${rurl}`);
	}

	const form = await superValidate<Infer<typeof loginPostReq>, Message>({email: username, password: pwd}, zod(loginPostReq), { errors: false });

	return {
		rurl,
		code,
		form
	};
};

export const actions: Actions = {
	login: async ({ request, locals, cookies }) => {
		console.log('Login action');
		const form = await superValidate(request, zod(loginPostReq));
		if (!form.valid) return message(form, 'Something went wrong', { status: 500 }); // this shouldn't happen because of client-side validation
		console.log('Form valid. Calling medusa');
		const res = await medusaClient.login(locals, cookies, form.data.email, form.data.password);
		if (res) {
			console.log(`Login success. Redirect to /${form.data.rurl}`)
			throw redirect(302, `/${form.data.rurl}`);
		} else {
			return message(form, 'Invalid email/password combination', { status: 401 });
		}
	},

	logout: async ({ locals, cookies }) => {
		if (await medusaClient.logout(locals, cookies)) {
			throw redirect(302, '/auth/login');
		} else throw error(500, 'server error');
	}
};
