'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import Modal from '@/components/Modal';
import { useWeb3Context } from '@/contexts/Web3';
import { setOwnName } from '@/services/dmdNaming';
import { formatTxError } from '@/utils/web3Errors';
import type { DmdNameAvailabilityResult } from '@/types/dmdNaming';
import { formatDmdName } from '@/utils/dmdNaming';
import ActivateNameModal from './ActivateNameModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  availability?: DmdNameAvailabilityResult | null;
  currentName?: string | null;
  onComplete?: () => void;
};

type PendingStage = 'confirm' | 'mining' | null;

export default function RegisterNameModal({
  isOpen,
  onClose,
  name,
  availability,
  currentName,
  onComplete,
}: Props) {
  const { contractsManager, web3, userWallet, ensureWalletConnection, ensureProviderReady, getGasPriceSafe } = useWeb3Context();
  const [pendingStage, setPendingStage] = useState<PendingStage>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activateOpen, setActivateOpen] = useState(false);
  const [autoActivatedSnapshot, setAutoActivatedSnapshot] = useState<boolean | null>(null);
  const fullName = formatDmdName(name);
  const willAutoActivate = success ? autoActivatedSnapshot ?? !currentName : !currentName;

  const registrationFee = availability?.registrationFee ?? '—';
  const estimatedGas = availability?.estimatedGas ?? '—';
  const totalCost = availability?.totalEstimatedCost ?? registrationFee;

  useEffect(() => {
    if (isOpen) {
      setPendingStage(null);
      setError(null);
      setSuccess(false);
      setActivateOpen(false);
      setAutoActivatedSnapshot(null);
    }
  }, [isOpen, name]);

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = async () => {
    const contract = contractsManager.diamondRegistryContract;
    const from = userWallet.myAddr;
    const valueWei = availability?.registrationFeeWei;

    if (!contract || !from || !valueWei) {
      setError('Wallet not ready. Please reconnect and try again.');
      return;
    }

    if (!ensureWalletConnection()) {
      return;
    }

    const ready = await ensureProviderReady();
    if (!ready) {
      return;
    }

    setPendingStage('confirm');
    setError(null);
    const willAutoActivateThisTx = !currentName;

    try {
      await setOwnName(contract, web3, from, name, valueWei, getGasPriceSafe, () => setPendingStage('mining'));
      toast.success(`${fullName} registered 💎`);
      setPendingStage(null);
      setAutoActivatedSnapshot(willAutoActivateThisTx);
      setSuccess(true);
      onComplete?.();
    } catch (err: any) {
      setPendingStage(null);
      const message = formatTxError(
        web3,
        (contract.options.jsonInterface as any[]) || [],
        err,
        'Registration failed. Please try again.',
      );
      setError(message);
      toast.error(message);
    }
  };

  if (success) {
    return (
      <>
        <Modal isOpen={isOpen} onClose={handleClose} closable>
          <div className="dmd-modal dmd-modal-success">
            <div className="dmd-modal-success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            {willAutoActivate ? (
              <>
                <h2>The name &quot;{fullName}&quot; was successfully created and activated automatically.</h2>
                <p>Because this address had no active name yet, the new name became the active name automatically.</p>
                <div className="dmd-modal-notice dmd-modal-notice-success">
                  <i className="fas fa-star"></i>
                  <p>First activation: Free (gas only)</p>
                </div>
              </>
            ) : (
              <>
                <h2>The name &quot;{fullName}&quot; was successfully created.</h2>
                <div className="dmd-modal-notice dmd-modal-notice-warn">
                  <i className="fas fa-exclamation-circle"></i>
                  <p>It is not active yet because another name ({currentName ? formatDmdName(currentName) : 'your current active name'}) owns this address.</p>
                </div>
                <div className="dmd-modal-notice dmd-modal-notice-success">
                  <i className="fas fa-star"></i>
                  <p>Activate this name now? You&apos;ll replace your current active one.</p>
                </div>
              </>
            )}
            <div className="dmd-modal-actions">
              {!willAutoActivate && (
                <button type="button" className="btn-primary" onClick={() => setActivateOpen(true)}>
                  Activate name
                </button>
              )}
              <Link
                href={userWallet.myAddr ? `/dmd-names/${userWallet.myAddr}` : '#'}
                className={willAutoActivate ? 'btn-primary' : 'btn-secondary'}
                onClick={handleClose}
              >
                Go to My DMD Names
              </Link>
              {willAutoActivate && (
                <Link href="/profile" className="btn-secondary" onClick={handleClose}>
                  View Profile
                </Link>
              )}
            </div>
          </div>
        </Modal>
        <ActivateNameModal
          isOpen={activateOpen}
          onClose={() => setActivateOpen(false)}
          name={name}
          currentActiveName={currentName}
          onComplete={() => {
            setActivateOpen(false);
            handleClose();
            onComplete?.();
          }}
        />
      </>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} closable={!pendingStage}>
      <div className="dmd-modal">
        <h2>Create &quot;{fullName}&quot;</h2>

        {pendingStage ? (
          <div className="dmd-modal-pending-card">
            <span className="dmd-modal-spinner" aria-hidden="true"></span>
            {pendingStage === 'confirm' ? (
              <div>
                <strong>Confirm in wallet</strong>
                <p>Approve the transaction in your connected wallet to continue.</p>
              </div>
            ) : (
              <div>
                <strong>Minting name</strong>
                <p>Your transaction is pending. You will be notified in your wallet once complete. Do not close the window until the transaction is completed.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <dl className="dmd-modal-fees">
              <div className="dmd-modal-fees-row">
                <dt>Minting fee</dt>
                <dd>{registrationFee}</dd>
              </div>
              <div className="dmd-modal-fees-row">
                <dt>Estimated gas fee</dt>
                <dd>{estimatedGas}</dd>
              </div>
              <div className="dmd-modal-fees-row dmd-modal-fees-row-total">
                <dt>Total estimated cost</dt>
                <dd>{totalCost}</dd>
              </div>
            </dl>

            <div className={`dmd-modal-notice ${willAutoActivate ? 'dmd-modal-notice-info' : 'dmd-modal-notice-warn'}`}>
              <i className={`fas ${willAutoActivate ? 'fa-info-circle' : 'fa-exclamation-triangle'}`}></i>
              <p>
                {willAutoActivate
                  ? 'This address has no active name yet. The new name will be created, and this address will become its active name automatically.'
                  : 'This address already owns another active name. The new name will be created, but it will stay inactive until you activate it.'}
              </p>
            </div>

            {error && (
              <div className="dmd-modal-notice dmd-modal-notice-warn">
                <i className="fas fa-times-circle"></i>
                <p>{error}</p>
              </div>
            )}

            <div className="dmd-modal-actions">
              <button type="button" className="btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleConfirm}
                disabled={!availability?.registrationFeeWei}
              >
                Confirm & Create
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
