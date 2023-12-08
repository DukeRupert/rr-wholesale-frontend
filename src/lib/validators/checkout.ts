import { z } from 'zod';

export const updateShippingAddressReq = z.object({
	first_name: z.string(),
	last_name: z.string(),
	address_1: z.string(),
	address_2: z.string().optional(),
	city: z.string(),
	province: z.string(),
	postal_code: z.string(),
	country_code: z.string().toLowerCase()
});

export const updateShippingAddressSchema = z.object({
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

export type UpdateShippingAddressSchema = typeof updateShippingAddressSchema
