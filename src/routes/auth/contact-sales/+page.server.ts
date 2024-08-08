import type { PageServerLoad, Actions } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';
import { redirect } from '@sveltejs/kit';
import sgMail from '$lib/sendgrid';
import { FROM_EMAIL, TO_EMAIL, SENDGRID_CLIENT_ACCESS_REQUEST_ID } from '$env/static/private';

const template_id = SENDGRID_CLIENT_ACCESS_REQUEST_ID || '';
if (!template_id) console.log('Missing env variable: SENDGRID_CLIENT_ACCESS_REQUEST_ID');
const from_email = FROM_EMAIL || '';
if (!from_email) console.log('Missing env variable: FROM_EMAIL');
const to_email = TO_EMAIL || '';
if (!to_email) console.log('Missing env variable: TO_EMAIL');

const contactSchema = z.object({
	email: z
		.string()
		.email()
		.refine((val) => val.length > 0, {
			message: 'Email is required'
		}),
	first_name: z.string().min(1).max(200),
	last_name: z.string().min(1).max(200),
	business_name: z.string().min(1).max(200),
	phone: z.string().min(1).max(15)
});

export const load: PageServerLoad = async ({ locals, url }) => {
	// If logged in, redirect to return url or home
	if (locals.user) {
		throw redirect(302, '/');
	}

	const form = await superValidate(zod(contactSchema));

	return {
		form
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		// handle form data
		const form = await superValidate(request, zod(contactSchema));
		// server side validation
		if (!form.valid) return message(form, { type: 'warning', text: 'Invalid form' }); // this shouldn't happen because of client-side validation
		// Todo: Check for bots
		// Send email via Sendgrid
		const msg = {
			to: to_email,
			from: from_email,
			templateId: template_id,
			dynamicTemplateData: {
				business_name: form.data.business_name,
				first_name: form.data.first_name,
				last_name: form.data.last_name,
				email: form.data.email,
				phone: form.data.phone
			}
		};
		try {
			await sgMail.send(msg);
		} catch (error) {
			console.error(error);

			if (error.response) {
				console.error(error.response.body);
			}

			return message(form, {
				type: 'error',
				text: 'Something went wrong. Please try again later.'
			});
		}
		return message(form, { type: 'success', text: 'We will reach out to you soon!' });
	}
};
