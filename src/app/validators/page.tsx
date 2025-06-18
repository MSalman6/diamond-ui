'use client';

import './Validators.css';
import { useState } from 'react';
import Validators from '../../components/Validators';
import { Validator } from '../../components/Validators/types';

export default function ValidatorsPage() {
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [selectedValidator, setSelectedValidator] = useState<Validator | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');

  const handleStake = (validator: Validator) => {
    setSelectedValidator(validator);
    setShowStakeModal(true);
  };

  const handleUnstake = (validator: Validator) => {
    setSelectedValidator(validator);
    setShowUnstakeModal(true);
  };

  const confirmStake = () => {
    if (selectedValidator && stakeAmount) {
      // Handle stake logic here
      console.log(`Staking ${stakeAmount} DMD to ${selectedValidator.walletAddress}`);
      setShowStakeModal(false);
      setStakeAmount('');
      setSelectedValidator(null);
    }
  };

  const confirmUnstake = () => {
    if (selectedValidator && unstakeAmount) {
      // Handle unstake logic here
      console.log(`Unstaking ${unstakeAmount} DMD from ${selectedValidator.walletAddress}`);
      setShowUnstakeModal(false);
      setUnstakeAmount('');
      setSelectedValidator(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'valid': return 'status-valid';
      case 'invalid': return 'status-invalid';
      case 'jailed': return 'status-jailed';
      default: return 'status-active';
    }
  };

  const closeModal = () => {
    setShowStakeModal(false);
    setShowUnstakeModal(false);
    setSelectedValidator(null);
    setStakeAmount('');
    setUnstakeAmount('');
  };

  return (
    <div className="validators-page">
      {/* Hero Section */}
      <section className="validators-hero">
        <div className="cosmic-grid"></div>
        <div className="cosmic-elements">
          <div className="diamond diamond-1"></div>
          <div className="diamond diamond-2"></div>
          <div className="diamond diamond-3"></div>
          <div className="glow glow-1"></div>
          <div className="glow glow-2"></div>
        </div>
        <div className="container">
          <div className="validators-hero-content">
            <h1 className="fade-in">Validators</h1>
            <p className="fade-in">
              Browse and interact with network validators. Track their performance, stake your DMD coins, 
              and take part in securing and governing the network.
            </p>
          </div>
        </div>
      </section>

      {/* Validators Component */}
      <Validators onStake={handleStake} onUnstake={handleUnstake} />

      {/* Stake Modal */}
      {showStakeModal && selectedValidator && (
        <div className="modal show" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Stake Coins</h3>
              <button className="close-modal" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="validator-info">
                <p><strong>Validator:</strong> {selectedValidator.walletAddress}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`status-badge ${getStatusBadgeClass(selectedValidator.status)}`}>
                    {selectedValidator.status.charAt(0).toUpperCase() + selectedValidator.status.slice(1)}
                  </span>
                </p>
              </div>
              <div className="stake-form">
                <div className="form-group">
                  <label htmlFor="stake-amount">Amount to Stake (DMD)</label>
                  <input 
                    type="number" 
                    id="stake-amount"
                    placeholder="Enter amount..."
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                  />
                  <div className="balance-info">
                    <span>Available: <strong>25,000 DMD</strong></span>
                    <button 
                      className="btn-max"
                      onClick={() => setStakeAmount('25000')}
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn-primary" onClick={confirmStake}>
                Confirm Stake
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unstake Modal */}
      {showUnstakeModal && selectedValidator && (
        <div className="modal show" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Unstake Coins</h3>
              <button className="close-modal" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="validator-info">
                <p><strong>Validator:</strong> {selectedValidator.walletAddress}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`status-badge ${getStatusBadgeClass(selectedValidator.status)}`}>
                    {selectedValidator.status.charAt(0).toUpperCase() + selectedValidator.status.slice(1)}
                  </span>
                </p>
                <p><strong>Claim period:</strong> Next epoch</p>
              </div>
              <div className="stake-form">
                <div className="form-group">
                  <label htmlFor="unstake-amount">Amount to Unstake (DMD)</label>
                  <input 
                    type="number" 
                    id="unstake-amount"
                    placeholder="Enter amount..."
                    value={unstakeAmount}
                    onChange={(e) => setUnstakeAmount(e.target.value)}
                  />
                  <div className="balance-info">
                    <span>Staked: <strong>{selectedValidator.myStake}</strong></span>
                    <button 
                      className="btn-max"
                      onClick={() => {
                        const amount = selectedValidator.myStake.replace(' DMD', '').replace(',', '');
                        setUnstakeAmount(amount);
                      }}
                    >
                      MAX
                    </button>
                  </div>
                </div>
                <div className="warning-message">
                  <i className="fas fa-exclamation-triangle"></i>
                  <p>Unstaked Coins will be claimable in next epoch</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn-primary" onClick={confirmUnstake}>
                Confirm Unstake
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
