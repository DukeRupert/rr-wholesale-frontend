import BaseResource from "./base"
import type { StoreCartsRes } from "@medusajs/medusa";
import type { CreateLineItemParams, UpdateLineItemParams, DeleteLineItemParams } from "../types";

class LineItemsResource extends BaseResource {
    /**
	 * Creates a new line item in the specified cart.
	 *
	 * @param params - A CreateLineItemParams object containing cartId, variantId, and quantity.
	 * @returns A Promise that resolves to a StoreCartsRes object containing the updated cart, or null if the operation fails.
	 * @throws {Error} If cartId or variantId are missing.
	 * @throws {Error} If the API call fails.
	 */
	async create(params: CreateLineItemParams): Promise<StoreCartsRes | null> {
		console.log(
			`Creating line item in cart: ${params.variantId} with quantity ${params.quantity}.`
		);

		if (!params.cartId || !params.variantId) {
			throw new Error('Missing cartId or variantId');
		}

		try {
			const { cart, response } = await this.medusa.client.carts.lineItems.create(params.cartId, {
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
	async update(params: UpdateLineItemParams): Promise<StoreCartsRes | null> {
		console.log(`Updating cart: ${params.lineItemId} quantity to ${params.quantity}.`);

		if (!params.cartId || !params.lineItemId) {
			throw new Error('Missing cartId or lineItemId');
		}

		try {
			const { cart, response } = await this.medusa.client.carts.lineItems.update(
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
	async delete(params: DeleteLineItemParams): Promise<StoreCartsRes | null> {
		console.log(`Deleting line item ${params.line_item_id} from cart.`);

		if (!params.cart_id || !params.line_item_id) {
			throw new Error('Missing cartId or lineItemId');
		}

		try {
			const { cart, response } = await this.medusa.client.carts.lineItems.delete(
				params.cart_id,
				params.line_item_id
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
}

export default LineItemsResource