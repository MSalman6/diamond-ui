'use client'

import '../page.css';
import './Profile.css';
import Link from 'next/link';
import BigNumber from 'bignumber.js';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { truncateAddress, parseEpochEndTime, parseDmdAmount } from '@/utils/common';
import { useWeb3Context } from '@/contexts/Web3';
import InfoTooltip from '@/components/InfoTooltip';
import { useStakingContext } from '@/contexts/Staking';
import { useDaoContext } from '@/contexts/DAO';
import { useIsPrivacyMode } from '@/contexts';
import { useWalletConnect } from '@/contexts/WalletConnect';
import StakeModal from '@/components/Modals/Stake/StakeModal';
import UnstakeModal from '@/components/Modals/Unstake/UnstakeModal';
import RemoveValidatorModal from '@/components/Modals/RemoveValidator/RemoveValidatorModal';
import CreatePoolModal from '@/components/Modals/CreatePool/CreatePoolModal';
import UpdatePoolOperatorModal from '@/components/Modals/UpdatePoolOperator/UpdatePoolOperatorModal';
import BonusScoreHistoryModal from '@/components/Modals/BonusScoreHistory/BonusScoreHistoryModal';
import StakeHistoryModal from '@/components/Modals/StakeHistory/StakeHistoryModal';
import RewardsHistoryModal from '@/components/Modals/RewardsHistory/RewardsHistoryModal';
import NodeRewardsHistoryModal from '@/components/Modals/NodeRewardsHistory/NodeRewardsHistoryModal';
import type { BatchNodeRewardStats, NodeRewardStats, StakerRewardStats, NodeEpochReward } from '@/types/rewards';
import {
  getCachedBatchNodeStats,
  getCachedNodeRewardStats,
  getCachedNodeEpochRewards,
  getCachedStakerRewardStats,
  getCachedStakerRewards30d,
} from '@/lib/rewardStatsCache';
import AreaChart from '@/components/Charts/AreaChart';
import '@/components/Charts/Charts.css';
import ValidatorCell from '@/components/ValidatorCell';
import Aep30Badge, { Aep30Ring } from '@/components/Aep30Badge';
import SaturationBar from '@/components/SaturationBar';
import Rpt30Cell from '@/components/Rpt30Cell';

