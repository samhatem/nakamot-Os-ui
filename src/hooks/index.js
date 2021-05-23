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
  TOKEN_ADDRESSES,
  getNFTBalance,
  getNFTSupply,
  getNFTIndices,
  getOwnerTicketCount,
  getTotalTicketCount,
  getMaxNFTCount,
  getBlocksTilLottery,
  getLotteryWinners,
  getHasMintedNFTs
} from '../utils'
import { utils } from 'ethers'

const TEST_ACCOUNTS = [
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
  '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
  '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
  '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
  '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
  '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
  '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720'
]

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
  }, [tokenAddress0, tokenAddress1])

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

export function useNFTIndices(tokensOwned) {
  const { library, account } = useWeb3Context()

  const [nftIndices, setNftIndices] = useState()

  const updateIndices = useCallback(() => {
    if (!tokensOwned) {
      return
    }

    let stale = false

    getNFTIndices(account, library, tokensOwned)
      .then(indices => {
        if (!stale) {
          setNftIndices(indices)
        }
      })
      .catch(error => {
        console.log({ error })
        if (!stale) {
          setNftIndices(null)
        }
      })

    return () => {
      stale = true
      setNftIndices()
    }
  }, [library, account, tokensOwned])

  useEffect(() => {
    return updateIndices()
  }, [updateIndices])

  useBlockEffect(updateIndices)

  return nftIndices
}

export function useNFTBalance() {
  const { library, account } = useWeb3Context()

  const [nftBalance, setNFTBalance] = useState()

  const updateBalance = useCallback(() => {
    let stale = false

    getNFTBalance(account, library)
      .then(value => {
        if (!stale) {
          setNFTBalance(value)
        }
      })
      .catch(error => {
        if (!stale) {
          setNFTBalance(null)
        }
      })

    return () => {
      stale = true
      setNFTBalance()
    }
  }, [account, library])

  useEffect(() => {
    return updateBalance()
  }, [updateBalance])

  useBlockEffect(updateBalance)

  return nftBalance && nftBalance.toNumber()
}

export function useOwnerTicketCount() {
  const { library, account } = useWeb3Context()

  const [ownerTicketCount, setOwnerTicketCount] = useState()

  const updateOwnerTicketCount = useCallback(() => {
    let stale = false

    getOwnerTicketCount(account, library)
      .then(value => {
        if (!stale) {
          setOwnerTicketCount(value)
        }
      })
      .catch(error => {
        if (!stale) {
          setOwnerTicketCount(null)
        }
      })

    return () => {
      stale = true
      setOwnerTicketCount()
    }
  }, [account, library])

  useEffect(() => {
    return updateOwnerTicketCount()
  }, [updateOwnerTicketCount])

  useBlockEffect(updateOwnerTicketCount)

  ownerTicketCount && ownerTicketCount.toNumber()
  return 5
}

export function useTotalTicketCount() {
  const { library, account } = useWeb3Context()

  const [totalTicketCount, setTotalTicketCount] = useState()

  const updateTotalTicketCount = useCallback(() => {
    let stale = false

    getTotalTicketCount(account, library)
      .then(value => {
        if (!stale) {
          setTotalTicketCount(value)
        }
      })
      .catch(error => {
        if (!stale) {
          setTotalTicketCount(null)
        }
      })

    return () => {
      stale = true
      setTotalTicketCount()
    }
  }, [account, library])

  useEffect(() => {
    return updateTotalTicketCount()
  }, [updateTotalTicketCount])

  useBlockEffect(updateTotalTicketCount)

  const test = totalTicketCount && totalTicketCount.toNumber() + 1
  return 69
}

export function useMaxNFTCount() {
  const { library, account } = useWeb3Context()

  const [maxNFTCount, setMaxNFTCount] = useState()

  const updateMaxNFTCount = useCallback(() => {
    let stale = false

    getMaxNFTCount(account, library)
      .then(value => {
        if (!stale) {
          setMaxNFTCount(value)
        }
      })
      .catch(error => {
        if (!stale) {
          setMaxNFTCount(null)
        }
      })

    return () => {
      stale = true
      setMaxNFTCount()
    }
  }, [account, library])

  useEffect(() => {
    return updateMaxNFTCount()
  }, [updateMaxNFTCount])

  useBlockEffect(updateMaxNFTCount)

  maxNFTCount && maxNFTCount.toNumber()
  return 10
}

