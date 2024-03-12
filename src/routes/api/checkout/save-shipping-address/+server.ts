import type { RequestHandler } from './$types';
import type { StorePostCustomersCustomerAddressesReq } from '@medusajs/medusa';
import { shippingAddressSchema } from '$lib/validators/account';
import { error, json } from '@sveltejs/kit';
import medusa from '$lib/medusa';

export const POST: RequestHandler = async ({ request, locals }) => {
	const data = await request.json();
	const address = shippingAddressSchema.safeParse(data);
	if (!locals.cartId || !address.success) {
		throw error(400, 'bad format');
	}

    const payload: StorePostCustomersCustomerAddressesReq = { address: { ...address.data, metadata: {}}}
	const res = await medusa.customers.addresses.addAddress(locals, payload) 
    if(res === null){
		throw error(500, 'Server error: save-shipping-address failed.');
	} else {
		return json({ success: true });
	}
};