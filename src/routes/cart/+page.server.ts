import type { Actions } from './$types';
import medusaClient from '$lib/medusaClient';
import type { StoreCartsRes } from '@medusajs/medusa';

export const actions: Actions = {
	add: async ({ request, locals, cookies }) => {
		const data = await request.formData();
		const variantId = data.get('variantId') as string;
		const quantity = parseInt(data.get('quantity') as string);
		const res = await medusaClient.addToCart(locals, cookies, variantId, quantity);
		if (res !== null) {
			const { cart } = res;
			return {
				cart,
				success: true
			};
		}
		return { success: false };
	},

	remove: async ({ request, locals }) => {
		const data = await request.formData();
		const itemId = (data.get('itemId') as string) || '';
		const res = await medusaClient.deleteLineItem(locals, itemId);
		if (res !== null) {
			const { cart } = res;
			return {
				cart,
				success: true
			};
		}
		return { success: false };
	},

	update: async ({ request, locals }) => {
		const data = await request.formData();
		const itemId = data.get('itemId') as string;
		const quantity = parseInt(data.get('quantity') as string);
		let res: StoreCartsRes | null = null;
		if (quantity === 0) {
			res = await medusaClient.deleteLineItem(locals, itemId);
		} else if (quantity > 0) {
			res = await medusaClient.updateLineItem(locals, itemId, quantity);
		}
		if (res !== null) {
			const { cart } = res;
			return {
				cart,
				success: true
			};
		}
		return { success: false };
	}
};
