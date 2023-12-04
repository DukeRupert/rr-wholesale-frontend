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
