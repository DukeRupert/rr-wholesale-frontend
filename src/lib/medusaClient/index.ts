import Client from './resources/client';
import type { Config } from './resources/client';
import { AuthResource, CartResource, CustomerResource, ShippingOptionsResource, ProductsResource } from './resources'
import type { AddToCartParams, CreateLineItemParams, UpdateLineItemParams, DeleteLineItemParams } from './types';

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
        this.shippingOptions = new ShippingOptionsResource(this.client),
		this.products = new ProductsResource(this.client)
	}
}

export default MedusaClient;
export { Config, AddToCartParams, CreateLineItemParams, UpdateLineItemParams, DeleteLineItemParams }
