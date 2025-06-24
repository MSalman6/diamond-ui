import { useAppKit } from '@reown/appkit/react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export const useWalletConnect = () => {
  const { open, close } = useAppKit()
  const { disconnect } = useDisconnect()
  const { connect, connectors } = useConnect()
  const { address, isConnected, isConnecting, isDisconnected } = useAccount()
  

  return {
    // AppKit methods
    open,
    close,
    
    // Wagmi account info
    address,
    isConnected,
    isConnecting,
    isDisconnected,
    
    // Connection methods
    connect,
    disconnect,
    connectors,
  }
}

export default useWalletConnect
