// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { Customer } from '@medusajs/medusa/dist/models/customer';
import type { Cart } from '@medusajs/medusa/dist/models/cart';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			sid: string;
			cartId: string;
			user: Customer | null;
			cart: Cart | null;
		}
		namespace Superforms {
			type Message = {
				type: 'error' | 'success' | 'warning';
				text: string;
			};
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
