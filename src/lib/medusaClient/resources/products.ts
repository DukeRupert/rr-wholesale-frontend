import BaseResource from './base';
import type { StoreProductsListRes, StoreGetProductsParams } from '@medusajs/medusa';
import type { QueryOptions } from '../types';

class ProductsResource extends BaseResource {
	async list(
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
			return await this.medusa.client.products.list(opts);
		} catch (error) {
			console.log('Error: failed call getProducts()');
			return null;
		}
	}
}

export default ProductsResource;
