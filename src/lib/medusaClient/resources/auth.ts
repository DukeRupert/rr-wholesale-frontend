import BaseResource from './base';
import cookie from 'cookie';
import type { RequestEvent, Cookies } from '@sveltejs/kit';
import type { StoreAuthRes } from '@medusajs/medusa';

class AuthResource extends BaseResource {
	// Sets cookies for session
	parseAuthCookie(setCookie: string[], cookies: Cookies): boolean {
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
	async authenticate(
		locals: App.Locals,
		cookies: Cookies,
		email: string,
		password: string
	): Promise<StoreAuthRes | null> {
		try {
			let { customer, response } = await this.medusa.client.auth.authenticate({
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
		const { response } = await this.medusa.client.auth.deleteSession();
		if (response.status !== 200) return false;
		await this.invalidateSession(locals, cookies);
		return true;
	}
    async getSession(locals: App.Locals, cookies: Cookies): Promise<StoreAuthRes | null> {
		// https://docs.medusajs.com/api/store#authentication
		// Custom header must be provided to authenticate
		const headers = { Cookie: `connect.sid=${locals.sid}` };

		try {
			const getSessionResponse = await this.medusa.client.auth.getSession(headers);
			const setCookies = getSessionResponse.response.headers['set-cookie'] || [];
			const authCookieUpdated = await this.parseAuthCookie(setCookies, cookies);
			return getSessionResponse;
		} catch (error) {
			console.error('Error: invalid sid.', error);
			return null;
		}
	}
}

export default AuthResource;
