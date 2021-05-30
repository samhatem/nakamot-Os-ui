import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react'
import { Link } from 'react-router-dom'

import { useAppContext } from '../../context'
import Card from '../../components/Card'
import BuyButtons from '../../components/Buttons'
import RedeemButton from '../../components/RedeemButton'
import Checkout from '../../components/Checkout'
import { amountFormatter, INITIAL_SUPPLY, TOKEN_SYMBOL } from '../../utils'
import { useNftContext } from '../../context/nftContext'
import Facts from '../../components/Facts'

export function Header({ totalSupply, ready, balanceBKFT, setShowConnect, setShowNftModal }) {
  const { account, setConnector } = useWeb3Context()
  const { nftBalance } = useNftContext()
  const [, setState] = useAppContext()

  function handleAccount() {
    setConnector('Injected', { suppressAndThrowErrors: true }).catch(error => {
      setShowConnect(true)
    })
  }

  function handleShowNftModal() {
    setState(state => ({ ...state, visible: !state.visible }))
    setShowNftModal(true)
  }

  return (
    <HeaderFrame balanceBKFT={balanceBKFT}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <Unicorn>
          <span role="img" aria-label="crown">
            👑
          </span>{' '}
          Nakamot-Os
        </Unicorn>
      </Link>
      <StyledImageContainer>
        <StyledImage src="./nakamotos-title.png" alt="Nakamot-Os" />
      </StyledImageContainer>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {!!nftBalance && <NFTBalance onClick={handleShowNftModal}>{nftBalance} Nakamot-O NFTs</NFTBalance>}
        {totalSupply && (
          <Link to="/stats" style={{ textDecoration: 'none' }}>
            <Burned>
              <span role="img" aria-label="fire">
                🚀
              </span>{' '}
              {INITIAL_SUPPLY - totalSupply} <HideMobile>Redeemed</HideMobile>
            </Burned>
          </Link>
        )}
        <Account onClick={() => handleAccount()} balanceBKFT={balanceBKFT}>
          {account ? (
            balanceBKFT > 0 ? (
              <SockCount>
                {balanceBKFT && `${amountFormatter(balanceBKFT, 18, 0)}`} {TOKEN_SYMBOL}
              </SockCount>
            ) : (
              <SockCount>{account.slice(0, 6)}...</SockCount>
            )
          ) : (
            <SockCount>Connect Wallet</SockCount>
          )}

          <Status balanceBKFT={balanceBKFT} ready={ready} account={account} />
        </Account>
      </div>
    </HeaderFrame>
  )
}

const HeaderFrame = styled.div`
  position: sticky;
  width: 100%;
  box-sizing: border-box;
  margin: 0px;
  font-size: 1.25rem;
  color: ${props => (props.balanceBKFT ? props.theme.primary : 'white')};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem;
  padding-top: 0px;
`

const Account = styled.div`
  background-color: ${props => (props.balanceBKFT ? '#f1f2f6' : props.theme.orange)};
  padding: 0.75rem;
  cursor: ${props => (props.balanceBKFT ? 'auto' : 'pointer')};

  transform: scale(1);
  transition: transform 0.3s ease;

  :hover {
    transform: ${props => (props.balanceBKFT ? 'scale(1)' : 'scale(1.02)')};
    text-decoration: underline;
  }
`

const NFTBalance = styled.div`
  margin-right: 1rem;
  padding: 0.75rem;
  cursor: pointer;
  transform: scale(1);
  transition: transform 0.3s ease;
  line-height: 1;

  :hover {
    transform: scale(1.02);
  }

  font-weight: 500;
  font-size: 14px;
  color: #fff;
  font-family: inherit;
  background: linear-gradient(90deg, #fe8700 4.52%, #ffa743 100%);
`

