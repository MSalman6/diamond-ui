import ReactDOM from "react-dom";
import BigNumber from "bignumber.js";
import copy from "copy-to-clipboard";
import { toast } from "react-toastify";
import { Pool } from "@/contexts/types/models";
import { useWeb3Context } from "@/contexts/Web3";
import { useStakingContext } from "@/contexts/Staking";
import { formatDmdFromWei } from "@/utils/format";
import { formatDmdName } from "@/utils/dmdNaming";
import { formatDuration, formatElapsedSince, truncateAddress } from "@/utils/common";
import styles from "./RecoverAbandonedStakesModal.module.css";
import React, { useState, useEffect, useMemo, useRef, FormEvent } from "react";

const DEFAULT_INACTIVITY_THRESHOLD = 10 * 365 * 24 * 60 * 60;

interface ModalProps {
  buttonText: string;
  pool: Pool;
  name?: string | null;
}

const RecoverAbandonedStakesModal: React.FC<ModalProps> = ({ buttonText, pool, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { abandonedPools, inactivityThreshold, recoverAbandonedStakes } = useStakingContext();
  const { ensureWalletConnection } = useWeb3Context();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const abandoned = abandonedPools[pool.stakingAddress?.toLowerCase()];

  const others = useMemo(
    () => Object.values(abandonedPools).filter(
      entry => entry.stakingAddress.toLowerCase() !== pool.stakingAddress?.toLowerCase()
    ),
    [abandonedPools, pool.stakingAddress]
  );

  const combined = useMemo(
    () => Object.values(abandonedPools).reduce(
      (sum, entry) => sum.plus(entry.recoverableStake),
      new BigNumber(0)
    ),
    [abandonedPools]
  );

  const governanceShare = combined.dividedToIntegerBy(2);
  const reinsertShare = combined.minus(governanceShare);

  const handleRecover = async (e: FormEvent) => {
    e.preventDefault();
    if (!ensureWalletConnection()) return;

    const recovered = await recoverAbandonedStakes();
    if (recovered) closeModal();
  };

  return (
    <>
      <button className="btn-recover" onClick={(e) => { e.stopPropagation(); openModal(); }}>
        {buttonText}
      </button>

      {isOpen && ReactDOM.createPortal(
        <div onClick={(e) => e.stopPropagation()} className={styles.modalOverlay}>
          <div onClick={(e) => e.stopPropagation()} className={styles.modalContent} ref={modalRef}>
            <button className={styles.modalClose} onClick={closeModal} aria-label="Close modal">
              &times;
            </button>

            <h3 className={styles.headerTitle}>Transfer abandoned coins to the pots</h3>

            <div className={styles.identity}>
              {name && <span className={styles.identityName}>{formatDmdName(name)}</span>}
              <button
                type="button"
                className={styles.identityAddress}
                title="Copy staking address"
                onClick={() => { copy(pool.stakingAddress); toast.success('Copied staking address'); }}
              >
                {truncateAddress(pool.stakingAddress)}
                <i className="fas fa-copy" aria-hidden="true"></i>
              </button>
            </div>

            <p className={styles.lede}>
              This validator has not been part of the active validator set for more than{' '}
              {formatDuration(inactivityThreshold || DEFAULT_INACTIVITY_THRESHOLD, 1)}, so its coins
              can be transferred to the pots.
            </p>

            <dl className={styles.facts}>
              <div className={styles.fact}>
                <dt>Last active</dt>
                <dd>{formatElapsedSince(abandoned?.lastActive ?? 0)}</dd>
              </div>
              <div className={styles.fact}>
                <dt>Total stake</dt>
                <dd>{formatDmdFromWei(abandoned?.recoverableStake ?? pool.totalStake)}</dd>
              </div>
            </dl>

            <div className={styles.split}>
              <div className={styles.splitHeader}>
                <span>Coins will be distributed</span>
                <span className={styles.splitTotal}>{formatDmdFromWei(combined)}</span>
              </div>
              <div className={styles.splitRow}>
                <span><span className={styles.splitShare}>50%</span> to Reinsert Pot</span>
                <span className={styles.amount}>{formatDmdFromWei(reinsertShare)}</span>
              </div>
              <div className={styles.splitRow}>
                <span><span className={styles.splitShare}>50%</span> to Governance Pot</span>
                <span className={styles.amount}>{formatDmdFromWei(governanceShare)}</span>
              </div>
            </div>

            {others.length > 0 && (
              <div className={styles.sweepBlock}>
                <p className={styles.sweepText}>
                  The network recovers all abandoned validators in one transaction, so this
                  also transfers the coins of {others.length === 1 ? 'one other pool' : `${others.length} other pools`}:
                </p>
                <ul className={styles.sweepList}>
                  {others.map(entry => (
                    <li key={entry.stakingAddress}>
                      <span>{truncateAddress(entry.stakingAddress)}</span>
                      <span className={styles.amount}>{formatDmdFromWei(entry.recoverableStake)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.importantBlock} role="alert">
              <span className={styles.importantIcon} aria-hidden>⚠️</span>
              <span className={styles.importantLabel}>Important:</span>
              <p className={styles.importantText}>
                Transferring the coins to the pots cannot be reversed, and the affected pools
                are permanently removed from the validator candidate list.
              </p>
            </div>

            <form className={styles.form} onSubmit={handleRecover}>
              <button
                className={"btn-recover " + styles.formSubmit}
                type="submit"
                disabled={combined.isZero()}
              >
                Transfer to pots
              </button>
              <button
                className={"btn-secondary btn-sm " + styles.formCancel}
                type="button"
                onClick={closeModal}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>,
        document.getElementById("modal-root") as HTMLElement
      )}
    </>
  );
};

export default RecoverAbandonedStakesModal;
