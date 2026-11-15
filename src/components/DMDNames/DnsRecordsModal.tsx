'use client';

import { useEffect, useMemo, useState } from 'react';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import Modal from '@/components/Modal';
import { useWeb3Context } from '@/contexts/Web3';
import config from '@/lib/config';
import { getDnsUpdateEstimate, getDnsUpdates, sendDnsUpdate } from '@/services/dmdNaming';
import type { DmdDnsConfig } from '@/types/dmdNaming';
import { formatTxError } from '@/utils/web3Errors';
import {
  dnsRecordType,
  formatDmdName,
  formatDnsHostname,
  formatForwardingAddress,
  normalizeEmailInput,
  normalizeHostnameInput,
  parseIpAddress,
  validateForwardingEmail,
  validateHostname,
  validateIpAddress,
} from '@/utils/dmdNaming';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  config: DmdDnsConfig;
};

type TargetMode = 'none' | 'ip' | 'cname';
type Estimate = { estimatedGas?: string; totalEstimatedCost?: string; failureReason?: string };
type PendingStage = 'confirm' | 'mining' | null;
type Step = { index: number; total: number };

const TARGET_MODES: { value: TargetMode; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'ip', label: 'IP address' },
  { value: 'cname', label: 'Hostname' },
];

const ESTIMATE_DELAY_MS = 400;
const SERVICES_URL_PATTERN = /^https?:\/\//i;

function toTargetMode(dnsConfig: DmdDnsConfig): TargetMode {
  if (dnsConfig.website.type === 'none') {
    return 'none';
  }
  return dnsConfig.website.type === 'cname' ? 'cname' : 'ip';
}

