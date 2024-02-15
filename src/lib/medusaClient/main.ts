import Medusa from '@medusajs/medusa-js';
import cookie from 'cookie';
import type { RequestEvent } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import type {
	StoreAuthRes,
	StoreCartsRes,
	StoreCustomersRes,
	StoreGetProductsParams,
	StorePostCustomersCustomerReq,
	StorePostCustomersCustomerAddressesReq,
	StoreProductsListRes,
	StorePostCartsCartPaymentSessionReq,
	StoreShippingOptionsListRes,
	StorePostCartsCartShippingMethodReq,
	StorePostCartsCartReq,
	StoreCompleteCartRes,
	StorePostCustomersCustomerPasswordTokenReq,
	StorePostCustomersResetPasswordReq
} from '@medusajs/medusa';
import type { AddressCreatePayload, AddressPayload } from '@medusajs/types';

export interface QueryOptions {
	expand?: string;
	region_id?: 'NA';
	currency_code?: 'usd';
}

export interface CreateLineItemParams {
	cartId: string;
	variantId: string;
	quantity?: number;
}

export interface UpdateLineItemParams {
	cartId: string;
	lineItemId: string;
	quantity: number;
}

export interface DeleteLineItemParams {
	cartId: string;
	lineItemId: string;
}

export interface AddToCartParams {
	variantId: string;
	quantity: number;
}

export class MedusaClient {
	url: string;
	client: Medusa;

	constructor(url: string) {
		this.url = url;
		this.client = new Medusa({
			baseUrl: this.url,
			maxRetries: 0
		});
	}

	// this middleware function is called by src/hooks.server.ts or src/hooks.server.js
	async handleRequest(event: RequestEvent) {
		// Cookie retrieval
		event.locals.sid = event.cookies.get('sid') || '';
		event.locals.cartId = event.cookies.get('cartid') || '';
		// Fetch user and cart data
		try {
			const [userData, cartData] = await Promise.all([
				event.locals.sid ? this.getSession(event.locals, event.cookies) : Promise.resolve(null),
				this.retrieveCart(event.locals)
			]);

			if (userData) {
				event.locals.user = userData.customer;
			} else {
				this.invalidateSession(event.locals, event.cookies);
			}
			if (cartData) {
				event.locals.cartId = cartData.cart.id;
				event.locals.cart = cartData.cart;
			}

			return event;
		} catch (error) {
			console.error('Error in handleRequest()', error);
			return event;
		}
	}

	// Sets cookies for session
	async parseAuthCookie(setCookie: string[], cookies: Cookies): Promise<boolean> {
		for (const rawCookie of setCookie) {
			try {
				const parsedCookie = cookie.parse(rawCookie);

				if (parsedCookie['connect.sid']) {
					const sid = parsedCookie['connect.sid'];
					const expires = new Date(parsedCookie['Expires']);
					const maxAge = Math.floor((expires.getTime() - Date.now()) / 1000);

					cookies.set('sid', sid, {
						path: '/',
						maxAge,
						sameSite: 'strict',
						httpOnly: true,
						secure: true
					});

					return true;
				}
			} catch (error) {
				console.error('Error parsing cookie:', error);
				return false;
			}
		}

		return false;
	}

	invalidateSession(locals: App.Locals, cookies: Cookies) {
		cookies.delete('sid', {
			path: '/'
		});
		locals.cartId = '';
		locals.cart = null;
		return;
	}

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

