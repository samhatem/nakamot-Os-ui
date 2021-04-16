import React from 'react'
import styled from 'styled-components'

import { Controls } from './Redeem'
import { NFT_URI } from '../utils'

import { useNftContext } from '../context/nftContext'

const NftFrame = styled.div`
  width: 100%;
  padding: 24px;
  padding-top: 16px;
  box-sizing: border-box;
  font-size: 24px;
  font-weight: 600;
`

const Title = styled.p`
  margin-top: 1rem !important;

  font-weight: 600;
  font-size: 16px;
`

const ImgStyle = styled.img`
  width: ${props => (props.hasPickedAmount ? (props.hasBurnt ? '300px' : '120px') : '300px')};
  padding: ${props => (props.hasPickedAmount ? (props.hasBurnt ? '0px' : '0 1rem 0 0') : '2rem 0 2rem 0')};
  box-sizing: border-box;
  min-height: 200px;
`

export default function NftModal({ closeCheckout }) {
  const { nftIndices } = useNftContext()

  return (
    <NftFrame>
      <Controls closeCheckout={closeCheckout} theme={'dark'} hideHeader />
      <ImgStyle src={NFT_URI} alt="NFT" />
      <Title>Your Nakamot-Os NFTs</Title>
      {nftIndices.map((index) => (
        <div>
          #{index}
        </div>
      ))}
    </NftFrame>
  )
}
