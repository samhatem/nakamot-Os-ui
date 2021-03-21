import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useWeb3Context } from 'web3-react'
import { ethers } from 'ethers'

import { TOKEN_SYMBOLS, TOKEN_ADDRESSES, ERROR_CODES } from '../../utils'
import {
  useTokenContract,
  useAddressBalance,
  useAddressAllowance,
  useExchangeReserves,
  useExchangeAllowance,
  useTotalSupply,
  useRouterContract
} from '../../hooks'
import Body from '../Body'
import Stats from '../Stats'
import Status from '../Status'
import { getExchangeAddress } from "../../utils"

// denominated in bips
const GAS_MARGIN = ethers.BigNumber.from(1000)

export function calculateGasMargin(value, margin) {
  const offset = value.mul(margin).div(ethers.BigNumber.from(10000))
  return value.add(offset)
}

// denominated in seconds
const DEADLINE_FROM_NOW = 60 * 15

// denominated in bips
const ALLOWED_SLIPPAGE = ethers.BigNumber.from(200)

function calculateSlippageBounds(value) {
  const offset = value.mul(ALLOWED_SLIPPAGE).div(ethers.BigNumber.from(10000))
  const minimum = value.sub(offset)
  const maximum = value.add(offset)
  return {
    minimum: minimum.lt(ethers.constants.Zero) ? ethers.constants.Zero : minimum,
    maximum: maximum.gt(ethers.constants.MaxUint256) ? ethers.constants.MaxUint256 : maximum
  }
}

// this mocks the getInputPrice function, and calculates the required output
function calculateEtherTokenOutputFromInput(inputAmount, inputReserve, outputReserve) {
  const inputAmountWithFee = inputAmount.mul(ethers.BigNumber.from(997))
  const numerator = inputAmountWithFee.mul(outputReserve)
  const denominator = inputReserve.mul(ethers.BigNumber.from(1000)).add(inputAmountWithFee)
  return numerator.div(denominator)
}

// this mocks the getOutputPrice function, and calculates the required input
function calculateEtherTokenInputFromOutput(outputAmount, inputReserve, outputReserve) {
  const numerator = inputReserve.mul(outputAmount).mul(ethers.BigNumber.from(1000))
  const denominator = outputReserve.sub(outputAmount).mul(ethers.BigNumber.from(997))
  return numerator.div(denominator).add(ethers.constants.One)
}

// get exchange rate for a token/ETH pair
function getExchangeRate(inputValue, outputValue, invert = false) {
  const inputDecimals = 18
  const outputDecimals = 18

  if (inputValue && inputDecimals && outputValue && outputDecimals) {
    const factor = ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18))

    if (invert) {
      return inputValue
        .mul(factor)
        .div(outputValue)
        .mul(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(outputDecimals)))
        .div(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(inputDecimals)))
    } else {
      return outputValue
        .mul(factor)
        .div(inputValue)
        .mul(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(inputDecimals)))
        .div(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(outputDecimals)))
    }
  }
}