export function useBlockTilLottery() {
  const { library, account } = useWeb3Context()

  const [blockTilLottery, setBlockTilLottery] = useState()

  const updateBlockTilLottery = useCallback(() => {
    let stale = false

    getBlocksTilLottery(account, library)
      .then(value => {
        if (!stale) {
          setBlockTilLottery(value)
        }
      })
      .catch(error => {
        if (!stale) {
          setBlockTilLottery(null)
        }
      })

    return () => {
      stale = true
      setBlockTilLottery()
    }
  }, [account, library])

  useEffect(() => {
    return updateBlockTilLottery()
  }, [updateBlockTilLottery])

  useBlockEffect(updateBlockTilLottery)

  blockTilLottery && blockTilLottery.toNumber()
  return 40000
}

export function useHasMintedNFTs() {
  const { library, account } = useWeb3Context()

  const [hasMintedNFTs, setHasMintedNFTs] = useState()

  const updateHasMintedNFTs = useCallback(() => {
    let stale = false

    getHasMintedNFTs(account, library)
      .then(value => {
        if (!stale) {
          setHasMintedNFTs(value)
        }
      })
      .catch(error => {
        if (!stale) {
          setHasMintedNFTs(null)
        }
      })

    return () => {
      stale = true
      setHasMintedNFTs()
    }
  }, [account, library])

  useEffect(() => {
    return updateHasMintedNFTs()
  }, [updateHasMintedNFTs])

  useBlockEffect(updateHasMintedNFTs)

  // return hasMintedNFTs
  return true
}

export function useLotteryWinners() {
  const { library, account } = useWeb3Context()

  const [lotteryWinners, setLotteryWinners] = useState()

  const updateLotteryWinners = useCallback(() => {
    let stale = false

    getLotteryWinners(account, library)
      .then(value => {
        if (!stale) {
          setLotteryWinners(value)
        }
      })
      .catch(error => {
        if (!stale) {
          setLotteryWinners(null)
        }
      })

    return () => {
      stale = true
      setLotteryWinners()
    }
  }, [account, library])

  useEffect(() => {
    return updateLotteryWinners()
  }, [updateLotteryWinners])

  useBlockEffect(updateLotteryWinners)

  return (lotteryWinners && lotteryWinners.map(winner => winner.toNumber())) || TEST_ACCOUNTS
}

export function useNFTSupply() {
  const { library } = useWeb3Context()

  const [nftSupply, setNFTSupply] = useState()

  const updateSupply = useCallback(() => {
    let stale = false

    getNFTSupply(library)
      .then(value => {
        if (!stale) {
          setNFTSupply(value)
        }
      })
      .catch(error => {
        if (!stale) {
          setNFTSupply(null)
        }
      })

    return () => {
      stale = true
      setNFTSupply()
    }
  }, [library])

  useEffect(() => {
    return updateSupply()
  }, [updateSupply])

  useBlockEffect(updateSupply)

  return nftSupply && nftSupply.toNumber()
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
  const exchangeContract = useMemo(() => {
    const address0 = tokenAddress0 === TOKEN_ADDRESSES.ETH ? TOKEN_ADDRESSES.WETH : tokenAddress0
    const address1 = tokenAddress1 === TOKEN_ADDRESSES.ETH ? TOKEN_ADDRESSES.WETH : tokenAddress1

    return getExchangeAddress(address0, address1)
  }, [tokenAddress0, tokenAddress1])

  return useAddressAllowance(address, tokenAddress0, exchangeContract)
}

export function useRouterContract() {
  const { library, account } = useWeb3Context()

  return useMemo(() => getRouterContract(library, account), [library, account])
}
