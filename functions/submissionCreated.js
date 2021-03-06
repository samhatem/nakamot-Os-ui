import { ethers } from 'ethers'
import { getCustomer } from './helpers/getCustomer'

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
  console.log("in handler")
  const data = JSON.parse(event.body)

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
    address: _address,
    timestamp,
    'number-burned': numberBurned,
    signature
  } = data

  const address = isAddress(_address)

  if (!address || !signature || !timestamp) {
    console.log(data)
    return returnError('Invalid Arguments')
  }

  const m1 = `PLEASE VERIFY YOUR ADDRESS.\nYour data will never be shared publicly.`
  const m2 = `First Name: ${firstName}\nLast Name: ${lastName}\nStreet Address: ${line1}\nUnit: ${line2}\nCity: ${city}\nState: ${state}\nZIP: ${zip}\nCountry: ${country}\nEmail: ${email}`
  const m3 = `Ethereum Address: ${address}\nTime: ${timestamp}\nBOX Redeemed: ${numberBurned}`

  const addressOfSigner = ethers.utils.verifyMessage(`${m1}\n\n${m2}\n${m3}`, signature)
  const isInvalid = addressOfSigner !== address

  if (isInvalid) {
    console.log('Unauthorized!', `${m1}\n\n${m2}\n${m3}`, signature, address)
    return returnError("Unauthorized. Signature Invalid", 401)
  }

  let customer
  try {
    customer = await getCustomer(address, data, true)
  } catch (e) {
    console.log({ e, message: "unable to get customer" })
    return returnError(e.toString())
  }

  return returnSuccess({ message: 'Success', customer })
}
