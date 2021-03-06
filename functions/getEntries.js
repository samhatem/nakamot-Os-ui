import { ethers } from 'ethers'
import axios from './helpers/axios'
const faunadb = require('faunadb')

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
  const { address: _address, signature, timestamp } = JSON.parse(event && event.body ? event.body : {})
  const address = isAddress(_address)

  if (!address || !signature || !timestamp) {
    return returnError('Invalid Arguments')
  }

  const addressOfSigner = ethers.utils.verifyMessage(
    `This signature is proof that I control the private key of ${address} as of the timestamp ${timestamp}.\n\n It will be used to access my order history.`,
    signature
  )
  if (addressOfSigner !== address || Math.round(Date.now() / 1000) - timestamp >= 60 * 60) {
    return returnError('Unauthorized', 401)
  }

  // await getCustomer(address, client)

  try {
    const allRefs = await client.query(q.Paginate(q.Match(q.Index('get_order_by_address'), address)))

    if (allRefs.data.length === 0) {
      return returnSuccess([])
    }

    const query = await client.query(allRefs.data.map(ref => q.Get(ref)))
    const burnHashes = query.map(q => q.data.burnHash)

    const orderPromises = query.map(res => axios({
      url: `/admin/api/2021-04/orders/${res.data.orderId}.json`,
      method: 'get'
    }))

    const orderRequests = await Promise.all(orderPromises)
    const orders = orderRequests.map((req, i) => { return { ...req.data.order, burnHash: burnHashes[i] } })

    return returnSuccess(orders)
  } catch (error) {
    console.error(error)
    return returnError('Unknown Error')
  }
}
