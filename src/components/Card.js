import React from 'react'
import styled from 'styled-components'
import Tilt from 'react-tilt'

import { TOKEN_SYMBOL } from '../utils'

import Gallery3D from './Gallery/3DGallery'
const CardWrapper = styled.div`
  background: #fff;
  color: white;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  cursor: default;
  padding: 24px;
  transform: perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1);
  margin-right: 4vw;
  margin-top: 2vw;
  width: 348px;
  height: 528px;
  padding: 10px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);

  @media screen and (max-width: 1750px) {
    margin: auto;
    margin-bottom: 40px;
    margin-top: 12px;
  }

  @media only screen and (max-width: 480px) {
    margin: auto;
    margin-bottom: 40px;
    margin-top: 12px;
    width: 318px;
  }
`

const Title = styled.p`
  font-weight: 500;
  font-size: 24px;
  line-height: 126.7%;
  width: 100%;
  margin: 0;
  color: #000;
`

const SubTitle = styled.p`
  color: #6c7284;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 156.7%;
  width: 100%;
  margin: 0;
  font-feature-settings: 'tnum' on, 'onum' on;
`

export default function Card({ totalSupply, dollarPrice, reserveBKFTToken }) {
  return (
    <Tilt
      style={{ background: 'transparent', borderRadius: '8px' }}
      options={{ scale: 1.01, max: 10, glare: true, 'max-glare': 1, speed: 1000 }}
    >
      <CardWrapper>
        <Title>Nakamot-Os</Title>
        <SubTitle>${TOKEN_SYMBOL}</SubTitle>
        <Gallery3D />
      </CardWrapper>
    </Tilt>
  )
}
