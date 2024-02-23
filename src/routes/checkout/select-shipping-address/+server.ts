import type { RequestHandler } from './$types'
import { error, json } from '@sveltejs/kit'
import medusa from '$lib/medusa'

export const POST: RequestHandler = async ({ request, locals }) => {
   const address = await request.json()
   if (!locals.cartId || !address) { throw error(400, 'bad format') }
   const cart = await medusa.carts.update(locals, address)
   if (cart) return json(cart)
   else throw error(500, 'Server error: select-shipping-address failed')
}