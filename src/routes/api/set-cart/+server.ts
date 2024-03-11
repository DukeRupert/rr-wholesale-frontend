// api/set-cart
import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, cookies }) => {   
    const id = url.searchParams.get('cartId') || ''
    if(id) {
        cookies.set('cartid', id, {
               path: '/',
               maxAge: 60 * 60 * 24 * 400,
               sameSite: 'strict',
               httpOnly: true,
               secure: true
            })
    }
    throw redirect(302, '/checkout?invalidate=true')
};