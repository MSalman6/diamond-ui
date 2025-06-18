import React, { useState } from 'react';
import ValidatorsTable from './ValidatorsTable';
import { mockValidators } from './validatorsData';
import { Validator, VisibleColumns } from './types';

interface ValidatorsProps {
  onStake?: (validator: Validator) => void;
  onUnstake?: (validator: Validator) => void;
}

export default function Validators({ onStake, onUnstake }: ValidatorsProps) {
  const [validators] = useState<Validator[]>(mockValidators);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  // Visible columns state
  const [visibleColumns, setVisibleColumns] = useState<VisibleColumns>({
    status: true,
    wallet: true,
    miner: false,
    publickey: false,
    stake: true,
    voting: true,
    score: true,
    cr: true,
    mystake: true,
    actions: true
  });

  // Filter validators based on search and status
  const filteredValidators = validators.filter(validator => {
    const matchesSearch = validator.walletAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || validator.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStake = (validator: Validator) => {
    onStake?.(validator);
  };

  const handleUnstake = (validator: Validator) => {
    onUnstake?.(validator);
  };

  return (
    <>
      {/* Validators Metrics Section */}
      <section className="validators-metrics">
      <div className="container">
        <div className="metrics-grid">
          <div className="metric-card fade-in">
            <div className="metric-icon">
              <i className="fas fa-users"></i>
            </div>
            <h3>Total Validators</h3>
            <p className="metric-value">150</p>
          </div>
          <div className="metric-card fade-in">
            <div className="metric-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>Active Validators</h3>
            <p className="metric-value">142</p>
          </div>
          <div className="metric-card fade-in">
            <div className="metric-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3>Valid Validators</h3>
            <p className="metric-value">138</p>
          </div>
          <div className="metric-card fade-in">
            <div className="metric-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Invalid Validators</h3>
            <p className="metric-value">12</p>
          </div>
        </div>
      </div>
    </section>

      {/* Validators Table Section */}
      <section className="validators-table-section">
        <div className="container">
          <div className="validators-controls">
            <div className="search-filter-group">
              <div className="search-container">
                <input 
                  type="text" 
                  placeholder="Search by wallet address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-btn">
                  <i className="fas fa-search"></i>
                </button>
              </div>
              <div className="filter-container">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="valid">Valid</option>
                  <option value="invalid">Invalid</option>
                </select>
              </div>
            </div>
            <div className="customize-container">
              <button 
                className="btn-customize"
                onClick={() => setShowCustomizeModal(true)}
              >
                <i className="fas fa-columns"></i> Customize Columns
              </button>
            </div>
          </div>

          <ValidatorsTable 
            validators={filteredValidators}
            visibleColumns={visibleColumns}
            onStake={handleStake}
            onUnstake={handleUnstake}
          />

          <div className="pagination">
            <button className="pagination-btn">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <span className="pagination-ellipsis">...</span>
            <button className="pagination-btn">10</button>
            <button className="pagination-btn">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Customize Columns Modal */}
      {showCustomizeModal && (
        <div className="modal show" onClick={(e) => e.target === e.currentTarget && setShowCustomizeModal(false)}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add, delete and sort columns just how you need it</h3>
              <button className="close-modal" onClick={() => setShowCustomizeModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="columns-container">
                <div className="columns-section">
                  <div className="columns-section-title">CURRENT COLUMNS</div>
                  <div className="active-columns">
                    {Object.entries(visibleColumns)
                      .filter(([, visible]) => visible)
                      .map(([column], index) => (
                        <div key={column} className="active-column" data-column={column}>
                          <div className="column-number">{index + 1}</div>
                          <div className="column-name">
                            {column === 'wallet' ? 'Wallet address' :
                             column === 'miner' ? 'Miner address' :
                             column === 'publickey' ? 'Public Key' :
                             column === 'stake' ? 'Total Stake' :
                             column === 'voting' ? 'Voting Power' :
                             column === 'mystake' ? 'My Stake' :
                             column.charAt(0).toUpperCase() + column.slice(1)}
                          </div>
                          <div className="column-drag">
                            <i className="fas fa-grip-lines"></i>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <div className="columns-section">
                  <div className="columns-section-title">AVAILABLE COLUMNS</div>
                  <div className="available-columns">
                    {Object.entries(visibleColumns).map(([column, visible]) => (
                      <div 
                        key={column} 
                        className={`available-column ${visible ? 'selected' : ''}`}
                        data-column={column}
                        onClick={() => setVisibleColumns(prev => ({
                          ...prev,
                          [column]: !prev[column as keyof VisibleColumns]
                        }))}
                      >
                        <div className="column-name">
                          {column === 'wallet' ? 'Wallet address' :
                           column === 'miner' ? 'Miner address' :
                           column === 'publickey' ? 'Public Key' :
                           column === 'stake' ? 'Total Stake' :
                           column === 'voting' ? 'Voting Power' :
                           column === 'mystake' ? 'My Stake' :
                           column.charAt(0).toUpperCase() + column.slice(1)}
                        </div>
                        {visible && (
                          <div className="column-remove">
                            <i className="fas fa-times"></i>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowCustomizeModal(false)}>
                Cancel
              </button>
              <button className="btn-apply" onClick={() => setShowCustomizeModal(false)}>
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
