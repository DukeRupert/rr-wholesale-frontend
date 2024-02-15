import type { RequestHandler } from './$types';
import medusaClient from '$lib/medusaClient';
import { error, json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, locals }) => {
	const listShippingOptionsResponse = await medusaClient.listShippingOptions(locals);
	if (listShippingOptionsResponse === null)
		throw error(400, { message: 'Could not fetch shipping options' });
	const { shipping_options } = listShippingOptionsResponse;

	return json(shipping_options);
};
