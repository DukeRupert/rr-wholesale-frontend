import type { PageServerLoad, Actions } from './$types';
import medusaClient from '$lib/medusaClient';

export const actions: Actions = {
	check: async ({ request, locals, cookies }) => {
		console.log('Test session action');
		const res = await medusaClient.getCustomer(locals, cookies);
		console.log('Medusa response', res);
		return { success: true }
	},

	login: async({request, locals, cookies}) => {
		console.log('Login action')
		const res = await medusaClient.login(locals, cookies, "lwilliams56@gmail.com", "serenity")
				console.log('Medusa response', res);
		return { success: true }
	}
};