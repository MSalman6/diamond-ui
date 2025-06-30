import "./globals.css";
import type { Metadata } from "next";
import { DAOProvider } from "@/contexts/DAO";
import { Geist, Geist_Mono } from "next/font/google";
import { WalletConnectProvider } from "@/contexts/WalletConnect";
import { StakingContextProvider } from "@/contexts/Staking";
import ThemeProvider from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { headers } from 'next/headers';
import { Web3ContextProvider } from "@/contexts/Web3";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diamond UI",
  description: "Decentralized platform for DMD operations, offering tools for validator management, staking, DAO governance, and personalized user profiles to promote trust and stability in the DMD ecosystem.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get('cookie');

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning={true}>
        <ThemeProvider>
          <WalletConnectProvider cookies={cookies}>
            <Web3ContextProvider>
              <StakingContextProvider>
                <DAOProvider>
                  <Header />
                  {children}
                  <Footer />
                  <ToastContainer
                    position="bottom-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                  />
                </DAOProvider>
              </StakingContextProvider>
            </Web3ContextProvider>
          </WalletConnectProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
