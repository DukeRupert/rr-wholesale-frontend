import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import cart from '$lib/dev/DummyCart.json'


export const load: PageServerLoad = async function ({ locals }) {
	if (!locals.user) throw redirect(302, '/auth?rurl=checkout');

	return {
		user: locals.user,
		cart: cart
	};
};