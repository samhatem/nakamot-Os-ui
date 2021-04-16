import React, { createContext, useContext } from 'react'

import { useNFTSupply } from '../hooks'

const SupplyContext = createContext({
  supply: 0
})

export const SupplyProvider = ({ children }) => {
  const supply = useNFTSupply()

  return (
    <SupplyContext.Provider value={{ supply }}>
      {children}
    </SupplyContext.Provider>
  )
}

export const useNftTotalSupply = () => {
  return useContext(SupplyContext)
}