const Burned = styled.div`
  background-color: white;
  border: 1px solid ${props => props.theme.black};
  margin-right: 1rem;
  padding: 0.75rem;
  cursor: pointer;
  transform: scale(1);
  transition: transform 0.3s ease;
  line-height: 1;

  :hover {
    transform: scale(1.02);
  }

  font-weight: 500;
  font-size: 14px;
  color: ${props => props.theme.black};
`

const HideMobile = styled.span`
  @media only screen and (max-width: 480px) {
    display: none;
  }
`

const SockCount = styled.p`
  /* color: #6c7284; */
  font-weight: 500;
  margin: 0px;
  font-size: 14px;
  float: left;
`

const Status = styled.div`
  display: ${props => (props.balanceBKFT ? 'initial' : 'none')};
  width: 12px;
  margin-left: 12px;
  margin-top: 2px;
  float: right;
  background-color: ${props =>
    props.account === null ? props.theme.orange : props.ready ? props.theme.green : props.theme.orange};
`

const AppWrapper = styled.div`
  padding-top: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  scroll-behavior: smooth;
  position: ${props => (props.overlay ? 'fixed' : 'initial')};

  @media only screen and (max-width: 480px) {
    width: 100%;
  }

  @media not screen and (max-width: 480px) {
    margin-bottom: 20vh;
  }
`

const Content = styled.div`
  width: 40%;
  margin-top: 16px;
  margin-bottom: 16px;
`

const OrderStatusLink = styled.p`
  color: ${props => props.theme.orange};
  text-align: center;
  font-size: 1rem;
`

const Unicorn = styled.p`
  color: white;
  font-weight: 600;
  margin: auto 0px;
  font-size: 16px;
`

const StyledImage = styled.img`
  width: 150px;
`

const StyledImageContainer = styled.div`
  position: absolute;
  left: calc(50vw - 90px);

  @media only screen and (max-width: 600px) {
    display: none;
  }
`

// background-color: rgba(226, 226, 226);
const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
  max-width: 1500px;
  align-items: center;

  @media screen and (max-width: 800px) {
    min-width: 350px;
    flex-direction: column;
    justify-content: center;
  }

  @media screen and (max-width: 480px) {
    flex-direction: column;
    justify-content: center;
    width: 100%;
  }
`

const StyledBoxDetailsRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding-top: 32px;
  width: 50%;
  padding-left: 30%;

  @media screen and (max-width: 1750px) {
    min-width: 350px;
  }

  @media only screen and (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    margin-right: 20px;
    align-items: center;
    padding-left: 0;
  }
`

const StyledDetailsText = styled.span`
  width: 50%;
`

const StyledInfoRow = styled.div`
  padding-top: 12px;
  display: flex;
  text-align: left;
  justify-content: space-evenly;
  min-width: 350px;
  a {
    color: ${props => props.theme.orange};
    text-decoration: none;
  }
  a:hover {
    cursor: pointer;
    text-decoration: underline;
  }

  @media screen and (max-width: 1000px) {
    min-width: 350px;
  }
  @media only screen and (max-width: 480px) {
    width: 100%;
    margin-right: 20px;
    padding-top: 5px;
  }
`

const StyledDescription = styled.div`
  width: 40%;
  text-align: left;
  margin-top: 26px;
  @media only screen and (max-width: 480px) {
    width: 80%;
    text-align: center;
  }
`
const CurrentPrice = styled.p`
  font-weight: 600;
  font-size: 18px;
  margin: 0px;
  margin-bottom: 0.5rem;
  font-feature-settings: 'tnum' on, 'onum' on;
`

const GreyBg = styled.div`
  background-color: rgba(226, 226, 226);
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 100px;
`

const Centered = styled.div`
  display: flex;

  > div {
    margin-right: 50px;
  }

  @media only screen and (max-width: 800px) {
    flex-direction: column;
  }
`