function calculateAmount(
  inputTokenSymbol,
  outputTokenSymbol,
  SOCKSAmount,
  reserveBKFTWETH,
  reserveBKFTToken,
  reserveSelectedTokenETH,
  reserveSelectedTokenToken
) {
  // eth to token - buy
  if (inputTokenSymbol === TOKEN_SYMBOLS.ETH && outputTokenSymbol === TOKEN_SYMBOLS.SOCKS) {
    const amount = calculateEtherTokenInputFromOutput(SOCKSAmount, reserveBKFTWETH, reserveBKFTToken)
    if (amount.lte(ethers.constants.Zero) || amount.gte(ethers.constants.MaxUint256)) {
      throw Error()
    }
    return amount
  }

  // token to eth - sell
  if (inputTokenSymbol === TOKEN_SYMBOLS.SOCKS && outputTokenSymbol === TOKEN_SYMBOLS.ETH) {
    const amount = calculateEtherTokenOutputFromInput(SOCKSAmount, reserveBKFTToken, reserveBKFTWETH)
    if (amount.lte(ethers.constants.Zero) || amount.gte(ethers.constants.MaxUint256)) {
      throw Error()
    }

    return amount
  }

  // token to token - buy or sell
  const buyingSOCKS = outputTokenSymbol === TOKEN_SYMBOLS.SOCKS

  if (buyingSOCKS) {
    // eth needed to buy x socks
    const intermediateValue = calculateEtherTokenInputFromOutput(SOCKSAmount, reserveBKFTWETH, reserveBKFTToken)
    // calculateEtherTokenOutputFromInput
    if (intermediateValue.lte(ethers.constants.Zero) || intermediateValue.gte(ethers.constants.MaxUint256)) {
      throw Error()
    }
    // tokens needed to buy x eth
    const amount = calculateEtherTokenInputFromOutput(
      intermediateValue,
      reserveSelectedTokenToken,
      reserveSelectedTokenETH
    )
    if (amount.lte(ethers.constants.Zero) || amount.gte(ethers.constants.MaxUint256)) {
      throw Error()
    }
    return amount
  } else {
    // eth gained from selling x socks
    const intermediateValue = calculateEtherTokenOutputFromInput(SOCKSAmount, reserveBKFTToken, reserveBKFTWETH)
    if (intermediateValue.lte(ethers.constants.Zero) || intermediateValue.gte(ethers.constants.MaxUint256)) {
      throw Error()
    }
    // tokens yielded from selling x eth
    const amount = calculateEtherTokenOutputFromInput(
      intermediateValue,
      reserveSelectedTokenETH,
      reserveSelectedTokenToken
    )
    if (amount.lte(ethers.constants.Zero) || amount.gte(ethers.constants.MaxUint256)) {
      throw Error()
    }
    return amount
  }
}

