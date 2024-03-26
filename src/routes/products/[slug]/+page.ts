import type { PageLoad } from './$types';
import { generateBreadcrumbs } from '$lib/utilities';

export const load = (async ({ params, url }) => {
	const { slug } = params;
	const segments =  url.pathname.split('/').filter((el) => el)
	return { slug, segments };
}) satisfies PageLoad;
