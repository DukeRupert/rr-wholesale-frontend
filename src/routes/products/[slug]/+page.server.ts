import type { PageServerLoad, Actions } from './$types';
import type { AddToCartParams } from '$lib/medusaClient/types.js';
import { message, superValidate } from 'sveltekit-superforms';
import { z } from 'zod';
import { zod } from 'sveltekit-superforms/adapters';
import { baseSchema } from './+page.svelte';
import medusa from '$lib/medusa';
import { error } from '@sveltejs/kit';

export const load = (async ({ params, url }) => {
	const { slug } = params;
	const segments = url.pathname.split('/').filter((el) => el);

	// fetch products
	const res = await medusa.products.list({
		handle: slug,
		currency_code: 'usd',
		expand: 'images,variants,variants.options,options'
	});

	if (res === null) throw error(500, 'A server error has occured.');

	const { products } = res;
	if (products.length < 1) throw error(500, 'No products found.');
	const product = products[0];
	const { options } = product;
	if (!options) throw error(500, 'No product options found.');
	// create dynamic schema
	const dynamicSchema = z.object(Object.fromEntries(options.map((el) => [el.title, z.string()])));
	// combine with base schema
	const schema = Object.assign(baseSchema);
	// create form
	const form = await superValidate(zod(baseSchema));
	return {
		product: res.products[0],
		segments,
		form
	};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		// handle form data
		const form = await superValidate(request, zod(baseSchema));
		console.log(form.data);
		// server side validation
		if (!form.valid)
			return message(form, { type: 'warning', text: 'Invalid form' }, { status: 400 });
		// build payload
		const params: AddToCartParams = {
			variant_id: form.data.variant_id,
			quantity: form.data.quantity
		};
		console.log('Calling medusa with params: ');
		console.log(params);
		// call medusa
		const res = await medusa.carts.addToCart(locals, cookies, params);
		// handle error
		if (res === null) return message(form, { type: 'error', text: 'Invalid credentials' });
		// success
		return message(form, { type: 'success', text: 'Added to cart' });
	}
};
