import axios from 'axios'

const SHOPIFY_BASE_URL = process.env.SHOPIFY_BASE_URL

const axiosClient = axios.create({
  baseURL: SHOPIFY_BASE_URL,
  headers: {
    'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY
  }
})

export default axiosClient
