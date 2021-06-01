import { ethers } from 'ethers'
import { Token, Pair } from '@uniswap/sdk'
import UncheckedJsonRpcSigner from './signer'
import { CHAIN_ID, ROUTER_ADDRESS, NFT_ADDRESS, BKFT_ADDRESS } from './constants'

import ERC20_ABI from './erc20.json'
import NFT_ABI from './nft.json'
import ROUTER_ABI from './router.json'

export * from './constants'

export function isAddress(value) {
  try {
    ethers.utils.getAddress(value)
    return true
  } catch {
    return false
  }
}

// account is optional
export function getProviderOrSigner(library, account) {
  return account ? new UncheckedJsonRpcSigner(library.getSigner(account)) : library
}

// account is optional
export function getContract(address, ABI, library, account) {
  if (!isAddress(address) || address === ethers.constants.AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new ethers.Contract(address, ABI, getProviderOrSigner(library, account))
}

export function getRouterContract(library, account) {
  return getContract(ROUTER_ADDRESS, ROUTER_ABI, library, account)
}

export function getTokenContract(tokenAddress, library, account) {
  return getContract(tokenAddress, ERC20_ABI, library, account)
}

export function getNFTContract(nftAddress, library, account) {
  return getContract(nftAddress, NFT_ABI, library, account)
}

// get the ether balance of an address
export async function getEtherBalance(address, library) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' parameter '${address}'`)
  }

  return library.getBalance(address)
}

// get the current block number
export async function getBlockNumber(library) {
  return library.getBlockNumber()
}

export function getExchangeAddress(tokenAddress0, tokenAddress1) {
  const token0 = new Token(CHAIN_ID, tokenAddress0, 18, 'TOKEN0', 'TKN0')
  const token1 = new Token(CHAIN_ID, tokenAddress1, 18, 'TOKEN1', 'TKN1')

  return Pair.getAddress(token0, token1)
}

// get the token balance of an address
export async function getTokenBalance(tokenAddress, address, library) {
  if (!isAddress(tokenAddress) || !isAddress(address)) {
    throw Error(`Invalid 'tokenAddress' or 'address' parameter '${tokenAddress}' or '${address}'.`)
  }

  return getContract(tokenAddress, ERC20_ABI, library).balanceOf(address)
}

export async function getTokenAllowance(address, tokenAddress, spenderAddress, library) {
  if (!isAddress(address) || !isAddress(tokenAddress) || !isAddress(spenderAddress)) {
    throw Error(
      "Invalid 'address' or 'tokenAddress' or 'spenderAddress' parameter" +
        `'${address}' or '${tokenAddress}' or '${spenderAddress}'.`
    )
  }

  return getContract(tokenAddress, ERC20_ABI, library).allowance(address, spenderAddress)
}

export async function getNFTBalance(address, library) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' + '${address}'`)
  }

  const tokenContract = new ethers.Contract(
    NFT_ADDRESS,
    ['function balanceOf(address owner) public view returns (uint256)'],
    library
  )

  return tokenContract.balanceOf(address)
}

export async function getOwnerTicketCount(address, library) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' + '${address}'`)
  }
  const erc20Contract = getTokenContract(BKFT_ADDRESS, library, address)

  return erc20Contract.ownerTicketCount(address)
}

export async function getMaxNFTCount(address, library) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' + '${address}'`)
  }
  const erc20Contract = getTokenContract(BKFT_ADDRESS, library, address)

  return erc20Contract.maxNFTSupply()
}

export async function getTotalTicketCount(address, library) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' + '${address}'`)
  }
  const erc20Contract = getTokenContract(BKFT_ADDRESS, library, address)

  return erc20Contract.ticketCount()
}

export async function getBlocksTilLottery(address, library) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' + '${address}'`)
  }
  const erc20Contract = getTokenContract(BKFT_ADDRESS, library, address)

  return erc20Contract.lottoBlock()
}

export async function getHasMintedNFTs(address, library) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' + '${address}'`)
  }
  const erc20Contract = getTokenContract(BKFT_ADDRESS, library, address)

  return erc20Contract.hasMintedNFTs()
}

export async function getLotteryWinners(address, library) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' + '${address}'`)
  }
  const nftContract = getNFTContract(NFT_ADDRESS, library, address)

  const promises = []

  for (let i = 0; i < 10; i += 1) {
    promises.push(nftContract.ownerOf(i))
  }

  return Promise.all(promises)
}

export async function getNFTIndices(address, library, tokensOwned) {
  if (!isAddress(address)) {
    throw Error(`Invalid 'address' + '${address}'`)
  }

  const tokenContract = new ethers.Contract(
    NFT_ADDRESS,
    ['function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)'],
    library
  )

  const promises = []

  for (let i = 0; i < tokensOwned; i += 1) {
    promises.push(tokenContract.tokenOfOwnerByIndex(address, i).then(index => index && index.toNumber()))
  }

  return Promise.all(promises)
}

export async function getNFTSupply(library) {
  const tokenContract = new ethers.Contract(
    NFT_ADDRESS,
    ['function totalSupply() public view returns (uint256)'],
    library
  )

  return tokenContract.totalSupply()
}

export function amountFormatter(amount, baseDecimals = 18, displayDecimals = 3, useLessThan = true) {
  if (baseDecimals > 18 || displayDecimals > 18 || displayDecimals > baseDecimals) {
    throw Error(`Invalid combination of baseDecimals '${baseDecimals}' and displayDecimals '${displayDecimals}.`)
  }

  // if balance is falsy, return undefined
  if (!amount) {
    return undefined
  }
  // if amount is 0, return
  else if (amount.isZero()) {
    return '0'
  }
  // amount > 0
  else {
    // amount of 'wei' in 1 'ether'
    const baseAmount = ethers.BigNumber.from(10).pow(ethers.BigNumber.from(baseDecimals))

    const minimumDisplayAmount = baseAmount.div(ethers.BigNumber.from(10).pow(ethers.BigNumber.from(displayDecimals)))

    // if balance is less than the minimum display amount
    if (amount.lt(minimumDisplayAmount)) {
      return useLessThan
        ? `<${ethers.utils.formatUnits(minimumDisplayAmount, baseDecimals)}`
        : `${ethers.utils.formatUnits(amount, baseDecimals)}`
    }
    // if the balance is greater than the minimum display amount
    else {
      const stringAmount = ethers.utils.formatUnits(amount, baseDecimals)

      // if there isn't a decimal portion
      if (!stringAmount.match(/\./)) {
        return stringAmount
      }
      // if there is a decimal portion
      else {
        const [wholeComponent, decimalComponent] = stringAmount.split('.')
        const roundUpAmount = minimumDisplayAmount.div(ethers.constants.Two)
        const roundedDecimalComponent = ethers.BigNumber.from(decimalComponent.padEnd(baseDecimals, '0'))
          .add(roundUpAmount)
          .toString()
          .padStart(baseDecimals, '0')
          .substring(0, displayDecimals)

        // decimals are too small to show
        if (roundedDecimalComponent === '0'.repeat(displayDecimals)) {
          return wholeComponent
        }
        // decimals are not too small to show
        else {
          return `${wholeComponent}.${roundedDecimalComponent.toString().replace(/0*$/, '')}`
        }
      }
    }
  }
}
