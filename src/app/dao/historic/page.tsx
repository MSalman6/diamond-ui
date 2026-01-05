"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import "./historic-proposals.css";

type Proposal = {
  id: string;
  date: string;
  creator: string;
  creatorColor?: string;
  title: string;
  type: string;
  participation: number;
  exceeding: number;
  status: string;
};

const initialProposals: Proposal[] = [
  {
    id: "p1",
    date: "4 Mar 2025",
    creator: "0x8F3c...9D2b",
    creatorColor: "#3a7bd5",
    title: "Increase Min. Validator stake",
    type: "ecosystem",
    participation: 65,
    exceeding: 12.5,
    status: "Accepted",
  },
  {
    id: "p2",
    date: "8 Feb 2025",
    creator: "0x6C9b...2D5a",
    creatorColor: "#a17fe0",
    title: "Decrease min. gas fee",
    type: "community",
    participation: 45,
    exceeding: -5.3,
    status: "Declined",
  },
  {
    id: "p3",
    date: "29 Jan 2025",
    creator: "0x3E8c...6A1d",
    creatorColor: "#07f49e",
    title: "Reduce DAO phase duration to 14 days",
    type: "ecosystem",
    participation: 68,
    exceeding: -2.1,
    status: "Declined",
  },
  {
    id: "p4",
    date: "15 Jan 2025",
    creator: "0x9D4e...2F7b",
    creatorColor: "#ff9f43",
    title: "Update block gas limit",
    type: "ecosystem",
    participation: 75,
    exceeding: 31.2,
    status: "Executed",
  },
  {
    id: "p5",
    date: "12 Dec 2024",
    creator: "0x4E9f...2A1c",
    creatorColor: "#5d26c1",
    title: "Funding required",
    type: "open",
    participation: 55,
    exceeding: -8.4,
    status: "Declined",
  }
];

export default function HistoricProposalsPage() {
  const [proposals] = useState<Proposal[]>(initialProposals);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  function onSort(field: string) {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  }

  const displayed = useMemo(() => {
    let list = proposals.slice();

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.creator.toLowerCase().includes(q));
    }

    if (filter !== "all") {
      list = list.filter((p) => p.type.toLowerCase() === filter.toLowerCase());
    }

    if (sortField) {
      list = list.sort((a, b) => {
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
  }, [proposals, search, filter, sortField, sortAsc]);

  return (
    <div className="historic-page">
      <section className="historic-hero">
        <div className="cosmic-grid" />
        <div className="cosmic-elements">
          <div className="diamond diamond-1" />
          <div className="diamond diamond-2" />
          <div className="diamond diamond-3" />
          <div className="glow glow-1" />
          <div className="glow glow-2" />
        </div>
        <div className="container">
          <div className="historic-hero-content">
            <h1>Historic Proposals</h1>
            <p>Browse and analyze all past governance proposals and their outcomes.</p>
          </div>
          <Link href="/dao" className="btn-outline">← Back to Governance</Link>
        </div>
      </section>

      <section className="historic-controls">
        <div className="container">
          <div className="search-filter-container">
            <div className="search-filter-group">
              <div className="search-container">
                <input id="proposal-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search proposals..." />
                <button className="search-btn"><i className="fas fa-search" /></button>
              </div>
              <div className="filter-container">
                <select id="proposal-filter" value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="ecosystem">Ecosystem Parameter</option>
                  <option value="community">Community</option>
                  <option value="open">Open</option>
                </select>
              </div>
            </div>
            <div className="historic-stats">
              <div className="stat-item">
                <span className="stat-label">Total Proposals:</span>
                <span className="stat-value">{proposals.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Accepted:</span>
                <span className="stat-value accepted">{proposals.filter(p => p.status.toLowerCase() === 'accepted' || p.status.toLowerCase() === 'executed').length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Declined:</span>
                <span className="stat-value declined">{proposals.filter(p => p.status.toLowerCase() === 'declined').length}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="historic-proposals">
        <div className="container">
          <div className="proposals-table-container">
            <table className="proposals-table">
              <thead>
                <tr>
                  <th onClick={() => onSort('date')}>Date <i className={`fas ${sortField === 'date' ? (sortAsc ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'}`} /></th>
                  <th>Created by</th>
                  <th onClick={() => onSort('title')}>Title <i className={`fas ${sortField === 'title' ? (sortAsc ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'}`} /></th>
                  <th>Type</th>
                  <th>Participation</th>
                  <th>Exceeding Yes</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((p, idx) => (
                  <tr key={p.id} className={idx % 2 === 1 ? 'alt-row' : ''}>
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
                    <td><span className={`exceeding-value ${p.exceeding >= 0 ? 'positive' : 'negative'}`}>{p.exceeding >= 0 ? `+${p.exceeding}%` : `${p.exceeding}%`}</span></td>
                    <td><span className={`proposal-status ${p.status.toLowerCase()}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button className="pagination-btn"><i className="fas fa-chevron-left" /></button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <span className="pagination-ellipsis">...</span>
            <button className="pagination-btn">25</button>
            <button className="pagination-btn"><i className="fas fa-chevron-right" /></button>
          </div>
        </div>
      </section>
    </div>
  );
}
