import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Tilt from 'react-tilt'

import { amountFormatter, TOKEN_SYMBOL } from '../utils'

import Gallery3D from './Gallery/3DGallery'
const CardWrapper = styled.div`
  background: #fff;
  /* box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4); */
  color: white;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  cursor: default;
  padding: 24px;
  z-index: 1;
  transform: perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1);
  margin-right: 74px;
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

const SockCount = styled.p`
  color: #aeaeae;
  font-weight: 400;
  margin: 0px;
  font-size: 12px;
  font-feature-settings: 'tnum' on, 'onum' on;
`

const CurrentPrice = styled.p`
  font-weight: 600;
  font-size: 18px;
  margin: 0px;
  margin-bottom: 0.5rem;
  font-feature-settings: 'tnum' on, 'onum' on;
`

const Info = styled.div`
  /* margin-bottom: -2px; */
`

const Dynamic = styled.p`
  color: #aeaeae;
  font-style: italic;
  font-weight: 400;
  margin: 0px;
  margin-top: 1px;
  font-size: 12px;
  float: left;
`

const InfoButton = styled.span`
  width: 16px;
  height: 16px;
  font-size: 12px;
  color: white;
  text-decoration: none;
  text-align: center;
  margin-left: 8px;
  float: right;
  background-color: #5ca2ff;
`

const MarketData = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  margin-top: 1rem;
`

export default function Card({ totalSupply, dollarPrice, reserveBKFTToken }) {
  return (
    <Tilt
      style={{ background: '#000', borderRadius: '8px' }}
      options={{ scale: 1.01, max: 10, glare: true, 'max-glare': 1, speed: 1000 }}
    >
      <CardWrapper>
        <Title>Nakamot-Os</Title>
        <SubTitle>${TOKEN_SYMBOL}</SubTitle>
        <Gallery3D />
        <MarketData>
          <span>
            <CurrentPrice>{dollarPrice ? `$${amountFormatter(dollarPrice, 18, 2)} USD` : '$0.00'}</CurrentPrice>
            <SockCount>
              {reserveBKFTToken && totalSupply
                ? `${amountFormatter(reserveBKFTToken, 18, 0)}/${totalSupply} available`
                : ''}
            </SockCount>
          </span>
          <Link to="/stats">
            <Info>
              <InfoButton>?</InfoButton>
              <Dynamic>Dynamic Pricing Stats</Dynamic>
            </Info>
          </Link>
        </MarketData>
      </CardWrapper>
    </Tilt>
  )
}
