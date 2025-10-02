import "./index.css";
import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify"
import { DaoContextProvider } from "./contexts/DaoContext";
import { Web3ContextProvider } from "./contexts/Web3Context";
import { StakingContextProvider } from "./contexts/StakingContext";
import { WalletConnectContextProvider } from "./contexts/WalletConnect";

const originalFetch = window.fetch;
window.fetch = async (...args) => {
  try {
    return await originalFetch(...args);
  } catch (error: any) {
    if (error.message?.includes('Failed to fetch') && 
        (args[0]?.toString().includes('cca-lite.coinbase.com') || 
         args[0]?.toString().includes('metrics'))) {
      return new Response('{}', { status: 200, statusText: 'OK' });
    }
    throw error;
  }
};

// Suppress console errors for specific analytics failures
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = args.join(' ');
  if (message.includes('Analytics SDK') || 
      message.includes('cca-lite.coinbase.com') ||
      message.includes('ERR_BLOCKED_BY_CLIENT')) {
    return;
  }
  originalConsoleError(...args);
};

// Handle unhandled promise rejections for analytics
window.addEventListener('unhandledrejection', (event) => {
  const errorMessage = event.reason?.message || event.reason?.toString() || '';
  if (errorMessage.includes('Analytics SDK') ||
      errorMessage.includes('cca-lite.coinbase.com') ||
      errorMessage.includes('ERR_BLOCKED_BY_CLIENT') ||
      errorMessage.includes('Failed to fetch')) {

        event.preventDefault();
  }
});

interface AppContextProviderProps {
  children: React.ReactNode;
}

const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  return (
    <WalletConnectContextProvider>
      <Web3ContextProvider>
      <StakingContextProvider>
        <DaoContextProvider>
          
            {children}
          
        </DaoContextProvider>
        </StakingContextProvider>
      </Web3ContextProvider>
    </WalletConnectContextProvider>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <AppContextProvider>
    <App />
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  </AppContextProvider>
);
