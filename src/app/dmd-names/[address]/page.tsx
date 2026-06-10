'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWeb3Context } from '@/contexts/Web3';
import { useWalletConnect } from '@/contexts/WalletConnect';
import DmdNameSearch from '@/components/DMDNames/DmdNameSearch';
import DmdNamesOwnedTable from '@/components/DMDNames/DmdNamesOwnedTable';
import '@/components/DMDNames/DmdNames.css';

export default function MyDmdNamesPage() {
  const router = useRouter();
  const params = useParams();
  const routeAddress = typeof params.address === 'string' ? params.address : '';
  const { userWallet } = useWeb3Context();
  const { isConnected } = useWalletConnect();

  useEffect(() => {
    if (!isConnected || !userWallet.myAddr) {
      router.replace('/');
      return;
    }

    if (routeAddress.toLowerCase() !== userWallet.myAddr.toLowerCase()) {
      router.replace(`/dmd-names/${userWallet.myAddr}`);
    }
  }, [isConnected, userWallet.myAddr, routeAddress, router]);

  if (!isConnected || !userWallet.myAddr || routeAddress.toLowerCase() !== userWallet.myAddr.toLowerCase()) {
    return null;
  }

  return (
    <div className="dmd-names-page">
      <section className="dmd-names-hero">
        <div className="cosmic-grid"></div>
        <div className="cosmic-elements">
          <div className="glow glow-1"></div>
          <div className="glow glow-2"></div>
        </div>
        <div className="container">
          <div className="dmd-names-hero-content">
            <h1>My DMD Names</h1>
            <p>
              Manage names owned by the connected wallet: activate a public name, renew ownership,
              view history, configure DNS and transfer ownership.
            </p>
          </div>
        </div>
      </section>

      <section className="dmd-names-content">
        <div className="container">
          <div className="dmd-names-search-card">
            <DmdNameSearch variant="page" showExamples />
          </div>

          <div className="dmd-names-stats">
            <div className="dmd-names-stats-card">
              <div className="dmd-names-stats-label">Active name</div>
              <div className="dmd-names-stats-sub">Publicly linked to this address</div>
            </div>
            <div className="dmd-names-stats-card">
              <div className="dmd-names-stats-label">Names owned</div>
              <div className="dmd-names-stats-sub">ERC-721 name NFTs</div>
            </div>
            <div className="dmd-names-stats-card">
              <div className="dmd-names-stats-label">Expiring soon</div>
              <div className="dmd-names-stats-sub">Renewal reminder shown</div>
            </div>
          </div>

          <DmdNamesOwnedTable />

          <div className="dmd-names-hints">
            <h3><i className="fas fa-info-circle"></i> Action hints in UI</h3>
            <ul>
              <li>
                <strong>Activate:</strong> Makes the selected name the public active name for this address;
                activation fee depends on how many times the active name was changed.
              </li>
              <li>
                <strong>Renew:</strong> Sends a keep-alive transaction and resets the 10-year validity window
                from that point; the UI provides reminders during the final year.
              </li>
              <li>
                <strong>Transfer:</strong> Moves ownership of the name NFT to another address; Diamond UI shows
                transfer fee + gas before confirmation.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
