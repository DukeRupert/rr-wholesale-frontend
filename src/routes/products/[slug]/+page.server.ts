import type { PageServerLoad } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import medusa from '$lib/medusa';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, url }) => {
	const { slug } = params;
	const segments = url.pathname.split('/').filter((el) => el);
	// fetch products
	const res = await medusa.products.list({
		handle: slug,
		currency_code: 'usd',
		expand: 'variants,variants.options,options',
	});
	if (res !== null) {
		const { products } = res;
		const product = products[0];
		const options = product?.options ?? [];
		// create schema
		const schema = z.object(Object.fromEntries(options.map((field) => [field.title, z.string()])));
		// create form
		const form = await superValidate(zod(schema));
		return {
			product,
			segments,
			form
		};
	}
	throw error(500, 'No product found.');
}) satisfies PageServerLoad;
