import BaseResource from './base';

class OrdersResource extends BaseResource {

	async stub(): Promise<boolean> {
		console.log('Stub for future resource');
		return true
	}

	
}

export default OrdersResource;