export default function DnsRecordsModal({ isOpen, onClose, name, config: currentConfig }: Props) {
  const { contractsManager, web3, userWallet, ensureWalletConnection, ensureProviderReady, getGasPriceSafe } = useWeb3Context();
  const [mode, setMode] = useState<TargetMode>('none');
  const [ipInput, setIpInput] = useState('');
  const [hostnameInput, setHostnameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [baseline, setBaseline] = useState<DmdDnsConfig>(currentConfig);
  const [touched, setTouched] = useState(false);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [pendingStage, setPendingStage] = useState<PendingStage>(null);
  const [step, setStep] = useState<Step | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fullName = formatDmdName(name);
  const hostname = formatDnsHostname(name);
  const forwardingAddress = formatForwardingAddress(name);
  const servicesUrl = SERVICES_URL_PATTERN.test(config.domainServicesUrl) ? config.domainServicesUrl : '';

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const { website, emailForwarding } = currentConfig;
    setMode(toTargetMode(currentConfig));
    setIpInput(website.type === 'ipv4' || website.type === 'ipv6' ? website.value : '');
    setHostnameInput(website.type === 'cname' ? website.value : '');
    setEmailInput(emailForwarding);
    setBaseline(currentConfig);
    setTouched(false);
    setEstimate(null);
    setPendingStage(null);
    setStep(null);
    setError(null);
    setSuccess(false);
  }, [isOpen, currentConfig]);

  const ipError = mode === 'ip' ? validateIpAddress(ipInput) : null;
  const hostnameError = mode === 'cname' ? validateHostname(hostnameInput) : null;
  const emailError = validateForwardingEmail(emailInput);
  const ipTarget = mode === 'ip' ? parseIpAddress(ipInput) : null;
  const recordType = mode === 'cname' ? dnsRecordType('cname') : ipTarget ? dnsRecordType(ipTarget.type) : null;

  const nextConfig = useMemo<DmdDnsConfig | null>(() => {
    if (ipError || hostnameError || emailError) {
      return null;
    }
    const website = mode === 'ip'
      ? parseIpAddress(ipInput)
      : mode === 'cname'
        ? { type: 'cname' as const, value: normalizeHostnameInput(hostnameInput) }
        : { type: 'none' as const, value: '' };
    return website ? { website, emailForwarding: normalizeEmailInput(emailInput) } : null;
  }, [mode, ipInput, hostnameInput, emailInput, ipError, hostnameError, emailError]);

  const registrar = contractsManager.diamondRegistryContract;
  const updates = useMemo(
    () => (registrar && nextConfig ? getDnsUpdates(registrar, name, baseline, nextConfig) : null),
    [registrar, name, baseline, nextConfig],
  );
  const hasChanges = !updates || updates.length > 0;

  useEffect(() => {
    const from = userWallet.myAddr;
    if (!isOpen || !registrar || !from || !updates || updates.length === 0) {
      setEstimate(null);
      setLoadingEstimate(false);
      return;
    }

    let cancelled = false;
    setLoadingEstimate(true);
    const timer = setTimeout(() => {
      getDnsUpdateEstimate(registrar, web3, updates, from)
        .then((result) => {
          if (!cancelled) setEstimate(result);
        })
        .catch(() => {
          if (!cancelled) setEstimate(null);
        })
        .finally(() => {
          if (!cancelled) setLoadingEstimate(false);
        });
    }, ESTIMATE_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [isOpen, registrar, updates, userWallet.myAddr, web3]);

  const handleCopyHostname = () => {
    copy(hostname);
    toast.success('Subdomain copied to clipboard');
  };

  const handleSave = async () => {
    setTouched(true);

    const from = userWallet.myAddr;
    if (!registrar || !from) {
      setError('Wallet not ready. Please reconnect and try again.');
      return;
    }

    if (!nextConfig) {
      return;
    }

    const pending = getDnsUpdates(registrar, name, baseline, nextConfig);
    if (pending.length === 0) {
      return;
    }

    if (!ensureWalletConnection()) {
      return;
    }

    const ready = await ensureProviderReady();
    if (!ready) {
      return;
    }

    setError(null);

    let saved = baseline;
    try {
      for (let i = 0; i < pending.length; i += 1) {
        setStep({ index: i + 1, total: pending.length });
        setPendingStage('confirm');
        await sendDnsUpdate(pending[i], from, getGasPriceSafe, () => setPendingStage('mining'));
        saved = pending[i].apply(saved);
        setBaseline(saved);
      }
      toast.success(`DNS settings saved for ${fullName} 💎`);
      setPendingStage(null);
      setStep(null);
      setSuccess(true);
    } catch (err: any) {
      setPendingStage(null);
      setStep(null);
      const message = formatTxError(
        web3,
        (registrar.options.jsonInterface as any[]) || [],
        err,
        'Saving DNS settings failed. Please try again.',
      );
      setError(message);
      toast.error(message);
    }
  };

  if (success) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} closable>
        <div className="dmd-modal dmd-modal-success dmd-dns-modal">
          <div className="dmd-modal-success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h2>DNS settings saved for &quot;{fullName}&quot;.</h2>
          <p>
            {baseline.website.type === 'none'
              ? `${hostname} is no longer linked to this name.`
              : `${hostname} is set to ${baseline.website.value}.`}
          </p>
          <p>
            {baseline.emailForwarding
              ? `${forwardingAddress} forwards to ${baseline.emailForwarding}.`
              : `${forwardingAddress} is not forwarded.`}
          </p>
          <div className="dmd-modal-notice dmd-modal-notice-success">
            <i className="fas fa-check-circle"></i>
            <p>DNS settings recorded on-chain.</p>
          </div>
          <div className="dmd-modal-actions">
            <button type="button" className="btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  const stepLabel = step && step.total > 1 ? ` (${step.index} of ${step.total})` : '';

  return (
    <Modal isOpen={isOpen} onClose={onClose} closable={!pendingStage}>
      <div className="dmd-modal dmd-dns-modal">
        <h2>Configure DNS for &quot;{fullName}&quot;</h2>

        {pendingStage ? (
          <div className="dmd-modal-pending-card">
            <span className="dmd-modal-spinner" aria-hidden="true"></span>
            {pendingStage === 'confirm' ? (
              <div>
                <strong>Confirm in wallet{stepLabel}</strong>
                <p>Approve the transaction in your connected wallet to continue.</p>
              </div>
            ) : (
              <div>
                <strong>Saving DNS settings{stepLabel}</strong>
                <p>
                  You are updating DNS settings for &quot;{fullName}&quot;. This may take up to 1 minute.
                  Do not close the window until the transaction is completed.
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="dmd-dns-hostname">
              <div>
                <span className="dmd-dns-hostname-label">Subdomain</span>
                <span className="dmd-dns-hostname-value">{hostname}</span>
              </div>
              <button type="button" className="dmd-table-btn" onClick={handleCopyHostname}>
                <i className="fas fa-copy"></i> Copy
              </button>
            </div>

            <div className="dmd-dns-section">
              <h4>Website</h4>
              <div className="dmd-dns-target-types" role="radiogroup" aria-label="Website">
                {TARGET_MODES.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={mode === option.value}
                    className={`dmd-dns-target-type${mode === option.value ? ' dmd-dns-target-type--active' : ''}`}
                    onClick={() => setMode(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {mode !== 'none' && (
                <>
                  <label className="dmd-form-label" htmlFor="dmd-dns-target">
                    {mode === 'ip' ? 'IP address' : 'Hostname'}
                  </label>
                  <div className="dmd-dns-target-input">
                    <input
                      id="dmd-dns-target"
                      type="text"
                      className="dmd-form-input"
                      placeholder={mode === 'ip' ? '192.0.2.10' : 'www.example.com'}
                      value={mode === 'ip' ? ipInput : hostnameInput}
                      onChange={(e) => (mode === 'ip' ? setIpInput(e.target.value) : setHostnameInput(e.target.value))}
                      autoComplete="off"
                      autoCapitalize="none"
                      spellCheck={false}
                    />
                    {recordType && <span className="dmd-dns-record-type">{recordType}</span>}
                  </div>
                  {touched && (ipError || hostnameError) && (
                    <p className="dmd-form-error">{ipError || hostnameError}</p>
                  )}
                </>
              )}
            </div>

            <div className="dmd-dns-section">
              <h4>Email forwarding</h4>
              <label className="dmd-form-label" htmlFor="dmd-dns-email">
                Forward {forwardingAddress} to
              </label>
              <input
                id="dmd-dns-email"
                type="email"
                inputMode="email"
                className="dmd-form-input"
                placeholder="user@example.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
              />
              {touched && emailError && <p className="dmd-form-error">{emailError}</p>}
              <p className="dmd-dns-section-note">Leave blank to turn off email forwarding.</p>
            </div>

            <dl className="dmd-modal-fees">
              <div className="dmd-modal-fees-row">
                <dt>Record cost</dt>
                <dd>Free</dd>
              </div>
              <div className="dmd-modal-fees-row">
                <dt>Zone operator</dt>
                <dd>DMD Association</dd>
              </div>
              <div className="dmd-modal-fees-row">
                <dt>Estimated gas fee</dt>
                <dd>{loadingEstimate ? '…' : estimate?.estimatedGas ?? '—'}</dd>
              </div>
              <div className="dmd-modal-fees-row dmd-modal-fees-row-total">
                <dt>Total estimated cost</dt>
                <dd>{loadingEstimate ? '…' : estimate?.totalEstimatedCost ?? '—'}</dd>
              </div>
            </dl>

            {servicesUrl && (
              <a className="dmd-dns-services-link" href={servicesUrl} target="_blank" rel="noopener noreferrer">
                Hosting and mailbox services <i className="fas fa-external-link-alt"></i>
              </a>
            )}

            {!loadingEstimate && estimate?.failureReason && (
              <div className="dmd-modal-notice dmd-modal-notice-warn">
                <i className="fas fa-triangle-exclamation"></i>
                <p>{estimate.failureReason}</p>
              </div>
            )}

            {error && (
              <div className="dmd-modal-notice dmd-modal-notice-warn">
                <i className="fas fa-times-circle"></i>
                <p>{error}</p>
              </div>
            )}

            <div className="dmd-modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSave}
                disabled={!hasChanges || loadingEstimate || !!estimate?.failureReason}
              >
                {error ? 'Try again' : 'Save DNS settings'}
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
