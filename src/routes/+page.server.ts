import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import medusaClient from '$lib/medusaClient';

export const load: PageServerLoad = async function () {
	console.log('Fetching products')
	let products = await medusaClient.getProducts();
	// console.log(products)

	// if (!products || products.length < 1) throw error(500, 'No products found.');

	return {
		products
	};
};
