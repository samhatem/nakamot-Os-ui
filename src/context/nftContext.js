import React, { createContext, useContext } from 'react'

import { useNFTSupply, useNFTBalance, useNFTIndices } from '../hooks'

const NftContext = createContext({
  supply: 0,
  nftBalance: 0,
  nftIndices: 0
})

export const NftProvider = ({ children }) => {
  const supply = useNFTSupply()
  const nftBalance = useNFTBalance()
  const nftIndices = useNFTIndices(nftBalance)

  return (
    <NftContext.Provider value={{ supply, nftBalance, nftIndices }}>
      {children}
    </NftContext.Provider>
  )
}

export const useNftContext = () => {
  return useContext(NftContext)
}
