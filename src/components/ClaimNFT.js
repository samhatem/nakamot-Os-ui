import React, { useState } from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react'
import { ethers } from 'ethers'

import { Controls } from './Redeem'
import { NFT_ADDRESS } from '../utils'
import Button from './Button'

const Frame = styled.div`
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

const SelectFrame = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: #fff;
  background-color: #000;
  padding: 8px 12px 8px 12px;
  max-width: 84px;
  font-weight: 600;

  /* margin-top: 0.5rem;
  margin-bottom: 0.5rem; */
`

const SelectMenu = styled.div`
  font-size: 16px;
  /* margin: 1rem; */
  font-family: 'Tomorrow', sans-serif;
  font-weight: 500;
  width: 100%;
  /* height: 48px; */
  box-sizing: border-box;
  margin: 0;
  /* appearance: none;
  display: flex;
  justify-content: flex-start;
  align-items: center; */
  border: none;
  /* padding: 0px 1rem 0px 1rem; */
  text-align: center;
`

const IncrementButton = styled.span`
  cursor: pointer;
  user-select: none;
  width: 48px;
  /* height: 48px; */
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: ${props => props.justify};
  justify-content: center;
`

function useCount(initialValue, max) {
  const [count, setCount] = useState(initialValue)

  function increment() {
    if (!max || count + 1 <= max) {
      setCount(prev => prev + 1)
    }
  }

  function decrement() {
    if (count > 1) {
      setCount(prev => prev - 1)
    }
  }

  return [count, increment, decrement]
}

function IncrementToken({ count, decrementCount, incrementCount }) {
  return (
    <SelectFrame>
      <IncrementButton justify={'flex-start'} onClick={decrementCount}>
        -
      </IncrementButton>
      <SelectMenu>{count}</SelectMenu>

      <IncrementButton justify={'flex-end'} onClick={incrementCount}>
        +
      </IncrementButton>
    </SelectFrame>
  )
}

export default function ClaimNFT({ closeCheckout, claimableNFTs }) {
  const { account, library } = useWeb3Context()
  const [count, incrementCount, decrementCount] = useCount(claimableNFTs, claimableNFTs)

  async function handleClaim() {
    const nftContract = new ethers.Contract(
      NFT_ADDRESS,
      ["function mint(uint amount)"],
      library.getSigner(account),
    );

    await nftContract.mint(ethers.BigNumber.from(count))
  }

  return (
    <Frame>
      <Controls closeCheckout={closeCheckout} theme={'dark'} hideHeader />
      <Title>Claim Your Nakamot-Os NFTs</Title>
      <IncrementToken count={count} incrementCount={incrementCount} decrementCount={decrementCount} />
      <Button
        text='Claim'
        onClick={handleClaim}
      />
    </Frame>
  )
}
