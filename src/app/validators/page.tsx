'use client';

import './Validators.css';
import BigNumber from 'bignumber.js';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import Validators from '@/components/Validators';
import { Pool } from '../../contexts/types/models';
import { useWeb3Context } from '../../contexts/Web3';
import { useState, useEffect, useCallback } from 'react';
import { useStakingContext } from '../../contexts/Staking';

interface TableField {
  key: string;
  label: string;
  sortAble: boolean;
  updateAble: boolean;
  hide: boolean;
}

const tableFieldsDefault: TableField[] = [
  { key: "isActive", label: "Status", sortAble: true, updateAble: true, hide: false },
  { key: "stakingAddress", label: "Wallet address", sortAble: false, updateAble: true, hide: false },
  { key: "miningAddress", label: "Miner address", sortAble: false, updateAble: true, hide: true },
  { key: "miningPublicKey", label: "Public Key", sortAble: false, updateAble: true, hide: true },
  { key: "totalStake", label: "Total Stake", sortAble: true, updateAble: true, hide: false },
  { key: "votingPower", label: "Voting Power", sortAble: true, updateAble: true, hide: false },
  { key: "score", label: "Score", sortAble: true, updateAble: true, hide: false },
  { key: "connectivityReport", label: "CR", sortAble: true, updateAble: true, hide: false },
  { key: "myStake", label: "My Stake", sortAble: true, updateAble: false, hide: false },
  { key: "stakeBtn", label: "", sortAble: false, updateAble: false, hide: false },
  { key: "unstakeClaimBtn", label: "", sortAble: false, updateAble: false, hide: false },
];

export default function ValidatorsPage() {
  const { userWallet } = useWeb3Context();
  const { pools, stakingEpoch, claimOrderedUnstake } = useStakingContext();
  
  // State management
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [showUnstakeModal, setShowUnstakeModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  
  // Table management
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState<'default' | 'valid' | 'active' | 'invalid' | 'stakedOn'>('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  const [tableFields, setTableFields] = useState<TableField[]>(tableFieldsDefault);
  const [itemsPerPage] = useState(20);

  // Load table fields from localStorage
  useEffect(() => {
    const storedTableFields = localStorage.getItem('validatorFieldsData');
    if (storedTableFields) {
      setTableFields(JSON.parse(storedTableFields));
    } else {
      localStorage.setItem('validatorFieldsData', JSON.stringify(tableFieldsDefault));
    }
  }, []);

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

  // Handle staking
  const handleStake = (pool: Pool) => {
    setSelectedPool(pool);
    setShowStakeModal(true);
  };

  // Handle unstaking
  const handleUnstake = (pool: Pool) => {
    setSelectedPool(pool);
    setShowUnstakeModal(true);
  };

  // Confirm stake action
  const confirmStake = () => {
    if (selectedPool && stakeAmount) {
      console.log(`Staking ${stakeAmount} DMD to ${selectedPool.stakingAddress}`);
      setShowStakeModal(false);
      setStakeAmount('');
      setSelectedPool(null);
    }
  };

  // Confirm unstake action
  const confirmUnstake = () => {
    if (selectedPool && unstakeAmount) {
      console.log(`Unstaking ${unstakeAmount} DMD from ${selectedPool.stakingAddress}`);
      setShowUnstakeModal(false);
      setUnstakeAmount('');
      setSelectedPool(null);
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (isActive: boolean, isToBeElected: boolean, isPendingValidator: boolean) => {
    if (isActive) return 'status-active';
    if (isToBeElected || isPendingValidator) return 'status-valid';
    return 'status-invalid';
  };

  // Close modals
  const closeModal = () => {
    setShowStakeModal(false);
    setShowUnstakeModal(false);
    setShowCustomizeModal(false);
    setSelectedPool(null);
    setStakeAmount('');
    setUnstakeAmount('');
  };

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
        return "Value that approximates a node's influence in the DAO participation";
      case 'score':
        return "Combined score value, based on the results of generating the shared key, the stability of the validator connection and misbehaviour reports from other validators";
      case 'connectivityReport':
        return "Connectivity report value, based on how many other active validators did report bad connectivity towards that node";
      default:
        return "";
    }
  };

  // Render page numbers
  const renderPageNumbers = () => {
    const pageNumbers: React.ReactElement[] = [];
    for (let i = 0; i < pageCount; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={currentPage === i ? 'active' : ''}
          onClick={() => handlePageClick(i)}
        >
          {i + 1}
        </li>
      );
    }
    return pageNumbers;
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
      <Validators/>
    </div>
  );
}
