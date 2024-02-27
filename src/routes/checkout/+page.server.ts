import type { PageServerLoad, Actions } from './$types';
import { fail, error } from '@sveltejs/kit';
import type { Infer } from 'sveltekit-superforms';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { shippingAddressSchema } from '$lib/validators/account';
import medusa from '$lib/medusa';

export const load: PageServerLoad = async function ({ locals, url }) {
	const { cart, user } = locals;
	const shipping_address_form = await superValidate<Infer<typeof shippingAddressSchema>>(
		zod(shippingAddressSchema)
	);

	return {
		user,
		cart,
		shipping_address_form
	};
};

export const actions: Actions = {
	completeCart: async ({ locals, cookies }) => {
		const res = await medusa.carts.complete(locals);
		console.log(res);
		if (res === null) throw error(400, { message: 'Could not complete cart' });
		console.log(res.type);
		if (res.type === 'order') medusa.carts.invalidateCart(locals, cookies);
		return { success: true };
	},
	updateShippingAddress: async ({ request, locals }) => {
		const shippingAddressForm = await superValidate(request, zod(shippingAddressSchema));
		let cart = locals.cart;
		// Handle invalid data
		if (!shippingAddressForm.valid)
			return message(shippingAddressForm, { type: 'error', text: 'This address is invalid.' });

		// Update cart
		console.log('Update shipping address');
		const { data: address } = shippingAddressForm;
		const updateShippingResponse = await medusa.carts.update(locals, {
			shipping_address: address
		});
		if (updateShippingResponse === null) {
			return message(shippingAddressForm, { type: 'error', text: 'Bad request' });
		}
		cart = updateShippingResponse.cart;

		// Update billing address
		console.log('Update billing address');
		const updateBillingAddressResponse = await medusa.carts.update(locals, {
			billing_address: address
		});
		if (updateBillingAddressResponse === null) {
			return message(shippingAddressForm, { type: 'error', text: 'Bad request' });
		}
		cart = updateBillingAddressResponse.cart;

		return { cart, shippingAddressForm };
	}
};
