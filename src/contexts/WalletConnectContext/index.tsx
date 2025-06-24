'use client';

import { createAppKit } from '@reown/appkit/react'
import React, { type ReactNode, useEffect, useState } from 'react'
import { wagmiAdapter, projectId, networks } from './config/wagmi'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Set up queryClient
const queryClient = new QueryClient()

// Set up metadata
const metadata = {
  name: 'Diamond UI',
  icons: ['/favicon.ico'],
  url: 'https://diamond-ui.vercel.app/',
  description: 'Decentralized platform for DMD operations, offering tools for validator management, staking, DAO governance, and personalized user profiles to promote trust and stability in the DMD ecosystem.'
}

// Supported wallet IDs
const supportedWalletIds = [
  "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // metamask
  "163d2cf19babf05eb8962e9748f9ebe613ed52ebf9c8107c9a0f104bfcf161b3", // brave
  "fd20dc426fb37566d803205b19178114f4db188b89b763c899ba0be274e97267d96", // coinbase
]

let appKitInitialized = false

const initializeAppKit = () => {
  if (appKitInitialized) return

  try {
    // Create the modal
    createAppKit({
      adapters: [wagmiAdapter],
      projectId: projectId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      networks: networks as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      defaultNetwork: networks[0] as any,
      metadata: metadata,
      features: {
        analytics: false,
        swaps: false,
        onramp: false,
      },
      allowUnsupportedChain: true,
      featuredWalletIds: supportedWalletIds,
      includeWalletIds: supportedWalletIds,
      excludeWalletIds: [
        "a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393", // phantom
      ],
      themeMode: "light",
      themeVariables: {
        "--w3m-accent": "#0145b2",
        "--w3m-color-mix": "#0e44b2",
        "--w3m-color-mix-strength": 20,
      },
      allWallets: "HIDE",
    })
    
    appKitInitialized = true
    console.log('✅ AppKit initialized successfully')
    return true
  } catch (error) {
    console.error('❌ Failed to initialize AppKit:', error)
    return false
  }
}

interface WalletConnectProviderProps {
  children: ReactNode;
  cookies?: string | null;
}

export const WalletConnectProvider: React.FC<WalletConnectProviderProps> = ({ 
  children, 
  cookies 
}) => {
  const [isAppKitReady, setIsAppKitReady] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)
  
  useEffect(() => {
    // Initialize AppKit on client side when environment variables are available
    const success = initializeAppKit()
    if (success !== false) {
      // Small delay to ensure AppKit is fully ready
      const timer = setTimeout(() => {
        setIsAppKitReady(true)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setInitError('Failed to initialize wallet connection')
    }
  }, [])
  
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  // Show error if initialization failed
  if (initError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-2">⚠️</div>
          <p className="text-red-600">{initError}</p>
          <p className="text-gray-600 text-sm mt-2">
            Please check your environment configuration
          </p>
        </div>
      </div>
    )
  }

  // Don't render children until AppKit is ready
  if (!isAppKitReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Initializing wallet connection...</p>
        </div>
      </div>
    )
  }

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WalletConnectProvider;
