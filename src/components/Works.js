import React from 'react'
import styled from 'styled-components'

import { Controls } from './Redeem'
import { TOKEN_SYMBOL } from '../utils/constants'

const WorksFrame = styled.div`
  width: 100%;
  padding: 24px;
  padding-top: 16px;
  box-sizing: border-box;
  font-size: 24px;
  font-weight: 600;
  /* line-height: 170%; */
  /* text-align: center; */
`
const Title = styled.p`
  margin-top: 1rem !important;

  font-weight: 600;
  font-size: 16px;
`

const Desc = styled.p`
  line-height: 150%;
  font-size: 14px;
  margin-top: 1rem !important;
  font-weight: 500;
`

export function link(hash) {
  return `https://etherscan.io/tx/${hash}`
}

export const EtherscanLink = styled.a`
  text-decoration: none;
  color: ${props => props.theme.orange};
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
`

export default function Works({ closeCheckout }) {
  return (
    <WorksFrame>
      <Controls closeCheckout={closeCheckout} theme={'dark'} />

      <Title>How it works:</Title>
      <Desc>
        ${TOKEN_SYMBOL} is a token that entitles you to 1 real box of limited edition cereal, shipped anywhere in the world.
      </Desc>
      <Desc>
        You can sell the token back at any time. To get a real box, redeem a ${TOKEN_SYMBOL} token.
      </Desc>
      <Title>How it's priced:</Title>
      <Desc>
        ${TOKEN_SYMBOL} tokens are listed starting at $21 USD. Each buy/sell will move the price. The increase or decrease
        follows a{' '}
        <a
          href="https://blog.relevant.community/bonding-curves-in-depth-intuition-parametrization-d3905a681e0a"
          target="_blank"
          rel="noopener noreferrer"
        >
          bonding curve
        </a>
        . ${TOKEN_SYMBOL} will eventually find an equillibrium based on market demand.
      </Desc>
      <Title>Unipay:</Title>
      <Desc>
        Buying or selling cereal uses the uniswap protocol and accepts any token input as a payment method. Thank you to the{" "}
        <a href="https://app.uniswap.org/#/swap" target="_blank" rel="noopener noreferrer">Uniswap Team</a> for building and open sourcing{" "}
        <a href="https://unisocks.exchange/" target="_blank" rel="noopener noreferrer">Unisocks</a> which we used to cook up your breakfast.
      </Desc>
      <Desc>
        <a href="mailto:Satoshi@breakfast.exchange" target="_blank" rel="noopener noreferrer">
          Get in touch.
        </a>
      </Desc>
    </WorksFrame>
  )
}
