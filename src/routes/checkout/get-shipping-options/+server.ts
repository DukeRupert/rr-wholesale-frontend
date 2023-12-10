import type { RequestHandler } from './$types';
import medusa from '$lib/server/medusa';
import { error, json } from '@sveltejs/kit';
import type { ShippingOption } from '$lib/types/cart';

export const GET: RequestHandler = async ({ request, locals }) => {
	let shippingOptions = (await medusa.getShippingOptions(locals)) as ShippingOption[];

	if (shippingOptions) {
		return json(shippingOptions);
	} else {
		throw error(404, 'not found');
	}
};
