'use client';

import React, { useEffect, useState } from 'react';
import Modal from '@/components/Modal';
import { clientApiGet } from '@/lib/apiClient';
import { usePrivacyMode } from '@/contexts/PrivacyMode';
import './BonusScoreHistoryModal.css';
import { toast } from 'react-toastify';

interface BonusScoreHistoryEntry {
  block_number: number;
  epoch: number;
  score_change: number;
  previous_score: number;
  new_score: number;
  reason: string;
}

interface BonusScoreHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  validatorAddress: string;
}

const BonusScoreHistoryModal: React.FC<BonusScoreHistoryModalProps> = ({
  isOpen,
  onClose,
  validatorAddress,
}) => {
  const [history, setHistory] = useState<BonusScoreHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isPrivacyMode } = usePrivacyMode();

  useEffect(() => {
    if (isOpen && validatorAddress) {
      fetchHistory();
    }
  }, [isOpen, validatorAddress]);

  const fetchHistory = async () => {
    // Block API calls in Privacy Mode
    if (isPrivacyMode) {
      setError('Bonus score history is not available in Privacy Mode');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const endpoint = `node/${validatorAddress}/bonus-score-reasons-history/`;
      
      const response = await clientApiGet<{ data: BonusScoreHistoryEntry[] }>(endpoint);

      if (!response.ok) {
        toast.error(response.error || `Failed to fetch history: ${response.status}`);
      }

      setHistory(response.data.data || []);
    } catch (err) {
      console.error('Error fetching bonus score history:', err);
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  const formatReason = (reason: string): string => {
    // Convert camelCase to readable format
    return reason
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const getReasonClass = (reason: string): string => {
    if (reason.toLowerCase().includes('bonus')) return 'bonus';
    if (reason.toLowerCase().includes('penalty')) return 'penalty';
    return 'neutral';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="bonus-history-modal">
      <div className="bonus-history-container">
        <h2 className="bonus-history-title">
          Bonus Score History
        </h2>
        <p className="bonus-history-subtitle">
          Historical changes to the validator's bonus score
        </p>

        {isLoading && (
          <div className="bonus-history-loading">
            <div className="spinner"></div>
            <p>Loading history...</p>
          </div>
        )}

        {error && (
          <div className="bonus-history-error">
            <i className="fas fa-exclamation-circle"></i>
            <p>Unavailable</p>
          </div>
        )}

        {!isLoading && !error && history.length === 0 && (
          <div className="bonus-history-empty">
            <i className="fas fa-inbox"></i>
            <p>No history available</p>
          </div>
        )}

        {!isLoading && !error && history.length > 0 && (
          <>
            <div className="bonus-history-list">
              {history.map((entry, index) => (
                <div key={`${entry.block_number}-${index}`} className="history-entry">
                  <div className="entry-header">
                    <span className="entry-epoch">
                      <i className="fas fa-layer-group"></i> Epoch {entry.epoch}
                    </span>
                    <span className="entry-block">
                      Block #{entry.block_number.toLocaleString()}
                    </span>
                  </div>

                  <div className="entry-body">
                    <div className="score-change-container">
                      <div className="score-display">
                        <span className="score-label">Previous</span>
                        <span className="score-value">{entry.previous_score}</span>
                      </div>
                      
                      <div className={`score-arrow ${entry.score_change > 0 ? 'positive' : 'negative'}`}>
                        <i className={`fas fa-arrow-${entry.score_change > 0 ? 'up' : 'down'}`}></i>
                        <span className="change-value">
                          {entry.score_change > 0 ? '+' : ''}{entry.score_change}
                        </span>
                      </div>

                      <div className="score-display">
                        <span className="score-label">New</span>
                        <span className="score-value">{entry.new_score}</span>
                      </div>
                    </div>

                    <div className={`entry-reason ${getReasonClass(entry.reason)}`}>
                      <i className={`fas fa-${entry.score_change > 0 ? 'plus-circle' : 'minus-circle'}`}></i>
                      <span>{formatReason(entry.reason)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default BonusScoreHistoryModal;
