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
  align-items: center;
  cursor: default;
  padding: 24px;
  z-index: 1;
  transform: perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1);
  border-radius: '8px';
  margin-left: 74px;
  margin-top: 97px;
`

const StyledTextContainer = styled.div`
  width: 100%;
  height: 34px;
  left: 597px;
  font-family: Domine;
  font-style: normal;
  color: #000000;
`

const StyledTitle = styled.h1`
  font-weight: bold;
  font-size: 30px;
  line-height: 29px;
`

const StyledSubHeader = styled.h2`
  font-weight: normal;
  font-size: 20px;
  line-height: 16px;
`

const StyledText = styled.h3`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-family: Domine;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 16px;
`

const StyledParagraph = styled.p`
  width: 100%;
  line-height: 16px;
  font-family: Domine;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  color: #000000;
`

const Line = styled.div`
  width: 100%;
  height: 10px;
  left: 595px;
  top: 159px;

  background: #000000;
`

export default function Facts() {
  return (
    <Tilt
      style={{ background: 'transparent', borderRadius: '8px' }}
      options={{ scale: 1.01, max: 10, glare: true, 'max-glare': 1, speed: 1000 }}
    >
      <CardWrapper>
        <StyledTextContainer>
          <StyledTitle>Lottery Facts</StyledTitle>
          <StyledSubHeader>Entry: 1 Redemption</StyledSubHeader>
          <Line />
          <StyledText>
            <>NFTs Available</>
            <b>10</b>
          </StyledText>
          <StyledText>
            <>Your Entries</>
            <b>0</b>
          </StyledText>
          <StyledText>
            <>Total Entries</>
            <b>69</b>
          </StyledText>
          <StyledText>
            <>Blocks Til Lottery</>
            <b>40,000</b>
          </StyledText>
          <Line />
          <StyledParagraph>
            When you redeem your $BOX before the lottery block, not only will you receive the physical box, but you’ll
            also automatically be eligible for a Nakamot-Os NFT. They’ll only be 10 NFTs every. Talk about sound cereal.
          </StyledParagraph>
        </StyledTextContainer>
      </CardWrapper>
    </Tilt>
  )
}
