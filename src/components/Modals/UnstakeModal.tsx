import React, { useState } from 'react';

interface UnstakeModalProps {
  buttonText: string;
  pool: any;
  onUnstake?: (pool: any, amount: string) => void;
}

const UnstakeModal: React.FC<UnstakeModalProps> = ({ buttonText, pool, onUnstake }) => {
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

  const handleUnstake = () => {
    if (onUnstake && amount) {
      onUnstake(pool, amount);
    }
    // Placeholder: Log the unstaking action
    console.log(`Unstaking ${amount} DMD from ${pool.stakingAddress}`);
    closeModal();
  };

  return (
    <>
      <button 
        className="primaryBtn" 
        onClick={openModal}
      >
        {buttonText}
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Unstake DMD</h3>
              <button className="close-modal" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>Unstake from validator: {pool.stakingAddress}</p>
              <p>Your current stake: {pool.myStake || '0'} DMD</p>
              <div className="input-group">
                <label htmlFor="unstake-amount">Amount (DMD):</label>
                <input
                  id="unstake-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount to unstake"
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
                onClick={handleUnstake}
                disabled={!amount || parseFloat(amount) <= 0}
              >
                Unstake
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UnstakeModal;
