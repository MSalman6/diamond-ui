"use client";

import "./dao.css";
import React, { useEffect, useMemo, useState } from "react";
import { useFadeInAnimation } from "@/hooks/useFadeInAnimation";

type ProposalType = "protocol" | "treasury" | "parameter" | "community" | "open";

type Proposal = {
  id: string;
  date: string; // ISO-ish date
  creator: string;
  creatorColor?: string;
  title: string;
  type: ProposalType | string;
  participation: number; // percentage (0-100)
  exceeding: number; // percent change (positive/negative)
  voted: boolean;
  status: string;
  actionsNeeded?: boolean;
};

const initialProposals: Proposal[] = [
  {
    id: "p1",
    date: "2025-04-02",
    creator: "0x8F3c...9D2b",
    creatorColor: "#3a7bd5",
    title: "Increase Min. Gas price",
    type: "parameter",
    participation: 65,
    exceeding: 12.5,
    voted: true,
    status: "Active",
  }
];

export default function DaoPage() {
  useFadeInAnimation();

  const [proposals] = useState<Proposal[]>(initialProposals);
  const [activeTab, setActiveTab] = useState<"current" | "actions">("current");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const [countdown, setCountdown] = useState({ days: "02", hours: "18", minutes: "45", seconds: "32" });

  // Modal state
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [selectedVote, setSelectedVote] = useState<"Yes" | "No" | "Abstain" | null>(null);

  // Filter/sort/search derived list
  const displayedProposals = useMemo(() => {
    let list = proposals.filter((p) => (activeTab === "current" ? !p.actionsNeeded : !!p.actionsNeeded));

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.creator.toLowerCase().includes(q));
    }

    if (filter !== "all") {
      list = list.filter((p) => p.type === filter);
    }

    if (sortField) {
      list = [...list].sort((a, b) => {
        let A: any = (a as any)[sortField];
        let B: any = (b as any)[sortField];
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
  }, [proposals, activeTab, search, filter, sortField, sortAsc]);

  useEffect(() => {
    function update() {
      const now = new Date();
      const end = new Date(now);
      end.setDate(end.getDate() + 2);
      end.setHours(end.getHours() + 18);
      end.setMinutes(end.getMinutes() + 45);
      end.setSeconds(end.getSeconds() + 32);
      const diff = Math.max(0, end.getTime() - now.getTime());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown({ days: String(days).padStart(2, "0"), hours: String(hours).padStart(2, "0"), minutes: String(minutes).padStart(2, "0"), seconds: String(seconds).padStart(2, "0") });
    }

    update();
    const id = window.setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

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

      {/* Stats */}
      <section className="governance-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card dao-phase-card">
              <div className="stat-header">
                <h3>DAO Phase</h3>
                <div className="stat-icon">
                  <i className="fas fa-calendar-alt" />
                </div>
              </div>
              <div className="stat-content">
                <p className="stat-value">Proposal Phase 61</p>
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
                <button className="btn-primary create-proposal-btn">
                  <i className="fas fa-plus-circle" /> Create Proposal
                </button>
              </div>
            </div>

            <div className="stat-card voting-power-card">
              <div className="stat-header">
                <h3>Voting Power</h3>
                <div className="stat-icon">
                  <i className="fas fa-vote-yea" />
                </div>
              </div>
              <div className="stat-content">
                <p className="stat-value">4.2%</p>
                <div className="stat-details">
                  <div className="detail-item">
                    <span className="detail-label">Pool Stake:</span>
                    <span className="detail-value">1,250,000 DMD</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Total Stake:</span>
                    <span className="detail-value">29,750,000 DMD</span>
                  </div>
                </div>
                <div className="voting-power-bar">
                  <div className="power-progress" style={{ width: `4.2%` }} />
                </div>
              </div>
            </div>

            <div className="stat-card governance-pot-card">
              <div className="stat-header">
                <h3>Governance Pot</h3>
                <div className="stat-icon">
                  <i className="fas fa-coins" />
                </div>
              </div>
              <div className="stat-content">
                <p className="stat-value">750,000 DMD</p>
                <div className="stat-trend positive">
                  <i className="fas fa-arrow-up" /> 3.5% this month
                </div>
                <div className="pot-distribution">
                  <div className="distribution-item">
                    <span className="distribution-label">Community:</span>
                    <span className="distribution-value">300,000 DMD</span>
                    <div className="distribution-bar">
                      <div className="distribution-progress community" style={{ width: `40%` }} />
                    </div>
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
                <p className="stat-value">248</p>
                <div className="proposals-breakdown">
                  <div className="breakdown-item">
                    <span className="breakdown-dot passed" />
                    <span className="breakdown-label">Passed:</span>
                    <span className="breakdown-value">186</span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-dot rejected" />
                    <span className="breakdown-label">Rejected:</span>
                    <span className="breakdown-value">62</span>
                  </div>
                </div>
                <button className="btn-outline view-history-btn">
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
                <select id="proposal-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="treasury">Treasury</option>
                  <option value="parameter">Parameter</option>
                  <option value="community">Community</option>
                  <option value="protocol">Protocol</option>
                </select>
              </div>
            </div>
          </div>

          <div className="proposals-tabs">
            <button className={`tab-btn ${activeTab === "current" ? "active" : ""}`} data-tab="current" onClick={() => setActiveTab("current")}>Proposals of the current DAO phase</button>
            <button className={`tab-btn ${activeTab === "actions" ? "active" : ""}`} data-tab="actions" onClick={() => setActiveTab("actions")}>Actions needed</button>
          </div>

          <div className={`proposals-tab-content ${activeTab === "current" ? "active" : ""}`} id="current-tab">
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
                      <td><span className={`proposal-type ${p.type}`}>{p.type === "community" ? "Open" : p.type}</span></td>
                      <td>
                        <div className="participation-bar">
                          <div className="participation-progress" style={{ width: `${p.participation}%` }} />
                          <span className="participation-value">{p.participation}%</span>
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

          <div className={`proposals-tab-content ${activeTab === "actions" ? "active" : ""}`} id="actions-tab">
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
                          <span className="participation-value">{p.participation}%</span>
                        </div>
                      </td>
                      <td><span className={`exceeding-value ${p.exceeding >= 0 ? "positive" : "negative"}`}>{p.exceeding >= 0 ? `+${p.exceeding}%` : `${p.exceeding}%`}</span></td>
                      <td>
                        <button className="btn-vote" onClick={() => openVoteModal(p)}>
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

