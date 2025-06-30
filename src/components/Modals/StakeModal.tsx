import React, { useState } from 'react';

interface StakeModalProps {
  buttonText: string;
  pool: any;
  isOpen?: boolean;
  onClose?: () => void;
  onStake?: (pool: any, amount: string) => void;
}

const StakeModal: React.FC<StakeModalProps> = ({ buttonText, pool, isOpen: externalIsOpen, onClose: externalOnClose, onStake }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [amount, setAmount] = useState('');

  // Use external control if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnClose !== undefined ? 
    (open: boolean) => !open && externalOnClose() : 
    setInternalIsOpen;

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (externalOnClose === undefined) {
      setInternalIsOpen(true);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setAmount('');
  };

  const handleStake = () => {
    if (onStake && amount) {
      onStake(pool, amount);
    }
    // Placeholder: Log the staking action
    console.log(`Staking ${amount} DMD to ${pool.stakingAddress}`);
    closeModal();
  };

  return (
    <>
      {externalOnClose === undefined && (
        <button 
          className="primaryBtn" 
          onClick={openModal}
          disabled={!pool.isActive && !pool.isToBeElected && !pool.isPendingValidator}
        >
          {buttonText}
        </button>
      )}

      {isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Stake DMD</h3>
              <button className="close-modal" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Stake to validator: {pool.stakingAddress}</p>
              <div className="input-group">
                <label htmlFor="stake-amount">Amount (DMD):</label>
                <input
                  id="stake-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount to stake"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>
                Cancel
              </button>
              <button 
                className="btn-primary" 
                onClick={handleStake}
                disabled={!amount || parseFloat(amount) <= 0}
              >
                Stake
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StakeModal;