	async getSession(locals: App.Locals, cookies: Cookies): Promise<StoreAuthRes | null> {
		// https://docs.medusajs.com/api/store#authentication
		// Custom header must be provided to authenticate
		const headers = { Cookie: `connect.sid=${locals.sid}` };

		try {
			const getSessionResponse = await this.client.auth.getSession(headers);
			const setCookies = getSessionResponse.response.headers['set-cookie'] || [];
			const authCookieUpdated = await this.parseAuthCookie(setCookies, cookies);
			return getSessionResponse;
		} catch (error) {
			console.error('Error: invalid sid.', error);
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
	async retrieveCart(locals: App.Locals): Promise<StoreCartsRes | null> {
		console.log('Retrieve cart');

		// Validation - Early Exit
		if (!locals.cartId) {
			return null; // Cart ID is mandatory
		}

		try {
			const res = await this.client.carts.retrieve(locals.cartId);

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
	async updateCart(
		locals: App.Locals,
		payload: StorePostCartsCartReq
	): Promise<StoreCartsRes | null> {
		console.log('Update cart details.');

		// Validation - Early Exit
		if (!locals.cartId) {
			return null; // Cart ID is mandatory
		}

		try {
			const res = await this.client.carts.update(locals.cartId, payload);

			if (res.response.status !== 200) {
				throw new Error(`API call failed: ${res.response.status}`);
			}

			return res;
		} catch (error) {
			console.error('Error: failed updateCart()', error);
			return null;
		}
	}

	async completeCart(locals: App.Locals): Promise<StoreCompleteCartRes | null> {
		console.log('Complete cart.');

		// Validation - Early Exit
		if (!locals.cartId) {
			return null; // Cart ID is mandatory
		}

		try {
			const res = await this.client.carts.complete(locals.cartId);

			if (res.response.status !== 200) {
				throw new Error(`API call failed: ${res.response.status}`);
			}

			return res;
		} catch (error) {
			console.error('Error: failed completeCart()', error);
			return null;
		}
	}

	async authenticate(
		locals: App.Locals,
		cookies: Cookies,
		email: string,
		password: string
	): Promise<StoreAuthRes | null> {
		try {
			let { customer, response } = await this.client.auth.authenticate({
				email,
				password
			});
			if (response.status !== 200) return null;
			const setCookies = response.headers['set-cookie'] || [];
			const authCookieUpdated = await this.parseAuthCookie(setCookies, cookies);
			locals.user = customer;
			return { customer };
		} catch (error) {
			console.log('Login failed.');
			return null;
		}
	}

	async generatePasswordToken(email: string): Promise<boolean> {
		console.log('Generate password token');
		if (!email) return false;
		try {
			const payload: StorePostCustomersCustomerPasswordTokenReq = {
				email
			};
			const { response } = await this.client.customers.generatePasswordToken(payload);
			if (response.status !== 200) return false;
			return true;
		} catch (error) {
			console.log('Error: failed addShippingMethod()', error);
			return false;
		}
	}

	async resetPassword(
		payload: StorePostCustomersResetPasswordReq
	): Promise<StoreCustomersRes | null> {
		console.log('Reset password');
		const { token, email, password } = payload;
		if (!token || !email || !password) return null;
		try {
			const res = await this.client.customers.resetPassword(payload);
			if (res.response.status !== 200) {
				throw new Error(`API update failed: ${res.response.status}`);
			}
			return res;
		} catch (error) {
			console.log('Error: failed resetPassword()', error);
			return null;
		}
	}

	async deleteSession(locals: App.Locals, cookies: Cookies): Promise<boolean> {
		// returns true or false based on success
		const { response } = await this.client.auth.deleteSession();
		if (response.status !== 200) return false;
		await this.invalidateSession(locals, cookies);
		return true;
	}

	async listProducts(
		limit: number = 20,
		offset: number = 0,
		options?: QueryOptions
	): Promise<StoreProductsListRes | null> {
		// returns an array of product objects
		let opts: StoreGetProductsParams = options
			? { limit, offset, ...options }
			: {
					limit,
					offset,
					expand: 'variants,variants.prices,variants.options',
					currency_code: 'usd'
			  };

		try {
			return await this.client.products.list(opts);
		} catch (error) {
			console.log('Error: failed call getProducts()');
			return null;
		}
	}
	/**
	 * Creates a new line item in the specified cart.
	 *
	 * @param params - A CreateLineItemParams object containing cartId, variantId, and quantity.
	 * @returns A Promise that resolves to a StoreCartsRes object containing the updated cart, or null if the operation fails.
	 * @throws {Error} If cartId or variantId are missing.
	 * @throws {Error} If the API call fails.
	 */
	async createLineItem(params: CreateLineItemParams): Promise<StoreCartsRes | null> {
		console.log(
			`Creating line item in cart: ${params.variantId} with quantity ${params.quantity}.`
		);

		if (!params.cartId || !params.variantId) {
			throw new Error('Missing cartId or variantId');
		}

		try {
			const { cart, response } = await this.client.carts.lineItems.create(params.cartId, {
				variant_id: params.variantId,
				quantity: params.quantity ?? 1 // Use default value 1 if not provided
			});

			if (response.status !== 200) {
				throw new Error(`API create failed: ${response.status}`);
			}

			return { cart };
		} catch (error) {
			console.error('Error: failed createLineItem()', error);
			return null;
		}
	}

	/**
	 * Updates the quantity of an existing line item in the specified cart.
	 *
	 * @param params - An UpdateLineItemParams object containing cartId, lineItemId, and quantity.
	 * @returns A Promise that resolves to a StoreCartsRes object containing the updated cart, or null if the operation fails.
	 * @throws {Error} If cartId or lineItemId are missing.
	 * @throws {Error} If the API call fails.
	 */
	async updateLineItem(params: UpdateLineItemParams): Promise<StoreCartsRes | null> {
		console.log(`Updating cart: ${params.lineItemId} quantity to ${params.quantity}.`);

		if (!params.cartId || !params.lineItemId) {
			throw new Error('Missing cartId or lineItemId');
		}

		try {
			const { cart, response } = await this.client.carts.lineItems.update(
				params.cartId,
				params.lineItemId,
				{
					quantity: params.quantity
				}
			);

			if (response.status !== 200) {
				throw new Error(`API update failed: ${response.status}`);
			}

			return { cart };
		} catch (error) {
			console.error('Error: failed updateLineItem()', error);
			return null;
		}
	}

	/**
	 * Deletes a line item from the specified cart.
	 *
	 * @param params - A DeleteLineItemParams object containing cartId and lineItemId.
	 * @returns A Promise that resolves to a StoreCartsRes object containing the updated cart, or null if the operation fails.
	 * @throws {Error} If cartId or lineItemId are missing.
	 * @throws {Error} If the API call fails.
	 */
	async deleteLineItem(params: DeleteLineItemParams): Promise<StoreCartsRes | null> {
		console.log(`Deleting line item ${params.lineItemId} from cart.`);

		if (!params.cartId || !params.lineItemId) {
			throw new Error('Missing cartId or lineItemId');
		}

		try {
			const { cart, response } = await this.client.carts.lineItems.delete(
				params.cartId,
				params.lineItemId
			);

			if (response.status !== 200) {
				throw new Error(`API delete failed: ${response.status}`);
			}

			return { cart };
		} catch (error) {
			console.error('Error: failed deleteLineItem()', error);
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
	async createCart(locals: App.Locals, cookies: Cookies): Promise<StoreCartsRes | null> {
		try {
			const { cart, response } = await this.client.carts.create();

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
		console.log(`Adding ${params.variantId} to cart.`);

		if (!params.variantId) {
			throw new Error('Missing variantId');
		}

		try {
			// Ensure a cart exists
			let cart = locals.cart;
			if (!cart) {
				const response = await this.createCart(locals, cookies);
				if (!response) throw new Error('Cart creation failed');
				cart = response.cart;
			}

			// Find existing line item if possible
			const lineItem = cart.items.find((el) => el.variant_id === params.variantId);

			if (lineItem) {
				// Update existing item
				return await this.updateLineItem({
					cartId: cart.id,
					lineItemId: lineItem.id,
					quantity: params.quantity + lineItem.quantity
				});
			} else {
				// Create new item
				return await this.createLineItem({
					cartId: cart.id,
					variantId: params.variantId,
					quantity: params.quantity ?? 1
				});
			}
		} catch (error) {
			console.error('Error: failed addToCart()', error);
			return null;
		}
	}
	async updateCustomer(
		locals: App.Locals,
		payload: StorePostCustomersCustomerReq
	): Promise<StoreCustomersRes | null> {
		console.log('Update customer record.');
		const headers = { Cookie: `connect.sid=${locals.sid}` };

		if (!payload) {
			throw new Error('Missing address payload');
		}

		try {
			const res = await this.client.customers.update(payload, headers);

			if (res.response.status !== 200) {
				throw new Error(`Add address failed: API responded with ${res.response.status}`);
			}

			return res;
		} catch (error) {
			console.error('Error: failed updateCustomer()', error);
			return null;
		}
	}
	async addAddress(
		locals: App.Locals,
		payload: AddressCreatePayload
	): Promise<StoreCustomersRes | null> {
		console.log('Adding a new customer address.');
		const headers = { Cookie: `connect.sid=${locals.sid}` };

		if (!payload) {
			throw new Error('Missing address payload');
		}

		try {
			const params: StorePostCustomersCustomerAddressesReq = {
				address: payload
			};

			const res = await this.client.customers.addresses.addAddress(params, headers);

			if (res.response.status !== 200) {
				throw new Error(`Add address failed: API responded with ${res.response.status}`);
			}

			return res;
		} catch (error) {
			console.error('Error: failed addAddress()', error);
			return null;
		}
	}
	async deleteAddress(locals: App.Locals, address_id: string): Promise<StoreCustomersRes | null> {
		console.log('Adding a new customer address.');
		const headers = { Cookie: `connect.sid=${locals.sid}` };

		if (!address_id) {
			throw new Error('Missing address id');
		}

		try {
			const res = await this.client.customers.addresses.deleteAddress(address_id, headers);

			if (res.response.status !== 200) {
				throw new Error(`Add address failed: API responded with ${res.response.status}`);
			}

			return res;
		} catch (error) {
			console.error('Error: failed deleteAddress()', error);
			return null;
		}
	}
	async createPaymentSessions(locals: App.Locals): Promise<StoreCartsRes | null> {
		console.log('Creating payment sessions.');
		if (!locals.cartId) {
			return null;
		}
		try {
			const res = await this.client.carts.createPaymentSessions(locals.cartId);

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
			const res = await this.client.carts.setPaymentSession(locals.cartId, payload);

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
	 * Retrieves a list of shipping options available for the specified cart.
	 *
	 * @param locals - An App.Locals object containing required properties (likely cartId)
	 * @returns A Promise that resolves to a StoreShippingOptionsListRes object, or null if the operation fails.
	 * @throws {Error} If the cartId is missing.
	 * @throws {Error} If the API call fails.
	 */
	async listShippingOptions(locals: App.Locals): Promise<StoreShippingOptionsListRes | null> {
		console.log('Retrieve a list of shipping options available for a cart.');
		if (!locals.cartId) throw new Error('Missing cartId');
		try {
			const res = await this.client.shippingOptions.listCartOptions(locals.cartId);
			if (res.response.status !== 200) {
				throw new Error(`List shipping options failed: API responded with ${res.response.status}`);
			}
			return res;
		} catch (error) {
			console.error('Error: failed listShippingOptions()', error);
			return null;
		}
	}
	async addShippingMethod(locals: App.Locals, option_id: string): Promise<StoreCartsRes | null> {
		console.log('Add a shipping method to the cart.');
		if (!locals.cartId || !option_id) return null;
		try {
			let payload: StorePostCartsCartShippingMethodReq = {
				option_id,
				data: {}
			};
			const res = await this.client.carts.addShippingMethod(locals.cartId, payload);
			if (res.response.status !== 200) {
				throw new Error(`List shipping options failed: API responded with ${res.response.status}`);
			}
			return res;
		} catch (error) {
			console.error('Error: failed addShippingMethod()', error);
			return null;
		}
	}
}

export default MedusaClient;
