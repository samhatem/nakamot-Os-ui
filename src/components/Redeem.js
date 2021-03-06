import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react'
import { Link } from 'react-router-dom'
import { BigNumber } from 'ethers'

import { useAppContext } from '../context'
import { useNftContext } from '../context/nftContext'
import Button from './Button'
import RedeemForm, { defaultState, address } from './RedeemForm'
import { amountFormatter, TOKEN_SYMBOL, NFT_URI, NFT_MAX_SUPPLY } from '../utils'

import IncrementToken from './IncrementToken'
import test from './Gallery/Nakmot-Os.png'

import close from './Gallery/close.svg'
import closeDark from './Gallery/close_dark.svg'

import Confetti from 'react-dom-confetti'

const config = {
  angle: 90,
  spread: 76,
  startVelocity: 51,
  elementCount: 154,
  dragFriction: 0.1,
  duration: 7000,
  stagger: 0,
  width: '10px',
  height: '10px',
  colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a']
}

export function Controls({ closeCheckout, theme, type, hideHeader }) {
  return (
    <FrameControls>
      <Close src={theme === 'dark' ? closeDark : close} onClick={() => closeCheckout()} alt="close" />

      {!hideHeader && (
        <Unicorn theme={theme}>
          <span role="img" aria-label="unicorn">
            👑
          </span>{' '}
          Pay{' '}
          <span style={{ color: '#737373' }}>
            {' '}
            {type === 'confirm' ? ' / Order Details' : type === 'shipping' ? ' / Shipping Details' : ''}
          </span>
        </Unicorn>
      )}
    </FrameControls>
  )
}

