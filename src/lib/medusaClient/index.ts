import MedusaClient from './main'
import { MEDUSA_BACKEND_URL } from '$env/static/private'
import type { AddToCartParams, CreateLineItemParams, UpdateLineItemParams, DeleteLineItemParams } from './main'

const medusaClient = new MedusaClient(MEDUSA_BACKEND_URL)

export default medusaClient
export { AddToCartParams, CreateLineItemParams, UpdateLineItemParams, DeleteLineItemParams }
