import React, { useState } from 'react'
import styled from 'styled-components'

import { useWeb3Context } from 'web3-react'
import ReCAPTCHA from 'react-google-recaptcha'

import { TOKEN_SYMBOL } from '../utils'

// we need to capture the full address into netlify...
// https://www.netlify.com/blog/2017/07/20/how-to-integrate-netlifys-form-handling-in-a-react-app/
/*
function encode(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')
}
*/

// variables for the netlify names of each form field
const bot = 'beep-boop'
const firstName = 'firstName'
const lastName = 'lastName'
const line1 = 'line1'
const line2 = 'line2'
const city = 'city'
const state = 'state'
const zip = 'zip'
const country = 'country'
const email = 'email'
export const address = 'address'
const timestamp = 'timestamp'
const numberBurned = 'number-burned'
const signature = 'signature'

// map from variables to display text for each field
const nameMap = {
  [firstName]: 'First Name',
  [lastName]: 'Last Name',
  [line1]: 'Street Address',
  [line2]: 'Unit',
  [city]: 'City',
  [state]: 'State',
  [zip]: 'ZIP',
  [country]: 'Country',
  [email]: 'Email',
  [address]: 'Ethereum Address',
  [timestamp]: 'Time',
  [numberBurned]: `${TOKEN_SYMBOL} Redeemed`
}

// the order for fields that will be submitted
const nameOrder = [firstName, lastName, line1, line2, city, state, zip, country, email]

// default for each form field
export const defaultState = {
  [bot]: '',
  [firstName]: '',
  [lastName]: '',
  [line1]: '',
  [line2]: '',
  [city]: '',
  [state]: '',
  [zip]: '',
  [country]: '',
  [email]: ''
}

// mapping from field to google maps return value
/*
const addressMapping = [
  { [line1]: 'street_address' },
  { [city]: 'sublocality' },
  { [state]: 'administrative_area_level_1' },
  { [zip]: 'postal_code' },
  { [country]: 'country' }
]
*/

const recaptchaEnabled = false

