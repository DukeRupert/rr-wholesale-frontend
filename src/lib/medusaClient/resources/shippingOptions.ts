import BaseResource from "./base";
import type {
  StoreShippingOptionsListRes,
} from "@medusajs/medusa"

class ShippingOptionsResource extends BaseResource {
    /**
	 * Retrieves a list of shipping options available for the specified cart.
	 *
	 * @param locals - An App.Locals object containing required properties (likely cartId)
	 * @returns A Promise that resolves to a StoreShippingOptionsListRes object, or null if the operation fails.
	 * @throws {Error} If the cartId is missing.
	 * @throws {Error} If the API call fails.
	 */
	async listCartOptions(locals: App.Locals): Promise<StoreShippingOptionsListRes | null> {
		if (!locals.cartId) throw new Error('Missing cartId');
		try {
			const res = await this.medusa.client.shippingOptions.listCartOptions(locals.cartId);
			if (res.response.status !== 200) {
				throw new Error(`List shipping options failed: API responded with ${res.response.status}`);
			}
			return res;
		} catch (error) {
			console.error('Error: failed listShippingOptions()', error);
			return null;
		}
	}
}

export default ShippingOptionsResource


