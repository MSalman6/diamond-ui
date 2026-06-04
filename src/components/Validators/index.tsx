import React, { useState, useEffect, useCallback } from 'react';
import BigNumber from 'bignumber.js';
import { useRouter, useSearchParams } from 'next/navigation';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import StakeModal from '../Modals/Stake/StakeModal';
import UnstakeModal from '../Modals/Unstake/UnstakeModal';
import ColumnsFilterModal from '../ColumnsFilter';
import { useWeb3Context } from '../../contexts/Web3';
import { useStakingContext } from '../../contexts/Staking';
import { useTheme } from '../../hooks';
import { truncateAddress } from '../../utils/common';
import { getThemeImagePath } from '../../utils/imageUtils';
import Image from 'next/image';
import InfoTooltip from '../InfoTooltip';
import { useIsPrivacyMode } from '@/contexts';
import type { BatchNodeRewardStats } from '@/types/rewards';
import { getCachedBatchNodeStats } from '@/lib/rewardStatsCache';
import ValidatorCell from '../ValidatorCell';
import Aep30Badge from '../Aep30Badge';
import SaturationBar from '../SaturationBar';
import Rpt30Cell from '../Rpt30Cell';

const SORT_PILLS = [
  { key: 'rpt30',      label: 'Highest RpT30',       icon: 'fa-trophy',        direction: 'descending' },
  { key: 'apy',        label: 'Highest APY',          icon: 'fa-percent',       direction: 'descending' },
  { key: 'saturation', label: 'Lowest Saturation',    icon: 'fa-gauge',         direction: 'ascending'  },
  { key: 'aep30',      label: 'Most Stable',          icon: 'fa-shield',        direction: 'descending' },
] as const;

interface TableField {
  key: string;
  label: string;
  sortAble: boolean;
  updateAble: boolean;
  hide: boolean;
}

const tableFieldsDefault: TableField[] = [
  { key: "isActive", label: "Status", sortAble: true, updateAble: true, hide: false },
  { key: "stakingAddress", label: "Validator", sortAble: false, updateAble: true, hide: false },
  { key: "rpt30", label: "RpT30", sortAble: true, updateAble: true, hide: false },
  { key: "apy", label: "APY", sortAble: true, updateAble: true, hide: false },
  { key: "totalStake", label: "Stake", sortAble: true, updateAble: true, hide: false },
  { key: "score", label: "Score", sortAble: true, updateAble: true, hide: false },
  { key: "aep30", label: "Active Epoch %", sortAble: true, updateAble: true, hide: false },
  { key: "myStake", label: "My Stake", sortAble: true, updateAble: false, hide: false },
  { key: "stakeBtn", label: "", sortAble: false, updateAble: false, hide: false },
  { key: "unstakeClaimBtn", label: "", sortAble: false, updateAble: false, hide: false },
  // Optional / hidden by default
  { key: "votingPower", label: "Voting Power", sortAble: true, updateAble: true, hide: true },
  { key: "connectivityReport", label: "CR", sortAble: true, updateAble: true, hide: true },
  { key: "vos30", label: "VOS30", sortAble: true, updateAble: true, hide: true },
  { key: "saturation", label: "Saturation", sortAble: true, updateAble: true, hide: true },
  { key: "miningAddress", label: "Miner address", sortAble: false, updateAble: true, hide: true },
  { key: "miningPublicKey", label: "Public Key", sortAble: false, updateAble: true, hide: true },
];

