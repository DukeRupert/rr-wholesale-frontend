import type { Handle } from '@sveltejs/kit';
import medusa from '$lib/server/medusa';
import { redirect } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// MEDUSA SESSION MIDDLEWARE
	// Sets locals.user and locals.cart if they are found.
	event = await medusa.handleRequest(event);

	// If user is not logged in and they are responding to a draft order confirmation email
	if (!event.locals?.user && event.url.pathname.startsWith('/api/set-cart')) {
		// Grab return url in case user needs to login
		let rurl = event.url.pathname + '?' + event.url.searchParams.toString();
		// remove leading / from url
		rurl = rurl.replace(/^\/+/, '');
		throw redirect(307, `/auth/login?rurl=${rurl}`);
	}

	// If the user is not logged in and they are not trying to log in, redirect them to the login page.
	if (!event.locals?.user && !event.url.pathname.startsWith('/auth')) {
		throw redirect(302, '/auth/login');
	}

	const response = await resolve(event);

	// CACHE CONTROL
	// response.headers.set['Cache-Control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate'
	// response.headers.set['Cache-Control'] = 'public, max-age=0, s-maxage=1'

	// SECURITY HEADERS
	// CSP directives are set elsewhere in svelte.config.js and added automatically by SvelteKit.
	// CSRF mitigation in SvelteKit is handled by header-checking and is enabled by default. More secure token-based CSRF mitigation must be added manually.
	// Token-based CSRF mitigation for the most sensitive endpoints/form actions is handled by Cloudflare Turnstile.
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set(
		'Permissions-Policy',
		'payment=(), accelerometer=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(), gyroscope=(), hid=(), interest-cohort=(), magnetometer=(), microphone=(), midi=(), picture-in-picture=(), publickey-credentials-get=(), sync-xhr=(), usb=(), xr-spatial-tracking=(), geolocation=()'
	);

	return response;
};
