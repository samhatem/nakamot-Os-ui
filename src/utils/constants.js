import { ChainId } from '@uniswap/sdk'

const isProd = process.env.NETWORK === "mainnet";

export const PROVIDER_URL = isProd
    ? process.env.REACT_APP_MAINNET_PROVIDER_URL
    : process.env.REACT_APP_GOERLI_PROVIDER_URL;

export const SUPPORTED_NETWORKS = isProd ? [1] : [1, 5];

export const SUPPORTED_NETWORK_URLS = isProd
    ? { 1: process.env.REACT_APP_MAINNET_PROVIDER_URL }
    : { 1: process.env.REACT_APP_MAINNET_PROVIDER_URL,
        5: process.env.REACT_APP_GOERLI_PROVIDER_URL
    }

export const CHAIN_ID = isProd ? ChainId.MAINNET : ChainId.GOERLI

export const INITIAL_SUPPLY = 2100

export const NFT_MAX_SUPPLY = 210

export const TOKEN_SYMBOL = 'BOX'

export const ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'

export const FACTORY_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'

export const NFT_ADDRESS = isProd ? 'bad address' : '0xE76Fe023165765dB27b8611369C611B28985b044'

export const NFT_URI = "https://arweave.net/w8Vs3I-TmRIcZVNaSkxjVhtWc9ZJleCJeSRlpXEVdPM"

export const BKFT_ADDRESS = isProd ? 'bad address' : '0x6b40A0c525aC66Fdd44af375F760701dfB5B0a6e'

const WETH_ADDRESS = isProd ? '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' : '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6'

const USDC_ADDRESS = isProd ? '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' : '0x9DA9Bc12b19b22d7C55798F722A1B6747AE9A710'

export const TOKEN_ADDRESSES = {
  ETH: 'ETH',
  BKFT: BKFT_ADDRESS,
  DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
  USDC: USDC_ADDRESS,
  USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  UNI: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  WETH: WETH_ADDRESS
}

export const TOKEN_SYMBOLS = Object.keys(TOKEN_ADDRESSES).reduce((o, k) => {
  o[k] = k
  return o
}, {})

export const ERROR_CODES = [
  'INVALID_AMOUNT',
  'INVALID_TRADE',
  'INSUFFICIENT_ETH_GAS',
  'INSUFFICIENT_SELECTED_TOKEN_BALANCE',
  'INSUFFICIENT_ALLOWANCE'
].reduce((o, k, i) => {
  o[k] = i
  return o
}, {})

export const TRADE_TYPES = ['BUY', 'SELL', 'UNLOCK', 'REDEEM'].reduce((o, k, i) => {
  o[k] = i
  return o
}, {})