export default function Redeem({
  burn,
  balanceBKFT,
  balance,
  ready,
  unlock,
  dollarize,
  setCurrentTransaction,
  setShowConnect,
  closeCheckout
}) {
  const { library, account, setConnector } = useWeb3Context()
  const [state] = useAppContext()

  const [numberBurned, setNumberBurned] = useState()
  const [hasPickedAmount, setHasPickedAmount] = useState(false)
  const [hasConfirmedAddress, setHasConfirmedAddress] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')
  const [lastTransactionHash, setLastTransactionHash] = useState('')

  const [formState, setFormState] = useState(defaultState)

  const [hasBurnt, setHasBurnt] = useState(false)
  const [userAddress, setUserAddress] = useState('')

  const { supply: nftSupply } = useNftContext()

  const pending = !!transactionHash

  useEffect(() => {
    if (transactionHash) {
      library.waitForTransaction(transactionHash).then(() => {
        setLastTransactionHash(transactionHash)
        setTransactionHash('')
        setHasBurnt(true)
      })
    }
  })

  function link(hash) {
    return `https://etherscan.io/tx/${hash}`
  }

  function renderContent() {
    if (account === null) {
      return (
        <ButtonFrame
          className="button"
          disabled={false}
          text={account === null ? 'Connect Wallet' : `Redeem ${TOKEN_SYMBOL}`}
          type={'cta'}
          onClick={() => {
            setConnector('Injected', { suppressAndThrowErrors: true }).catch(() => {
              setShowConnect(true)
            })
          }}
        />
      )
    } else if (!hasPickedAmount) {
      return (
        <>
          <TopFrame hasPickedAmount={hasPickedAmount}>
            <Controls closeCheckout={closeCheckout} />
            <ImgStyle src={test} alt="Logo" hasPickedAmount={hasPickedAmount} />
            <InfoFrame pending={pending}>
              <Owned>
                <SockCount>You own {balanceBKFT && `${amountFormatter(balanceBKFT, 18, 0)}`}</SockCount>
                <p>Redeem {TOKEN_SYMBOL}</p>
              </Owned>
              <IncrementToken
                initialValue={Number(amountFormatter(BigNumber.from('1000000000000000000'), 18, 0))}
                max={Number(amountFormatter(balanceBKFT, 18, 0))}
              />
            </InfoFrame>
          </TopFrame>
          <ButtonFrame
            className="button"
            disabled={false}
            text={'Next'}
            type={'cta'}
            onClick={() => {
              setNumberBurned(state.count)
              setHasPickedAmount(true)
            }}
          />
        </>
      )
    } else if (!hasConfirmedAddress) {
      return (
        <>
          <TopFrame hasPickedAmount={hasPickedAmount}>
            <Controls closeCheckout={closeCheckout} type="shipping" />

            <InfoFrame hasPickedAmount={hasPickedAmount}>
              <ImgStyle src={test} alt="Logo" hasPickedAmount={hasPickedAmount} />
              <Owned>
                <p>{state.count} Boxes</p>
                <p style={{ fontSize: '14px', fontWeight: '500', marginTop: '16px', color: '#AEAEAE' }}>ICO Edition</p>
              </Owned>
            </InfoFrame>
          </TopFrame>

          {/* <Count>2/3</Count> */}
          <CheckoutPrompt>Where should we send them?</CheckoutPrompt>
          <RedeemFrame
            burn={burn}
            setHasConfirmedAddress={setHasConfirmedAddress}
            setUserAddress={setUserAddress}
            numberBurned={numberBurned}
            formState={formState}
            setFormState={setFormState}
          />
          <Back>
            <span
              onClick={() => {
                setNumberBurned()
                setHasPickedAmount(false)
              }}
            >
              back
            </span>
          </Back>
        </>
      )
    } else if (!hasBurnt) {
      return (
        <>
          <TopFrame hasPickedAmount={hasPickedAmount}>
            <Controls closeCheckout={closeCheckout} type="confirm" />
            <InfoFrame hasPickedAmount={hasPickedAmount}>
              <ImgStyle src={test} alt="Logo" hasPickedAmount={hasPickedAmount} />
              <Owned>
                <p style={{ fontSize: '18px' }}>{state.count} Nakamot-Os</p>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#AEAEAE',
                    marginTop: '16px',
                    marginRight: '16px'
                  }}
                >
                  {userAddress}
                </p>
              </Owned>
            </InfoFrame>
            {nftSupply < NFT_MAX_SUPPLY && (
              <InfoFrame hasPickedAmount={hasPickedAmount}>
                <ImgStyle src={NFT_URI} alt="Logo" hasPickedAmount={hasPickedAmount} />
                <Bonus>Bonus</Bonus>
                <Owned>
                  <p style={{ fontSize: '18px' }}>{state.count} entry Nakamot-Os Lottery</p>
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>Digital Collectible (6.9mb)</p>
                  <p
                    style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#AEAEAE',
                      marginTop: '16px',
                      marginRight: '16px',
                      wordBreak: 'break-all'
                    }}
                  >
                    {account}
                  </p>
                </Owned>
              </InfoFrame>
            )}
          </TopFrame>
          {/* <Back
            onClick={() => {
              setHasConfirmedAddress(false)
            }}
          >
            back
          </Back>
          <Count>2/3</Count> */}
          <ButtonFrame
            className="button"
            disabled={pending}
            pending={pending}
            text={pending ? `Waiting for confirmation...` : `Place order (Redeem ${numberBurned} ${TOKEN_SYMBOL}) `}
            type={'cta'}
            onClick={() => {
              burn(numberBurned.toString())
                .then(response => {
                  // save transaction hash
                  fetch('/.netlify/functions/createOrder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      ...{
                        ...formState,
                        [address]: account,
                        'number-burned': numberBurned,
                        burnHash: response.hash
                      }
                    })
                  })
                    .then(res => {
                      console.log('Response from create order')
                      console.log(res)
                      setTransactionHash(response.hash)
                    })
                    .catch((error) => {
                      console.log('Error in create order')
                      console.log(error)
                    })
                })
                .catch(error => {
                  console.log('Error from create order')
                  console.error(error)
                  // setTransactionHash(
                  //   true
                  //     ? '0x888503cb966a67192afb74c740abaec0b7e8bda370bc8f853fb040eab247c63f'
                  //     : '0x66dac079f7ee27ba7b2cae27eaabf64574c2011aacd007968be6d282b3c2065b'
                  // )
                })
            }}
          />
          <Back disabled={!!pending}>
            {pending ? (
              <EtherscanLink href={link(transactionHash)} target="_blank" rel="noopener noreferrer">
                View on Etherscan.
              </EtherscanLink>
            ) : (
              <span
                onClick={() => {
                  setHasConfirmedAddress(false)
                }}
              >
                back
              </span>
            )}
          </Back>
        </>
      )
    } else {
      return (
        <>
          <TopFrame hasPickedAmount={hasPickedAmount}>
            <Controls closeCheckout={closeCheckout} />
            <ImgStyle src={test} alt="Logo" hasPickedAmount={hasPickedAmount} hasBurnt={hasBurnt} />
            <InfoFrame>
              <Owned>
                <p>You got cereal!</p>
              </Owned>
            </InfoFrame>
          </TopFrame>
          <CheckoutPrompt>
            Estimated shipping time 2-3 weeks. <br /> Shipping time will vary by region.
          </CheckoutPrompt>
          <CheckoutPrompt>
            Your shipping details can be viewed <Link to="/status">here</Link>.
          </CheckoutPrompt>
          <div style={{ margin: '16px 0 16px 16px' }}>
            <EtherscanLink href={link(lastTransactionHash)} target="_blank" rel="noopener noreferrer">
              View on Etherscan.
            </EtherscanLink>
          </div>
        </>
      )
    }
  }

  return (
    <>
      {renderContent()}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <Confetti active={hasBurnt} config={config} />
      </div>
    </>
  )
}

