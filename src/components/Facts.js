import React from 'react'
import styled from 'styled-components'
import Tilt from 'react-tilt'
import {
  useBlockTilLottery,
  useHasMintedNFTs,
  useLotteryWinners,
  useMaxNFTCount,
  useOwnerTicketCount,
  useTotalTicketCount
} from '../hooks'

const CardWrapper = styled.div`
  box-sizing: border-box;
  width: 348px;
  height: 548px;
  background: #fff;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
  color: white;
  align-items: center;
  cursor: default;
  padding: 24px;
  z-index: 1;
  transform: perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1);
  border-radius: 8px;
  margin-left: 4vw;
  margin-top: 2vw;

  @media screen and (max-width: 1750px) {
    margin: auto;
    margin-bottom: 40px;
    margin-top: 12px;
  }
  @media only screen and (max-width: 480px) {
    margin: auto;
    margin-bottom: 40px;
    width: 318px;
    height: 648px;
  }
`

const StyledTextContainer = styled.div`
  width: 100%;
  height: 32px;
  left: 597px;
  font-family: Tomorrow, sans-serif;
  font-style: normal;
  color: #000000;
`

const StyledTitle = styled.h1`
  font-weight: bold;
  font-size: 30px;
  line-height: 25px;
  margin-top: 0px;
`

const StyledSubHeader = styled.h2`
  font-weight: normal;
  font-size: 20px;
  line-height: 10px;
`

const StyledText = styled.h3`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-family: Tomorrow, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 10px;
`

const StyledWinnerText = styled.h4`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-family: Tomorrow, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 10px;
`

const StyledParagraph = styled.p`
  width: 100%;
  line-height: 20px;
  font-family: Tomorrow, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
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
  const maxNftCount = useMaxNFTCount()
  const blocksTilLottery = useBlockTilLottery()
  const totalTicketCount = useTotalTicketCount()
  const ownerTicketCount = useOwnerTicketCount()
  const hasMintedNFTs = useHasMintedNFTs()
  const lotteryWinners = useLotteryWinners()

  return (
    <Tilt
      style={{ background: 'transparent', borderRadius: '8px' }}
      options={{ scale: 1.01, max: 10, glare: true, 'max-glare': 1, speed: 1000 }}
    >
      <CardWrapper>
        <StyledTextContainer>
          <StyledTitle>{hasMintedNFTs ? 'Lottery Winners' : 'Lottery Facts'}</StyledTitle>
          <StyledSubHeader>Entry: 1 Redemption</StyledSubHeader>
          <Line />
          {hasMintedNFTs ? (
            lotteryWinners &&
            lotteryWinners.map((winner, index) => {
              const obfuscatedWinner = `${winner.slice(0, 8)}.... ${winner.slice(winner.length - 7, winner.length)}`
              return (
                <StyledWinnerText>
                  <div>{`#${index + 1}`}</div>
                  <div>{obfuscatedWinner}</div>
                </StyledWinnerText>
              )
            })
          ) : (
            <>
              <StyledText>
                <>NFTs Available</>
                <b>{maxNftCount}</b>
              </StyledText>
              <StyledText>
                <>Your Entries</>
                <b>{ownerTicketCount}</b>
              </StyledText>
              <StyledText>
                <>Total Entries</>
                <b>{totalTicketCount}</b>
              </StyledText>
              <StyledText>
                <>Blocks Til Lottery</>
                <b>{blocksTilLottery}</b>
              </StyledText>
            </>
          )}
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
