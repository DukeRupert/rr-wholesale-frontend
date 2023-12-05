import { z } from 'zod';

export const addShippingAddress = z.object({
	first_name: z.string(),
	last_name: z.string(),
	address_1: z.string(),
	address_2: z.string().optional(),
	city: z.string(),
	province: z.string().optional(),
	postal_code: z.string(),
	country_code: z.string().toLowerCase().default('us'),
    phone: z.string().optional(),
    company: z.string().optional()
});