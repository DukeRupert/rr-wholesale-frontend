import {default as MedusaClient} from '@medusajs/medusa-js';

export interface Config {
	baseUrl: string;
	maxRetries: number;
	apiKey?: string;
	publishableApiKey?: string;
	customHeaders?: Record<string, any>;
}

const defaultConfig = {
	baseUrl: 'http://localhost:9000',
	maxRetries: 0
};

class Client {
    private config: Config;
	public client: MedusaClient;

	constructor(c: Config) {
        this.config = { ...defaultConfig, ...c }
		this.client = new MedusaClient(this.config);
	}
}

export default Client;
