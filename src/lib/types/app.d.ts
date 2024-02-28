import type { Customer } from '@medusajs/medusa/dist/models/customer';

type ExtendedCustomerMetadata = Record<string, unknown> & { is_trusted?: boolean };

export interface ExtendedCustomer extends Customer {
	metadata: ExtendedCustomerMetadata
}