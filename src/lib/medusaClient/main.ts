import Medusa from '@medusajs/medusa-js';
import cookie from 'cookie';
import type { RequestEvent } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import type { Cart } from '@medusajs/medusa/dist/models/cart';
import type {
	StoreAuthRes,
	StoreCartsRes,
	StoreGetProductsParams,
	StoreProductsListRes
} from '@medusajs/medusa';

interface QueryOptions {
	expand?: string;
	region_id?: 'NA';
	currency_code?: 'usd';
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

	async handleRequest(event: RequestEvent) {
		// this middleware function is called by src/hooks.server.ts or src/hooks.server.js
		event.locals.sid = event.cookies.get('sid') || '';
		event.locals.cartId = event.cookies.get('cartid') || '';
		// Check cookies for sid, if present fetch customer information
		if (event.locals.sid) {
			const getSessionResponse = await this.getSession(event.locals, event.cookies);
			if (getSessionResponse !== null) {
				event.locals.user = getSessionResponse.customer;
			}
		}
		// Check cookies for cartId, if present fetch cart information
		const retrieveCartResponse = await this.retrieveCart(event.locals);
		if (retrieveCartResponse !== null) {
			const { cart } = retrieveCartResponse;
			event.locals.cartId = cart.id;
			event.locals.cart = cart;
		}
		return event;
	}

	async parseAuthCookie(
		setCookie: string[],
		locals: App.Locals,
		cookies: Cookies
	): Promise<boolean> {
		let result = false;
		if (setCookie.length === 0) return result;
		try {
			for (let rawCookie of setCookie) {
				let parsedCookie = cookie.parse(rawCookie);
				if (parsedCookie['connect.sid']) {
					locals.sid = parsedCookie['connect.sid'];
					let expires = new Date(parsedCookie['Expires']);
					let maxAge = Math.floor((expires.getTime() - Date.now()) / 1000);
					cookies.set('sid', locals.sid, {
						path: '/',
						maxAge: maxAge,
						sameSite: 'strict',
						httpOnly: true,
						secure: true
					});
					result = true;
				}
			}
		} catch (e) {
			console.log(e);
		}
		return result;
	}

	async getSession(locals: App.Locals, cookies: Cookies): Promise<StoreAuthRes | null> {
		// https://docs.medusajs.com/api/store#authentication
		// Custom header must be provided to authenticate
		let headers: Record<string, any> = {};
		headers['Cookie'] = `connect.sid=${locals.sid}`;
		try {
			const getSessionResponse = await this.client.auth.getSession(headers);
			const setCookies = getSessionResponse.response.headers['set-cookie'] || [];
			this.parseAuthCookie(setCookies, locals, cookies);
			return getSessionResponse;
		} catch (error) {
			console.log('Error: invalid sid.');
			cookies.delete('sid');
			locals.cartId = '';
			locals.cart = null;
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
			this.parseAuthCookie(setCookies, locals, cookies);
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
		locals.sid = null;
		locals.user = null;
		cookies.delete('sid', {
			path: '/'
		});
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

	async createLineItem(
		locals: App.Locals,
		variant_id: string,
		quantity: number = 1
	): Promise<StoreCartsRes | null> {
		console.log(`Updating cart: create ${variant_id} quantity to ${quantity}.`);
		if (!locals.cartId || !variant_id) return null;
		try {
			const { cart, response } = await this.client.carts.lineItems.create(locals.cartId, {
				variant_id,
				quantity
			});
			if (response.status !== 200) return null;
			locals.cart = cart;
			return { cart };
		} catch {
			console.log('Error: failed addToCart()');
			return null;
		}
	}

	async updateLineItem(
		locals: App.Locals,
		line_id: string,
		quantity: number
	): Promise<StoreCartsRes | null> {
		console.log(`Updating cart: ${line_id} quantity to ${quantity}.`);
		if (!locals.cartId || !line_id) return null;
		try {
			const { cart, response } = await this.client.carts.lineItems.update(locals.cartId, line_id, {
				quantity
			});
			if (response.status !== 200) return null;
			locals.cart = cart;
			return { cart };
		} catch (error) {
			console.log('Error: failed updateLineItem()');
			return null;
		}
	}

	async deleteLineItem(locals: App.Locals, line_id: string): Promise<StoreCartsRes | null> {
		console.log(`Deleting ${line_id} from cart.`);
		if (!locals.cartId || !line_id) return null;
		try {
			const { cart, response } = await this.client.carts.lineItems.delete(locals.cartId, line_id);
			if (response.status !== 200) return null;
			locals.cart = cart;
			return { cart };
		} catch (error) {
			console.log('Error: failed deleteLineItem()');
			return null;
		}
	}

	async createCart(locals: App.Locals, cookies: Cookies): Promise<StoreCartsRes | null> {
		try {
			const { cart, response } = await this.client.carts.create();
			if (response.status !== 200) return null;
			cookies.set('cartid', cart.id, {
				path: '/',
				maxAge: 60 * 60 * 24 * 400,
				sameSite: 'strict',
				httpOnly: true,
				secure: true
			});
			locals.cartId = cart.id;
			locals.cart = cart as Cart;
			return { cart };
		} catch (error) {
			console.log('Error createCart()');
			return null;
		}
	}

	async addToCart(
		locals: App.Locals,
		cookies: Cookies,
		variant_id: string,
		quantity: number = 1
	): Promise<StoreCartsRes | null> {
		// If no variantId is provided we can't do anything
		console.log(`Adding ${variant_id} to cart.`);
		if (!variant_id) {
			return null;
		}
		// If no cart exists, create one
		if (!locals.cart) {
			const response = await this.createCart(locals, cookies);
			if (response === null) return null;
		}
		// Create or Update LineItem
		if (locals.cart && locals.cart.items) {
			const lineItem = locals.cart.items.find((el) => el.variant_id === variant_id);
			if (lineItem === undefined) {
				return await this.createLineItem(locals, variant_id, quantity);
			}
			return await this.updateLineItem(locals, lineItem.id, quantity + lineItem.quantity);
		}

		return null;
	}
}

export default MedusaClient;
