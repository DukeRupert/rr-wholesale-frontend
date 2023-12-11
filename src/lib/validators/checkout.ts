import { z } from 'zod';

export const ShippingAddressSchema = z.object({
	first_name: z.string(),
	last_name: z.string(),
	company: z.string().optional().default(''),
	address_1: z.string(),
	address_2: z.string().optional().default(''),
	city: z.string(),
	province: z.string(),
	postal_code: z.string(),
	country_code: z.string().toLowerCase().default('us')
});

export type ShippingAddressSchemaType = typeof ShippingAddressSchema;
