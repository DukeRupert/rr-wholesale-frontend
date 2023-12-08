import type { PageServerLoad, Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { registerSchema} from '$lib/validators/auth';
import medusa from '$lib/server/medusa';

export const load: PageServerLoad = async ({ locals, url }) => {
	let rurl = url.searchParams.get('rurl') || '';
	let code = url.searchParams.get('code') || '';

	// If logged in, redirect to return url or home
	if (locals.user) {
		throw redirect(302, `/${rurl}`);
	}

	const form = await superValidate(registerSchema);

	return {
		rurl,
		code,
		form
	};
};

export const actions: Actions = {
	login: async ({ request, locals, cookies }) => {
		console.log('Register customer action');
		const form = await superValidate(request, registerSchema);
		if (!form.valid) return message(form, 'Something went wrong', { status: 500 }); // this shouldn't happen because of client-side validation
		console.log('Form valid. Calling medusa');
		const user = {
			first_name: form.data.first_name,
			last_name: form.data.last_name,
			email: form.data.email,
			password: form.data.password
		}
		const res = await medusa.register(locals, cookies, user);
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
