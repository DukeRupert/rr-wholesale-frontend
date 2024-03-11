import { json } from '@sveltejs/kit';
import medusa from '$lib/medusa.js';
import type { StoreCartsRes } from '@medusajs/medusa';
import type { UpdateLineItemParams, DeleteLineItemParams } from '$lib/medusaClient/types.js';

export async function POST({ request, locals }) {
	const data = await request.json();
	const cart_id = locals?.cartId ?? '';
	const line_item_id = data?.line_item_id ?? '';
	const quantity = data?.quantity ?? 0;
	if (!cart_id || !line_item_id || !quantity) return json({ success: false });
	console.log(
		`Send request to update cart: ${cart_id}, line item: ${line_item_id} to quantity: ${quantity}`
	);
	let res: StoreCartsRes | null = null;
	if (quantity === 0) {
		const params: DeleteLineItemParams = {
			cart_id,
			line_item_id
		};
		res = await medusa.carts.lineItems.delete(params);
	} else if (quantity > 0) {
		const params: UpdateLineItemParams = {
			cartId: cart_id,
			lineItemId: line_item_id,
			quantity
		};
		res = await medusa.carts.lineItems.update(params);
	}
	if (res === null) return json({ success: false });
	const { cart } = res;
	locals.cart = cart;
	locals.cartId = cart.id;
	return json({
		success: true
	});
}
