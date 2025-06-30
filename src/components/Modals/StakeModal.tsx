import React, { useState } from 'react';

interface StakeModalProps {
  buttonText: string;
  pool: any;
  onStake?: (pool: any, amount: string) => void;
}

const StakeModal: React.FC<StakeModalProps> = ({ buttonText, pool, onStake }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
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
      <button 
        className="primaryBtn" 
        onClick={openModal}
        disabled={!pool.isActive && !pool.isToBeElected && !pool.isPendingValidator}
      >
        {buttonText}
      </button>

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