export default function ProfilePage() {
  const router = useRouter();
  const { userWallet } = useWeb3Context();
  const { myPool, pools, totalDaoStake, myTotalStake, myCandidateStake } = useStakingContext();
  const isPrivacyMode = useIsPrivacyMode();
  const { isConnected } = useWalletConnect();
  const { allDaoProposals } = useDaoContext();
  const [isBonusHistoryModalOpen, setIsBonusHistoryModalOpen] = useState(false);
  const [isValidatorStakeHistoryModalOpen, setIsValidatorStakeHistoryModalOpen] = useState(false);
  const [isDelegatedStakeHistoryModalOpen, setIsDelegatedStakeHistoryModalOpen] = useState(false);
  const [isStakerHistoryModalOpen, setIsStakerHistoryModalOpen] = useState(false);

  // Delegator reward state
  const [stakerRewardStats, setStakerRewardStats] = useState<StakerRewardStats | null>(null);
  const [stakerNodeStatsMap, setStakerNodeStatsMap] = useState<Record<string, BatchNodeRewardStats>>({});
  const [isLoadingStakerStats, setIsLoadingStakerStats] = useState(false);
  const [isRewardsHistoryModalOpen, setIsRewardsHistoryModalOpen] = useState(false);

  // Validator reward state
  const [validatorRewardStats, setValidatorRewardStats] = useState<NodeRewardStats | null>(null);
  const [isLoadingValidatorStats, setIsLoadingValidatorStats] = useState(false);
  const [isValidatorRewardsHistoryModalOpen, setIsValidatorRewardsHistoryModalOpen] = useState(false);

  // Per-pool rewards 30d (delegator view)
  const [perPoolRewards30d, setPerPoolRewards30d] = useState<Record<string, number>>({});
  // Top validators stats map (delegator view)
  const [topValidatorStatsMap, setTopValidatorStatsMap] = useState<Record<string, BatchNodeRewardStats>>({});
  // Epoch rewards (validator view)
  const [epochRewards, setEpochRewards] = useState<NodeEpochReward[]>([]);
  const [isLoadingEpochRewards, setIsLoadingEpochRewards] = useState(false);
  // legend toggles for Rewards Performance chart
  const [chartShowRpt, setChartShowRpt] = useState(true);
  const [chartShowScore, setChartShowScore] = useState(false);
  const [chartShowSaturation, setChartShowSaturation] = useState(false);

  // Get validators that user has staked with (has myStake > 0)
  const stakedValidators = useMemo(() => {
    return pools.filter(pool => 
      pool.myStake && 
      BigNumber(pool.myStake).isGreaterThan(0) &&
      pool.stakingAddress !== userWallet.myAddr
    );
  }, [pools, userWallet.myAddr]);

  // Get top 5 validators by total stake and score
  const topValidators = useMemo(() => {
    const validatorsWithData = pools.filter(pool => 
      pool.totalStake && 
      BigNumber(pool.totalStake).isGreaterThan(0) && 
      pool.score !== undefined && 
      pool.score !== null
    );
    
    // Sort by total stake (descending) and then by score (descending)
    return validatorsWithData
      .sort((a, b) => {
        const stakeComparison = BigNumber(b.totalStake).minus(a.totalStake).toNumber();
        if (stakeComparison !== 0) return stakeComparison;
        return b.score - a.score;
      })
      .slice(0, 5);
  }, [pools]);

  // Redirect to home if wallet is not connected
  useEffect(() => {
    if (!isConnected || !userWallet.myAddr) {
      router.replace('/');
    }
  }, [isConnected, userWallet.myAddr, router]);

  // Calculate voting power as percentage of total DAO stake
  const calculateVotingPower = (totalStake: BigNumber) => {
    if (!totalDaoStake || totalDaoStake.isZero()) {
      return '0.0';
    }
    return BigNumber(totalStake).dividedBy(totalDaoStake).multipliedBy(100).toFixed(1);
  };

  // Format DMD amounts with proper decimals and commas
  const formatDMDAmount = (amount: BigNumber) => {
    const dmdAmount = amount.dividedBy(1e18);
    return dmdAmount.toFormat(0, BigNumber.ROUND_DOWN) + ' DMD';
  };

  const myDelegatedStakeWei = useMemo(() => {
    if (myPool) {
      return new BigNumber(0);
    }
    return myTotalStake || new BigNumber(0);
  }, [myPool, myTotalStake]);

  const myOutgoingDelegationsWei = useMemo(() => {
    return myCandidateStake || new BigNumber(0);
  }, [myCandidateStake]);

  // Number of proposals created by the user
  const myProposalsCreated = useMemo(() => {
    if (!allDaoProposals || !userWallet.myAddr) return 0;
    try {
      return allDaoProposals.filter(p => (p.proposer || '').toLowerCase() === userWallet.myAddr.toLowerCase()).length;
    } catch {
      return 0;
    }
  }, [allDaoProposals, userWallet.myAddr]);

  // Aggregate voting power of validators the user staked with
  const stakedWithVotingPowerPct = useMemo(() => {
    if (!totalDaoStake || totalDaoStake.isZero()) return '0.0';
    const sumStakeWei = stakedValidators.reduce((sum, v) => sum.plus(v.totalStake || 0), new BigNumber(0));
    return BigNumber(sumStakeWei).dividedBy(totalDaoStake).multipliedBy(100).toFixed(2);
  }, [stakedValidators, totalDaoStake]);

  const hasValidator = Boolean(myPool);

  // Staker reward stats (delegator view)
  useEffect(() => {
    if (hasValidator || !userWallet.myAddr || isPrivacyMode) return;
    setIsLoadingStakerStats(true);
    getCachedStakerRewardStats(userWallet.myAddr)
      .then(data => { if (data) setStakerRewardStats(data); })
      .catch(() => {})
      .finally(() => setIsLoadingStakerStats(false));
  }, [hasValidator, userWallet.myAddr, isPrivacyMode]);

  // Per-staked-validator node stats (delegator view)
  useEffect(() => {
    if (hasValidator || !stakedValidators.length || isPrivacyMode) return;
    const addresses = stakedValidators.map(p => p.stakingAddress.toLowerCase());
    getCachedBatchNodeStats(addresses)
      .then(data => setStakerNodeStatsMap(data))
      .catch(() => {});
  }, [hasValidator, stakedValidators, isPrivacyMode]);

  // Validator reward stats (validator view)
  useEffect(() => {
    if (!hasValidator || !myPool?.stakingAddress || isPrivacyMode) return;
    setIsLoadingValidatorStats(true);
    getCachedNodeRewardStats(myPool.stakingAddress)
      .then(data => { if (data) setValidatorRewardStats(data); })
      .catch(() => {})
      .finally(() => setIsLoadingValidatorStats(false));
  }, [hasValidator, myPool?.stakingAddress, isPrivacyMode]);

  // Per-pool rewards 30d for delegator view
  useEffect(() => {
    if (hasValidator || !userWallet.myAddr || isPrivacyMode) return;
    getCachedStakerRewards30d(userWallet.myAddr)
      .then(map => setPerPoolRewards30d(map))
      .catch(() => {});
  }, [hasValidator, userWallet.myAddr, isPrivacyMode]);

  // Top validators stats (delegator view)
  useEffect(() => {
    if (hasValidator || !topValidators.length || isPrivacyMode) return;
    const addresses = topValidators.map(p => p.stakingAddress.toLowerCase());
    getCachedBatchNodeStats(addresses)
      .then(data => setTopValidatorStatsMap(data))
      .catch(() => {});
  }, [hasValidator, topValidators, isPrivacyMode]);

  // Epoch rewards history (validator view) — GET /node/:address/epoch-rewards
  useEffect(() => {
    if (!hasValidator || !myPool?.stakingAddress || isPrivacyMode) return;
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 86400;
    setIsLoadingEpochRewards(true);
    getCachedNodeEpochRewards(myPool.stakingAddress, thirtyDaysAgo)
      .then(data => setEpochRewards(data))
      .catch(() => {})
      .finally(() => setIsLoadingEpochRewards(false));
  }, [hasValidator, myPool?.stakingAddress, isPrivacyMode]);

  const rpt30DeltaPct = useMemo(() => {
    if (validatorRewardStats?.rpt30_delta == null || validatorRewardStats?.rpt30_prev30 == null) {
      return null;
    }
    const prev = validatorRewardStats.rpt30_prev30;
    if (prev === 0) return null;
    return (validatorRewardStats.rpt30_delta / prev) * 100;
  }, [validatorRewardStats]);

  // chart series derived from epoch-rewards
  const validatorChartData = useMemo(() => {
    const maxStakeDmd = 50000;
    const rows: { date: string; rpt: number; score: number; saturation: number; sortKey: number }[] = [];
    for (const e of epochRewards) {
      const endDate = parseEpochEndTime(e.epoch_end_time);
      const stakeDmd = parseDmdAmount(e.total_staked_snapshot);
      if (!endDate || stakeDmd <= 0) continue;
      const delegatorsReward = parseDmdAmount(e.delegators_total_reward);
      rows.push({
        date: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        rpt: (delegatorsReward / stakeDmd) * 1000,
        score: Number(myPool?.score ?? 0),
        saturation: Math.min(100, (stakeDmd / maxStakeDmd) * 100),
        sortKey: endDate.getTime(),
      });
    }
    rows.sort((a, b) => a.sortKey - b.sortKey);
    return rows;
  }, [epochRewards, myPool?.score]);

  const validatorChartAreas = useMemo(() => {
    const areas: { dataKey: string; name: string; color: string }[] = [];
    if (chartShowRpt) {
      areas.push({ dataKey: 'rpt', name: 'RpT30', color: '#3a7bd5' });
    }
    if (chartShowScore) {
      areas.push({ dataKey: 'score', name: 'Score', color: '#8b5cf6' });
    }
    if (chartShowSaturation) {
      areas.push({ dataKey: 'saturation', name: 'Saturation', color: '#14b8a6' });
    }
    return areas;
  }, [chartShowRpt, chartShowScore, chartShowSaturation]);

  // APY (delegator view)
  const portfolioApy = useMemo(() => {
    if (!stakerRewardStats || !myTotalStake || BigNumber(myTotalStake).isZero()) return null;
    const rewards = BigNumber(stakerRewardStats.total_rewards_30d);
    const stakeInDmd = BigNumber(myTotalStake).dividedBy(1e18);
    return rewards.dividedBy(stakeInDmd).multipliedBy(12).multipliedBy(100).toFixed(2);
  }, [stakerRewardStats, myTotalStake]);

  // Average RpT30 across staked validators
  const avgRpt30 = useMemo(() => {
    const entries = stakedValidators
      .map(v => stakerNodeStatsMap[v.stakingAddress.toLowerCase()]?.rpt30)
      .filter((v): v is number => v != null);
    if (!entries.length) return null;
    return (entries.reduce((a, b) => a + b, 0) / entries.length).toFixed(2);
  }, [stakedValidators, stakerNodeStatsMap]);

  // Best validator by RpT30
  const bestValidator = useMemo(() => {
    return stakedValidators.reduce<{ addr: string; rpt30: number } | null>((best, v) => {
      const rpt30 = stakerNodeStatsMap[v.stakingAddress.toLowerCase()]?.rpt30;
      if (rpt30 == null) return best;
      if (!best || rpt30 > best.rpt30) return { addr: v.stakingAddress, rpt30 };
      return best;
    }, null);
  }, [stakedValidators, stakerNodeStatsMap]);

  // Determine current validator status
  const myValidatorStatus = useMemo(() => {
    if (!myPool) return null;
    const isActive = Boolean((myPool as any).isActive);
    const isValid = Boolean((myPool as any).isToBeElected || (myPool as any).isPendingValidator);
    if (isActive) return { label: 'Active', className: 'active' } as const;
    if (isValid) return { label: 'Valid', className: 'valid' } as const;
    return { label: 'Invalid', className: 'invalid' } as const;
  }, [myPool]);

  // Compute own validator stake and delegated stake for the current pool
  const totalStakeWei = BigNumber(myPool?.totalStake || 0);
  const myValidatorStakeWei = BigNumber(myPool?.myStake || 0);
  const delegatedStakeWei = BigNumber.max(totalStakeWei.minus(myValidatorStakeWei), 0);

  // Compute stake distribution percentages (own vs delegated)
  const ownStakePct = totalStakeWei.isGreaterThan(0)
    ? myValidatorStakeWei.multipliedBy(100).dividedBy(totalStakeWei).toFixed(0)
    : '0';
  const delegatedStakePct = totalStakeWei.isGreaterThan(0)
    ? delegatedStakeWei.multipliedBy(100).dividedBy(totalStakeWei).toFixed(0)
    : '0';

  const copyData = (data: string) => {
    copy(data);
    toast.success("Copied to clipboard");
  };

  return (
    <div>
        {/* Authenticated User View (Without Validator) */}
        <div id="authenticated-user-view" style={{display: hasValidator ? "none" : "block"}}>
          {/* User Information Section */}
          <section className="hero user-info-section">
            <div className="cosmic-grid"></div>
            <div className="cosmic-elements">
              <div className="glow glow-1"></div>
              <div className="glow glow-2"></div>
            </div>
            <div className="container">
              <div className="user-dashboard">
                <div className="user-info-card">
                  <div className="user-info-header">
                    <div className="user-wallet">
                      <div className="wallet-icon large">
                        <div className="wallet-icon-inner"></div>
                      </div>
                      <div className="wallet-details">
                        <h1>{userWallet.myAddr}</h1>
                        <p>User Account</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="dp2-stats-bar">
                    <div className="dp2-stat-item">
                      <div className="dp2-stat-label">
                        Total Delegated Stake
                        <InfoTooltip content={<div><p>The total amount of DMD you've delegated across all validators.</p></div>}>
                          <i className="fas fa-info-circle info-icon" aria-hidden="true"></i>
                        </InfoTooltip>
                      </div>
                      <div className="dp2-stat-value">
                        {isPrivacyMode ? '—' : myDelegatedStakeWei.isZero()
                          ? '0 DMD'
                          : myDelegatedStakeWei.dividedBy(1e18).toFormat(4, BigNumber.ROUND_DOWN) + ' DMD'}
                      </div>
                      <div className="dp2-stat-sub">across {stakedValidators.length} validator{stakedValidators.length !== 1 ? 's' : ''}</div>
                      <div className="dp2-stat-actions">
                        <Link href="/validators?sort=myStake&direction=descending" className="btn-primary btn-sm">Stake/Unstake</Link>
                        <CreatePoolModal buttonText="Create pool" />
                      </div>
                    </div>

                    <div className="dp2-stat-item dp2-stat-item--sep">
                      <div className="dp2-stat-label">
                        Total Rewards 30d
                        <InfoTooltip content={<div><p>Total DMD rewards earned from all your staked validators over the past 30 days.</p></div>}>
                          <i className="fas fa-info-circle info-icon" aria-hidden="true"></i>
                        </InfoTooltip>
                      </div>
                      <div className="dp2-stat-value dp2-stat-value--teal">
                        {isPrivacyMode ? '—' : isLoadingStakerStats ? '...' : stakerRewardStats ? stakerRewardStats.total_rewards_30d.toFixed(1) + ' DMD' : '—'}
                      </div>
                      <div className="dp2-stat-sub">last 30d</div>
                    </div>

                    <div className="dp2-stat-item dp2-stat-item--sep">
                      <div className="dp2-stat-label">
                        Portfolio APY
                        <InfoTooltip content={<div><p>Estimated annualized return based on validator rewards over the last 30 days.</p></div>}>
                          <i className="fas fa-info-circle info-icon" aria-hidden="true"></i>
                        </InfoTooltip>
                      </div>
                      <div className="dp2-stat-value">
                        {isPrivacyMode ? '—' : isLoadingStakerStats ? '...' : portfolioApy != null ? portfolioApy + '%' : '—'}
                      </div>
                      <div className="dp2-stat-sub">estimated</div>
                    </div>

                    <div className="dp2-stat-item dp2-stat-item--sep">
                      <div className="dp2-stat-label">
                        Avg RpT30
                        <InfoTooltip content={<div><p>Average rewards per 1,000 DMD staked across all your validators over the last 30 days.</p></div>}>
                          <i className="fas fa-info-circle info-icon" aria-hidden="true"></i>
                        </InfoTooltip>
                      </div>
                      <div className="dp2-stat-value dp2-stat-value--teal">
                        {isPrivacyMode ? '—' : avgRpt30 != null ? avgRpt30 + ' DMD' : '—'}
                      </div>
                      <div className="dp2-stat-sub">per 1000 / 30d</div>
                    </div>

                    <div className="dp2-stat-item dp2-stat-item--sep">
                      <div className="dp2-stat-label">
                        Best Validator
                        <InfoTooltip content={<div><p>The validator you're staked with that has the highest RpT30 (rewards per 1,000 DMD / 30d).</p></div>}>
                          <i className="fas fa-info-circle info-icon" aria-hidden="true"></i>
                        </InfoTooltip>
                      </div>
                      <div className="dp2-stat-value dp2-stat-value--teal dp2-stat-value--link">
                        {isPrivacyMode ? '—' : bestValidator
                          ? <Link href="/validators">{truncateAddress(bestValidator.addr)}</Link>
                          : '—'}
                      </div>
                      <div className="dp2-stat-sub">
                        {!isPrivacyMode && bestValidator ? `RpT30: ${bestValidator.rpt30.toFixed(1)}` : '—'}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>

          {/* Staked With Section */}
          <section className="validators-staked">
            <div className="container">
              <div className="dp-section-header">
                <h2>Staked With</h2>
                {!isPrivacyMode && (
                  <button
                    onClick={() => setIsRewardsHistoryModalOpen(true)}
                    className="btn-secondary btn-sm"
                  >
                    History
                  </button>
                )}
              </div>
              <div className="table-container">
                <table className="validators-table">
                  <thead>
                    <tr>
                      <th>Validator</th>
                      {!isPrivacyMode && <th>RpT30</th>}
                      {!isPrivacyMode && <th>APY</th>}
                      {!isPrivacyMode && <th>AEP30</th>}
                      <th>Saturation</th>
                      <th>My Stake</th>
                      {!isPrivacyMode && <th>Rewards 30d</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {stakedValidators.length > 0 ? (
                      stakedValidators.map((validator) => {
                        const stats = stakerNodeStatsMap[validator.stakingAddress.toLowerCase()];
                        const rewards30d = perPoolRewards30d[validator.stakingAddress.toLowerCase()];
                        return (
                          <tr key={validator.stakingAddress}>
                            <td><ValidatorCell address={validator.stakingAddress} /></td>
                            {!isPrivacyMode && <td>{stats ? <Rpt30Cell rpt30={stats.rpt30} rpt30_delta={stats.rpt30_delta} /> : '—'}</td>}
                            {!isPrivacyMode && <td>{stats ? stats.estimated_apy.toFixed(2) + '%' : '—'}</td>}
                            {!isPrivacyMode && <td>{stats ? <Aep30Badge aep30={stats.aep30} /> : '—'}</td>}
                            <td><SaturationBar totalStakeWei={validator.totalStake || '0'} /></td>
                            <td>{validator.myStake ? BigNumber(validator.myStake).dividedBy(1e18).toFormat(4, BigNumber.ROUND_DOWN) + ' DMD' : '0 DMD'}</td>
                            {!isPrivacyMode && <td className="dp2-rewards-cell">{rewards30d != null ? rewards30d.toFixed(1) + ' DMD' : '—'}</td>}
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={isPrivacyMode ? 3 : 7} style={{ textAlign: 'center', padding: '2rem' }}>
                          You haven't staked with any validators yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {stakedValidators.length > 0 && (
                    <tfoot>
                      <tr className="dp2-tfoot-row">
                        <td>
                          <span className="dp2-tfoot-count">
                            <i className="fas fa-chart-bar" aria-hidden="true"></i>
                            {' '}{stakedValidators.length} validator{stakedValidators.length !== 1 ? 's' : ''}
                          </span>
                        </td>
                        {!isPrivacyMode && <td></td>}
                        {!isPrivacyMode && <td></td>}
                        {!isPrivacyMode && <td></td>}
                        <td></td>
                        <td className="dp2-tfoot-total">
                          <span>Total Delegated:</span>{' '}
                          <strong>{isPrivacyMode ? '—' : myDelegatedStakeWei.dividedBy(1e18).toFormat(4, BigNumber.ROUND_DOWN) + ' DMD'}</strong>
                        </td>
                        {!isPrivacyMode && (
                          <td className="dp2-tfoot-rewards">
                            <span>Total Rewards 30d:</span>{' '}
                            <strong className="dp2-tfoot-rewards-value">
                              {stakerRewardStats ? stakerRewardStats.total_rewards_30d.toFixed(1) + ' DMD' : '—'}
                            </strong>
                          </td>
                        )}
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </div>
          </section>

          {/* Top Validators Section */}
          <section className="top-validators">
            <div className="container">
              <h2>Top Validators</h2>
              <div className="table-container">
                <table className="validators-table">
                  <thead>
                    <tr>
                      <th>Validator</th>
                      {!isPrivacyMode && <th>RpT30</th>}
                      {!isPrivacyMode && <th>APY</th>}
                      <th>Saturation</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topValidators.map((validator) => {
                      const stats = topValidatorStatsMap[validator.stakingAddress.toLowerCase()];
                      return (
                        <tr key={validator.stakingAddress} className={validator.stakingAddress === userWallet.myAddr ? "current-user" : ""}>
                          <td>
                            <ValidatorCell
                              address={validator.stakingAddress}
                              subtext={validator.stakingAddress === userWallet.myAddr ? '(You)' : undefined}
                            />
                          </td>
                          {!isPrivacyMode && <td>{stats ? <Rpt30Cell rpt30={stats.rpt30} rpt30_delta={stats.rpt30_delta} /> : '—'}</td>}
                          {!isPrivacyMode && <td>{stats ? stats.estimated_apy.toFixed(2) + '%' : '—'}</td>}
                          <td><SaturationBar totalStakeWei={validator.totalStake || '0'} /></td>
                          <td>{validator.score !== undefined && validator.score !== null ? Number(validator.score).toFixed(1) : 'N/A'}</td>
                        </tr>
                      );
                    })}
                    {topValidators.length === 0 && (
                      <tr>
                        <td colSpan={isPrivacyMode ? 3 : 5} style={{ textAlign: 'center', padding: '2rem' }}>
                          No validator data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="validators-actions">
                <Link href="/validators" className="dp-view-all-link btn-primary">See the list <i className="fas fa-arrow-right"></i></Link>
              </div>
            </div>
          </section>
        </div>

        {/* Authenticated User View (With Validator) */}
        <div id="authenticated-validator-view" style={{display: hasValidator ? "block" : "none"}}>
          {/* User/Validator Information Section */}
          <section className="hero validator-info-section">
            <div className="cosmic-grid"></div>
            <div className="cosmic-elements">
              <div className="glow glow-1"></div>
              <div className="glow glow-2"></div>
            </div>
            <div className="container">
              <div className="validator-dashboard">
                <div className="validator-header">
                  <div className="validator-identity">
                    <div className="wallet-icon large">
                      <div className="wallet-icon-inner" style={{background: "linear-gradient(45deg, #6EE7B7, #3B82F6)"}}></div>
                    </div>
                    <div className="validator-details">
                      <h1>{userWallet.myAddr}</h1>
                      {myValidatorStatus && (
                        <span className={`status-badge ${myValidatorStatus.className}`}>{myValidatorStatus.label}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="combined-stake-card">
                  <div className="stake-card-header">
                    <h3>Validator Pool Overview <InfoTooltip content={<div><p>Summary of your total stake, combining your own validator stake and all delegations received.</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></h3>
                    <div className="total-stake-value highlight">
                      {formatDMDAmount(BigNumber(myPool?.totalStake || 0))}
                    </div>
                  </div>
                  
                  <div className="stake-breakdown">
                    <div className="stake-item">
                      <div className="stake-item-header">
                        <span className="stake-label">My validator stake <InfoTooltip content={<div><p>The amount of DMD you've personally staked as a validator in your own pool.</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></span>
                        <span className="stake-value highlight">{formatDMDAmount(myValidatorStakeWei)}</span>
                      </div>
                      <div className="stake-actions">
                        {
                          myPool && (
                            <>
                              <StakeModal buttonText="Stake" pool={myPool} />
                              <UnstakeModal buttonText="Unstake" pool={myPool} />
                              {!isPrivacyMode && (
                                <button onClick={() => setIsValidatorStakeHistoryModalOpen(true)}  className="btn-secondary btn-sm">History</button>
                              )}
                              {myPool && (
                                <RemoveValidatorModal buttonText="Remove pool" pool={myPool} />
                              )}
                            </>
                          )
                        }
                      </div>
                    </div>
                    
                    <div className="stake-item">
                      <div className="stake-item-header">
                        <span className="stake-label">Delegated stake to my pool <InfoTooltip content={<div><p>The amount of DMD delegated to your pool by other users (excluding your own stake).</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></span>
                        <span className="stake-value highlight">{formatDMDAmount(delegatedStakeWei)}</span>
                      </div>
                      {!isPrivacyMode && (
                        <button onClick={() => setIsDelegatedStakeHistoryModalOpen(true)}  className="btn-secondary btn-sm">History</button>
                      )}
                    </div>
                  </div>
                  
                  <div className="stake-distribution-section">
                    <div className="distribution-header">
                      <span className="distribution-label">Stake Distribution <InfoTooltip content={<div><p>Visual breakdown showing the ratio between your own stake and delegated stake in your validator pool.</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></span>
                    </div>
                    <div className="stake-distribution">
                      <div className="stake-bar">
                          <div
                            className="own-stake"
                            title={`${ownStakePct}% own stake`}
                            style={{ width: `${ownStakePct}%` }}
                          />
                          <div
                            className="delegated-stake"
                            title={`${delegatedStakePct}% delegated`}
                            style={{ width: `${delegatedStakePct}%` }}
                          />
                      </div>
                      <div className="stake-labels">
                        <span className="own-stake-label">{ownStakePct}% own stake</span>
                        <span className="delegated-stake-label">{delegatedStakePct}% delegated</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Analytics section */}
                {!isPrivacyMode && (
                  <section className="vp-performance-section vp2-performance-section">
                <h2 className="vp2-section-title">
                  Performance Analytics
                  <InfoTooltip content={<div><p>Key reward and participation metrics for your validator over the last 30 days.</p></div>}>
                    <i className="fas fa-info-circle info-icon" aria-hidden="true"></i>
                  </InfoTooltip>
                </h2>
                <div className="vp2-analytics-grid">
                  <div className="stat-card vp2-analytics-card">
                    <div className="stat-label">RpT30 <InfoTooltip content={<div><p>Historical staking rewards earned per 1000 DMD staked with this validator during the last 30 days. This value excludes the validator owner reward share and represents delegator-focused profitability.</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></div>
                    <div className="stat-value highlight vp2-analytics-value">
                      {isLoadingValidatorStats ? '...' : validatorRewardStats ? validatorRewardStats.rpt30.toFixed(2) + ' DMD' : '—'}
                    </div>
                    <div className="vp2-analytics-sub">per 1000 / 30d</div>
                    {rpt30DeltaPct != null && (
                      <div className={`vp2-analytics-delta ${rpt30DeltaPct >= 0 ? 'vp2-delta-up' : 'vp2-delta-down'}`}>
                        {rpt30DeltaPct >= 0 ? '↑' : '↓'}{' '}
                        {rpt30DeltaPct >= 0 ? '+' : ''}
                        {Math.abs(rpt30DeltaPct).toFixed(1)}% vs previous 30d
                      </div>
                    )}
                    <div className="vp2-analytics-footer">Historical delegator profitability</div>
                  </div>
                  <div className="stat-card vp2-analytics-card">
                    <div className="stat-label">APY <InfoTooltip content={<div><p>Historical annualized return based on delegator rewards earned during the last 30 days. This value excludes the validator owner reward share and does not guarantee future rewards.</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></div>
                    <div className="stat-value highlight vp2-analytics-value">
                      {isLoadingValidatorStats ? '...' : validatorRewardStats ? validatorRewardStats.estimated_apy.toFixed(2) + '%' : '—'}
                    </div>
                    <div className="vp2-analytics-sub">estimated APY</div>
                    <div className="vp2-analytics-footer">Based on last 30d rewards</div>
                  </div>
                  <div className="stat-card vp2-analytics-card vp2-analytics-card--donut">
                    <div className="stat-label">AEP30 <InfoTooltip content={<div><p>Percentage of epochs during the last 30 days where this validator was part of the active validator set.</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></div>
                    <div className="vp2-donut-wrap">
                      <Aep30Ring
                        aep30={validatorRewardStats?.aep30 ?? null}
                        isLoading={isLoadingValidatorStats}
                      />
                    </div>
                    <div className="vp2-analytics-sub">
                      {validatorRewardStats
                        ? `${validatorRewardStats.active_epoch_count} / ${validatorRewardStats.total_epochs_in_window} active epochs`
                        : 'active epochs'}
                    </div>
                    <div className="vp2-analytics-footer">Participation during last 30d</div>
                  </div>
                  <div className="stat-card vp2-analytics-card">
                    <div className="stat-label">VOS30 <InfoTooltip content={<div><p>Total validator owner rewards earned during the last 30 days from the 20% validator owner share.</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></div>
                    <div className="stat-value highlight vp2-analytics-value">
                      {isLoadingValidatorStats ? '...' : validatorRewardStats ? validatorRewardStats.vos30.toFixed(2) + ' DMD' : '—'}
                    </div>
                    <div className="vp2-analytics-sub">validator owner rewards</div>
                    <div className="vp2-analytics-footer">
                      Net: {isLoadingValidatorStats ? '...' : validatorRewardStats ? validatorRewardStats.vos30_net.toFixed(2) + ' DMD' : '—'}
                    </div>
                  </div>
                </div>
                  </section>
                )}

                {/* Rewards Performance chart section */}
                {!isPrivacyMode && (
                  <section className="vp-rewards-chart-section vp2-rewards-performance">
                <div className="vp2-rewards-performance-header">
                  <div className="vp2-rewards-performance-title">
                    <h3>Rewards Performance</h3>
                    <InfoTooltip content={<div><p>Per-epoch reward per 1,000 DMD staked (approximated from epoch data).</p></div>}>
                      <i className="fas fa-info-circle info-icon" aria-hidden="true"></i>
                    </InfoTooltip>
                  </div>
                  <div className="vp2-rewards-performance-controls">
                    <div className="vp2-legend-pills" role="group" aria-label="Chart series">
                      <button
                        type="button"
                        className={`vp2-legend-pill${chartShowRpt ? ' vp2-legend-pill--active' : ''}`}
                        onClick={() => setChartShowRpt((v) => !v)}
                      >
                        <span className="vp2-legend-dot vp2-legend-dot--rpt" aria-hidden="true" />
                        RpT30
                      </button>
                      <button
                        type="button"
                        className={`vp2-legend-pill${chartShowScore ? ' vp2-legend-pill--active' : ''}`}
                        onClick={() => setChartShowScore((v) => !v)}
                      >
                        <span className="vp2-legend-dot vp2-legend-dot--score" aria-hidden="true" />
                        Score
                      </button>
                      <button
                        type="button"
                        className={`vp2-legend-pill${chartShowSaturation ? ' vp2-legend-pill--active' : ''}`}
                        onClick={() => setChartShowSaturation((v) => !v)}
                      >
                        <span className="vp2-legend-dot vp2-legend-dot--saturation" aria-hidden="true" />
                        Saturation
                      </button>
                    </div>
                    <span className="vp2-range-pill">30D</span>
                  </div>
                </div>
                <AreaChart
                  data={validatorChartData}
                  xAxisKey="date"
                  areas={
                    validatorChartAreas.length > 0
                      ? validatorChartAreas
                      : [{ dataKey: 'rpt', name: 'RpT30', color: '#3a7bd5' }]
                  }
                  config={{ height: 260, margin: { top: 10, right: 20, left: 10, bottom: 0 } }}
                  showLegend={false}
                  yAxisLabel="RpT per 1000 DMD"
                  isLoading={isLoadingEpochRewards}
                  emptyMessage="No epoch data available"
                    />
                  </section>
                )}

                {/* Validator Statistics section */}
                <section className="vp2-validator-statistics">
              <h2 className="vp2-section-title">
                Validator Statistics
                <InfoTooltip content={<div><p>Operational and reward statistics for your validator pool.</p></div>}>
                  <i className="fas fa-info-circle info-icon" aria-hidden="true"></i>
                </InfoTooltip>
              </h2>
              <div className="vp2-stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Monthly rewards <InfoTooltip content={<div><p>Total validator owner rewards earned during the last 30 days from the 20% validator owner share.</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></div>
                  <div className="stat-value highlight">
                    {isPrivacyMode ? '—' : isLoadingValidatorStats ? '...' : validatorRewardStats ? validatorRewardStats.vos30.toFixed(2) + ' DMD' : '—'}
                  </div>
                  {!isPrivacyMode && (
                    <button onClick={() => setIsValidatorRewardsHistoryModalOpen(true)} className="btn-secondary btn-sm">Rewards history</button>
                  )}
                </div>

                <div className="stat-card">
                  <div className="stat-label">My outgoing delegations <InfoTooltip content={<div><p>Amount of DMD you've delegated to other validators from your account (if any).</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></div>
                  <div className="stat-value highlight">{formatDMDAmount(myOutgoingDelegationsWei)}</div>
                  {!isPrivacyMode && (
                    <button onClick={() => toast.info('Coming soon!')} className="btn-secondary btn-sm">Delegations history</button>
                  )}
                </div>

                <div className="stat-card">
                  <div className="stat-label">Node operator shared reward <InfoTooltip content={<div><p>The portion of the validator's 20% reward that is shared with a separate node operator.</p> <p>Useful when a node owner delegates technical operation to someone else but keeps ownership and voting rights. Configurable per pool (from 0.01% to 20%).</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></div>
                  <div className="stat-value highlight">{myPool?.poolOperatorShare ? BigNumber(myPool.poolOperatorShare).dividedBy(100).toFixed(2) + '%' : '—'}</div>
                  <div className="stat-note copy-address-container vp2-operator-address" title={myPool?.poolOperator || undefined}>
                    {myPool?.poolOperator ? truncateAddress(myPool.poolOperator) : '—'}
                  </div>
                  {myPool && <UpdatePoolOperatorModal buttonText="Edit" pool={myPool} />}
                </div>

                <div className="stat-card">
                  <div className="stat-label">Voting power <InfoTooltip content={<div><p>Voting power is the share of total DAO stake that your validator pool represents (your own stake + delegated stake).</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></div>
                  <div className="stat-value highlight">{myPool?.votingPower && myPool.votingPower.toString() !== 'NaN' ? `${myPool.votingPower.toString()}%` : '0%'}</div>
                  <div className="stat-note">Proposals created: {myProposalsCreated}</div>
                  {!isPrivacyMode && (
                    <button onClick={() => toast.info('Coming soon!')} className="btn-secondary btn-sm">History</button>
                  )}
                </div>

                <div className="stat-card">
                  <div className="stat-label">Score <InfoTooltip
                    placement="bottom"
                    content={
                      <div>
                        <p>The Bonus Score measures your validator's performance and uptime.</p>
                        <ul>
                          <li>Staying online and ready increases your score.</li>
                          <li>Downtime, missed key operations, or unavailability decrease it.</li>
                        </ul>
                        <p>Your selection chance for the next epoch is based on Stake × Bonus Score.</p>
                        <p>Scores range from 1 to 1000.</p>
                      </div>
                    }
                  >
                    <i className="fas fa-info-circle info-icon" aria-hidden="true"></i>
                  </InfoTooltip></div>
                  <div className="stat-value highlight">{myPool?.score !== undefined && myPool?.score !== null ? Number(myPool.score).toFixed(1) : '—'}</div>
                  <div className="cr-count">Connectivity reports: {myPool?.connectivityReport ?? '—'}<InfoTooltip content={<div><p>Number of detected connectivity issues for this validator.</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></div>
                  {!isPrivacyMode && (
                    <button onClick={() => setIsBonusHistoryModalOpen(true)} className="btn-secondary btn-sm">History</button>
                  )}
                </div>
              </div>
                </section>
              </div>
            </div>
          </section>

          {/* Staked With Section */}
          <section className="validators-staked">
            <div className="container">
              <h2>Staked With</h2>
              <div className="table-container">
                <table className="validators-table">
                  <thead>
                    <tr>
                      <th>Validator</th>
                      <th>Total Stake</th>
                      <th>My Stake</th>
                      <th>Voting Power</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stakedValidators.length > 0 ? (
                      stakedValidators.map((validator, index) => (
                        <tr key={validator.stakingAddress}>
                          <td>
                            <div className="validator-info">
                              <div className="wallet-icon">
                                <div className="wallet-icon-inner" style={{
                                  background: `linear-gradient(45deg, ${
                                    index % 3 === 0 ? '#FF5E62, #FF9966' :
                                    index % 3 === 1 ? '#56CCF2, #2F80ED' :
                                    '#6EE7B7, #3B82F6'
                                  })`
                                }}></div>
                              </div>
                              <span>{truncateAddress(validator.stakingAddress)}</span>
                            </div>
                          </td>
                          <td>{validator.totalStake ? `${BigNumber(validator.totalStake).dividedBy(1e18).toFixed(0)} DMD` : '0 DMD'}</td>
                          <td>{validator.myStake ? `${BigNumber(validator.myStake).dividedBy(1e18).toFixed(0)} DMD` : '0 DMD'}</td>
                          <td>{calculateVotingPower(validator.totalStake || new BigNumber(0))}%</td>
                          <td>{validator.score !== undefined && validator.score !== null ? Number(validator.score).toFixed(1) : 'N/A'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                          You haven't staked with any validators yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Top Validators Section */}
          <section className="top-validators">
            <div className="container">
              <h2>Top Validators</h2>
              <div className="table-container">
                <table className="validators-table">
                  <thead>
                    <tr>
                      <th>Validator</th>
                      <th>Total Stake</th>
                      <th>Voting Power</th>
                      <th>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topValidators.map((validator, index) => (
                      <tr key={validator.stakingAddress} className={validator.stakingAddress === userWallet.myAddr ? "current-user" : ""}>
                        <td>
                          <div className="validator-info">
                            <div className="wallet-icon">
                              <div className="wallet-icon-inner" style={{
                                background: `linear-gradient(45deg, ${
                                  index % 3 === 0 ? '#FF5E62, #FF9966' :
                                  index % 3 === 1 ? '#56CCF2, #2F80ED' :
                                  '#6EE7B7, #3B82F6'
                                })`
                              }}></div>
                            </div>
                            <span>
                              {validator.stakingAddress === userWallet.myAddr 
                                ? `${truncateAddress(validator.stakingAddress)} (You)` 
                                : truncateAddress(validator.stakingAddress)
                              }
                            </span>
                          </div>
                        </td>
                        <td>{validator.totalStake ? `${BigNumber(validator.totalStake).dividedBy(1e18).toFixed(0)} DMD` : '0 DMD'}</td>
                        <td>{calculateVotingPower(validator.totalStake || new BigNumber(0))}%</td>
                        <td>{validator.score !== undefined && validator.score !== null ? Number(validator.score).toFixed(1) : 'N/A'}</td>
                      </tr>
                    ))}
                    {topValidators.length === 0 && (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '2rem' }}>
                          No validator data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="validators-actions">
                <Link href="/validators" className="btn-primary">See the list <i className="fas fa-arrow-right"></i></Link>
              </div>
            </div>
          </section>
        </div>

        {/* Modals */}
        <BonusScoreHistoryModal
          isOpen={isBonusHistoryModalOpen}
          onClose={() => setIsBonusHistoryModalOpen(false)}
          validatorAddress={userWallet.myAddr}
        />
        <StakeHistoryModal
          isOpen={isValidatorStakeHistoryModalOpen}
          onClose={() => setIsValidatorStakeHistoryModalOpen(false)}
          address={myPool?.stakingAddress || userWallet.myAddr}
          mode="node"
          delegatorFilter={false}
        />
        <StakeHistoryModal
          isOpen={isDelegatedStakeHistoryModalOpen}
          onClose={() => setIsDelegatedStakeHistoryModalOpen(false)}
          address={myPool?.stakingAddress || userWallet.myAddr}
          mode="node"
          delegatorFilter={true}
        />
        <StakeHistoryModal
          isOpen={isStakerHistoryModalOpen}
          onClose={() => setIsStakerHistoryModalOpen(false)}
          address={userWallet.myAddr}
          mode="staker"
        />
        <RewardsHistoryModal
          isOpen={isRewardsHistoryModalOpen}
          onClose={() => setIsRewardsHistoryModalOpen(false)}
          stakerAddress={userWallet.myAddr}
        />
        <NodeRewardsHistoryModal
          isOpen={isValidatorRewardsHistoryModalOpen}
          onClose={() => setIsValidatorRewardsHistoryModalOpen(false)}
          validatorAddress={myPool?.stakingAddress || userWallet.myAddr}
        />
    </div>
  );
}