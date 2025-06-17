import "./globals.css";
import type { Metadata } from "next";
import { DAOProvider } from "@/contexts/DAOContext";
import { Geist, Geist_Mono } from "next/font/google";
import { Web3Provider } from "@/contexts/Web3Context";
import { StakingProvider } from "@/contexts/StakingContext";
import ThemeProvider from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientWrapper from "@/components/ClientWrapper";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning={true}>
        <ClientWrapper>
          <ThemeProvider>
            <Web3Provider>
              <StakingProvider>
                <DAOProvider>
                  <Header />
                  {children}
                  <Footer />
                </DAOProvider>
              </StakingProvider>
            </Web3Provider>
          </ThemeProvider>
        </ClientWrapper>
      </body>
    </html>
  );
}
