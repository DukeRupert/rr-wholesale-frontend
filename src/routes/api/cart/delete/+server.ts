import { json } from '@sveltejs/kit';
import medusa from '$lib/medusa.js';
import type { StoreCartsRes } from '@medusajs/medusa';
import type { UpdateLineItemParams, DeleteLineItemParams } from '$lib/medusaClient/types.js';

export async function POST({ request, locals }) {
	console.log('Delete cart item');
	const data = await request.json();
	const cart_id = locals?.cartId ?? '';
	const line_item_id = data?.line_item_id ?? '';
	if (!cart_id || !line_item_id) return json({ success: false });
	console.log(`Send request to update cart: ${cart_id}, delete line item: ${line_item_id}`);

	const params: DeleteLineItemParams = {
		cart_id,
		line_item_id
	};
	const res = await medusa.carts.lineItems.delete(params);

	if (res === null) return json({ success: false });
	const { cart } = res;
	locals.cart = cart;
	locals.cartId = cart.id;
	return json({
		success: true
	});
}
