import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY } from '$env/static/private';

const key = SENDGRID_API_KEY || '';
if (!key) console.log('Missing Sendgrid Api key');
sgMail.setApiKey(key);

export default sgMail;
