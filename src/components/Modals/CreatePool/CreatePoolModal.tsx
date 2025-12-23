import BigNumber from "bignumber.js";
import { toast } from "react-toastify";
import styles from "./CreatePoolModal.module.css";
import { useWeb3Context } from "@/contexts/Web3";
import { useStakingContext } from "@/contexts/Staking";
import React, { useState, useEffect, useRef, FormEvent } from "react";
import ReactDOM from "react-dom";
import { isValidAddress } from "@/utils/common";

interface ModalProps {
  buttonText: string;
}

const CreatePoolModal: React.FC<ModalProps> = ({ buttonText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [publicKey, setPublicKey] = useState("");
  const [stakeAmount, setStakeAmount] = useState<number>(10000);
  const { userWallet, ensureWalletConnection } = useWeb3Context();
  const { createPool } = useStakingContext();

  const [nodeOperatorAddress, setNodeOperatorAddress] = useState("");
  const [nodeOperatorShare, setNodeOperatorShare] = useState<BigNumber | null>(null);
  const [isDifferentNodeOperator, setIsDifferentNodeOperator] = useState(false);

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

  const handleCreatePool = async (e: FormEvent) => {
    e.preventDefault();
    if (!ensureWalletConnection()) return;

    let nOperatorShare = nodeOperatorShare;
    let nOperatorAddress = nodeOperatorAddress;

    if (!isDifferentNodeOperator) {
      nOperatorShare = new BigNumber(0);
      nOperatorAddress = "0x0000000000000000000000000000000000000000";
    } else {
      if (nOperatorAddress.length && !isValidAddress(nOperatorAddress)) {
        toast.error("Invalid node operator address");
        return;
      }
      if (nOperatorShare && (nOperatorShare.isLessThan(0) || nOperatorShare.dividedBy(100).isGreaterThan(20))) {
        toast.error("Node operator share must be between 0 and 20%");
        return;
      }
    }

    try {
      const success = await createPool(publicKey, new BigNumber(stakeAmount), nOperatorAddress, nOperatorShare || new BigNumber(0));
      if (success) {
        closeModal();
      }
    } catch (err) {
      console.log(err);
      toast.error("Error in creating pool");
    }
  };

  return (
    <>
      <button className="btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); openModal(); }}>
        {buttonText}
      </button>

      {isOpen && ReactDOM.createPortal(
        <div onClick={(e) => e.stopPropagation()} className={styles.modalOverlay}>
          <div onClick={(e) => e.stopPropagation()} className={styles.modalContent} ref={modalRef}>
            <button className={styles.modalClose} onClick={closeModal} aria-label="Close create pool modal">&times;</button>
            <h2>Create a pool</h2>

            <form className={styles.form} onSubmit={handleCreatePool}>
              <span>Please stake at least 10,000 DMD coins (50,000 max) to become a validator candidate.</span>

              <input
                type="text"
                minLength={130}
                maxLength={130}
                name="publicKey"
                className={styles.formInput}
                onChange={(e) => setPublicKey(e.currentTarget.value)}
                placeholder="Public key"
                required
              />

              <input
                min={10000}
                max={50000}
                type="number"
                value={stakeAmount}
                className={styles.formInput}
                placeholder="Enter the amount of DMD to stake"
                onChange={(e) => setStakeAmount(Number(e.target.value))}
              />

              <div className={styles.checkboxWrapper}>
                <span>Do you want to share the pool rewards with a node operator?</span>
                <input
                  type="checkbox"
                  checked={isDifferentNodeOperator}
                  onChange={() => setIsDifferentNodeOperator((prev) => !prev)}
                />
              </div>

              {isDifferentNodeOperator && (
                <>
                  <span>Please provide a node operator address to share the rewards and the %, which is forwarded to the address. Check the FAQs to learn more.</span>

                  <input
                    type="text"
                    minLength={42}
                    maxLength={42}
                    name="nodeOperatorAddress"
                    className={styles.formInput}
                    value={nodeOperatorAddress}
                    onChange={(e) => setNodeOperatorAddress(e.target.value)}
                    placeholder="Node operator address"
                    required={isDifferentNodeOperator}
                  />

                  <div className={styles.inputWrapper}>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      step={0.01}
                      name="nodeOperatorShare"
                      className={styles.formInput}
                      value={nodeOperatorShare ? nodeOperatorShare.dividedBy(100).toString() : ""}
                      onChange={(e) => {
                        const percentage = parseFloat(e.target.value);
                        const scaledValue = isNaN(percentage) ? null : new BigNumber(percentage * 100);
                        setNodeOperatorShare(scaledValue);
                      }}
                      placeholder="Node operator share percentage"
                      required={isDifferentNodeOperator}
                    />
                    <span className={styles.percentageSign}>%</span>
                  </div>
                </>
              )}

              <button className={`${styles.formSubmit} btn-primary`} type="submit">Create</button>
            </form>
          </div>
        </div>,
        document.getElementById("modal-root") as HTMLElement
      )}
    </>
  );
};

export default CreatePoolModal;
