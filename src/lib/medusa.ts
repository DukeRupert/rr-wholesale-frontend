import { MEDUSA_BACKEND_URL } from '$env/static/private';
import MedusaClient from './medusaClient';
import type { Config } from './medusaClient';

const baseUrl = MEDUSA_BACKEND_URL || 'http://localhost:9000';
const config: Config = {
	baseUrl,
	maxRetries: 3
};

const medusa = new MedusaClient(config);

export default medusa;