export default function Main({ stats, status }) {
  const { library, account } = useWeb3Context()

  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState(TOKEN_SYMBOLS.ETH)
  const tokenContractSelectedToken = useTokenContract(TOKEN_ADDRESSES[selectedTokenSymbol])
  const allowanceSelectedToken = useExchangeAllowance(account, TOKEN_ADDRESSES.BKFT, TOKEN_ADDRESSES[selectedTokenSymbol])
  const { reserveETH: reserveSelectedTokenETH, reserveToken: reserveSelectedTokenToken } = useExchangeReserves(
    TOKEN_ADDRESSES.BKFT,
    TOKEN_ADDRESSES[selectedTokenSymbol]
  )

  const [USDExchangeRateSelectedToken, setUSDExchangeRateSelectedToken] = useState()

  // get token contracts
  const tokenContractBKFT = useTokenContract(TOKEN_ADDRESSES.BKFT)

  // get router contract
  const router = useRouterContract();

  // get balances
  const balanceETH = useAddressBalance(account, TOKEN_ADDRESSES.ETH)
  const balanceBKFT = useAddressBalance(account, TOKEN_ADDRESSES.BKFT)
  const balanceSelectedToken = useAddressBalance(account, TOKEN_ADDRESSES[selectedTokenSymbol])

  const bkftWethExchangeAddress = useMemo(() => getExchangeAddress(TOKEN_ADDRESSES.WETH, TOKEN_ADDRESSES.BKFT), [])
  const usdcWethExchangeAddress = useMemo(() => getExchangeAddress(TOKEN_ADDRESSES.WETH, TOKEN_ADDRESSES.USDC), [])

  // totalsupply
  const totalSupply = useTotalSupply(tokenContractBKFT)

  // get allowances
  const allowanceBKFT = useAddressAllowance(
    account,
    TOKEN_ADDRESSES.BKFT,
    bkftWethExchangeAddress
  )

  // get reserves
  const reserveBKFTWETH = useAddressBalance(bkftWethExchangeAddress, TOKEN_ADDRESSES.WETH)
  const reserveBKFTToken = useAddressBalance(
    bkftWethExchangeAddress,
    TOKEN_ADDRESSES.BKFT
  )

  const reserveUSDCETH = useAddressBalance(usdcWethExchangeAddress, TOKEN_ADDRESSES.WETH)
  const reserveUSDCToken = useAddressBalance(usdcWethExchangeAddress, TOKEN_ADDRESSES.USDC)

  const [USDExchangeRateETH, setUSDExchangeRateETH] = useState()

  const ready = !!(
    (account === null || allowanceBKFT) &&
    (selectedTokenSymbol === 'ETH' || account === null || allowanceSelectedToken) &&
    (account === null || balanceETH) &&
    (account === null || balanceBKFT) &&
    (account === null || balanceSelectedToken) &&
    reserveBKFTWETH &&
    reserveBKFTToken &&
    (selectedTokenSymbol === 'ETH' || reserveSelectedTokenETH) &&
    (selectedTokenSymbol === 'ETH' || reserveSelectedTokenToken) &&
    selectedTokenSymbol &&
    (USDExchangeRateETH || USDExchangeRateSelectedToken)
  )

  useEffect(() => {
    try {
      const exchangeRateUSDC = getExchangeRate(reserveUSDCETH, reserveUSDCToken)

      if (selectedTokenSymbol === TOKEN_SYMBOLS.ETH) {
        setUSDExchangeRateETH(exchangeRateUSDC)
      } else {
        const exchangeRateSelectedToken = getExchangeRate(reserveSelectedTokenETH, reserveSelectedTokenToken)
        if (exchangeRateUSDC && exchangeRateSelectedToken) {
          setUSDExchangeRateSelectedToken(
            exchangeRateUSDC
              .mul(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18)))
              .div(exchangeRateSelectedToken)
          )
        }
      }
    } catch {
      setUSDExchangeRateETH()
      setUSDExchangeRateSelectedToken()
    }
  }, [reserveUSDCETH, reserveUSDCToken, reserveSelectedTokenETH, reserveSelectedTokenToken, selectedTokenSymbol])

  function _dollarize(amount, exchangeRate) {
    return amount.mul(exchangeRate).div(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18)))
  }

  function dollarize(amount) {
    return _dollarize(
      amount,
      selectedTokenSymbol === TOKEN_SYMBOLS.ETH ? USDExchangeRateETH : USDExchangeRateSelectedToken
    )
  }

  const [dollarPrice, setDollarPrice] = useState()
  useEffect(() => {
    try {
      const SOCKSExchangeRateETH = getExchangeRate(reserveBKFTToken, reserveBKFTWETH)
      setDollarPrice(
        SOCKSExchangeRateETH.mul(USDExchangeRateETH).div(
          ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18))
        )
      )
    } catch {
      setDollarPrice()
    }
  }, [USDExchangeRateETH, reserveBKFTToken, reserveBKFTWETH])

  async function unlock(buyingSOCKS = true) {
    const contract = buyingSOCKS ? tokenContractSelectedToken : tokenContractBKFT
    const spenderAddress = bkftWethExchangeAddress // buyingSOCKS ? exchangeContractSelectedToken.address : exchangeContractSOCKS.address

    const estimatedGasLimit = await contract.estimate.approve(spenderAddress, ethers.constants.MaxUint256)
    const estimatedGasPrice = await library
      .getGasPrice()
      .then(gasPrice => gasPrice.mul(ethers.BigNumber.from(150)).div(ethers.BigNumber.from(100)))

    return contract.approve(spenderAddress, ethers.constants.MaxUint256, {
      gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
      gasPrice: estimatedGasPrice
    })
  }

  // buy functionality
  const validateBuy = useCallback(
    numberOfSOCKS => {
      // validate passed amount
      let parsedValue
      try {
        parsedValue = ethers.utils.parseUnits(numberOfSOCKS, 18)
      } catch (error) {
        error.code = ERROR_CODES.INVALID_AMOUNT
        throw error
      }

      let requiredValueInSelectedToken
      try {
        requiredValueInSelectedToken = calculateAmount(
          selectedTokenSymbol,
          TOKEN_SYMBOLS.SOCKS,
          parsedValue,
          reserveBKFTWETH,
          reserveBKFTToken,
          reserveSelectedTokenETH,
          reserveSelectedTokenToken
        )
      } catch (error) {
        error.code = ERROR_CODES.INVALID_TRADE
        throw error
      }

      // get max slippage amount
      const { maximum } = calculateSlippageBounds(requiredValueInSelectedToken)

      // the following are 'non-breaking' errors that will still return the data
      let errorAccumulator
      // validate minimum ether balance
      if (balanceETH && balanceETH.lt(ethers.utils.parseEther('.01'))) {
        const error = Error()
        error.code = ERROR_CODES.INSUFFICIENT_ETH_GAS
        if (!errorAccumulator) {
          errorAccumulator = error
        }
      }

      // validate minimum selected token balance
      if (balanceSelectedToken && maximum && balanceSelectedToken.lt(maximum)) {
        const error = Error()
        error.code = ERROR_CODES.INSUFFICIENT_SELECTED_TOKEN_BALANCE
        if (!errorAccumulator) {
          errorAccumulator = error
        }
      }

      // validate allowance
      if (selectedTokenSymbol !== 'ETH') {
        if (allowanceSelectedToken && maximum && allowanceSelectedToken.lt(maximum)) {
          const error = Error()
          error.code = ERROR_CODES.INSUFFICIENT_ALLOWANCE
          if (!errorAccumulator) {
            errorAccumulator = error
          }
        }
      }

      return {
        inputValue: requiredValueInSelectedToken,
        maximumInputValue: maximum,
        outputValue: parsedValue,
        error: errorAccumulator
      }
    },
    [allowanceSelectedToken, balanceETH, balanceSelectedToken, reserveBKFTToken, reserveBKFTWETH, reserveSelectedTokenETH, reserveSelectedTokenToken, selectedTokenSymbol]
  )

  async function buy(maximumInputValue, outputValue) {
    const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW

    const estimatedGasPrice = await library
      .getGasPrice()
      .then(gasPrice => gasPrice.mul(ethers.BigNumber.from(150)).div(ethers.BigNumber.from(100)))

    if (selectedTokenSymbol === TOKEN_SYMBOLS.ETH) {
      const estimatedGasLimit = await router.estimate.swapETHForExactTokens(
          outputValue,
          [TOKEN_ADDRESSES.WETH, TOKEN_ADDRESSES.BKFT],
          account,
          deadline,
          { value: maximumInputValue }
      )
      return router.swapETHForExactTokens(
          outputValue,
          [TOKEN_ADDRESSES.WETH, TOKEN_ADDRESSES.BKFT],
          account,
          deadline,
          {
              value: maximumInputValue,
              gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
              gasPrice: estimatedGasPrice
          }
      )
    } else {
      throw new Error('No Support for swapping with tokens other than ETH')
      /*
      const estimatedGasLimit = await exchangeContractSelectedToken.estimate.tokenToTokenSwapOutput(
        outputValue,
        maximumInputValue,
        ethers.constants.MaxUint256,
        deadline,
        TOKEN_ADDRESSES.SOCKS
      )
      return exchangeContractSelectedToken.tokenToTokenSwapOutput(
        outputValue,
        maximumInputValue,
        ethers.constants.MaxUint256,
        deadline,
        TOKEN_ADDRESSES.SOCKS,
        {
          gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
          gasPrice: estimatedGasPrice
        }
      )
      */
    }
  }

  // sell functionality
  const validateSell = useCallback(
    numberOfSOCKS => {
      // validate passed amount
      let parsedValue
      try {
        parsedValue = ethers.utils.parseUnits(numberOfSOCKS, 18)
      } catch (error) {
        error.code = ERROR_CODES.INVALID_AMOUNT
        throw error
      }

      // how much ETH or tokens the sale will result in
      let requiredValueInSelectedToken
      try {
        requiredValueInSelectedToken = calculateAmount(
          TOKEN_SYMBOLS.SOCKS,
          selectedTokenSymbol,
          parsedValue,
          reserveBKFTWETH,
          reserveBKFTToken,
          reserveSelectedTokenETH,
          reserveSelectedTokenToken
        )
      } catch (error) {
        error.code = ERROR_CODES.INVALID_EXCHANGE
        throw error
      }

      // slippage-ized
      const { minimum } = calculateSlippageBounds(requiredValueInSelectedToken)

      // the following are 'non-breaking' errors that will still return the data
      let errorAccumulator
      // validate minimum ether balance
      if (balanceETH.lt(ethers.utils.parseEther('.01'))) {
        const error = Error()
        error.code = ERROR_CODES.INSUFFICIENT_ETH_GAS
        if (!errorAccumulator) {
          errorAccumulator = error
        }
      }

      // validate minimum socks balance
      if (balanceBKFT.lt(parsedValue)) {
        const error = Error()
        error.code = ERROR_CODES.INSUFFICIENT_SELECTED_TOKEN_BALANCE
        if (!errorAccumulator) {
          errorAccumulator = error
        }
      }

      // validate allowance
      if (allowanceBKFT.lt(parsedValue)) {
        const error = Error()
        error.code = ERROR_CODES.INSUFFICIENT_ALLOWANCE
        if (!errorAccumulator) {
          errorAccumulator = error
        }
      }

      return {
        inputValue: parsedValue,
        outputValue: requiredValueInSelectedToken,
        minimumOutputValue: minimum,
        error: errorAccumulator
      }
    },
    [balanceETH, balanceBKFT, allowanceBKFT, selectedTokenSymbol, reserveBKFTWETH, reserveBKFTToken, reserveSelectedTokenETH, reserveSelectedTokenToken]
  )

  async function sell(inputValue, minimumOutputValue) {
    const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW

    const estimatedGasPrice = await library
      .getGasPrice()
      .then(gasPrice => gasPrice.mul(ethers.BigNumber.from(150)).div(ethers.BigNumber.from(100)))

    if (selectedTokenSymbol === TOKEN_SYMBOLS.ETH) {
      const estimatedGasLimit = await router.estimate.swapExactTokensForETH(
        inputValue,
        minimumOutputValue,
        [TOKEN_ADDRESSES.BKFT, TOKEN_ADDRESSES.WETH],
        account,
        deadline
      )
      return router.swapExactTokensForETH(
          inputValue,
          minimumOutputValue,
          [TOKEN_ADDRESSES.BKFT, TOKEN_ADDRESSES.WETH],
          account,
          deadline,
          {
              gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
              gasPrice: estimatedGasPrice
          }
      )
    } else {
      throw new Error("Swaps for tokens other than ETH not yet supported")
      /*
      const estimatedGasLimit = await exchangeContractSOCKS.estimate.tokenToTokenSwapInput(
        inputValue,
        minimumOutputValue,
        ethers.constants.One,
        deadline,
        TOKEN_ADDRESSES[selectedTokenSymbol]
      )
      return exchangeContractSOCKS.tokenToTokenSwapInput(
        inputValue,
        minimumOutputValue,
        ethers.constants.One,
        deadline,
        TOKEN_ADDRESSES[selectedTokenSymbol],
        {
          gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
          gasPrice: estimatedGasPrice
        }
      )
      */
    }
  }

  async function burn(amount) {
    const parsedAmount = ethers.utils.parseUnits(amount, 18)

    const estimatedGasPrice = await library
      .getGasPrice()
      .then(gasPrice => gasPrice.mul(ethers.BigNumber.from(150)).div(ethers.BigNumber.from(100)))

    const estimatedGasLimit = await tokenContractBKFT.estimate.burn(parsedAmount)

    return tokenContractBKFT.burn(parsedAmount, {
      gasLimit: calculateGasMargin(estimatedGasLimit, GAS_MARGIN),
      gasPrice: estimatedGasPrice
    })
  }

  return stats ? (
    <Stats reserveBKFTToken={reserveBKFTToken} totalSupply={totalSupply} ready={ready} balanceBKFT={balanceBKFT} />
  ) : status ? (
    <Status totalSupply={totalSupply} ready={ready} balanceBKFT={balanceBKFT} />
  ) : (
    <Body
      selectedTokenSymbol={selectedTokenSymbol}
      setSelectedTokenSymbol={setSelectedTokenSymbol}
      ready={ready}
      unlock={unlock}
      validateBuy={validateBuy}
      buy={buy}
      validateSell={validateSell}
      sell={sell}
      burn={burn}
      dollarize={dollarize}
      dollarPrice={dollarPrice}
      balanceBKFT={balanceBKFT}
      reserveBKFTToken={reserveBKFTToken}
      totalSupply={totalSupply}
    />
  )
}
