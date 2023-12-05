export interface User {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: any;
  email: string;
  first_name: string;
  last_name: string;
  billing_address_id?: any;
  phone?: any;
  has_account: boolean;
  metadata: Metadata;
  orders: Order[];
  shipping_addresses: Shippingaddress[];
}

export interface Shippingaddress {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: any;
  customer_id: string;
  company?: any;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: any;
  city: string;
  country_code: string;
  province: string;
  postal_code: string;
  phone: string;
  metadata?: any;
}

export interface Order {
  object: string;
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  display_id: number;
  cart_id: string;
  customer_id: string;
  email: string;
  billing_address_id?: any;
  shipping_address_id: string;
  region_id: string;
  currency_code: string;
  tax_rate?: any;
  draft_order_id?: any;
  canceled_at?: any;
  metadata: Metadata2;
  no_notification?: any;
  idempotency_key?: any;
  external_id?: any;
  sales_channel_id: string;
  items: Item[];
}

export interface Item {
  id: string;
  created_at: string;
  updated_at: string;
  cart_id: string;
  order_id: string;
  swap_id?: any;
  claim_order_id?: any;
  original_item_id?: any;
  order_edit_id?: any;
  title: string;
  description: string;
  thumbnail: string;
  is_return: boolean;
  is_giftcard: boolean;
  should_merge: boolean;
  allow_discounts: boolean;
  has_shipping: boolean;
  unit_price: number;
  variant_id: string;
  quantity: number;
  fulfilled_quantity?: number;
  returned_quantity?: any;
  shipped_quantity?: any;
  metadata: Metadata2;
}

export interface Metadata2 {
}

export interface Metadata {
  stripe_id: string;
}