export default function RedeemForm({
  setHasConfirmedAddress,
  setUserAddress,
  numberBurned: actualNumberBurned,
  formState,
  setFormState
}) {
  const { library, account } = useWeb3Context()
  const [recaptcha, setRecaptcha] = useState()
  // const [autoAddress, setAutoAddress] = useState([])
  // const [inputY, setInputY] = useState(0)

  function handleChange(event) {
    const { name, value } = event.target
    setFormState(state => ({ ...state, [name]: value }))
  }

  /*
  function updateAutoFields(address) {
    let constructedStreetAddress = ''
    function getTypes(addressItem, addressVal, item) {
      addressItem.forEach(type => {
        if (Object.keys(item)[0] === line1) {
          if (type === 'street_number') {
            constructedStreetAddress += addressVal
          } else if (type === 'route') {
            constructedStreetAddress += ' ' + addressVal
          }
          setFormState(state => ({ ...state, [Object.keys(item)[0]]: constructedStreetAddress }))
        } else if (Object.keys(item)[0] === city) {
          if (type === 'sublocality' || type === 'locality') {
            setFormState(state => ({ ...state, [Object.keys(item)[0]]: addressVal }))
          }
        } else if (Object.keys(item)[0] === state) {
          if (type === 'administrative_area_level_1') {
            setFormState(state => ({ ...state, [Object.keys(item)[0]]: addressVal }))
          }
        } else if (Object.keys(item)[0] === country) {
          if (type === 'country') {
            setFormState(state => ({ ...state, [Object.keys(item)[0]]: addressVal }))
          }
        } else if (Object.keys(item)[0] === zip) {
          if (type === 'postal_code') {
            setFormState(state => ({ ...state, [Object.keys(item)[0]]: addressVal }))
          }
        }
      })
    }

    addressMapping.forEach(item => {
      address.forEach(addressItem => {
        getTypes(addressItem.types, addressItem.long_name, item)
      })
    })
  }

  // keep acount in sync
  useEffect(() => {
    setUserAddress(autoAddress['formatted_address'])
    updateAutoFields(autoAddress['address_components'] ? autoAddress['address_components'] : [])
    handleChange({ target: { name: [address], value: account } })
  }, [account, autoAddress, setUserAddress])

  useLayoutEffect(() => {
    if (suggestEl.current) {
      setInputY(suggestEl.current.getBoundingClientRect().bottom)
    }
  }, [suggestEl])
  */

  const canSign =
    formState[firstName] &&
    formState[lastName] &&
    formState[line1] &&
    formState[city] &&
    formState[state] &&
    formState[zip] &&
    formState[country] &&
    formState[email]

  function onRecaptcha(value) {
    if (value) {
      setRecaptcha(value)
    }
  }

  return (
    <FormFrame autoComplete="off">
      <input hidden autoComplete="false" type="text" name="beep-boop" value={formState[bot]} onChange={handleChange} />
      <Compressed>
        <input
          style={{ marginRight: '8px' }}
          required
          name={firstName}
          value={formState[firstName]}
          onChange={handleChange}
          placeholder={nameMap[firstName]}
          autoComplete="off"
          type="text"
        />
        <input
          required
          name={lastName}
          value={formState[lastName]}
          onChange={handleChange}
          placeholder={nameMap[lastName]}
          autoComplete="off"
          type="text"
        />
      </Compressed>
      <input
        type="text"
        value={formState[line1]}
        onChange={handleChange}
        name={line1}
        placeholder={nameMap[line1]}
        autoComplete="off"
      />
      <input
        type="text"
        name={line2}
        value={formState[line2]}
        onChange={handleChange}
        placeholder={nameMap[line2]}
        autoComplete="off"
      />
      <input
        required
        type="text"
        name={city}
        value={formState[city]}
        onChange={handleChange}
        placeholder={nameMap[city]}
        autoComplete="address-level2"
      />

      <Compressed>
        <input
          style={{ marginRight: '8px' }}
          required
          type="text"
          name={state}
          value={formState[state]}
          onChange={handleChange}
          placeholder={nameMap[state]}
          autoComplete="address-level1"
        />
        <input
          required
          type="text"
          name={zip}
          value={formState[zip]}
          onChange={handleChange}
          placeholder={nameMap[zip]}
          autoComplete="postal-code"
        />
      </Compressed>

      <input
        required
        type="text"
        name={country}
        value={formState[country]}
        onChange={handleChange}
        placeholder={nameMap[country]}
        autoComplete="country-name"
      />

      <input
        required
        type="email"
        name={email}
        value={formState[email]}
        onChange={handleChange}
        placeholder={nameMap[email]}
        autoComplete="email"
      />

      {recaptchaEnabled && <ReCAPTCHA sitekey={process.env.REACT_APP_SITE_RECAPTCHA_KEY} onChange={onRecaptcha} />}
      <ButtonFrame
        type="submit"
        disabled={!canSign || (recaptchaEnabled && !!!recaptcha)}
        onClick={event => {
          const signer = library.getSigner()
          const timestampToSign = Math.round(Date.now() / 1000)

          const header = `PLEASE VERIFY YOUR ADDRESS.\nYour data will never be shared publicly.`
          const formDataMessage = nameOrder.map(o => `${nameMap[o]}: ${formState[o]}`).join('\n')
          const autoMessage = `${nameMap[address]}: ${account}\n${nameMap[timestamp]}: ${timestampToSign}\n${nameMap[numberBurned]}: ${actualNumberBurned}`

          signer.signMessage(`${header}\n\n${formDataMessage}\n${autoMessage}`).then(returnedSignature => {
            fetch('/.netlify/functions/submission-created', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                'form-name': 'redeem',
                ...{
                  ...formState,
                  [address]: account,
                  [timestamp]: timestampToSign,
                  [numberBurned]: actualNumberBurned,
                  [signature]: returnedSignature,
                  ...(recaptchaEnabled ? { 'g-recaptcha-response': recaptcha } : {})
                }
              })
            })
              .then(() => {
                setHasConfirmedAddress(true)
              })
              .catch(() => {
                setHasConfirmedAddress(false)
              })
          })

          event.preventDefault()
        }}
      >
        {canSign ? 'Next' : 'Complete the form to continue'}
      </ButtonFrame>
      <br />
    </FormFrame>
  )
}

const FormFrame = styled.form`
  width: 100%;
  color: #fff;
  font-weight: 600;
  margin: 16px;
  /* margin-bottom: 0px; */
  font-size: 16px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  input {
    border: none;
    background-image: none;
    background-color: transparent;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    color: #000;
    background-color: #f1f2f6;
    padding: 8px;
    margin: 4px 0 4px 0;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;
  }
  input:required {
    box-shadow: inset 0 0 0 1px rgba(254, 135, 0, 0.5);
  }
  input:valid {
    border: nne;
    box-shadow: none;
  }
`

const Compressed = styled.span`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`

const ButtonFrame = styled.button`
  padding: 0;
  text-align: center;
  box-sizing: border-box;
  height: 48px;
  width: 100%;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  border: none;
  cursor: pointer;
  pointer-events: ${props => (props.disabled ? 'none' : 'auto')};

  background: linear-gradient(90deg, #fe8700 4.52%, #ffa743 100%);
  box-shadow: 0px 4px 20px rgba(254, 135, 0, 1, 0.4);
  background: ${props => (props.disabled ? '#f1f2f6' : 'linear-gradient(90deg, #FE8700 4.52%, #FFA743 100%)')};
  box-shadow: ${props => (props.disabled ? 'none' : '0px 4px 20px rgba(254,135,0,1, 0.4)')};
  color: ${props => (props.disabled ? '#aeaeae' : props.theme.white)};
  transform: scale(1);
  transition: transform 0.3s ease;
  text-align: center;
  margin-top: 4px;

  :hover {
    transform: scale(0.99);
  }
`
