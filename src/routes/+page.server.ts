import type { PageServerLoad } from './$types';
import type { PricedProduct } from '@medusajs/medusa/dist/types/pricing';
import { error } from '@sveltejs/kit';
import medusa from '$lib/medusa';

export const load: PageServerLoad = async ({ url }) => {
	// get query params
	let l = url.searchParams.get('limit') || '20';
	let o = url.searchParams.get('offset') || '0';
	let limit = parseInt(l) || 20;
	let offset = parseInt(o) || 0;
	// fetch products
	let products: PricedProduct[] = [];
	const res = await medusa.products.list(limit, offset);
	if (res !== null) {
		const { products, limit, offset, count } = res;
		return {
			products
		};
	}
	if (!products || products.length < 1) throw error(500, 'No products found.');
};
