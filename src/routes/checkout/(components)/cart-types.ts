import type { Cart } from '@medusajs/medusa/dist/models/cart';

export type Cart_Update_Response =
	| {
			success: true;
			cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
	  }
	| {
			success: false;
			cart: null;
	  };
