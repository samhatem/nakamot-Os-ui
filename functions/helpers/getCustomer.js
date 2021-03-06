import axios from './axios'
const faunadb = require('faunadb')

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

export function findAddress (customer, info) {
  return customer.addresses.find(addr => addr.address1 === info.line1 && addr.zip === info.zip)
}

export async function getCustomer (address, customerInfo, shouldCreateAddress = false) {
  console.log("getting customer")
  const allRefs = await client.query(q.Paginate(q.Match(q.Index('get_by_customer'), address)))

  console.log({ allRefs })

  if (allRefs.data.length === 0) {
    return createCustomer(address, customerInfo)
  }

  const query = await client.query(allRefs.data.map(ref => q.Get(ref)))

  const { shopifyId } = query[0].data
  const { data: { customer } } = await axios({
    url: `/admin/api/2021-04/customers/${shopifyId}.json`,
    method: 'get'
  })

  console.log({ customer })

  if (shouldCreateAddress) {
    if (!findAddress(customer, customerInfo)) {
      const newAddress = await createAddress(customer, customerInfo)
      customer.addresses = [...customer.addresses, newAddress]
    }
  }

  return customer
}

async function createAddress (customer, info) {
  if (info.country.toUpperCase() === "USA") { info.country = "United States" }

  const { data: { customer_address: newAddress } } = await axios({
    url: `/admin/api/2021-04/customers/${customer.id}/addresses.json`,
    method: 'post',
    data: {
      address: {
        address1: info.line1,
        address2: info.line2,
        city: info.city,
        province: info.state,
        zip: info.zip,
        last_name: info.lastName,
        first_name: info.firstName,
        country: info.country
      }
    }
  })

  return newAddress
}

async function createCustomer (address, customerInfo) {
  console.log("creating customer")
  const {
    firstName,
    lastName,
    line1,
    line2,
    city,
    state,
    zip,
    country,
    email,
  } = customerInfo

  const { data: { customer: { id } } } = await axios({
    url: '/admin/api/2021-04/customers.json',
    method: 'post',
    data: {
      customer: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        addresses: [
          {
            address1: line1,
            address2: line2,
            city: city,
            province: state,
            zip: zip,
            last_name: lastName,
            first_name: firstName,
            country: country
          }
        ]
      }
    }
  })

  console.log({ id });

    const res = await client.query(
      q.Create(q.Collection('customers'), {
        data: {
          addressPhysical: {
            firstName,
            lastName,
            line1,
            line2,
            city,
            state,
            zip,
            country,
            email
          },
          addressEthereum: address,
          matched: false,
          shopifyId: id
        }
    }))

    console.log({ res })

    return res.data
}
