import { defineChain } from '@reown/appkit/networks'
import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || ''

export const networks = [
    defineChain({
        id: Number(process.env.NEXT_PUBLIC_WC_PROJECT_ID_CHAINID) || 27272,
        chainNamespace: 'eip155',
        caipNetworkId: `eip155:${Number(process.env.NEXT_PUBLIC_WC_PROJECT_ID_CHAINID) || 27272}`,
        name: "DMD Diamond",
        nativeCurrency: {
            name: "DMD",
            symbol: "DMD",
            decimals: 18,
        },
        rpcUrls: {
            default: {
                http: [process.env.NEXT_PUBLIC_WC_PROJECT_ID_RPC_URL || 'https://beta-rpc.bit.diamonds/'],
                webSocket: [process.env.NEXT_PUBLIC_WS_URL || 'wss://beta-rpc.bit.diamonds/ws'],
            },
        },
        blockExplorers: {
            default: {
                name: "DMD Explorer",
                url: process.env.NEXT_PUBLIC_WC_PROJECT_ID_EXPLORER_URL || "https://beta-explorer.bit.diamonds/",
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
