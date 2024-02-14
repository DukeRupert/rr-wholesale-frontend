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
	StoreProductsListRes
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
				await this.handleInvalidSession(event.locals, event.cookies);
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

	async handleInvalidSession(locals: App.Locals, cookies: Cookies) {
		cookies.delete('sid', {
			path: '/'
		});
		locals.cartId = '';
		locals.cart = null;
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

	async retrieveCart(locals: App.Locals): Promise<StoreCartsRes | null> {
		const cartId = locals?.cartId ?? '';
		let retrieveCartResponse: StoreCartsRes;
		if (!cartId) return null;
		try {
			retrieveCartResponse = await this.client.carts.retrieve(cartId);
		} catch (error) {
			console.log(error);
			return null;
		}
		const { cart } = retrieveCartResponse;
		// if this cart was completed on another device, we don't want to use it
		if (cart && cart.completed_at) return null;
		return retrieveCartResponse;
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

	async deleteSession(locals: App.Locals, cookies: Cookies): Promise<boolean> {
		// returns true or false based on success
		const { response } = await this.client.auth.deleteSession();
		if (response.status !== 200) return false;
		await this.handleInvalidSession(locals, cookies);
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
}

export default MedusaClient;
