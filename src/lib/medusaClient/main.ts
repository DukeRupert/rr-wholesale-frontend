import Medusa from '@medusajs/medusa-js';
import cookie from 'cookie';
import type { RequestEvent } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import type { Cart } from '@medusajs/medusa/dist/models/cart';

interface clientConfig {
	persistCart: boolean;
}

export class MedusaClient {
	url: string;
	persistCart: boolean;
	client: Medusa;

	constructor(url: string, config: clientConfig = { persistCart: true }) {
		this.url = url;
		this.persistCart = config.persistCart;
		this.client = new Medusa({
			baseUrl: this.url,
			maxRetries: 0
		});
	}

	async handleRequest(event: RequestEvent) {
		// this middleware function is called by src/hooks.server.ts or src/hooks.server.js
		console.log('Handle request');
		// If user doesn't exist, check with server using session id.
		if (!event?.locals?.user) {
			// Check cookies for session id (sid) and if present, fetch user information
			event.locals.sid = event.cookies.get('sid') || '';
			if (event.locals.sid) event.locals.user = await this.getCustomer(event.locals, event.cookies);
		}

		// Check cookies for cartId, if present fetch cart information
		event.locals.cartId = event.cookies.get('cartId') || '';
		let cart: Cart | null = await this.getCart(event.locals, event.cookies);
		event.locals.cartId = cart?.id || '';
		event.locals.cart = cart || null;
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

	async getCustomer(locals: App.Locals, cookies: Cookies) {
		// https://docs.medusajs.com/api/store#authentication
		// Custom header must be provided to authenticate
		let headers: Record<string, any> = {};
		headers['Cookie'] = `connect.sid=${locals.sid}`;
		console.log(`Checking validity of sid: ${locals.sid}`);
		try {
			const { customer, response } = await this.client.auth.getSession(headers);
			const setCookies = response.headers['set-cookie'] || [];
			this.parseAuthCookie(setCookies, locals, cookies);
			return customer;
		} catch (error) {
			console.log(error);
			return null;
		}
	}

	async getCart(locals: App.Locals, cookies: Cookies) {
		// returns a cart array on success, otherwise null
		let cart: Cart | null = null;
		let cartId = locals?.cartId ?? '';
		if (cartId) {
			try {
				const { cart: c, response } = await this.client.carts.retrieve(cartId);
				cart = c as Cart;
			} catch (error) {
				console.log(error);
			}
		}
		//TODO: Persist cart
		// if this cart was completed on another device, we don't want to use it
		if (cart && cart.completed_at) cart = null;
		return cart;
	}

	async login(locals: App.Locals, cookies: Cookies, email: string, password: string) {
		// returns true or false based on success
		console.log('Login()');
		let result = false;
		try {
			const { customer, response } = await this.client.auth.authenticate({
				email,
				password
			});
			const setCookies = response.headers['set-cookie'] || [];
			this.parseAuthCookie(setCookies, locals, cookies);
			locals.user = customer;
			result = true;
		} catch (error) {
			console.log(error);
		}
		return result;
	}

	async logout(locals: App.Locals, cookies: Cookies) {
		// returns true or false based on success
		const { response } = await this.client.auth.deleteSession();
		if (response.status === 200) {
			locals.sid = '';
			locals.user = null;
			cookies.delete('sid', {
				path: '/'
			});
			return true;
		} else {
			return false;
		}
	}
}

export default MedusaClient;
