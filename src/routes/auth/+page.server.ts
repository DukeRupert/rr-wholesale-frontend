import type { PageServerLoad, Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from './login-form.svelte';
import medusa from '$lib/medusa';

export const load: PageServerLoad = async ({ locals, url }) => {
	let rurl = url.searchParams.get('rurl') || '';
	// If logged in, redirect to return url or home
	if (locals.user) {
		throw redirect(302, `/${rurl}`);
	}

	// Need to return an undefined payload instead of empty strings
	// in order to avoid errors appearing on every page load without
	// params
	const build_payload = (email: string, password: string) => {
		if (email !== '' || password !== '') {
			return { email, password };
		} else {
			return undefined;
		}
	};
	let email = url.searchParams.get('username') || '';
	let password = url.searchParams.get('pwd') || '';
	const payload = build_payload(email, password);

	const form = await superValidate(payload, zod(loginSchema));

	return {
		form
	};
};

export const actions: Actions = {
	login: async ({ request, locals, cookies }) => {
		// handle form data
		const form = await superValidate(request, zod(loginSchema));
		// server side validation
		if (!form.valid)
			return message(form, { type: 'warning', text: 'Invalid form' }, { status: 400 });
		// call medusa
		const res = await medusa.auth.authenticate(
			locals,
			cookies,
			form.data.email,
			form.data.password
		);
		// handle error
		if (res === null) return message(form, { type: 'error', text: 'Invalid credentials' });
		// success
		return { form };
	},

	logout: async ({ locals, cookies }) => {
		console.log('Logout action');
		if (await medusa.auth.deleteSession(locals, cookies)) {
			throw redirect(302, '/auth');
		} else throw error(500, 'server error');
	}
};
