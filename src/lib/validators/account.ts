import { z } from 'zod';

export const editUser = z.object({
	first_name: z.string(),
	last_name: z.string(),
	email: z.string().email(),
	phone: z.string().optional()
});

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

export const changePassword = z
	.object({
		currentPassword: z.string().min(6),
		newPassword: z.string().min(6),
		confirmPassword: z.string().min(6)
	})
	.superRefine(({ newPassword, confirmPassword }, ctx) => {
		if (newPassword !== confirmPassword) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'The passwords did not match'
			});
		}
	});
