import React from 'react'
import styled from 'styled-components'
import Tilt from 'react-tilt'

const CardWrapper = styled.div`
  border: 2px solid #000000;
  box-sizing: border-box;
  width: 348px;
  height: 628px;
  background: #fff;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
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
  border-radius: '8px';
  margin-left: 74px;
`

const StyledTextContainer = styled.div`
  width: 190px;
  height: 34px;
  left: 597px;
  font-family: Domine;
  font-style: normal;
  color: #000000;
`

const StyledTitle = styled.h1`
  top: 104px;
  font-weight: bold;
  font-size: 25px;
  line-height: 29px;
`

const StyledSubHeader = styled.h2`
  top: 138px;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
`

export default function Facts() {
  return (
    <Tilt
      style={{ background: '#000', borderRadius: '8px' }}
      options={{ scale: 1.01, max: 10, glare: true, 'max-glare': 1, speed: 1000 }}
    >
      <CardWrapper>
        <StyledTextContainer>
          <StyledTitle>Lottery Facts</StyledTitle>
          <StyledSubHeader>Entry: 1 Redemption</StyledSubHeader>
        </StyledTextContainer>
      </CardWrapper>
    </Tilt>
  )
}
