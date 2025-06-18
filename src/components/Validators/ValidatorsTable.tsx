import React from 'react';
import { Validator, VisibleColumns } from './types';

interface ValidatorsTableProps {
  validators: Validator[];
  visibleColumns: VisibleColumns;
  onStake: (validator: Validator) => void;
  onUnstake: (validator: Validator) => void;
}

export default function ValidatorsTable({ 
  validators, 
  visibleColumns, 
  onStake, 
  onUnstake 
}: ValidatorsTableProps) {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'valid': return 'status-valid';
      case 'invalid': return 'status-invalid';
      case 'jailed': return 'status-jailed';
      default: return 'status-active';
    }
  };

  const getCrClass = (cr: number) => {
    if (cr === 0) return 'cr-zero';
    if (cr > 0 && cr <= 20) return 'cr-warning';
    return 'cr-danger';
  };

  return (
    <div className="validators-table-container">
      <table className="validators-table">
        <thead>
          <tr>
            {visibleColumns.status && <th>Status <i className="fas fa-sort"></i></th>}
            {visibleColumns.wallet && <th>Wallet Address <i className="fas fa-sort"></i></th>}
            {visibleColumns.miner && <th>Miner Address <i className="fas fa-sort"></i></th>}
            {visibleColumns.publickey && <th>Public Key <i className="fas fa-sort"></i></th>}
            {visibleColumns.stake && <th>Total Stake <i className="fas fa-sort"></i></th>}
            {visibleColumns.voting && <th>Voting Power <i className="fas fa-sort"></i></th>}
            {visibleColumns.score && <th>Score <i className="fas fa-sort"></i></th>}
            {visibleColumns.cr && <th>CR <i className="fas fa-sort"></i></th>}
            {visibleColumns.mystake && <th>My Stake <i className="fas fa-sort"></i></th>}
            {visibleColumns.actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {validators.map((validator) => (
            <tr key={validator.id}>
              {visibleColumns.status && (
                <td>
                  <span className={`status-badge ${getStatusBadgeClass(validator.status)}`}>
                    {validator.status.charAt(0).toUpperCase() + validator.status.slice(1)}
                  </span>
                </td>
              )}
              {visibleColumns.wallet && (
                <td className="wallet-address">{validator.walletAddress}</td>
              )}
              {visibleColumns.miner && (
                <td className="miner-address">{validator.minerAddress}</td>
              )}
              {visibleColumns.publickey && (
                <td className="public-key">{validator.publicKey}</td>
              )}
              {visibleColumns.stake && <td>{validator.totalStake}</td>}
              {visibleColumns.voting && <td>{validator.votingPower}</td>}
              {visibleColumns.score && <td>{validator.score}</td>}
              {visibleColumns.cr && (
                <td>
                  <span className={`cr-value ${getCrClass(validator.cr)}`}>
                    {validator.cr}
                  </span>
                </td>
              )}
              {visibleColumns.mystake && <td>{validator.myStake}</td>}
              {visibleColumns.actions && (
                <td>
                  <button 
                    className="btn-stake"
                    disabled={!validator.canStake}
                    onClick={() => onStake(validator)}
                  >
                    Stake
                  </button>
                  {validator.canUnstake && (
                    <button 
                      className="btn-unstake"
                      onClick={() => onUnstake(validator)}
                    >
                      Unstake
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
