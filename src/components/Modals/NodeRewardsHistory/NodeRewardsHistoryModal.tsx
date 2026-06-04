'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Modal from '@/components/Modal';
import { clientApiGet } from '@/lib/apiClient';
import { usePrivacyMode } from '@/contexts/PrivacyMode';
import { AreaChart } from '@/components/Charts';
import { truncateAddress, parseEpochEndTime, formatEpochEndDate } from '@/utils/common';
import logger from '@/utils/logger';
import type { NodeEpochReward, NodeEpochRewardsResponse } from '@/types/rewards';
import '../RewardsHistory/RewardsHistoryModal.css';

interface NodeRewardsHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  validatorAddress: string;
}

const LIMIT = 100;

const NodeRewardsHistoryModal: React.FC<NodeRewardsHistoryModalProps> = ({
  isOpen,
  onClose,
  validatorAddress,
}) => {
  const [rewards, setRewards] = useState<NodeEpochReward[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const { isPrivacyMode } = usePrivacyMode();

  const fetchRewards = async () => {
    if (isPrivacyMode) {
      setError('Not available in Privacy Mode');
      return;
    }
    if (!validatorAddress) return;

    setIsLoading(true);
    setError(null);

    try {
      const addr = validatorAddress.toLowerCase();
      const offset = page * LIMIT;
      const response = await clientApiGet<NodeEpochRewardsResponse>(
        `node/${addr}/epoch-rewards?limit=${LIMIT}&offset=${offset}`
      );

      if (!response.ok) {
        setError(response.error || `Failed to fetch rewards (${response.status})`);
        setRewards([]);
        setTotalCount(0);
      } else {
        setRewards(response.data.data || []);
        setTotalCount(response.data.count || 0);
      }
    } catch (err) {
      logger.error('Error fetching validator rewards history:', err);
      setError(err instanceof Error ? err.message : 'Failed to load rewards history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && validatorAddress) {
      fetchRewards();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, validatorAddress, page]);

  useEffect(() => {
    if (!isOpen) {
      setPage(0);
      setRewards([]);
      setError(null);
    }
  }, [isOpen]);

  const chartData = useMemo(() => {
    const rows: { epoch: number; totalReward: number; ownerReward: number }[] = [];
    for (const e of rewards) {
      if (!parseEpochEndTime(e.epoch_end_time)) continue;
      rows.push({
        epoch: e.epoch,
        totalReward: parseFloat(e.total_pool_reward),
        ownerReward: parseFloat(e.owner_reward),
      });
    }
    rows.sort((a, b) => a.epoch - b.epoch);
    return rows;
  }, [rewards]);

  const totalPages = Math.ceil(totalCount / LIMIT);

  const formatDmd = (val: string) => {
    const num = parseFloat(val);
    return isNaN(num) ? '—' : num.toFixed(4) + ' DMD';
  };

  const tableRows = useMemo(
    () => [...rewards].sort((a, b) => b.epoch - a.epoch),
    [rewards]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="rewards-history-modal">
      <div className="rewards-history-container">
        <div className="rewards-history-header">
          <h2 className="rewards-history-title">Rewards History</h2>
        </div>

        <p className="rewards-history-subtitle">
          Per-epoch pool rewards for {truncateAddress(validatorAddress)}
        </p>

        {isLoading && (
          <div className="rewards-history-loading">
            <div className="spinner"></div>
            <p>Loading rewards...</p>
          </div>
        )}

        {error && (
          <div className="rewards-history-error">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && rewards.length === 0 && (
          <div className="rewards-history-empty">
            <p>No rewards history available</p>
          </div>
        )}

        {!isLoading && !error && rewards.length > 0 && (
          <div className="rewards-history-dual-view">
            {chartData.length > 0 && (
              <div className="rewards-history-chart-section">
                <div className="chart-wrapper">
                  <AreaChart
                    data={chartData}
                    xAxisKey="epoch"
                    areas={[
                      { dataKey: 'totalReward', name: 'Pool reward', type: 'monotone' },
                      { dataKey: 'ownerReward', name: 'Owner share', type: 'monotone' },
                    ]}
                    config={{ height: 250 }}
                    xAxisLabel="Epoch"
                    yAxisLabel="DMD"
                    className="chart-fade-in"
                  />
                </div>
              </div>
            )}

            <div className="rewards-history-list-section">
              <table className="rewards-history-table">
                <thead>
                  <tr>
                    <th>Epoch</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Owner</th>
                    <th>Delegators</th>
                    <th>APY</th>
                    <th>Pool stake</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((entry, i) => (
                    <tr key={`${entry.epoch}-${i}`}>
                      <td>{entry.epoch}</td>
                      <td>{formatEpochEndDate(entry.epoch_end_time)}</td>
                      <td>{formatDmd(entry.total_pool_reward)}</td>
                      <td>{formatDmd(entry.owner_reward)}</td>
                      <td>{formatDmd(entry.delegators_total_reward)}</td>
                      <td>{parseFloat(entry.epoch_apy).toFixed(2)}%</td>
                      <td>{parseFloat(entry.total_staked_snapshot).toFixed(4)} DMD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="rewards-history-pagination">
                <button
                  className="pagination-btn"
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <span className="pagination-info">
                  Page {page + 1} of {totalPages} ({totalCount} total)
                </span>
                <button
                  className="pagination-btn"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => p + 1)}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NodeRewardsHistoryModal;