export default function Body({
  selectedTokenSymbol,
  setSelectedTokenSymbol,
  ready,
  unlock,
  validateBuy,
  buy,
  validateSell,
  sell,
  burn,
  dollarize,
  dollarPrice,
  balanceBKFT,
  reserveBKFTToken,
  totalSupply,
  ethPrice
}) {
  const { account } = useWeb3Context()
  const [currentTransaction, _setCurrentTransaction] = useState({})
  const setCurrentTransaction = useCallback((hash, type, amount) => {
    _setCurrentTransaction({ hash, type, amount })
  }, [])
  const clearCurrentTransaction = useCallback(() => {
    _setCurrentTransaction({})
  }, [])
  const [state, setState] = useAppContext()
  const [showConnect, setShowConnect] = useState(false)
  const [showWorks, setShowWorks] = useState(false)
  const [showNftModal, setShowNftModal] = useState(false)
  const boxPriceETH = amountFormatter(dollarPrice, 6, 2) / amountFormatter(ethPrice, 6, 2)

  return (
    <>
      <AppWrapper overlay={state.visible}>
        <Header
          totalSupply={totalSupply}
          ready={ready}
          dollarPrice={dollarPrice}
          balanceBKFT={balanceBKFT}
          setShowConnect={setShowConnect}
          setShowNftModal={setShowNftModal}
        />
        <StyledRow>
          <Centered>
            <Card totalSupply={totalSupply} dollarPrice={dollarPrice} reserveBKFTToken={reserveBKFTToken} />
            <Facts />
          </Centered>
        </StyledRow>
        <GreyBg>
          <StyledInfoRow>
            <StyledDescription>
              Buy and sell real cereal with digital currency. Delivered on demand.{' '}
              <a
                href="/"
                onClick={e => {
                  e.preventDefault()
                  setState(state => ({ ...state, visible: !state.visible }))
                  setShowWorks(true)
                }}
              >
                Learn more
              </a>
            </StyledDescription>
          </StyledInfoRow>
          <StyledBoxDetailsRow>
            <StyledDetailsText>
              <CurrentPrice>{dollarPrice ? `${boxPriceETH.toFixed(4)} ETH` : '0.00 ETH'}</CurrentPrice>
              <SockCount>
                {(reserveBKFTToken && totalSupply) || true
                  ? `${amountFormatter(reserveBKFTToken, 18, 0)}/${totalSupply} available`
                  : ''}
              </SockCount>
            </StyledDetailsText>
            <StyledDetailsText style={{ marginTop: '12px' }}>${TOKEN_SYMBOL}</StyledDetailsText>
          </StyledBoxDetailsRow>
          <StyledRow>
            <Content>
              <BuyButtons balanceBKFT={balanceBKFT} />
              <RedeemButton balanceBKFT={balanceBKFT} />
              {!!account && (
                <Link style={{ textDecoration: 'none' }} to="/status">
                  <OrderStatusLink>Check order status?</OrderStatusLink>
                </Link>
              )}
            </Content>
          </StyledRow>
        </GreyBg>
        <Checkout
          selectedTokenSymbol={selectedTokenSymbol}
          setSelectedTokenSymbol={setSelectedTokenSymbol}
          ready={ready}
          unlock={unlock}
          validateBuy={validateBuy}
          buy={buy}
          validateSell={validateSell}
          sell={sell}
          burn={burn}
          balanceBKFT={balanceBKFT}
          dollarPrice={dollarPrice}
          reserveBKFTToken={reserveBKFTToken}
          dollarize={dollarize}
          showConnect={showConnect}
          setShowConnect={setShowConnect}
          currentTransactionHash={currentTransaction.hash}
          currentTransactionType={currentTransaction.type}
          currentTransactionAmount={currentTransaction.amount}
          setCurrentTransaction={setCurrentTransaction}
          clearCurrentTransaction={clearCurrentTransaction}
          showWorks={showWorks}
          setShowWorks={setShowWorks}
          showNftModal={showNftModal}
          setShowNftModal={setShowNftModal}
        />
      </AppWrapper>
    </>
  )
}
