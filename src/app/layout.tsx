import "./globals.css";
import type { Metadata } from "next";
import { DAOProvider } from "@/contexts/DAO";
import { Geist, Geist_Mono } from "next/font/google";
import { WalletConnectProvider } from "@/contexts/WalletConnect";
import { StakingProvider } from "@/contexts/Staking";
import ThemeProvider from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { headers } from 'next/headers';
import { Web3ContextProvider } from "@/contexts/Web3";

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
              <StakingProvider>
                <DAOProvider>
                  <Header />
                  {children}
                  <Footer />
                </DAOProvider>
              </StakingProvider>
            </Web3ContextProvider>
          </WalletConnectProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
