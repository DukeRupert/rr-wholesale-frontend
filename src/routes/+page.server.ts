import type { PageServerLoad } from './$types';
import medusa from '$lib/server/medusa';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async function () {
	let products = []
	// let products = await medusa.getProducts();

	if(!products || products.length < 1) throw error(500, "No products found.")

	return {
		products
	};
};
