'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Modal from '@/components/Modal';
import { useWeb3Context } from '@/contexts/Web3';
import { setOwnName } from '@/services/dmdNaming';
import type { DmdNameAvailabilityResult } from '@/types/dmdNaming';
import { formatDmdName } from '@/utils/dmdNaming';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  availability?: DmdNameAvailabilityResult | null;
  currentName?: string | null;
  walletAddress?: string;
  onComplete?: () => void;
};

export default function RegisterNameModal({
  isOpen,
  onClose,
  name,
  availability,
  currentName,
  walletAddress,
  onComplete,
}: Props) {
  const { contractsManager, web3, getGasPriceSafe, userWallet } = useWeb3Context();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const fullName = formatDmdName(name);

  const registrationFee = availability?.registrationFee ?? '—';
  const estimatedGas = availability?.estimatedGas ?? '—';
  const totalCost = availability?.totalEstimatedCost ?? registrationFee;

  useEffect(() => {
    if (isOpen) {
      setSubmitting(false);
      setError(false);
      setSuccess(false);
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
      setError(true);
      return;
    }

    setSubmitting(true);
    setError(false);

    const result = await setOwnName(contract, web3, from, name, valueWei, getGasPriceSafe);

    setSubmitting(false);

    if (result.success) {
      setSuccess(true);
      onComplete?.();
      return;
    }

    setError(true);
  };

  if (success) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="dmd-modal dmd-modal-success">
          <div className="dmd-modal-success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h2>{fullName} is registered.</h2>
          <div className="dmd-modal-actions">
            <Link
              href={walletAddress ? `/dmd-names/${walletAddress}` : '#'}
              className="btn-primary"
              onClick={handleClose}
            >
              My DMD Names
            </Link>
            <Link href="/profile" className="btn-secondary" onClick={handleClose}>
              Profile
            </Link>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="dmd-modal">
        <h2>Register {fullName}</h2>

        {submitting ? (
          <div className="dmd-modal-pending-card">
            <i className="fas fa-spinner fa-spin"></i>
            <div>
              <strong>Waiting for wallet</strong>
              <p>Confirm the transaction to register this name.</p>
            </div>
          </div>
        ) : (
          <>
            <dl className="dmd-modal-fees">
              <div className="dmd-modal-fees-row">
                <dt>Registration fee</dt>
                <dd>{registrationFee}</dd>
              </div>
              <div className="dmd-modal-fees-row">
                <dt>Estimated gas</dt>
                <dd>{estimatedGas}</dd>
              </div>
              <div className="dmd-modal-fees-row dmd-modal-fees-row-total">
                <dt>Total</dt>
                <dd>{totalCost}</dd>
              </div>
            </dl>

            {currentName && (
              <div className="dmd-modal-notice dmd-modal-notice-warn">
                <i className="fas fa-exclamation-circle"></i>
                <p>
                  This replaces your current name ({formatDmdName(currentName)}).
                </p>
              </div>
            )}

            {error && (
              <div className="dmd-modal-notice dmd-modal-notice-warn">
                <i className="fas fa-times-circle"></i>
                <p>Transaction failed. Try again.</p>
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
                Register
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
