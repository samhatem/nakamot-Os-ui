import { useEffect, useState, useCallback, useMemo } from 'react'
import { useWeb3Context } from 'web3-react'

import {
  isAddress,
  getTokenContract,
  getEtherBalance,
  getTokenBalance,
  getTokenAllowance,
  getExchangeAddress,
  getRouterContract,
  TOKEN_ADDRESSES
} from '../utils'
import { utils } from 'ethers'

export function useBlockEffect(functionToRun) {
  const { library } = useWeb3Context()

  useEffect(() => {
    if (library) {
      function wrappedEffect(blockNumber) {
        functionToRun(blockNumber)
      }
      library.on('block', wrappedEffect)
      return () => {
        library.removeListener('block', wrappedEffect)
      }
    }
  }, [library, functionToRun])
}

export function useTokenContract(tokenAddress, withSignerIfPossible = true) {
  const { library, account } = useWeb3Context()

  return useMemo(() => {
    try {
      return getTokenContract(tokenAddress, library, withSignerIfPossible ? account : undefined)
    } catch {
      return null
    }
  }, [account, library, tokenAddress, withSignerIfPossible])
}

/*
export function useExchangeContract(tokenAddress0, tokenAddress1, withSignerIfPossible = true) {
    const { library, account } = useWeb3Context()

    return useMemo(() => {
        try {
            return get
        }
    })
}
*/

export function useExchangeReserves(tokenAddress0, tokenAddress1) {
  const exchangeContract = useMemo(() => {
      const address0 = tokenAddress0 === TOKEN_ADDRESSES.ETH ? TOKEN_ADDRESSES.WETH : tokenAddress0
      const address1 = tokenAddress1 === TOKEN_ADDRESSES.ETH ? TOKEN_ADDRESSES.WETH : tokenAddress1

      return getExchangeAddress(address0, address1)
  }, [tokenAddress0, tokenAddress1]);

  const reserve0 = useAddressBalance(exchangeContract, tokenAddress0)
  const reserve1 = useAddressBalance(exchangeContract, tokenAddress1)

  return { reserve0, reserve1 }
}

export function useAddressBalance(address, tokenAddress) {
  const { library } = useWeb3Context()

  const [balance, setBalance] = useState()

  const updateBalance = useCallback(() => {
    if (isAddress(address) && (tokenAddress === 'ETH' || isAddress(tokenAddress))) {
      let stale = false

      ;(tokenAddress === 'ETH' ? getEtherBalance(address, library) : getTokenBalance(tokenAddress, address, library))
        .then(value => {
          if (!stale) {
            setBalance(value)
          }
        })
        .catch(() => {
          if (!stale) {
            setBalance(null)
          }
        })
      return () => {
        stale = true
        setBalance()
      }
    }
  }, [address, library, tokenAddress])

  useEffect(() => {
    return updateBalance()
  }, [updateBalance])

  useBlockEffect(updateBalance)

  return balance
}

export function useTotalSupply(contract) {
  const [totalSupply, setTotalSupply] = useState()

  const updateTotalSupply = useCallback(() => {
    if (!!contract) {
      let stale = false

      contract
        .totalSupply()
        .then(value => {
          if (!stale) {
            setTotalSupply(value)
          }
        })
        .catch(() => {
          if (!stale) {
            setTotalSupply(null)
          }
        })
      return () => {
        stale = true
        setTotalSupply()
      }
    }
  }, [contract])

  useEffect(() => {
    return updateTotalSupply()
  }, [updateTotalSupply])

  useBlockEffect(updateTotalSupply)

  return totalSupply && Math.round(Number(utils.formatEther(totalSupply)))
}

export function useAddressAllowance(address, tokenAddress, spenderAddress) {
  const { library } = useWeb3Context()

  const [allowance, setAllowance] = useState()

  const updateAllowance = useCallback(() => {
    if (isAddress(address) && isAddress(tokenAddress) && isAddress(spenderAddress)) {
      let stale = false

      getTokenAllowance(address, tokenAddress, spenderAddress, library)
        .then(allowance => {
          if (!stale) {
            setAllowance(allowance)
          }
        })
        .catch(() => {
          if (!stale) {
            setAllowance(null)
          }
        })

      return () => {
        stale = true
        setAllowance()
      }
    }
  }, [address, library, spenderAddress, tokenAddress])

  useEffect(() => {
    return updateAllowance()
  }, [updateAllowance])

  useBlockEffect(updateAllowance)

  return allowance
}

// tokenAddress0 is the address we're checking
export function useExchangeAllowance(address, tokenAddress0, tokenAddress1) {
  const exchangeContract = useMemo(
      () => {
          const address0 = tokenAddress0 === TOKEN_ADDRESSES.ETH ? TOKEN_ADDRESSES.WETH : tokenAddress0
          const address1 = tokenAddress1 === TOKEN_ADDRESSES.ETH ? TOKEN_ADDRESSES.WETH : tokenAddress1

          return getExchangeAddress(address0, address1)
      },
      [tokenAddress0, tokenAddress1]
  );

  return useAddressAllowance(address, tokenAddress0, exchangeContract)
}

export function useRouterContract() {
    const { library, account } = useWeb3Context()

    return useMemo(() => getRouterContract(library, account), [library, account])
}
