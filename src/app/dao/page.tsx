"use client";

import "./dao.css";
import React, { useEffect, useMemo, useState, startTransition } from "react";
import Link from 'next/link';
import BigNumber from 'bignumber.js';
import { useFadeInAnimation } from "@/hooks/useFadeInAnimation";
import { useRouter } from 'next/navigation';
import { useDaoContext } from '@/contexts/DAO';
import { useWeb3Context } from '@/contexts/Web3';
import { useStakingContext } from '@/contexts/Staking';
import { timestampToDate, truncateAddress } from '@/utils/common';

type ProposalType = "protocol" | "parameter" | "community" | "open";

type Proposal = {
  id: string;
  date: string;
  creator: string;
  creatorColor?: string;
  title: string;
  type: ProposalType | string;
  participation: number;
  exceeding: number;
  voted: boolean;
  status: string;
  totalStakeSnapshot?: string;
  actionsNeeded?: boolean;
};

const initialProposals: Proposal[] = [];

export default function DaoPage() {
  useFadeInAnimation();

  const [localProposals] = useState<Proposal[]>(initialProposals);
  const [activeTab, setActiveTab] = useState<'currentPhase' | 'actionsNeeded'>('currentPhase');
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const [countdown, setCountdown] = useState({ days: "02", hours: "18", minutes: "45", seconds: "32" });

  // Modal state
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [selectedVote, setSelectedVote] = useState<"Yes" | "No" | "Abstain" | null>(null);

  // Contexts
  const router = useRouter();
  const daoContext = useDaoContext();
  const web3Context = useWeb3Context();
  const stakingContext = useStakingContext();

  // When web3 is ready, fetch DAO proposals
  useEffect(() => {
    try {
      if (!daoContext.activeProposals.length && web3Context.web3Initialized) {
        web3Context.showLoader(true, "");
        daoContext.getActiveProposals().then(() => { daoContext.getHistoricProposals(); web3Context.showLoader(false, ""); }).catch(() => web3Context.showLoader(false, ""));
      }
    } catch (err) {}
  }, [web3Context.web3Initialized]);

  const daoMappedProposals = useMemo(() => {
    const src = activeTab === 'currentPhase'
      ? daoContext.activeProposals.filter((proposal: any) => proposal.state !== "3")
      : daoContext.allDaoProposals.filter((proposal: any) => (
          proposal.state === "3" || (proposal.state === "4" && daoContext.daoPhase.daoEpoch == Number(proposal.daoPhaseCount) + 1)
        ));

    if (!src || !src.length) return [];

    return src.map((p: any) => {
      const mapped: Proposal = {
        id: p.id,
        date: (p.timestamp ? timestampToDate(p.timestamp) : new Date().toISOString().slice(0,10)),
        creator: truncateAddress(p.proposer || p.proposerAddress || ""),
        creatorColor: undefined,
        title: p.title || (p.description ? String(p.description).split('\n')[0] : ""),
        type: (p.proposalType || p.rawProposalType || 'open').toLowerCase(),
        participation: Number(p.participation) || 0,
        exceeding: Number(p.exceedingYes) || 0,
        totalStakeSnapshot: p.totalStakeSnapshot || p.totalStakeSnapshot || '0',
        voted: false,
        status: daoContext.getStateString ? daoContext.getStateString(p.state) : (p.state || 'Unknown'),
        actionsNeeded: (p.state === "3") || (p.state === "4" && daoContext.daoPhase && daoContext.daoPhase.daoEpoch === String(Number(p.daoPhaseCount) + 1))
      };
      return mapped;
    });
  }, [daoContext.activeProposals, daoContext.allDaoProposals, activeTab, daoContext.daoPhase, daoContext.daoPhaseCount]);

  // Filter/sort/search derived list (prefer DAO data when present, otherwise fallback to local)
  const displayedProposals = useMemo(() => {
    let list: Proposal[];
    const daoHasAny = (daoContext.activeProposals && daoContext.activeProposals.length > 0) || (daoContext.allDaoProposals && daoContext.allDaoProposals.length > 0);

    if (daoMappedProposals && daoMappedProposals.length) {
      list = daoMappedProposals;
    } else if (daoContext.daoInitialized || daoHasAny) {
      list = [];
    } else {
      list = localProposals;
    }

    if (filterQuery) {
      if (filterQuery === 'unfinalized') {
        list = list.filter((p) => p.status === (daoContext.getStateString ? daoContext.getStateString('3') : '3'));
      } else if (filterQuery === 'myProposals') {
        const myAddr = web3Context.userWallet?.myAddr?.toLowerCase();
        if (myAddr) {
          list = list.filter((p: any) => (p.creator && String(p.creator).toLowerCase().includes(myAddr)) || (p.id && String(p.id).toLowerCase().includes(myAddr)) );
        }
      }
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.creator.toLowerCase().includes(q));
    }

    if (filter !== "all") {
      list = list.filter((p) => String(p.type).toLowerCase().includes(filter.toLowerCase()));
    }

    if (sortField) {
      list = [...list].sort((a, b) => {
        let A: any = (a as any)[sortField as keyof Proposal];
        let B: any = (b as any)[sortField as keyof Proposal];
        if (sortField === "date") {
          A = new Date(a.date).getTime();
          B = new Date(b.date).getTime();
        }
        if (A < B) return sortAsc ? -1 : 1;
        if (A > B) return sortAsc ? 1 : -1;
        return 0;
      });
    }

    return list;
  }, [daoMappedProposals, localProposals, filterQuery, search, filter, sortField, sortAsc, web3Context.userWallet, daoContext]);

  const handleDetailsClick = (proposalId: string) => {
    startTransition(() => {
      router.push(`/dao/details/${proposalId}`);
    });
  }

  useEffect(() => {
    function update() {
      try {
        const endSeconds = daoContext?.daoPhase?.end ? Number(daoContext.daoPhase.end) : 0;
        const endMs = endSeconds ? endSeconds * 1000 : 0;
        const nowMs = Date.now();
        const diff = endMs ? Math.max(0, endMs - nowMs) : 0;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdown({ days: String(days).padStart(2, "0"), hours: String(hours).padStart(2, "0"), minutes: String(minutes).padStart(2, "0"), seconds: String(seconds).padStart(2, "0") });
      } catch (e) {}
    }

    update();
    const id = window.setInterval(update, 1000);
    return () => clearInterval(id);
  }, [daoContext?.daoPhase?.end]);

  // Sorting toggle handler
  function onSort(field: string) {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  }

  function openVoteModal(p: Proposal) {
    setSelectedProposal(p);
    setSelectedVote(null);
    setVoteModalOpen(true);
  }

  function confirmVote() {
    if (!selectedVote || !selectedProposal) return;
    setVoteModalOpen(false);
    alert(`Your vote (${selectedVote}) has been submitted successfully!`);
  }

  return (
    <div className="dao-page">
      {/* Hero */}
      <section className="governance-hero">
        <div className="cosmic-grid" />
        <div className="cosmic-elements">
          <div className="diamond diamond-1" />
          <div className="diamond diamond-2" />
          <div className="diamond diamond-3" />
          <div className="glow glow-1" />
          <div className="glow glow-2" />
        </div>
        <div className="container">
          <div className="governance-hero-content">
            <h1 className="fade-in">Governance</h1>
            <div className="phase-indicator">
              <div className="phase-badge">
                <i className="fas fa-hourglass-half" /> Current Phase: Proposal
              </div>
              <div className="phase-progress">
                <div className="phase-step active">
                  <div className="step-dot" />
                  <span>Proposal</span>
                </div>
                <div className="phase-connector" />
                <div className="phase-step">
                  <div className="step-dot" />
                  <span>Voting</span>
                </div>
                <div className="phase-connector" />
                <div className="phase-step">
                  <div className="step-dot" />
                  <span>Execution</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
      </div>

      {/* Stats */}
      <section className="governance-stats">
        <div className="container">
          <div className="dao-stats-grid">
            <div className="stat-card dao-phase-card">
              <div className="stat-header">
                <h3>DAO Phase</h3>
                <div className="stat-icon">
                  <i className="fas fa-calendar-alt" />
                </div>
              </div>
              <div className="stat-content">
                <p className="stat-value">{(daoContext?.daoPhase && daoContext.daoPhase.daoEpoch) ? `Proposal Phase ${daoContext.daoPhase.daoEpoch}` : 'Proposal Phase 61'}</p>
                <div className="countdown-timer">
                  <div className="countdown-item">
                    <span className="countdown-value">{countdown.days}</span>
                    <span className="countdown-label">Days</span>
                  </div>
                  <div className="countdown-item">
                    <span className="countdown-value">{countdown.hours}</span>
                    <span className="countdown-label">Hours</span>
                  </div>
                  <div className="countdown-item">
                    <span className="countdown-value">{countdown.minutes}</span>
                    <span className="countdown-label">Minutes</span>
                  </div>
                  <div className="countdown-item">
                    <span className="countdown-value">{countdown.seconds}</span>
                    <span className="countdown-label">Seconds</span>
                  </div>
                </div>
                <Link href="/dao/create" className="btn-primary create-proposal-btn">
                  <i className="fas fa-plus-circle" /> Create Proposal
                </Link>
              </div>
            </div>

            {stakingContext?.myPool ? (
              <div className="stat-card voting-power-card">
                <div className="stat-header">
                  <h3>Voting Power</h3>
                  <div className="stat-icon">
                    <i className="fas fa-vote-yea" />
                  </div>
                </div>
                <div className="stat-content">
                  <p className="stat-value">{stakingContext.myPool.votingPower ? `${stakingContext.myPool.votingPower.toFixed(2)}%` : '0%'}</p>
                  <div className="stat-details">
                    <div className="detail-item">
                      <span className="detail-label">Pool Stake:</span>
                      <span className="detail-value">{stakingContext.myPool.ownStake ? stakingContext.myPool.ownStake.dividedBy(1e18).toFixed(2) + ' DMD' : '0 DMD'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Total Stake:</span>
                      <span className="detail-value">{stakingContext.totalDaoStake ? stakingContext.totalDaoStake.dividedBy(1e18).toFixed(2) + ' DMD' : '0 DMD'}</span>
                    </div>
                  </div>
                  <div className="voting-power-bar">
                    <div className="power-progress" style={{ width: `${stakingContext.myPool.votingPower ? stakingContext.myPool.votingPower.toFixed(2) : 0}%` }} />
                  </div>
                </div>
              </div>
            ) : null}

            <div className="stat-card governance-pot-card">
              <div className="stat-header">
                <h3>Governance Pot</h3>
                <div className="stat-icon">
                  <i className="fas fa-coins" />
                </div>
              </div>
              <div className="stat-content">
                <p className="stat-value">{daoContext.governancePotBalance ? `${daoContext.governancePotBalance.toFixed(2)} DMD` : '0 DMD'}</p>
                <div className="stat-trend positive">
                  <i className="fas fa-arrow-up" /> 3.5% this month
                </div>
                <div className="pot-distribution">
                  <div className="distribution-item">
                    <span className="distribution-label">Low majority pot</span>
                    <span className="distribution-value">{daoContext.lowMajorityContractBalance ? `${daoContext.lowMajorityContractBalance.toFixed(2)} DMD` : '0 DMD'}</span>
                    {/* <div className="distribution-bar">
                      <div className="distribution-progress community" style={{ width: `40%` }} />
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="stat-card historic-proposals-card">
              <div className="stat-header">
                <h3>Historic Proposals</h3>
                <div className="stat-icon">
                  <i className="fas fa-history" />
                </div>
              </div>
              <div className="stat-content">
                <p className="stat-value">{daoContext.allDaoProposals ? daoContext.allDaoProposals.length : 0}</p>
                <div className="proposals-breakdown">
                  <div className="breakdown-item-dao">
                    <span className="breakdown-dot passed" />
                    <span className="breakdown-label">Passed:</span>
                    <span className="breakdown-value">{daoContext.allDaoProposals ? daoContext.allDaoProposals.filter(p => p.state === '4' || p.state === '6').length : 0}</span>
                  </div>
                  <div className="breakdown-item-dao">
                    <span className="breakdown-dot rejected" />
                    <span className="breakdown-label">Rejected:</span>
                    <span className="breakdown-value">{daoContext.allDaoProposals ? daoContext.allDaoProposals.filter(p => p.state === '5').length : 0}</span>
                  </div>
                </div>
                <button className="btn-outline view-history-btn" onClick={() => router.push('/dao/historic')}>
                  <i className="fas fa-external-link-alt" /> View History
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proposals Management */}
      <section className="proposals-management">
        <div className="container">
          <div className="proposals-controls">
            <div className="search-filter-group">
              <div className="search-container">
                <input id="proposal-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search proposals..." />
                <button className="search-btn"><i className="fas fa-search" /></button>
              </div>
              <div className="filter-container">
                <select id="scope-filter" value={filterQuery} onChange={(e) => setFilterQuery(e.target.value)}>
                  <option value="">All</option>
                  <option value="myProposals">My proposals</option>
                  <option value="unfinalized">Unfinalized</option>
                </select>
              </div>
              <div className="filter-container">
                <select id="proposal-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="parameter">Ecosystem Parameter</option>
                  <option value="community">Contract Upgrade</option>
                  <option value="protocol">Open</option>
                </select>
              </div>
            </div>
          </div>

          <div className="proposals-tabs">
            <button className={`tab-btn ${activeTab === "currentPhase" ? "active" : ""}`} data-tab="current" onClick={() => setActiveTab("currentPhase")}>Proposals of the current DAO phase</button>
            <button className={`tab-btn ${activeTab === "actionsNeeded" ? "active" : ""}`} data-tab="actions" onClick={() => setActiveTab("actionsNeeded")}>Actions needed
            {daoContext.allDaoProposals && daoContext.allDaoProposals.filter(proposal => 
                  proposal.state === "3" || 
                  (proposal.state === "4" && daoContext.daoPhase.daoEpoch == Number(proposal.daoPhaseCount) + 1)
                ).length > 0 && (
                <span className="actionsNeededBadge">
                  {daoContext.allDaoProposals.filter(proposal => 
                    proposal.state === "3" || 
                    (proposal.state === "4" && daoContext.daoPhase.daoEpoch == Number(proposal.daoPhaseCount) + 1)
                  ).length}
                </span>
                )}
            </button>
          </div>

          <div className={`proposals-tab-content ${activeTab === "currentPhase" ? "active" : ""}`} id="current-tab">
            <div className="proposals-table-container">
              <table className="proposals-table">
                <thead>
                  <tr>
                    <th onClick={() => onSort("date")}>Date <i className={`fas ${sortField === "date" ? (sortAsc ? "fa-sort-up" : "fa-sort-down") : "fa-sort"}`} /></th>
                    <th onClick={() => onSort("creator")}>Created by <i className={`fas ${sortField === "creator" ? (sortAsc ? "fa-sort-up" : "fa-sort-down") : "fa-sort"}`} /></th>
                    <th onClick={() => onSort("title")}>Title <i className={`fas ${sortField === "title" ? (sortAsc ? "fa-sort-up" : "fa-sort-down") : "fa-sort"}`} /></th>
                    <th onClick={() => onSort("type")}>Type <i className={`fas ${sortField === "type" ? (sortAsc ? "fa-sort-up" : "fa-sort-down") : "fa-sort"}`} /></th>
                    <th onClick={() => onSort("participation")}>Participation <i className={`fas ${sortField === "participation" ? (sortAsc ? "fa-sort-up" : "fa-sort-down") : "fa-sort"}`} /></th>
                    <th onClick={() => onSort("exceeding")}>Exceeding Yes <i className={`fas ${sortField === "exceeding" ? (sortAsc ? "fa-sort-up" : "fa-sort-down") : "fa-sort"}`} /></th>
                    <th onClick={() => onSort("voted")}>Voted <i className={`fas ${sortField === "voted" ? (sortAsc ? "fa-sort-up" : "fa-sort-down") : "fa-sort"}`} /></th>
                    <th onClick={() => onSort("status")}>Status <i className={`fas ${sortField === "status" ? (sortAsc ? "fa-sort-up" : "fa-sort-down") : "fa-sort"}`} /></th>
                  </tr>
                </thead>
                <tbody>
                  {displayedProposals.map((p) => (
                    <tr key={p.id} onClick={() => handleDetailsClick(p.id)} style={{ cursor: 'pointer' }}>
                      <td>{p.date}</td>
                      <td>
                        <div className="creator-address">
                          <div className="address-icon" style={{ backgroundColor: p.creatorColor }} />
                          <span>{p.creator}</span>
                        </div>
                      </td>
                      <td>
                        <div className="proposal-title"><span>{p.title}</span></div>
                      </td>
                      <td><span className={`proposal-type ${p.type}`}>{p.type === "community" ? "Open" : p.type}</span></td>
                      <td>
                        <div className="participation-bar">
                          <div className="participation-progress" style={{ width: `${p.participation}%` }} />
                          {(() => {
                            try {
                              const snap = (p as any).totalStakeSnapshot;
                              if (snap && snap !== '0') {
                                const tokens = BigNumber(snap).multipliedBy(Number(p.participation)).dividedBy(100).dividedBy(1e18).toFixed(2);
                                return <span className="participation-value">{p.participation}% • {tokens} DMD</span>;
                              }
                            } catch (e) {console.log("EREREOEREOORER", e);}
                            return <span className="participation-value">{p.participation}%</span>;
                          })()}
                        </div>
                      </td>
                      <td><span className={`exceeding-value ${p.exceeding >= 0 ? "positive" : "negative"}`}>{p.exceeding >= 0 ? `+${p.exceeding}%` : `${p.exceeding}%`}</span></td>
                      <td><span className={`voted-status ${p.voted ? "voted" : "not-voted"}`}>{p.voted ? <i className="fas fa-check-circle" /> : <i className="fas fa-times-circle" />}</span></td>
                      <td>
                        <span className={`proposal-status ${p.status.toLowerCase()}`}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={`proposals-tab-content ${activeTab === "actionsNeeded" ? "active" : ""}`} id="actions-tab">
            <div className="proposals-table-container">
              <table className="proposals-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Created by</th>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Participation</th>
                    <th>Exceeding Yes</th>
                    <th>Action</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedProposals.map((p) => (
                    <tr key={p.id}>
                      <td>{p.date}</td>
                      <td>
                        <div className="creator-address">
                          <div className="address-icon" style={{ backgroundColor: p.creatorColor }} />
                          <span>{p.creator}</span>
                        </div>
                      </td>
                      <td>
                        <div className="proposal-title"><span>{p.title}</span></div>
                      </td>
                      <td><span className={`proposal-type ${p.type}`}>{p.type}</span></td>
                      <td>
                        <div className="participation-bar">
                          <div className="participation-progress" style={{ width: `${p.participation}%` }} />
                          {(() => {
                            try {
                              const snap = (p as any).totalStakeSnapshot;
                              if (snap && snap !== '0') {
                                const tokens = BigNumber(snap).multipliedBy(Number(p.participation)).dividedBy(100).dividedBy(1e18).toFixed(2);
                                return <span className="participation-value">{p.participation}% • {tokens} DMD</span>;
                              }
                            } catch (e) {}
                            return <span className="participation-value">{p.participation}%</span>;
                          })()}
                        </div>
                      </td>
                      <td><span className={`exceeding-value ${p.exceeding >= 0 ? "positive" : "negative"}`}>{p.exceeding >= 0 ? `+${p.exceeding}%` : `${p.exceeding}%`}</span></td>
                      <td>
                        <button className="btn-vote" onClick={(e) => { e.stopPropagation(); openVoteModal(p); }}>
                          <i className="fas fa-vote-yea" /> Vote
                        </button>
                      </td>
                      <td><span className={`proposal-status ${p.status.toLowerCase()}`}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Empty state */}
          {displayedProposals.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon"><i className="fas fa-file-alt" /></div>
              <h3>No proposals found</h3>
              <p>There are no proposals matching your search criteria.</p>
              <button className="btn-primary create-proposal-btn"><i className="fas fa-plus-circle" /> Create Proposal</button>
            </div>
          )}

          {/* Pagination placeholder */}
          <div className="pagination">
            <button className="pagination-btn"><i className="fas fa-chevron-left" /></button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <span className="pagination-ellipsis">...</span>
            <button className="pagination-btn">10</button>
            <button className="pagination-btn"><i className="fas fa-chevron-right" /></button>
          </div>
        </div>
      </section>

      {/* Vote Modal */}
      <div id="vote-modal" className={`modal ${voteModalOpen ? "show" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) setVoteModalOpen(false); }}>
        <div className="modal-content">
          <div className="modal-header">
            <h3>Vote on Proposal</h3>
            <button className="close-modal" onClick={() => setVoteModalOpen(false)}><i className="fas fa-times" /></button>
          </div>
          <div className="modal-body">
            {selectedProposal && (
              <>
                <div className="proposal-info">
                  <h4 id="vote-proposal-title">{selectedProposal.title}</h4>
                  <div className="proposal-meta">
                    <span className={`proposal-type ${selectedProposal.type}`}>{selectedProposal.type}</span>
                    <span className="proposal-date">Created on {selectedProposal.date}</span>
                  </div>
                  <div className="proposal-description">
                    <p>This proposal contains details and rationale for the requested change. Review and cast your vote below.</p>
                  </div>
                </div>

                <div className="voting-stats">
                  <div className="voting-stat">
                    <span className="stat-label">Participation</span>
                    <div className="participation-bar">
                      <div className="participation-progress" style={{ width: `${selectedProposal.participation}%` }} />
                      <span className="participation-value">{selectedProposal.participation}%</span>
                    </div>
                  </div>
                  <div className="voting-stat">
                    <span className="stat-label">Current Results</span>
                    <div className="results-bars">
                      <div className="result-bar yes"><span className="result-label">Yes</span><div className="result-progress-container"><div className="result-progress" style={{ width: `68%` }} /></div><span className="result-value">68%</span></div>
                      <div className="result-bar no"><span className="result-label">No</span><div className="result-progress-container"><div className="result-progress" style={{ width: `22%` }} /></div><span className="result-value">22%</span></div>
                      <div className="result-bar abstain"><span className="result-label">Abstain</span><div className="result-progress-container"><div className="result-progress" style={{ width: `10%` }} /></div><span className="result-value">10%</span></div>
                    </div>
                  </div>
                </div>

                <div className="vote-options">
                  <h4>Cast Your Vote</h4>
                  <div className="vote-buttons">
                    <button className={`vote-btn vote-yes ${selectedVote === "Yes" ? "selected" : ""}`} onClick={() => setSelectedVote("Yes")}><i className="fas fa-check-circle" /> Yes</button>
                    <button className={`vote-btn vote-no ${selectedVote === "No" ? "selected" : ""}`} onClick={() => setSelectedVote("No")}><i className="fas fa-times-circle" /> No</button>
                    <button className={`vote-btn vote-abstain ${selectedVote === "Abstain" ? "selected" : ""}`} onClick={() => setSelectedVote("Abstain")}><i className="fas fa-minus-circle" /> Abstain</button>
                  </div>
                  <div className="voting-power-info">
                    <span>Your Voting Power: <strong>4.2%</strong></span>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn-secondary close-modal" onClick={() => setVoteModalOpen(false)}>Cancel</button>
            <button className="btn-primary" id="confirm-vote" disabled={!selectedVote} onClick={confirmVote}>Confirm Vote</button>
          </div>
        </div>
      </div>
    </div>
  );
}

