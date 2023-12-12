export interface OrderSummary {
  object: string
  id: string
  created_at: string
  updated_at: string
  status: string
  fulfillment_status: string
  payment_status: string
  display_id: number
  cart_id: string
  customer_id: string
  email: string
  billing_address_id: string
  shipping_address_id: string
  region_id: string
  currency_code: string
  tax_rate: any
  draft_order_id: any
  canceled_at: any
  metadata: Metadata
  no_notification: any
  idempotency_key: any
  external_id: any
  sales_channel_id: string
  claims: any[]
  discounts: any[]
  gift_card_transactions: any[]
  gift_cards: any[]
  items: Item[]
  payments: Payment[]
  refunds: any[]
  region: Region
  shipping_address: ShippingAddress
  shipping_methods: ShippingMethod[]
  swaps: any[]
  subtotal: number
  discount_total: number
  shipping_total: number
  refunded_total: number
  paid_total: number
  refundable_amount: number
  item_tax_total: number
  shipping_tax_total: number
  tax_total: number
  gift_card_total: number
  gift_card_tax_total: number
  total: number
}

export interface Metadata {}

export interface Item {
  id: string
  created_at: string
  updated_at: string
  cart_id: string
  order_id: string
  swap_id: any
  claim_order_id: any
  original_item_id: any
  order_edit_id: any
  title: string
  description: string
  thumbnail: string
  is_return: boolean
  is_giftcard: boolean
  should_merge: boolean
  allow_discounts: boolean
  has_shipping: boolean
  unit_price: number
  variant_id: string
  quantity: number
  fulfilled_quantity: any
  returned_quantity: any
  shipped_quantity: any
  metadata: Metadata2
  adjustments: any[]
  tax_lines: TaxLine[]
  variant: Variant
  subtotal: number
  discount_total: number
  total: number
  original_total: number
  original_tax_total: number
  tax_total: number
  raw_discount_total: number
  refundable: number
}

export interface Metadata2 {}

export interface TaxLine {
  id: string
  created_at: string
  updated_at: string
  rate: number
  name: string
  code: string
  metadata: any
  item_id: string
}

export interface Variant {
  id: string
  created_at: string
  updated_at: string
  deleted_at: any
  title: string
  product_id: string
  sku: any
  barcode: any
  ean: any
  upc: any
  variant_rank: number
  inventory_quantity: number
  allow_backorder: boolean
  manage_inventory: boolean
  hs_code: any
  origin_country: any
  mid_code: any
  material: string
  weight: any
  length: any
  height: any
  width: any
  metadata: any
}

export interface Payment {
  id: string
  created_at: string
  updated_at: string
  swap_id: any
  cart_id: string
  order_id: string
  amount: number
  currency_code: string
  amount_refunded: number
  provider_id: string
  data: Data
  captured_at: any
  canceled_at: any
  metadata: any
  idempotency_key: any
}

export interface Data {
  status: string
}

export interface Region {
  id: string
  created_at: string
  updated_at: string
  deleted_at: any
  name: string
  currency_code: string
  tax_rate: number
  tax_code: any
  gift_cards_taxable: boolean
  automatic_taxes: boolean
  tax_provider_id: any
  metadata: any
}

export interface ShippingAddress {
  id: string
  created_at: string
  updated_at: string
  deleted_at: any
  customer_id: any
  company: string
  first_name: string
  last_name: string
  address_1: string
  address_2: string
  city: string
  country_code: string
  province: string
  postal_code: string
  phone: string
  metadata: any
}

export interface ShippingMethod {
  id: string
  shipping_option_id: string
  order_id: string
  claim_order_id: any
  cart_id: string
  swap_id: any
  return_id: any
  price: number
  data: Data2
  tax_lines: TaxLine2[]
  original_total: number
  total: number
  subtotal: number
  original_tax_total: number
  tax_total: number
}

export interface Data2 {}

export interface TaxLine2 {
  id: string
  created_at: string
  updated_at: string
  rate: number
  name: string
  code: string
  metadata: any
  shipping_method_id: string
}
