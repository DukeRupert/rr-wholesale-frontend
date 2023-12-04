import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
export const load: PageServerLoad = async ({ locals }) => {
	// If logged in, redirect to return url or home
	if (locals.user) {
		throw redirect(302, `/`);
	}

    throw redirect(302, `/auth/login`);
};