import MedusaClient from './main';
import { MEDUSA_BACKEND_URL } from '$env/static/private';
import type {
	AddToCartParams,
	CreateLineItemParams,
	UpdateLineItemParams,
	DeleteLineItemParams
} from './main';

const medusaClient = new MedusaClient({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 });

export default medusaClient;
export { AddToCartParams, CreateLineItemParams, UpdateLineItemParams, DeleteLineItemParams };
