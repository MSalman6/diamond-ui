'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import config from '@/lib/config';
import { usePrivacyMode } from '@/contexts/PrivacyMode';
import { useWeb3Context } from '@/contexts/Web3';
import { getNameHistory } from '@/services/dmdNaming';
import { formatDmdName, shortenAddress } from '@/utils/dmdNaming';
import type { DmdNameHistory, DmdNameHistoryEventType, OwnedDmdNameStatus } from '@/types/dmdNaming';

type Props = {
  name: string;
  backTo: 'my-names' | 'directory';
};

const STATUS_LABELS: Record<OwnedDmdNameStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  'expiring-soon': 'Expiring soon',
  expired: 'Expired',
};

const EVENT_ICONS: Record<DmdNameHistoryEventType, string> = {
  created: 'fa-user-plus',
  activated: 'fa-check-circle',
  'ownership-transferred': 'fa-right-left',
  renewed: 'fa-rotate',
  expiring: 'fa-triangle-exclamation',
  other: 'fa-circle-info',
};

function formatDateTime(timestampSeconds: number): string {
  return new Date(timestampSeconds * 1000).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }) + ' UTC';
}

function AddressLink({ address }: { address: string }) {
  const explorerUrl = config.explorerUrl;
  return (
    <span className="dmd-history-address">
      <a href={`${explorerUrl}address/${address}`} target="_blank" rel="noopener noreferrer">
        {shortenAddress(address)}
      </a>
      <button
        type="button"
        className="dmd-history-copy-btn"
        title="Copy address"
        onClick={() => {
          copy(address);
          toast.success('Copied to clipboard');
        }}
      >
        <i className="fas fa-copy"></i>
      </button>
    </span>
  );
}

export default function NameHistoryContent({ name, backTo }: Props) {
  const { isPrivacyMode } = usePrivacyMode();
  const { userWallet } = useWeb3Context();
  const [history, setHistory] = useState<DmdNameHistory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (isPrivacyMode) {
      setHistory(null);
      setError(null);
      setNotFound(false);
      return;
    }

    setHistory(null);
    setError(null);
    setNotFound(false);

    getNameHistory(name)
      .then(setHistory)
      .catch((err: any) => {
        if (err?.message === 'NOT_FOUND') {
          setNotFound(true);
        } else {
          setError('Unable to load name history right now. Please try again later.');
        }
      });
  }, [name, isPrivacyMode]);

  const backHref = backTo === 'my-names' && userWallet.myAddr ? `/dmd-names/${userWallet.myAddr}` : '/names';
  const backLabel = backTo === 'my-names' ? 'Back to My DMD Names' : 'Back to DMD Names';

  return (
    <div className="dmd-history">
      <Link href={backHref} className="dmd-history-back">
        <i className="fas fa-arrow-left"></i> {backLabel}
      </Link>

      {isPrivacyMode && (
        <div className="dmd-modal-notice dmd-modal-notice-warn">
          <i className="fas fa-shield-halved"></i>
          <p>Name history is indexed data and is not available while Privacy Mode is on.</p>
        </div>
      )}

      {!isPrivacyMode && notFound && (
        <div className="dmd-modal-notice dmd-modal-notice-warn">
          <i className="fas fa-circle-exclamation"></i>
          <p>&quot;{formatDmdName(name)}&quot; was not found in the index.</p>
        </div>
      )}

      {!isPrivacyMode && error && (
        <div className="dmd-modal-notice dmd-modal-notice-warn">
          <i className="fas fa-triangle-exclamation"></i>
          <p>{error}</p>
        </div>
      )}

      {!isPrivacyMode && !notFound && !error && !history && (
        <p className="dmd-owned-loading">Loading name history…</p>
      )}

      {history && (
        <>
          <div className="dmd-history-header">
            <div className="dmd-history-title">
              <div className="dmd-history-icon"><i className="fas fa-gem"></i></div>
              <div>
                <h1>{formatDmdName(history.name)}</h1>
                <span>DMD Name</span>
              </div>
            </div>
            <a
              className="btn-secondary"
              href={`${config.explorerUrl}address/${history.currentOwner}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Explorer <i className="fas fa-external-link-alt"></i>
            </a>
          </div>

          <div className="dmd-history-stats">
            <div className="dmd-history-stat">
              <span>Creator</span>
              <AddressLink address={history.creator} />
            </div>
            <div className="dmd-history-stat">
              <span>Created on</span>
              <strong>{formatDateTime(history.createdAt)}</strong>
            </div>
            <div className="dmd-history-stat">
              <span>Current owner</span>
              <AddressLink address={history.currentOwner} />
            </div>
            <div className="dmd-history-stat">
              <span>Current status</span>
              <span className={`dmd-status-pill dmd-status-pill--${history.status}`}>
                {STATUS_LABELS[history.status]}
              </span>
            </div>
          </div>

          <div className="dmd-history-timeline-section">
            <h2>History timeline</h2>
            <div className="dmd-history-timeline">
              {history.timeline.length === 0 && (
                <p className="dmd-owned-empty">No events recorded for this name yet.</p>
              )}
              {history.timeline.map((event, i) => (
                <div className="dmd-history-event" key={`${event.type}-${event.timestamp}-${i}`}>
                  <div className={`dmd-history-event-icon dmd-history-event-icon--${event.type}`}>
                    <i className={`fas ${EVENT_ICONS[event.type] ?? EVENT_ICONS.other}`}></i>
                  </div>
                  <div className={`dmd-history-event-label dmd-history-event-label--${event.type}`}>
                    {event.label}
                  </div>
                  <div className="dmd-history-event-description">{event.description}</div>
                  <div className="dmd-history-event-time">{formatDateTime(event.timestamp)}</div>
                </div>
              ))}
            </div>
          </div>

          {history.transfers.length > 0 && (
            <div className="dmd-history-transfers-section">
              <h2>Transfer history</h2>
              <div className="dmd-owned-table-wrapper">
                <table className="dmd-owned-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Tx reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.transfers.map((transfer, i) => (
                      <tr key={`${transfer.timestamp}-${i}`}>
                        <td>{formatDateTime(transfer.timestamp)}</td>
                        <td><AddressLink address={transfer.from} /></td>
                        <td><AddressLink address={transfer.to} /></td>
                        <td>
                          {transfer.txHash ? (
                            <a
                              href={`${config.explorerUrl}tx/${transfer.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {shortenAddress(transfer.txHash)} <i className="fas fa-external-link-alt"></i>
                            </a>
                          ) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
