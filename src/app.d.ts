// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Cart } from '$lib/types/cart';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			sid: string;
			cartid: string;
			user: any;
			cart: Cart | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
