import { defineChain } from '@reown/appkit/networks'
import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || '2cceb4f25f1cb889b967ea3c40bfd7cd'

export const networks = [
    defineChain({
        id: Number(process.env.NEXT_PUBLIC_CHAINID) || 37373,
        chainNamespace: 'eip155',
        caipNetworkId: `eip155:${Number(process.env.NEXT_PUBLIC_CHAINID) || 37373}`,
        name: "DMD Diamond",
        nativeCurrency: {
            name: "DMD",
            symbol: "DMD",
            decimals: 18,
        },
        rpcUrls: {
            default: {
                http: [process.env.NEXT_PUBLIC_RPC_URL || 'https://testnet-rpc.bit.diamonds/'],
                webSocket: [process.env.NEXT_PUBLIC_WS_URL || 'wss://testnet-rpc.bit.diamonds/ws'],
            },
        },
        blockExplorers: {
            default: {
                name: "DMD Explorer",
                url: process.env.NEXT_PUBLIC_EXPLORER_URL || "https://testnet-explorer.bit.diamonds/",
            },
        },
    })
];


// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId: projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig
