// api/set-cart
import type { RequestHandler } from './$types';
import { redirect, json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, locals, url, cookies }) => {
    // todo: Grab return url in case user needs to login
    console.log(`URL : ${url}`)
    const rurl = url.pathname
    console.log(`rurl: ${rurl}?${url.searchParams}`)
    const id = url.searchParams.get('cartId') || ''
	console.log(`CartId: ${id}`)
    throw redirect(302, '/auth')
};