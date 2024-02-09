import MedusaClient from './main'
import { MEDUSA_BACKEND_URL } from '$env/static/private'

const medusaClient = new MedusaClient(MEDUSA_BACKEND_URL)

export default medusaClient
