// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Cart } from '$lib/types/cart';
import type { User } from '$lib/types/user';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			sid: string;
			cartid: string;
			user: User | null;
			cart: Cart | null;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
