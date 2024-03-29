import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import medusa from '$lib/medusa';

export const load: PageServerLoad = async ({ url }) => {
	// get query params
	let l = url.searchParams.get('limit') || '20';
	let o = url.searchParams.get('offset') || '0';
	let limit = parseInt(l) || 20;
	let offset = parseInt(o) || 0;
	// fetch products
	const res = await medusa.products.list({limit, offset, region_id: "na"});
	if (res !== null) {
		const { products, limit, offset, count } = res;
		return {
			products
		};
	}
	throw error(500, 'No products found.');
};
