import { ethers } from 'ethers'
import { getCustomer, findAddress } from './helpers/getCustomer'
import axios from './helpers/axios'
const faunadb = require('faunadb')

const VARIANT_ID = process.env.VARIANT_ID

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

function isAddress(value) {
  try {
    return ethers.utils.getAddress(value.toLowerCase())
  } catch {
    return false
  }
}

function returnError(message, statusCode = 400) {
  return {
    statusCode,
    body: JSON.stringify({ error: message })
  }
}

function returnSuccess(data, statusCode = 200) {
  return {
    statusCode,
    body: JSON.stringify(data)
  }
}


export async function handler(event) {
  const data = JSON.parse(event.body)

  const {
    email,
    address: _address,
    'number-burned': numberBurned,
    burnHash
  } = data

  const address = isAddress(_address)

  if (!address) {
    return Error('Invalid Arguments')
  }

  let customer
  try {
    customer = await getCustomer(address, data)
  } catch (e) {
    console.log({ e, message: 'unable to get customer' })
    return returnError("Unable to get customer")
  }

  const physicalAddress = findAddress(customer, data)

  const orderData = {
    email,
    customer,
    "send_receipt": true,
    "send_fulfillment_receipt": true,
    "line_items": [
      {
        "variant_id": VARIANT_ID,
        "quantity": numberBurned
      }
    ],
    "shipping_address": physicalAddress,
    "financial_status": "paid"
  }

  let orderId
  try {
    // create order with shopify
    const { data: { order: { id } } } = await axios({
      url: '/admin/api/2021-04/orders.json',
      method: 'post',
      data: {
        order: orderData
      }
    })

    orderId = id
  } catch (e) {
    console.log({ e, message: "unable to get customer" })
    console.log("response data", e.response.data)
    return returnError("Unable to get customer")
  }

  try {
    await client.query(
      q.Create(q.Collection('orders'), {
        data: {
          burnHash,
          orderId,
          addressEthereum: address,
          order: orderData
        }
      })
    )

  } catch (e) {
    console.log({ e, message: "unable to save order to faunadb"})
  }

  return returnSuccess({ message: "Success", customer, orderId })
}
