import BaseResource from './base';
import type {
	StoreProductsRes,
	StoreProductsListRes,
	StoreGetProductsParams
} from '@medusajs/medusa';

class ProductsResource extends BaseResource {
	async list(options?: StoreGetProductsParams): Promise<StoreProductsListRes | null> {
		// returns an array of product objects
		let opts: StoreGetProductsParams = options
			? { ...options }
			: {};

		try {
			return await this.medusa.client.products.list(opts);
		} catch (error) {
			console.log('Error: failed call getProducts()');
			return null;
		}
	}

	async retrieve(id: string): Promise<StoreProductsRes | null> {
		// Retrieve a Product's details
		if (!id) return null;
		try {
			return await this.medusa.client.products.retrieve(id);
		} catch (error) {
			console.log('Error: failed call retrieveProduct()');
			return null;
		}
	}
}

export default ProductsResource;
