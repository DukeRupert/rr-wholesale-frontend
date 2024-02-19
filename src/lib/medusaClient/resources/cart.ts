import BaseResource from './base';
import LineItemsResource from './line-items';
import type {
	StoreCartsRes,
	StorePostCartsCartReq,
	StoreCompleteCartRes,
	StorePostCartsCartShippingMethodReq,
	StorePostCartsCartPaymentSessionReq
} from '@medusajs/medusa';
import type { Cookies } from '@sveltejs/kit';
import type { AddToCartParams } from '../types';



class CartResource extends BaseResource {
	public lineItems = new LineItemsResource(this.medusa);

	invalidateCart(locals: App.Locals, cookies: Cookies): void {
		cookies.set('cartId', '', {
			path: '/',
			maxAge: 0,
			sameSite: 'strict',
			httpOnly: true,
			secure: true
		});
		// reset locals
		locals.cartId = '';
		locals.cart = null;
		return;
	}

	async addShippingMethod(locals: App.Locals, option_id: string): Promise<StoreCartsRes | null> {
		console.log('Add a shipping method to the cart.');
		if (!locals.cartId || !option_id) return null;
		try {
			let payload: StorePostCartsCartShippingMethodReq = {
				option_id,
				data: {}
			};
			const res = await this.medusa.client.carts.addShippingMethod(locals.cartId, payload);
			if (res.response.status !== 200) {
				throw new Error(`List shipping options failed: API responded with ${res.response.status}`);
			}
			return res;
		} catch (error) {
			console.error('Error: failed addShippingMethod()', error);
			return null;
		}
	}
	/**
	 * Creates a new shopping cart.
	 *
	 * @param locals - An App.Locals object (define any relevant properties for this)
	 * @param cookies - A Cookies object for managing cart cookies
	 * @returns A Promise that resolves to a StoreCartsRes object containing the newly created cart, or null if the operation fails.
	 * @throws {Error} If the API call for cart creation fails.
	 */
	async create(locals: App.Locals, cookies: Cookies): Promise<StoreCartsRes | null> {
		try {
			const { cart, response } = await this.medusa.client.carts.create();

			if (response.status !== 200) {
				throw new Error(`Cart creation failed: API responded with ${response.status}`);
			}

			cookies.set('cartid', cart.id, {
				path: '/',
				maxAge: 60 * 60 * 24 * 400,
				sameSite: 'strict',
				httpOnly: true,
				secure: true
			});

			locals.cartId = cart.id;
			locals.cart = cart;

			return { cart };
		} catch (error) {
			console.error('Error createCart()', error);
			return null;
		}
	}

