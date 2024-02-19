import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import medusa from '$lib/medusa';

export const GET: RequestHandler = async ({ request, locals }) => {
	const listShippingOptionsResponse = await medusa.shippingOptions.listCartOptions(locals);
	if (listShippingOptionsResponse === null)
		throw error(400, { message: 'Could not fetch shipping options' });
	const { shipping_options } = listShippingOptionsResponse;

	return json(shipping_options);
};
