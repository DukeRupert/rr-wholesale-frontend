import { z } from 'zod';

export const editUserSchema = z.object({
	first_name: z.string().max(30),
	last_name: z.string().max(30),
	email: z.string().email(),
	phone: z.string().optional()
});

export const addShippingAddressSchema = z.object({
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

export const changePasswordSchema = z
	.object({
		newPassword: z.string().min(6),
		confirmPassword: z.string().min(6)
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });
	
