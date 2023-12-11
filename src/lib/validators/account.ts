import { z } from 'zod';

export const editUserSchema = z.object({
	first_name: z.string().max(30),
	last_name: z.string().max(30),
	email: z.string().email(),
	phone: z.string().optional()
});

export const shippingAddressSchema = z.object({
	first_name: z.string(),
	last_name: z.string(),
	company: z.string().optional(),
	address_1: z.string(),
	address_2: z.string().optional(),
	city: z.string(),
	province: z.string(),
	phone: z.string().optional(),
	postal_code: z.string(),
	country_code: z.string().toLowerCase().default('us')
});

export const changePasswordSchema = z
	.object({
		newPassword: z.string().min(6),
		confirmPassword: z.string().min(6)
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'] // path of error
	});

export type ShippingAddressSchema = typeof shippingAddressSchema;