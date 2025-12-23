import BigNumber from "bignumber.js";
import { toast } from "react-toastify";
import styles from "./UpdatePoolOperatorModal.module.css";
import { isValidAddress } from "@/utils/common";
import { useWeb3Context } from "@/contexts/Web3";
import { useStakingContext } from "@/contexts/Staking";
import React, { useState, useEffect, useRef, FormEvent, startTransition } from "react";
import ReactDOM from "react-dom";
import { Pool } from "@/contexts/types/models";

interface ModalProps {
  buttonText: string;
  pool?: Pool | undefined;
}

const UpdatePoolOperatorModal: React.FC<ModalProps> = ({ buttonText, pool }) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [canUpdate, setCanUpdate] = useState<boolean>(false);
  const [poolOperator, setPoolOperator] = useState<string>("");
  const [poolOperatorShare, setPoolOperatorShare] = useState<BigNumber | null>(null);

  const { ensureWalletConnection } = useWeb3Context();
  const { updatePoolOperatorRewardsShare, canUpdatePoolOperatorRewards } = useStakingContext();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeModal();
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

  const checks = () => {
    if (!pool) return;
    setPoolOperator(pool.poolOperator || "");
    setPoolOperatorShare(pool.poolOperatorShare ? pool.poolOperatorShare : null);
    canUpdatePoolOperatorRewards(pool).then((res) => setCanUpdate(res)).catch(() => setCanUpdate(false));
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!ensureWalletConnection()) return;

    if (!pool) return;

    let nOperatorAddress = poolOperator;
    let nOperatorShare = poolOperatorShare;

    if (nOperatorAddress.length && !isValidAddress(nOperatorAddress)) {
      toast.error("Invalid node operator address");
      return;
    }

    if (nOperatorShare && (nOperatorShare.isLessThan(0) || nOperatorShare.dividedBy(100).isGreaterThan(20))) {
      toast.error("Node operator share must be between 0 and 20%");
      return;
    }

    try {
      const success = await updatePoolOperatorRewardsShare(pool, nOperatorAddress, nOperatorShare || new BigNumber(0));
      if (success) closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Error in updating pool");
      closeModal();
    }
  };

  return (
    <>
      <button className="btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); openModal(); checks(); }}>
        {buttonText}
      </button>

      {isOpen && ReactDOM.createPortal(
        <div onClick={(e) => e.stopPropagation()} className={styles.modalOverlay}>
          <div onClick={(e) => e.stopPropagation()} className={styles.modalContent} ref={modalRef}>
            <button className={styles.modalClose} onClick={closeModal} aria-label="Close update pool modal">&times;</button>
            <h2>Update rewards share</h2>

            <p>Please provide a node operator address to share the rewards and the %, which is forwarded to the address. Check the <a onClick={() => { startTransition(() => { /* navigate to faqs if needed */ }) }}>FAQ section</a> to learn more.</p>

            <form className={styles.form} onSubmit={handleUpdate}>
              <input
                type="text"
                minLength={42}
                maxLength={42}
                value={poolOperator}
                className={styles.formInput}
                placeholder="Enter pool operator address"
                onChange={(e) => setPoolOperator(e.target.value)}
              />

              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  min={0}
                  max={20}
                  step={0.01}
                  className={styles.formInput}
                  placeholder="Operator share %"
                  value={poolOperatorShare ? poolOperatorShare.dividedBy(100).toString() : ""}
                  onChange={(e) => {
                    const percentage = parseFloat(e.target.value);
                    const scaledValue = isNaN(percentage) ? null : new BigNumber(percentage * 100);
                    setPoolOperatorShare(scaledValue);
                  }}
                />
                <span className={styles.percentageSign}>%</span>
              </div>

              {!canUpdate ? (
                <p className={styles.stakeWarning}>You can update the pool operator rewards share only once per Epoch</p>
              ) : (
                <button className={`${styles.formSubmit} btn-primary`} type="submit">Update</button>
              )}
            </form>
          </div>
        </div>,
        document.getElementById("modal-root") as HTMLElement
      )}
    </>
  );
};

export default UpdatePoolOperatorModal;
