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
  width: 100%;
  margin: 2rem 0px;
  box-sizing: border-box;
  height: 213px;
  border: 2px solid black;
  max-width: 300px;
`

const IndicesContainer = styled.div`
  display: flex;
`;

const Index = styled.div`
  padding-right: 10px;
`;

export default function NftModal({ closeCheckout }) {
  const { nftIndices } = useNftContext()

  return (
    <NftFrame>
      <Controls closeCheckout={closeCheckout} theme={'dark'} hideHeader />
      <ImgStyle src={NFT_URI} alt="NFT" />
      <Title>Your Nakamot-Os NFTs</Title>
      <IndicesContainer>
        {nftIndices.map((index) => (
          <Index>
            #{index}
          </Index>
        ))}
      </IndicesContainer>
    </NftFrame>
  )
}
