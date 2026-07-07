'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePrivacyMode } from '@/contexts/PrivacyMode';
import { getOwnedNames } from '@/services/dmdNaming';
import { formatDmdDate, formatDmdName } from '@/utils/dmdNaming';
import type { OwnedDmdName, OwnedDmdNameStatus } from '@/types/dmdNaming';
import ActivateNameModal from './ActivateNameModal';

type Props = {
  walletAddress: string;
  activeName: string | null;
};

const STATUS_LABELS: Record<OwnedDmdNameStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  'expiring-soon': 'Expiring soon',
  expired: 'Expired',
};

function StatusPill({ status }: { status: OwnedDmdNameStatus }) {
  return <span className={`dmd-status-pill dmd-status-pill--${status}`}>{STATUS_LABELS[status]}</span>;
}

export default function OwnedNamesSection({ walletAddress, activeName }: Props) {
  const { isPrivacyMode } = usePrivacyMode();
  const [names, setNames] = useState<OwnedDmdName[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activateTarget, setActivateTarget] = useState<string | null>(null);
  const [openMenuFor, setOpenMenuFor] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const reload = useCallback(() => {
    if (isPrivacyMode) {
      setNames(null);
      setError('Owned names are not available in Privacy Mode.');
      return;
    }

    setError(null);
    setNames(null);

    getOwnedNames(walletAddress)
      .then(setNames)
      .catch(() => {
        setNames([]);
        setError('Unable to load owned names right now. Please try again later.');
      });
  }, [walletAddress, isPrivacyMode]);

  useEffect(() => {
    reload();
  }, [reload]);

  useEffect(() => {
    if (!openMenuFor) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuFor(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuFor]);

  // On error `names` is set to [] just so the table can render an empty body — that must
  // not be read as "confirmed zero names owned" by the stat cards, so gate on error first.
  const namesOwnedCount = error ? null : names?.length ?? null;
  const expiringSoonCount = error ? null : names?.filter((n) => n.status === 'expiring-soon').length ?? null;

  return (
    <>
      <div className="dmd-stat-cards">
        <div className="dmd-stat-card">
          <h3>Active name</h3>
          <p className={`dmd-stat-value${activeName ? ' dmd-stat-value--link' : ''}`}>
            {activeName ? formatDmdName(activeName) : '—'}
          </p>
          <p className="dmd-stat-sub">Publicly linked to this address</p>
        </div>
        <div className="dmd-stat-card">
          <h3>Names owned</h3>
          <p className="dmd-stat-value">{namesOwnedCount ?? '—'}</p>
          <p className="dmd-stat-sub">ERC-721 name NFTs</p>
        </div>
        <div className="dmd-stat-card">
          <h3>Expiring soon</h3>
          <p className="dmd-stat-value">{expiringSoonCount ?? '—'}</p>
          <p className="dmd-stat-sub">Names nearing their 10-year expiry</p>
        </div>
      </div>

      <div className="dmd-owned-names">
        <h2>Owned names</h2>

        <div className="dmd-owned-table-wrapper">
          <table className="dmd-owned-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Expiration</th>
                <th>Last action</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {names === null && !error && (
                <tr>
                  <td colSpan={5} className="dmd-owned-loading">Loading owned names…</td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan={5} className="dmd-owned-error">{error}</td>
                </tr>
              )}
              {names !== null && !error && names.length === 0 && (
                <tr>
                  <td colSpan={5} className="dmd-owned-empty">No names owned by this address yet.</td>
                </tr>
              )}
              {names?.map((entry) => (
                <tr key={entry.name}>
                  <td className="dmd-owned-name-cell">
                    <Link href={`/names/${entry.name}`}>{formatDmdName(entry.name)}</Link>
                  </td>
                  <td><StatusPill status={entry.status} /></td>
                  <td>{formatDmdDate(entry.expiresAt)}</td>
                  <td>
                    {entry.lastAction
                      ? `${entry.lastAction.type} · ${formatDmdDate(entry.lastAction.timestamp)}`
                      : '—'}
                  </td>
                  <td className="dmd-owned-actions-cell">
                    <Link href={`/names/${entry.name}`} className="dmd-table-btn">
                      History
                    </Link>
                    {entry.status === 'inactive' && (
                      <div className="dmd-manage" ref={openMenuFor === entry.name ? menuRef : undefined}>
                        <button
                          type="button"
                          className="dmd-table-btn"
                          onClick={() => setOpenMenuFor(openMenuFor === entry.name ? null : entry.name)}
                        >
                          Manage <i className="fas fa-chevron-down"></i>
                        </button>
                        {openMenuFor === entry.name && (
                          <div className="dmd-manage-menu">
                            <button
                              type="button"
                              onClick={() => {
                                setActivateTarget(entry.name);
                                setOpenMenuFor(null);
                              }}
                            >
                              <i className="fas fa-bolt"></i> Activate
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dmd-action-hints dmd-modal-notice dmd-modal-notice-info">
        <i className="fas fa-info-circle"></i>
        <div>
          <p className="dmd-action-hints-title"><strong>Action hints in UI</strong></p>
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
              <strong>Transfer:</strong> Moves ownership of the name NFT to another address; Diamond UI
              shows transfer fee + gas before confirmation.
            </li>
          </ul>
        </div>
      </div>

      <ActivateNameModal
        isOpen={!!activateTarget}
        onClose={() => setActivateTarget(null)}
        name={activateTarget ?? ''}
        currentActiveName={activeName}
        onComplete={() => {
          setActivateTarget(null);
          reload();
        }}
      />
    </>
  );
}
