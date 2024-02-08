// api/set-cart
import type { RequestHandler } from './$types';
import { redirect, json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, locals, url, cookies }) => {   
    const id = url.searchParams.get('cartId') || ''
	console.log(id)
    if(id) {
        console.log('Setting cart id')
        cookies.set('cartid', id, {
               path: '/',
               maxAge: 60 * 60 * 24 * 400,
               sameSite: 'strict',
               httpOnly: true,
               secure: true
            })
    }
    throw redirect(302, '/checkout')
};