	/**
	 * Adds an item to the shopping cart, either by creating a new line item or updating the quantity of an existing one.
	 *
	 * @param locals - An App.Locals object (define relevant properties)
	 * @param cookies - A Cookies object for managing cart cookies
	 * @param params - An AddToCartParams object containing variantId, and optionally quantity
	 * @returns A Promise that resolves to a StoreCartsRes object containing the updated cart, or null if the operation fails.
	 * @throws {Error} If variantId is missing.
	 * @throws {Error} If cart creation fails (if a cart didn't already exist).
	 * @throws {Error} If line item creation or update fails due to API errors.
	 */
	async addToCart(
		locals: App.Locals,
		cookies: Cookies,
		params: AddToCartParams
	): Promise<StoreCartsRes | null> {
		console.log(`Adding ${params.variant_id} to cart.`);

		if (!params.variant_id) {
			throw new Error('Missing variantId');
		}

		try {
			// Ensure a cart exists
			let cart = locals.cart;
			if (!cart) {
				const response = await this.create(locals, cookies);
				if (!response) throw new Error('Cart creation failed');
				cart = response.cart;
			}

			// Find existing line item if possible
			const lineItem = cart.items.find((el) => el.variant_id === params.variant_id);

			if (lineItem) {
				// Update existing item
				return await this.lineItems.update({
					cartId: cart.id,
					lineItemId: lineItem.id,
					quantity: params.quantity + lineItem.quantity
				});
			} else {
				// Create new item
				return await this.lineItems.create({
					cartId: cart.id,
					variantId: params.variant_id,
					quantity: params.quantity ?? 1
				});
			}
		} catch (error) {
			console.error('Error: failed addToCart()', error);
			return null;
		}
	}
	async createPaymentSessions(locals: App.Locals): Promise<StoreCartsRes | null> {
		console.log('Creating payment sessions.');
		if (!locals.cartId) {
			return null;
		}
		try {
			const res = await this.medusa.client.carts.createPaymentSessions(locals.cartId);

			if (res.response.status !== 200) {
				throw new Error(
					`Create payment sessions failed: API responded with ${res.response.status}`
				);
			}

			return res;
		} catch (error) {
			console.error('Error: failed deleteAddress()', error);
			return null;
		}
	}
	async setPaymentSession(locals: App.Locals, provider_id: string): Promise<StoreCartsRes | null> {
		console.log('Set payment session.');
		if (!locals.cartId || !provider_id) {
			return null;
		}
		try {
			const payload: StorePostCartsCartPaymentSessionReq = {
				provider_id
			};
			const res = await this.medusa.client.carts.setPaymentSession(locals.cartId, payload);

			if (res.response.status !== 200) {
				throw new Error(`Set payment session failed: API responded with ${res.response.status}`);
			}

			return res;
		} catch (error) {
			console.error('Error: failed setPaymentSession()', error);
			return null;
		}
	}
	/**
	 * Retrieves the specified cart.
	 *
	 * @param locals - An App.Locals object likely containing the cartId
	 * @returns A Promise that resolves to a StoreCartsRes object (if the cart is valid), or null if the cart is not found, doesn't exist, is completed, or an API error occurs.
	 * @throws {Error} If the API call fails with a non-200 status code.
	 */
	async retrieve(locals: App.Locals): Promise<StoreCartsRes | null> {
		console.log('Retrieve cart');

		// Validation - Early Exit
		if (!locals.cartId) {
			return null; // Cart ID is mandatory
		}

		try {
			const res = await this.medusa.client.carts.retrieve(locals.cartId);

			if (res.response.status !== 200) {
				throw new Error(`API call failed: ${res.response.status}`);
			}

			// Cart Completion Check
			if (res.cart && res.cart.completed_at) {
				return null; // Cart is considered invalid if already completed
			}

			return res;
		} catch (error) {
			console.error('Error: failed retrieveCart()', error);
			return null;
		}
	}
	/**
	 * Updates details of the specified cart.
	 *
	 * @param locals - An App.Locals object likely containing the cartId
	 * @param payload - A StorePostCartsCartReq object holding cart update data
	 * @returns A Promise that resolves to a StoreCartsRes object on success, or null if cart ID is missing, update fails, or an API error occurs.
	 * @throws {Error} If the cartId is missing.
	 * @throws {Error} If the API call fails with a non-200 status code.
	 */
	async update(
		locals: App.Locals,
		payload: StorePostCartsCartReq
	): Promise<StoreCartsRes | null> {
		console.log('Update cart details.');

		// Validation - Early Exit
		if (!locals.cartId) {
			return null; // Cart ID is mandatory
		}

		try {
			const res = await this.medusa.client.carts.update(locals.cartId, payload);

			if (res.response.status !== 200) {
				throw new Error(`API call failed: ${res.response.status}`);
			}

			return res;
		} catch (error) {
			console.error('Error: failed updateCart()', error);
			return null;
		}
	}

	async complete(locals: App.Locals): Promise<StoreCompleteCartRes | null> {
		console.log('Complete cart.');

		// Validation - Early Exit
		if (!locals.cartId) {
			return null; // Cart ID is mandatory
		}

		try {
			const res = await this.medusa.client.carts.complete(locals.cartId);

			if (res.response.status !== 200) {
				throw new Error(`API call failed: ${res.response.status}`);
			}

			return res;
		} catch (error) {
			console.error('Error: failed completeCart()', error);
			return null;
		}
	}
}

export default CartResource;