export default function Validators() {
  const { userWallet } = useWeb3Context();
  const { pools, stakingEpoch, claimOrderedUnstake, delegatorMinStake } = useStakingContext();
  const router = useRouter();
  const theme = useTheme();
  const isPrivacyMode = useIsPrivacyMode();

  const getImagePath = (filename: string) => {
    return getThemeImagePath(filename, theme);
  };

  // State management
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState<'default' | 'valid' | 'active' | 'invalid' | 'stakedOn'>('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  const [tableFields, setTableFields] = useState<TableField[]>(tableFieldsDefault);
  const [rewardStatsMap, setRewardStatsMap] = useState<Record<string, BatchNodeRewardStats>>({});
  const [isLoadingRewardStats, setIsLoadingRewardStats] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(100);

  // Persist itemsPerPage from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('validatorsPerPage');
    const n = saved ? parseInt(saved, 10) : NaN;
    if ([5, 10, 25, 50, 100].includes(n)) setItemsPerPage(n);
  }, []);

  // Load table fields from localStorage
  useEffect(() => {
    const storedTableFields = localStorage.getItem('validatorFieldsData');
    if (storedTableFields) {
      try {
        const parsed: TableField[] = JSON.parse(storedTableFields);
        // Migrate: if old config is missing any new keys, reset to defaults
        const storedKeys = new Set(parsed.map(f => f.key));
        const hasNewColumns = ['rpt30', 'apy', 'aep30', 'saturation'].every(k => storedKeys.has(k));
        if (!hasNewColumns) {
          localStorage.setItem('validatorFieldsData', JSON.stringify(tableFieldsDefault));
          setTableFields(tableFieldsDefault);
        } else {
          setTableFields(parsed);
        }
      } catch {
        localStorage.setItem('validatorFieldsData', JSON.stringify(tableFieldsDefault));
        setTableFields(tableFieldsDefault);
      }
    } else {
      localStorage.setItem('validatorFieldsData', JSON.stringify(tableFieldsDefault));
    }
  }, []);

  // Fetch reward stats for all pools via shared cached layer
  useEffect(() => {
    if (!pools.length || isPrivacyMode) return;
    setIsLoadingRewardStats(true);
    const addresses = pools.map(p => p.stakingAddress.toLowerCase());
    getCachedBatchNodeStats(addresses)
      .then(results => setRewardStatsMap(results))
      .catch(() => {})
      .finally(() => setIsLoadingRewardStats(false));
  }, [pools, isPrivacyMode]);

  // Apply filter from URL search params (e.g. ?filter=stakedOn)
  const searchParams = useSearchParams();
  useEffect(() => {
    try {
      const param = searchParams?.get('filter');
      if (param && ['default', 'valid', 'active', 'invalid', 'stakedOn'].includes(param)) {
        setFilter(param as 'default' | 'valid' | 'active' | 'invalid' | 'stakedOn');
        setCurrentPage(0);
      }

      // Sorting with URL params, e.g. ?sort=myStake&direction=descending
      const sortKey = searchParams?.get('sort');
      const dirParam = searchParams?.get('direction') || searchParams?.get('dir');
      const direction = dirParam === 'descending' || dirParam === 'asc' || dirParam === 'desc' || dirParam === 'ascending'
        ? (dirParam === 'asc' ? 'ascending' : dirParam === 'desc' ? 'descending' : dirParam)
        : undefined;

      if (sortKey && tableFieldsDefault.some(tf => tf.key === sortKey && tf.sortAble)) {
        setSortConfig({ key: sortKey, direction: direction || 'descending' });
      }
    } catch (e) {}
  }, [searchParams]);

  // Update localStorage when table fields change
  useEffect(() => {
    localStorage.setItem('validatorFieldsData', JSON.stringify(tableFields));
  }, [tableFields]);

  // Handle filter changes
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value as typeof filter);
    setCurrentPage(0);
  };

  // Handle search changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  // Copy data to clipboard
  const copyData = useCallback((e: React.MouseEvent<HTMLDivElement>, data: string, msg: string) => {
    e.stopPropagation();
    copy(data);
    toast.success(msg);
  }, []);

  // Filter and process pools
  let poolsCopy = [...pools];

  if (filter === 'valid') {
    poolsCopy = poolsCopy.filter(pool => pool.isToBeElected && !pool.isActive);
  } else if (filter === 'active') {
    poolsCopy = poolsCopy.filter(pool => pool.isActive);
  } else if (filter === 'invalid') {
    poolsCopy = poolsCopy.filter(pool => !pool.isActive && !pool.isToBeElected);
  } else if (filter === 'stakedOn') {
    poolsCopy = poolsCopy.filter(pool => BigNumber(pool.myStake).isGreaterThan(0));
  }

  if (searchTerm.trim() !== '') {
    poolsCopy = poolsCopy.filter(pool =>
      pool.stakingAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pool.miningAddress && pool.miningAddress.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  // Apply sorting
  if (sortConfig !== null) {
    if (['rpt30', 'apy', 'aep30', 'vos30', 'saturation'].includes(sortConfig.key)) {
      const getVal = (pool: any): number => {
        const stats = rewardStatsMap[pool.stakingAddress.toLowerCase()];
        if (sortConfig.key === 'saturation') {
          return BigNumber(pool.totalStake || 0).dividedBy(BigNumber(50000).multipliedBy(10 ** 18)).multipliedBy(100).toNumber();
        }
        if (!stats) return -Infinity;
        if (sortConfig.key === 'rpt30') return stats.rpt30;
        if (sortConfig.key === 'apy') return stats.estimated_apy;
        if (sortConfig.key === 'aep30') return stats.aep30;
        if (sortConfig.key === 'vos30') return stats.vos30;
        return 0;
      };
      poolsCopy.sort((a, b) =>
        sortConfig.direction === 'ascending' ? getVal(a) - getVal(b) : getVal(b) - getVal(a)
      );
    } else {
      poolsCopy.sort((a: any, b: any) => {
        let keyA, keyB;

        if (sortConfig.key === 'myStake' || sortConfig.key === 'score' || sortConfig.key === 'connectivityReport') {
          keyA = parseFloat(a[sortConfig.key] || '0');
          keyB = parseFloat(b[sortConfig.key] || '0');
        } else {
          keyA = a[sortConfig.key];
          keyB = b[sortConfig.key];
        }

        if (keyA < keyB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (keyA > keyB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
  }

  // Pagination
  const pageCount = Math.ceil(poolsCopy.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = poolsCopy.slice(offset, offset + itemsPerPage);

  // Handle page changes
  const handlePageClick = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  // Handle sorting
  const requestSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle row click navigation
  const handleRowClick = (stakingAddress: string) => {
    // For own validator, navigate to profile page
    if (userWallet.myAddr && stakingAddress.toLowerCase() === userWallet.myAddr.toLowerCase()) {
      router.push('/profile');
    } else {
      router.push(`/validators/${stakingAddress}`);
    }
  };

  // Get sort class names
  const getClassNamesFor = (column: string) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === column ? sortConfig.direction : undefined;
  };

  // Get tooltip text
  const getTooltipText = (key: string) => {
    switch (key) {
      case 'isActive':
          return "Active candidate is part of the active set; Valid - is not part of the active set, but can be elected; Invalid - a candidate who is flagged unavailable on the blockchain or has not enough stake";
      case 'totalStake':
          return "Total delegated DMD (self-staked DMD + delegates' stake)";
      case 'votingPower':
          return "Value that approximates a node’s influence in the DAO participation";
      case 'score':
          return "Combined score value, based on the results of generating the shared key, the stability of the validator connection and misbehaviour reports from other validators";
      case 'connectivityReport':
          return "Connectivity report value, based on how many other active validators did report bad connectivity towards that node";      case 'rpt30':
          return "Historical staking rewards earned per 1000 DMD delegated to this validator during the last 30 days.";
      case 'apy':
          return "Estimated annualised return based on validator rewards over the last 30 days. This is a historical estimate, not a guarantee.";
      case 'aep30':
          return "Percentage of epochs during the last 30 days where this validator was part of the active validator set.";
      case 'vos30':
          return "Total validator owner rewards earned during the last 30 days from the 20% validator owner share.";
      case 'saturation':
          return "Current pool stake as a percentage of the 50,000 DMD maximum. Validators near saturation may have diluted returns for new delegators.";      default:
          return "";
    }
  };

  // Render page numbers
  const renderPageNumbers = () => {
    const pageNumbers: React.ReactElement[] = [];
    const WINDOW = 2;
    let prevSkipped = false;
    for (let i = 0; i < pageCount; i++) {
      const isFirst = i === 0;
      const isLast = i === pageCount - 1;
      const near = Math.abs(i - currentPage) <= WINDOW;
      if (!isFirst && !isLast && !near) {
        if (!prevSkipped) {
          pageNumbers.push(<li key={`ell-${i}`} className="pagination-btn pagination-ellipsis" style={{ cursor: 'default', pointerEvents: 'none' }}>…</li>);
          prevSkipped = true;
        }
        continue;
      }
      prevSkipped = false;
      pageNumbers.push(
        <li
          key={i}
          className={currentPage === i ? 'pagination-btn active' : 'pagination-btn'}
          onClick={() => handlePageClick(i)}
        >
          {i + 1}
        </li>
      );
    }
    return pageNumbers;
  };

  // Render table headers
  const renderHeaders = () => {
    return (
      <thead>
        <tr>
          {tableFields.filter(field => !field.hide).map((column, index) => {
            // Hide wallet-specific columns when wallet is not connected
            if ((column.key === 'myStake' || column.key === 'stakeBtn' || column.key === 'unstakeClaimBtn') && !userWallet.myAddr) {
              return null;
            }
            return (
              <th
                key={index}
                className={getClassNamesFor(column.key)}
                onClick={() => column.sortAble && requestSort(column.key)}
                style={{ cursor: column.sortAble ? 'pointer' : 'default' }}
              >
                {column.label}
                {column.sortAble && column.key && column.key !== 'stakingAddress' && column.key !== 'stakeBtn' && column.key !== 'unstakeClaimBtn' && (
                  <>
                    {column.key !== 'myStake' && (
                      <InfoTooltip content={getTooltipText(column.key)}>
                        <i className="fas fa-info-circle" />
                      </InfoTooltip>
                    )}
                    <i className="fas fa-sort"></i>
                  </>
                )}
              </th>
            );
          })}
        </tr>
      </thead>
    );
  };

  // Render table rows
  const renderRows = (currentItems: any[]) => {
    return currentItems.map((pool, index) => (
      <tr 
        key={index} 
        className="validators-table-row" 
        onClick={() => handleRowClick(pool.stakingAddress)}
        style={{ cursor: 'pointer' }}
      >
        {tableFields.filter(field => !field.hide).map((column, colIndex) => {
          // Hide wallet-specific columns when wallet is not connected
          if ((column.key === 'myStake' || column.key === 'stakeBtn' || column.key === 'unstakeClaimBtn') && !userWallet.myAddr) {
            return null;
          }
          
          if (column.key === 'isActive') {
            return (
              <td key={colIndex}>
                <span className={`status-badge ${pool.isActive ? 'status-active' : (pool.isToBeElected || pool.isPendingValidator) ? 'status-valid' : 'status-invalid'}`}>
                  {typeof pool.isActive === 'boolean'
                    ? pool.isActive ? 'Active' : (pool.isToBeElected || pool.isPendingValidator) ? "Valid" : "Invalid"
                    : 'Loading...'}
                </span>
              </td>
            );
          } else if (column.key === 'stakingAddress') {
            return (
              <td key={colIndex} className="wallet-address">
                {pool.stakingAddress ? (
                  <ValidatorCell
                    address={pool.stakingAddress}
                    onClick={(e) => { e.stopPropagation(); copyData(e, pool.stakingAddress, 'Copied staking address'); }}
                  />
                ) : (
                  <div>Loading...</div>
                )}
              </td>
            );
          } else if (column.key === 'miningAddress') {
            return (
              <td key={colIndex} className="miner-address">
                {pool.miningAddress ? (
                  <div onClick={(e) => copyData(e, pool.miningAddress, "Copied mining address")}>
                    {truncateAddress(pool.miningAddress)}
                  </div>
                ) : (
                  <div>Loading...</div>
                )}
              </td>
            );
          } else if (column.key === 'miningPublicKey') {
            return (
              <td key={colIndex} className="public-key">
                {pool.miningPublicKey ? (
                  <div onClick={(e) => copyData(e, pool.miningPublicKey, "Copied public key")}>
                    {truncateAddress(pool.miningPublicKey)}
                  </div>
                ) : (
                  <div>Loading...</div>
                )}
              </td>
            );
          } else if (column.key === 'rpt30') {
            const stats = rewardStatsMap[pool.stakingAddress.toLowerCase()];
            return (
              <td key={colIndex}>
                {isPrivacyMode ? '—' : isLoadingRewardStats ? '...' : stats ? (
                  <Rpt30Cell rpt30={stats.rpt30} rpt30_delta={stats.rpt30_delta} />
                ) : '—'}
              </td>
            );
          } else if (column.key === 'apy') {
            const stats = rewardStatsMap[pool.stakingAddress.toLowerCase()];
            return (
              <td key={colIndex}>
                {isPrivacyMode ? '—' : isLoadingRewardStats ? '...' : stats ? (
                  <div>
                    <div>{stats.estimated_apy.toFixed(2)}%</div>
                    <div className="vl-apy-sub">estimated</div>
                  </div>
                ) : '—'}
              </td>
            );
          } else if (column.key === 'aep30') {
            const stats = rewardStatsMap[pool.stakingAddress.toLowerCase()];
            return (
              <td key={colIndex}>
                {isPrivacyMode ? '—' : isLoadingRewardStats ? '...' : stats ? (
                  <Aep30Badge aep30={stats.aep30} />
                ) : '—'}
              </td>
            );
          } else if (column.key === 'vos30') {
            const stats = rewardStatsMap[pool.stakingAddress.toLowerCase()];
            return (
              <td key={colIndex}>
                {isPrivacyMode ? '—' : isLoadingRewardStats ? '...' : stats ? stats.vos30.toFixed(2) + ' DMD' : '—'}
              </td>
            );
          } else if (column.key === 'saturation') {
            return (
              <td key={colIndex}>
                <SaturationBar totalStakeWei={pool.totalStake || '0'} />
              </td>
            );
          } else if (column.key === 'totalStake') {
            return (
              <td key={colIndex}>
                {BigNumber(pool.totalStake ?? 0) ? BigNumber(BigNumber(pool.totalStake ?? 0)).dividedBy(10**18).toFixed(4) + " DMD" : 'Loading...'}
              </td>
            );
          } else if (column.key === 'votingPower') {
            return (
              <td key={colIndex}>
                {pool.votingPower && pool.votingPower.toString() !== 'NaN' && pool.votingPower.toString() !== 'Infinity'
                  ? `${pool.votingPower.toString()} %`
                  : 'Loading...'}
              </td>
            );
          } else if (column.key === 'score') {
            return (
              <td key={colIndex}>
                {pool.score !== undefined && pool.score !== null ? pool.score : 'Loading...'}
              </td>
            );
          } else if (column.key === 'connectivityReport') {
            return (
              <td key={colIndex}>
                <span className={`cr-value ${pool.isFaultyValidator ? 'cr-danger' : (Number(pool.connectivityReport) > 0 ? 'cr-warning' : 'cr-zero')}`}>
                  {pool.connectivityReport !== undefined && pool.connectivityReport !== null ? pool.connectivityReport : 'Loading...'}
                </span>
              </td>
            );
          } else if (column.key === 'myStake') {
            return (
              <td key={colIndex}>
                <div>
                  {BigNumber(pool.myStake) ? BigNumber(pool.myStake).dividedBy(10**18).toFixed(4) : 'Loading...'} DMD
                </div>
                {BigNumber(pool.orderedWithdrawAmount).isGreaterThan(0) && (
                  <div className="ordered-amount">Ordered: {BigNumber(pool.orderedWithdrawAmount).dividedBy(10**18).toFixed(4)} DMD</div>
                )}
              </td>
            );
          } else if (column.key === 'stakeBtn') {
            return (
              <td key={colIndex} onClick={(e) => e.stopPropagation()}>
                {(pool.isActive || pool.isToBeElected || pool.isPendingValidator) && BigNumber(pool.totalStake ?? 0).isLessThan(BigNumber(50000).multipliedBy(10**18)) && BigNumber(50000).multipliedBy(10**18).minus(BigNumber(pool.totalStake ?? 0)).isGreaterThanOrEqualTo(delegatorMinStake) && (
                  <StakeModal buttonText="Stake" pool={pool} />
                )}
              </td>
            );
          } else if (column.key === 'unstakeClaimBtn') {
            return (
              <td key={colIndex} onClick={(e) => e.stopPropagation()}>
                {BigNumber(pool.orderedWithdrawAmount).isGreaterThan(0) && BigNumber(pool.orderedWithdrawUnlockEpoch).isLessThanOrEqualTo(stakingEpoch) ? (
                  <button className="btn-stake claim-btn" onClick={(e) => {e.stopPropagation(); claimOrderedUnstake(pool)}}>Claim</button>
                ) : (
                  BigNumber(pool.myStake).isGreaterThan(0) && (
                    <UnstakeModal buttonText="Unstake" pool={pool} />
                  )
                )}
              </td>
            );
          } else {
            return <td key={colIndex}></td>;
          }
        })}
      </tr>
    ));
  };
  return (
    <>
      {/* Validators Metrics Section */}
      <section className="validators-metrics">
        <div className="container">
          <div className="metrics-grid">
            <div className="metric-card fade-in">
              <div className="metric-icon">
                <Image src={getImagePath("top-validators.png")} alt="" width={100} height={100} />
              </div>
              <div className='metric-content'>
                <p className="metric-value">{pools.length}</p>
                <h3>Total Validators</h3>
              </div>
              <Image className="ellipse-bottom" src={getImagePath("ellipse-bottom.png")} alt="" width={0} height={0} />
            </div>
            <div className="metric-card fade-in">
              <div className="metric-icon">
                <Image src={getImagePath("active-validators.png")} alt="" width={100} height={100} />
              </div>
              <div className='metric-content'>
                <p className="metric-value">{pools.filter((p) => p.isActive).length}</p>
                <h3>Active Validators</h3>
              </div>
              <Image className="ellipse-bottom" src={getImagePath("ellipse-bottom.png")} alt="" width={0} height={0} />
            </div>
            <div className="metric-card fade-in">
              <div className="metric-icon">
                <Image src={getImagePath("valid-validators.png")} alt="" width={100} height={100} />
              </div>
              <div className='metric-content'>
                <p className="metric-value">{pools.filter((p) => p.isToBeElected && !p.isActive).length}</p>
                <h3>Valid Validators</h3>
              </div>
              <Image className="ellipse-bottom" src={getImagePath("ellipse-bottom.png")} alt="" width={0} height={0} />
            </div>
            <div className="metric-card fade-in">
              <div className="metric-icon">
                <Image src={getImagePath("invalid-validators.png")} alt="" width={100} height={100} />
              </div>
              <div className='metric-content'>
                <p className="metric-value">{pools.filter((p) => !p.isActive && !p.isToBeElected).length}</p>
                <h3>Invalid Validators</h3>
              </div>
              <Image className="ellipse-bottom" src={getImagePath("ellipse-bottom.png")} alt="" width={0} height={0} />
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
                  placeholder="Search by address"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <button className="search-btn">
                  <i className="fas fa-search"></i>
                </button>
              </div>
              <div className="filter-container">
                <select value={filter} onChange={handleFilterChange}>
                  <option value="default">All Statuses</option>
                  <option value="valid">Valid Candidates</option>
                  <option value="active">Active Candidates</option>
                  <option value="invalid">Invalid Candidates</option>
                  {userWallet.myAddr && (
                    <option value="stakedOn">Candidates I've staked on</option>
                  )}
                </select>
              </div>
            </div>
            <div className="customize-container">
              <ColumnsFilterModal
                buttonText="Customize"
                tableFields={tableFields}
                setTableFields={setTableFields}
                defaultFields={tableFieldsDefault}
              />
            </div>
            <div className="vl-quick-sort-pills">
              {SORT_PILLS.map(pill => {
                const active = sortConfig?.key === pill.key;
                return (
                  <button
                    key={pill.key}
                    className={`vl-pill${active ? ' vl-pill--active' : ''}`}
                    onClick={() => setSortConfig(active ? null : { key: pill.key, direction: pill.direction })}
                  >
                    <i className={`fas ${pill.icon}`} aria-hidden="true"></i>
                    {pill.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div className="validators-table-container">
            <table className="validators-table">
              {renderHeaders()}
              <tbody>
                {renderRows(currentItems)}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <div className="vl-pagination-footer">
            <span className="vl-pagination-info">
              {poolsCopy.length === 0
                ? 'No results'
                : `Showing ${offset + 1}–${Math.min(offset + itemsPerPage, poolsCopy.length)} of ${poolsCopy.length}`}
            </span>
            {pageCount > 1 && (
              <div className="pagination">
                <button
                  className={`pagination-btn ${currentPage === 0 ? 'disabled' : ''}`}
                  onClick={() => { if (currentPage !== 0) handlePageClick(currentPage - 1); }}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                {renderPageNumbers()}
                <button
                  className={`pagination-btn ${currentPage === pageCount - 1 ? 'disabled' : ''}`}
                  onClick={() => { if (currentPage !== pageCount - 1) handlePageClick(currentPage + 1); }}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
            <div className="vl-per-page">
              <label>Rows:</label>
              <select
                value={itemsPerPage}
                onChange={e => {
                  const n = parseInt(e.target.value, 10);
                  setItemsPerPage(n);
                  localStorage.setItem('validatorsPerPage', String(n));
                  setCurrentPage(0);
                }}
              >
                {[5, 10, 25, 50, 100].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
