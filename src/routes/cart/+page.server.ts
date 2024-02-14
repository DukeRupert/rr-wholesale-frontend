import type { Actions } from './$types';
import medusaClient from '$lib/medusaClient';
import type {
	AddToCartParams,
	DeleteLineItemParams,
	UpdateLineItemParams
} from '$lib/medusaClient';
import type { StoreCartsRes } from '@medusajs/medusa';

export const actions: Actions = {
	add: async ({ request, locals, cookies }) => {
		const data = await request.formData();
		const variantId = data.get('variantId') as string;
		const quantity = parseInt(data.get('quantity') as string);
		if (!variantId || !quantity) return { success: false };
		const params: AddToCartParams = {
			variantId,
			quantity
		};
		const res = await medusaClient.addToCart(locals, cookies, params);
		if (res === null) return { success: false };
		const { cart } = res;
		locals.cart = cart;
		locals.cartId = cart.id;
		return {
			cart,
			success: true
		};
	},

	remove: async ({ request, locals }) => {
		const data = await request.formData();
		const cartId = locals.cartId;
		const lineItemId = (data.get('itemId') as string) || '';
		if (!cartId || !lineItemId) return { success: false };
		const params: DeleteLineItemParams = {
			cartId,
			lineItemId
		};
		const res = await medusaClient.deleteLineItem(params);
		if (res === null) return { success: false };
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
		const cartId = locals.cartId;
		const lineItemId = data.get('itemId') as string;
		const quantity = parseInt(data.get('quantity') as string);
		if (!cartId || !lineItemId || !quantity) return { success: false };
		let res: StoreCartsRes | null = null;
		if (quantity === 0) {
			const params: DeleteLineItemParams = {
				cartId,
				lineItemId
			};
			res = await medusaClient.deleteLineItem(params);
		} else if (quantity > 0) {
			const params: UpdateLineItemParams = {
				cartId,
				lineItemId,
				quantity
			};
			res = await medusaClient.updateLineItem(params);
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
