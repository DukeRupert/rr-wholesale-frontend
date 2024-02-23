import Client from './resources/client';
import type { Config } from './resources/client';
import {
	AuthResource,
	CartResource,
	CustomerResource,
	ShippingOptionsResource,
	ProductsResource
} from './resources';
import type {
	AddToCartParams,
	CreateLineItemParams,
	UpdateLineItemParams,
	DeleteLineItemParams
} from './types';
import type { RequestEvent, Cookies } from '@sveltejs/kit';

class MedusaClient {
	public client: Client;
	public auth: AuthResource;
	public customers: CustomerResource;
	public carts: CartResource;
	public shippingOptions: ShippingOptionsResource;
	public products: ProductsResource;

	constructor(config: Config) {
		this.client = new Client(config);
		this.auth = new AuthResource(this.client);
		this.customers = new CustomerResource(this.client);
		this.carts = new CartResource(this.client);
		(this.shippingOptions = new ShippingOptionsResource(this.client)),
			(this.products = new ProductsResource(this.client));
	}

	async handleRequest(event: RequestEvent) {
		// Cookie retrieval
		event.locals.sid = event.cookies.get('sid') || '';
		event.locals.cartId = event.cookies.get('cartid') || '';
		// Fetch user and cart data

		const [userData, cartData] = await Promise.all([
			event.locals.sid ? this.auth.getSession(event.locals, event.cookies) : Promise.resolve(null),
			event.locals.cartId ? this.carts.retrieve(event.locals) : Promise.resolve(null)
		]);

		if (userData) {
			event.locals.user = userData.customer;
		} else {
			this.auth.invalidateSession(event.locals, event.cookies);
		}

		if (cartData) {
			event.locals.cartId = cartData.cart.id;
			event.locals.cart = cartData.cart;
		}

		return event;
	}
}

export default MedusaClient;
export {
	Config,
	AddToCartParams,
	CreateLineItemParams,
	UpdateLineItemParams,
	DeleteLineItemParams
};
