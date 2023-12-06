import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async function ({ url, locals }) {
	if (!locals.user) throw redirect(307, '/auth');

	return {
		user: locals.user,
		currentPage: parseInt(url.searchParams?.get('page') as string) || 1,
	};
};