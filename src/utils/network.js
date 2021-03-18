const isProd = process.env.NETWORK = "mainnet";

export const PROVIDER_URL = isProd
    ? process.env.REACT_APP_MAINNET_PROVIDER_URL
    : process.env.REACT_APP_GOERLI_PROVIDER_URL;

export const SUPPORTED_NETWORKS = isProd ? [1] : [1, 5];

export const SUPPORTED_NETWORK_URLS = isProd
    ? { 1: process.env.REACT_APP_MAINNET_PROVIDER_URL }
    : { 1: process.env.REACT_APP_MAINNET_PROVIDER_URL,
        5: process.env.REACT_APP_GOERLI_PROVIDER_URL
    }
