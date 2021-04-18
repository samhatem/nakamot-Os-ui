import axios from './axios'
const faunadb = require('faunadb')

const q = faunadb.query
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SERVER_SECRET
})

export async function getCustomer (address, customerInfo) {
  const allRefs = await client.query(q.Paginate(q.Match(q.Index('get_by_customer'), address)))

  if (allRefs.data.length === 0) {
    return createCustomer(address, customerInfo)
  }

  const query = await client.query(allRefs.data.map(ref => q.Get(ref)))

  return query[0]
}

async function createCustomer (address, customerInfo) {
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

  try {
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

    return res.data
  } catch (e) {
    throw new Error("Unable to create customer")
  }
}
