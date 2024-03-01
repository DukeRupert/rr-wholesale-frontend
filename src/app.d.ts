// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { ExtendedCustomer } from "$lib/types/app";
import type { Cart } from '@medusajs/medusa/dist/models/cart'

export interface MessageType {
	type: 'success' | 'error' | 'warning';
	text: string;
}

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			sid: string | null;
			cartId: string | null;
			user: ExtendedCustomer | null;
			cart: Omit<Cart, "refundable_amount" | "refunded_total"> | null;
		}
		namespace Superforms {
			type Message = MessageType
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
