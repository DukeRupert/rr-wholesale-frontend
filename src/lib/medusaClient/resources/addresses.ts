import BaseResource from "./base"
import type { StoreCustomersRes, StorePostCustomersCustomerAddressesReq } from "@medusajs/medusa";

class AddressesResource extends BaseResource {
    async addAddress(
		locals: App.Locals,
		payload: StorePostCustomersCustomerAddressesReq
	): Promise<StoreCustomersRes | null> {
		console.log('Adding a new customer address.');
		const headers = { Cookie: `connect.sid=${locals.sid}` };

		if (!payload) {
			throw new Error('Missing address payload');
		}

		try {

			const res = await this.medusa.client.customers.addresses.addAddress(payload, headers);

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
			const res = await this.medusa.client.customers.addresses.deleteAddress(address_id, headers);

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

export default AddressesResource