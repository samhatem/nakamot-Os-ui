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
  position: fixed;
  width: 100%;
  box-sizing: border-box;
  margin: 0px;
  font-size: 1.25rem;
  color: ${props => (props.balanceBKFT ? props.theme.primary : 'white')};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem;
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
  // props.account === null ? props.theme.orange : props.theme.green};
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
  totalSupply
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

  return (
    <AppWrapper overlay={state.visible}>
      <Header
        totalSupply={totalSupply}
        ready={ready}
        dollarPrice={dollarPrice}
        balanceBKFT={balanceBKFT}
        setShowConnect={setShowConnect}
        setShowNftModal={setShowNftModal}
      />

      <Content>
        <StyledImage src="nakamotos-title.png" alt="Nakamot-Os" />
        <Card totalSupply={totalSupply} dollarPrice={dollarPrice} reserveBKFTToken={reserveBKFTToken} />{' '}
        <Info>
          <div style={{ marginBottom: '4px' }}>Buy and sell real cereal with digital currency.</div>
          <div style={{ marginBottom: '4px' }}>
            Delivered on demand.{' '}
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
          </div>
          {/* <SubInfo>
            An experiment in pricing and user experience by the team at Uniswap.{' '}
            <a
              href="/"
              onClick={e => {
                e.preventDefault()
                setState(state => ({ ...state, visible: !state.visible }))
                setShowWorks(true)
              }}
            >
              How it works.
            </a>
          </SubInfo> */}
        </Info>
        <BuyButtons balanceBKFT={balanceBKFT} />
        <RedeemButton balanceBKFT={balanceBKFT} />
        {!!account && (
          <Link style={{ textDecoration: 'none' }} to="/status">
            <OrderStatusLink>Check order status?</OrderStatusLink>
          </Link>
        )}
      </Content>
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
  )
}

const AppWrapper = styled.div`
  width: 100vw;
  height: 100%;
  margin: 0px auto;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  overflow: ${props => (props.overlay ? 'hidden' : 'scroll')};
  scroll-behavior: smooth;
  position: ${props => (props.overlay ? 'fixed' : 'initial')};
`

const Content = styled.div`
  width: calc(100vw - 32px);
  max-width: 375px;
  margin-top: 72px;
`

const Info = styled.div`
  color: ${props => props.theme.text};
  font-weight: 500;
  margin: 0px;
  font-size: 14px;
  padding: 20px;
  padding-top: 32px;
  margin-bottom: 12px;
  margin-top: -12px;
  /* margin-top: 16px; */
  background-color: ${props => '#f1f2f6'};
  a {
    color: ${props => props.theme.orange};
    text-decoration: none;
    /* padding-top: 8px; */
    /* font-size: 14px; */
  }
  a:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`

const OrderStatusLink = styled.p`
  color: ${props => props.theme.orange};
  text-align: center;
  font-size: 0.6rem;
`

const Unicorn = styled.p`
  color: white;
  font-weight: 600;
  margin: auto 0px;
  font-size: 16px;
`

const StyledImage = styled.img`
  margin-bottom: 50px;
  margin-top: 50px;
`
