import type { Actions } from './$types';
import type { StoreCartsRes } from '@medusajs/medusa';
import type {
	AddToCartParams,
	DeleteLineItemParams,
	UpdateLineItemParams
} from '$lib/medusaClient';
import medusa from '$lib/medusa';

export const actions: Actions = {
	add: async ({ request, locals, cookies }) => {
		const data = await request.formData();
		const variant_id = data.get('variantId') as string;
		const quantity = parseInt(data.get('quantity') as string);
		if (!variant_id || !quantity) return { success: false };
		const params: AddToCartParams = {
			variant_id,
			quantity
		};
		const res = await medusa.carts.addToCart(locals, cookies, params);
		if (res === null) return { success: false };
		const { cart } = res;
		locals.cart = cart;
		locals.cartId = cart.id;
		return {
			cart,
			success: true
		};
	},

	remove: async ({ request, locals, cookies }) => {
		const data = await request.formData();
		const cart_id = locals.cartId;
		const line_item_id = (data.get('itemId') as string) || '';
		if (!cart_id || !line_item_id) return { success: false };
		const params: DeleteLineItemParams = {
			cart_id,
			line_item_id
		};
		const res = await medusa.carts.lineItems.delete(params);
		if (res === null) {
			medusa.carts.invalidateCart(locals, cookies)
			return { success: false };
		} 
		const { cart } = res;
		locals.cart = cart;
		locals.cartId = cart.id;
		return {
			cart,
			success: true
		};
	},

	update: async ({ request, locals }) => {
		const data = await request.formData();
		const cart_id = locals.cartId;
		const line_item_id = data.get('itemId') as string;
		const quantity = parseInt(data.get('quantity') as string);
		if (!cart_id || !line_item_id || !quantity) return { success: false };
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
		if (res === null) return { success: false };
		const { cart } = res;
		locals.cart = cart;
		locals.cartId = cart.id;
		return {
			cart,
			success: true
		};
	}
};
