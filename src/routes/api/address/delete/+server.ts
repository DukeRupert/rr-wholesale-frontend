import { json } from '@sveltejs/kit';
import medusa from '$lib/medusa.js';

export async function POST({ request, locals }) {
	console.log('Delete address');
	// handle data
	const data = await request.json();
	const address_id = data?.address_id ?? '';
	// server side validation
	if (!address_id ) return json({ success: false });
	// call medusa
	const res = await medusa.customers.addresses.deleteAddress(locals, address_id);
	// handle error
	if (res === null) return json({ success: false });
	// handle success
	return json({
		success: true
	});
}