const TopFrame = styled.div`
  width: 100%;
  max-width: 375px;
  background: #fff;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.2);
  color: white;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
`

const FrameControls = styled.div`
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`

const Unicorn = styled.p`
  color: #000;
  font-weight: 600;
  margin: 0px;
  font-size: 16px;
`

const Close = styled.img`
  width: 16px;
  color: #fff;
  font-weight: 600;
  margin: 0px;
  /* margin-right: 2px;
  margin-top: -7px; */
  height: 16px;
  font-size: 16px;
  padding: 4px;
  cursor: pointer;
`

const InfoFrame = styled.div`
  opacity: ${props => (props.pending ? 0.6 : 1)};
  width: 100%;
  font-size: 20px;
  font-weight: 500;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  margin-top: ${props => (props.hasPickedAmount ? '8px' : '0')};
  justify-content: ${props => (props.hasPickedAmount ? 'flex-start' : 'space-between')};
  align-items: flex-end;
  padding: ${props => (props.hasPickedAmount ? '1rem 0 1rem 0' : ' 0')};
  /* padding: 1rem 0 1rem 0; */
  margin-top: 12px;
  /* margin-bottom: 8px; */
  /* margin-right: ${props => (props.hasPickedAmount ? '8px' : '0px')}; */

  /* background-color: ${props => (props.hasPickedAmount ? '#000' : 'none')}; */
  border: ${props => (props.hasPickedAmount ? '1px solid #3d3d3d' : 'none')};
`

const Owned = styled.div`
  font-weight: 700;
  color: rgb(55, 53, 47);
  font-size: 24px;
  margin-bottom: 12px;
  margin: 0px;
  white-space: pre-wrap;
`

const Bonus = styled.div`
  font-weight: 500;
  font-size: 12px;
  padding: 4px;
  background-color: ${props => props.theme.orange};
  position: absolute;
  top: 200px;
  left: 32px;
`

const ImgStyle = styled.img`
  width: ${props => (props.hasPickedAmount ? (props.hasBurnt ? '300px' : '120px') : '300px')};
  padding: ${props => (props.hasPickedAmount ? (props.hasBurnt ? '0px' : '0 1rem 0 0') : '2rem 0 2rem 0')};
  box-sizing: border-box;
`
const SockCount = styled.span`
  color: #aeaeae;
  font-weight: 400;
  font-size: 14px;
  width: 100%;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.orange};
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`

const Back = styled.div`
  color: #aeaeae;
  font-weight: 400;
  margin: 0px;
  margin: -4px 0 16px 0px !important;
  font-size: 14px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* color: ${props => props.theme.orange}; */
  text-align: center;
  span {
    cursor: pointer;
  }
  span:hover {
    text-decoration: underline;
  }
`

const CheckoutPrompt = styled.p`
  font-weight: 500;
  font-size: 14px;
  margin: 24px 16px 0 16px !important;
  text-align: left;
  color: '#000';
  font-style: italic;
  width: 100%;
`

const ButtonFrame = styled(Button)`
  margin: 16px;
  height: 48px;
  padding: 16px;
`

const RedeemFrame = styled(RedeemForm)`
  width: 100%;
`

const EtherscanLink = styled.a`
  text-decoration: none;
  color: ${props => props.theme.orange};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
`
