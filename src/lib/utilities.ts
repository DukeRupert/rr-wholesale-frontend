import { toast } from 'svelte-sonner';
import type { MessageType } from '../app';
import type { Address } from '@medusajs/medusa/dist/models/address';

export function handle_toast(m: MessageType) {
	const { type, text } = m;
	if (!text) return;
	switch (type) {
		case 'error':
			toast.error(text);
			break;
		case 'warning':
			toast.warning(text);
			break;
		case 'success':
			toast.success(text);
			break;
		default:
			toast(text);
			break;
	}
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const formatPrice = (price: number | undefined | null) => {
	if (price) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(price / 100);
	} else {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(0);
	}
};

export function debounce<F extends Function>(func: F, wait: number): F {
	let timeoutId: number;

	if (!Number.isInteger(wait)) {
		console.warn('Called debounce without a valid number');
		wait = 300;
	}

	return <any>function (this: any, ...args: any[]) {
		clearTimeout(timeoutId);
		const context = this;

		timeoutId = window.setTimeout(function () {
			func.apply(context, args);
		}, wait);
	};
}

export const findSelectedOptions = (variantId: string, product: any): any[] => {
	// Find the options for a given variant
	// The order of options for variants may be different from the order in the product-level options object
	// So, we search for the correct index instead of assuming same order
	let selectedOptions: any[] = [];
	if (!variantId) return selectedOptions;
	let variantIndex = product.variants.findIndex((v: any) => v.id === variantId);
	if (variantIndex === -1) return selectedOptions;
	for (let option of product.variants[variantIndex].options) {
		let index = product.options.findIndex((o: any) => o.filteredValues.includes(option.value));
		selectedOptions[product.options[index].id] = option.value;
	}
	return selectedOptions;
};

export const findVariant = (selectedOptions: any[], product: any) => {
	// See if any variants match all selected options
	// Brute force, needs update
	for (let variant of product.variants) {
		let match = true;
		for (let option of variant.options) {
			if (option.value != selectedOptions[option.option_id]) {
				match = false;
				break;
			}
		}
		if (match) return variant.id;
	}
	return false;
};

export function formatDate(date: string): string {
	return new Date(date).toLocaleDateString('us-EN', {
		month: 'long',
		day: 'numeric',
		year: 'numeric'
	});
}

export function fromISOtoDatetime(date: string): string {
	const split = date.split('T');
	return split[0];
}

// Prepare Address object to be an update payload by removing
// extraneous fields that throw an error on the backend
export function trim_address(address: Address): Partial<Address> {
	let clone: Partial<Address> = Object.assign({}, address);
	delete clone.id;
	delete clone.customer_id;
	delete clone.created_at;
	delete clone.updated_at;
	delete clone.deleted_at;
	return clone;
}
