export interface QueryOptions {
	expand?: string;
	region_id?: 'US';
	currency_code?: 'usd';
}

export interface CreateLineItemParams {
	cartId: string;
	variantId: string;
	quantity?: number;
}

export interface UpdateLineItemParams {
	cartId: string;
	lineItemId: string;
	quantity: number;
}

export interface DeleteLineItemParams {
	cart_id: string;
	line_item_id: string;
}

export interface AddToCartParams {
	variant_id: string;
	quantity: number;
}
