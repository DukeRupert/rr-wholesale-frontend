import BaseResource from './base';
import AddressesResource from './addresses';
import type {
	StoreCustomersRes,
	StorePostCustomersCustomerReq,
	StorePostCustomersResetPasswordReq,
	StorePostCustomersCustomerPasswordTokenReq,
	StoreCustomersListOrdersRes,
	StoreGetCustomersCustomerOrdersParams
} from '@medusajs/medusa';

class CustomerResource extends BaseResource {
	public addresses = new AddressesResource(this.medusa);

	async generatePasswordToken(email: string): Promise<boolean> {
		if (!email) return false;
		try {
			const payload: StorePostCustomersCustomerPasswordTokenReq = {
				email
			};
			const { response } = await this.medusa.client.customers.generatePasswordToken(payload);
			if (response.status !== 200) return false;
			return true;
		} catch (error) {
			console.log('Error: failed addShippingMethod()', error);
			return false;
		}
	}

	async resetPassword(
		payload: StorePostCustomersResetPasswordReq
	): Promise<StoreCustomersRes | null> {
		const { token, email, password } = payload;
		if (!token || !email || !password) return null;
		try {
			const res = await this.medusa.client.customers.resetPassword(payload);
			if (res.response.status !== 200) {
				throw new Error(`API update failed: ${res.response.status}`);
			}
			return res;
		} catch (error) {
			console.log('Error: failed resetPassword()', error);
			return null;
		}
	}

	async updateCustomer(
		locals: App.Locals,
		payload: StorePostCustomersCustomerReq
	): Promise<StoreCustomersRes | null> {
		const headers = { Cookie: `connect.sid=${locals.sid}` };

		if (!payload) {
			throw new Error('Missing address payload');
		}

		try {
			const res = await this.medusa.client.customers.update(payload, headers);

			if (res.response.status !== 200) {
				throw new Error(`Add address failed: API responded with ${res.response.status}`);
			}
			// update locals
			const { first_name, last_name, email, phone } = res.customer;
			if (locals.user) {
				locals.user.first_name = first_name;
				locals.user.last_name = last_name;
				locals.user.email = email;
				locals.user.phone = phone;
			}
			
			return res;
		} catch (error) {
			console.error('Error: failed updateCustomer()', error);
			return null;
		}
	}

	async listOrders(
		locals: App.Locals,
		payload: StoreGetCustomersCustomerOrdersParams
	): Promise<StoreCustomersListOrdersRes | null> {
		if (!payload) {
			throw new Error('Missing address payload');
		}

		try {
			const res = await this.medusa.client.customers.listOrders(payload);

			if (res.response.status !== 200) {
				throw new Error(`Customers listOrders() failed: API responded with ${res.response.status}`);
			}

			return res;
		} catch (error) {
			console.error('Error: failed listOrders()', error);
			return null;
		}
	}
}

export default CustomerResource;
