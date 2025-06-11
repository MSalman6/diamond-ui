'use client';

import { useEffect } from 'react';
import "./page.css";
import FAQ from '../components/FAQ';

export default function Home() {
  // Initialize fade-in animations
  useEffect(() => {
    const fadeElements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1
    });

    fadeElements.forEach(element => {
      observer.observe(element);
    });

    return () => {
      fadeElements.forEach(element => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div>
        {/* Unauthenticated View */}
        <div id="unauthenticated-view">
          {/* Hero Section */}
          <section className="hero">
            <div className="cosmic-grid"></div>
            <div className="cosmic-elements">
              <div className="glow glow-1"></div>
              <div className="glow glow-2"></div>
            </div>
            <div className="container">
              <div className="hero-content">
                <h1>Become DMD Chain Participant</h1>
                <p>
                  Welcome to the DMD Diamond Staking Platform – your gateway to earning rewards while contributing to the security and functionality of the DMD network. Embark on your staking adventure with us and unlock the full potential of your digital assets.
                </p>
                <div className="hero-buttons">
                  <a href="#" className="btn-primary">Connect wallet <i className="fas fa-arrow-right"></i></a>
                  <a href="https://github.com/DMDcoin/whitepaper/wiki/A.-Home" target="_blank" className="btn-secondary">GitHub Wiki <i className="fas fa-arrow-right"></i></a>
                </div>
              </div>
              <div className="hero-visual">
                <div className="diamond-custom diamond-custom-1"></div>
                <div className="diamond-custom diamond-custom-2"></div>
                <div className="diamond-custom diamond-custom-3"></div>
                <div className="glow-custom glow-custom-1"></div>
                <div className="glow-custom glow-custom-2"></div>
              </div>
            </div>
            <div className="partners-bar">
              <div className="partners-scroll">
                <div className="partners-track">
                  <div className="partner-logo">P2P b2b</div>
                  <div className="partner-logo">BitMart</div>
                  <div className="partner-logo">XeggeX</div>
                  <div className="partner-logo">BlockServ</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Authenticated User View (Without Validator) */}
        <div id="authenticated-user-view" style={{display: "none"}}>
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
                        <h1>0x7F...A3D2</h1>
                        <p>User Account</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="user-stats-grid">
                    <div className="stat-section">
                      <div className="stat-header">
                        <h3>My stake on other pools <i className="fas fa-info-circle info-icon" title=""></i></h3>
                      </div>
                      <div className="stat-value-container">
                        <div className="stat-value highlight">100.6267 DMD</div>
                        <div className="stat-change positive">+5 DMD since 01.01.24</div>
                      </div>
                      <div className="stat-actions">
                        <div>
                          <button className="btn-primary btn-sm">Stake</button>
                          <button className="btn-secondary btn-sm">Unstake</button>
                        </div>
                        <div>
                          <button className="btn-secondary btn-sm">History</button>
                          <button className="btn-primary btn-sm" id="create-pool-btn">Create pool</button>
                        </div>        
                      </div>
                    </div>
                    
                    <div className="stat-section">
                      <div className="stat-header">
                        <h3>Monthly rewards <i className="fas fa-info-circle info-icon" title=""></i></h3>
                      </div>
                      <div className="stat-value-container">
                        <div className="stat-value highlight">100 DMD</div>
                        <div className="stat-change positive">+5 DMD since 01.01.24</div>
                        <div className="stat-note">from staking on 1 validator</div>
                      </div>
                      <div className="stat-actions">
                        <button className="btn-secondary btn-sm">History</button>
                      </div>
                    </div>
                    
                    <div className="stat-section">
                      <div className="stat-header">
                        <h3>DAO participation <i className="fas fa-info-circle info-icon" title=""></i></h3>
                      </div>
                      <div className="stat-value-container">
                        <div className="stat-value highlight">2 proposals created</div>
                        <div className="stat-note">Total voting power of the validators I've staked on: 1.33%</div>
                      </div>
                      <div className="stat-actions">
                        <a href="dao.html" className="btn-primary btn-sm">Go to DAO</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Validators I've Staked On Section */}
          <section className="validators-staked">
            <div className="container">
              <h2>Validators I've Staked On</h2>
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
                    <tr>
                      <td>
                        <div className="validator-info">
                          <div className="wallet-icon">
                            <div className="wallet-icon-inner" style={{background: "linear-gradient(45deg, #FF5E62, #FF9966)"}}></div>
                          </div>
                          <span>0x8A...B4F1</span>
                        </div>
                      </td>
                      <td>25,430 DMD</td>
                      <td>500 DMD</td>
                      <td>12.5%</td>
                      <td>98.2</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="validator-info">
                          <div className="wallet-icon">
                            <div className="wallet-icon-inner" style={{background: "linear-gradient(45deg, #56CCF2, #2F80ED)"}}></div>
                          </div>
                          <span>0x3C...D9E7</span>
                        </div>
                      </td>
                      <td>18,750 DMD</td>
                      <td>750 DMD</td>
                      <td>9.2%</td>
                      <td>95.7</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* DAO Section */}
          <section className="dao-overview">
            <div className="container">
              <h2>DAO</h2>
              <div className="dao-stats-grid">
                <div className="dao-stat-card">
                  <h3>Count</h3>
                  <p className="stat-value">24</p>
                </div>
                <div className="dao-stat-card">
                  <h3>Phase</h3>
                  <p className="stat-value">Proposal</p>
                </div>
                <div className="dao-stat-card">
                  <h3>Time till end</h3>
                  <p className="stat-value countdown">2d 14h 35m</p>
                </div>
                <div className="dao-stat-card">
                  <h3>Governance Pot</h3>
                  <p className="stat-value">15,750 DMD</p>
                </div>
              </div>
              <div className="dao-actions">
                <a href="dao.html" className="btn-primary">Go to DAO <i className="fas fa-arrow-right"></i></a>
              </div>
            </div>
          </section>

          {/* Network Statistics Section */}
          <section className="statistics">
            <div className="container">
              <div className="statistics-header">
                <h2 className="fade-in">DMD: your protocol's<br/>connection to the<br/>global digital economy</h2>
                <div className="big-stat">
                  <span className="big-stat-value">4M+</span>
                  <span className="big-stat-label">Total DMD Emission</span>
                </div>
              </div>
              <div className="stats-grid">
                <div className="stat-card fade-in">
                  <h3>Current Epoch</h3>
                  <p className="stat-value">1,245</p>
                </div>
                <div className="stat-card fade-in">
                  <h3>Next Round</h3>
                  <p className="stat-value">12h 34m</p>
                </div>
                <div className="stat-card fade-in">
                  <h3>Stake Start Time</h3>
                  <p className="stat-value">08:00 UTC</p>
                </div>
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
                    <tr>
                      <td>
                        <div className="validator-info">
                          <div className="wallet-icon">
                            <div className="wallet-icon-inner" style={{background: "linear-gradient(45deg, #FF5E62, #FF9966)"}}></div>
                          </div>
                          <span>0x8A...B4F1</span>
                        </div>
                      </td>
                      <td>25,430 DMD</td>
                      <td>12.5%</td>
                      <td>98.2</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="validator-info">
                          <div className="wallet-icon">
                            <div className="wallet-icon-inner" style={{background: "linear-gradient(45deg, #56CCF2, #2F80ED)"}}></div>
                          </div>
                          <span>0x3C...D9E7</span>
                        </div>
                      </td>
                      <td>18,750 DMD</td>
                      <td>9.2%</td>
                      <td>95.7</td>
                    </tr>
                    <tr className="current-user">
                      <td>
                        <div className="validator-info">
                          <div className="wallet-icon">
                            <div className="wallet-icon-inner" style={{background: "linear-gradient(45deg, #6EE7B7, #3B82F6)"}}></div>
                          </div>
                          <span>0x7F...A3D2 (You)</span>
                        </div>
                      </td>
                      <td>15,750 DMD</td>
                      <td>7.8%</td>
                      <td>97.5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="validators-actions">
                <a href="validators.html" className="btn-primary">See the list <i className="fas fa-arrow-right"></i></a>
              </div>
            </div>
          </section>
        </div>

        {/* Authenticated User View (With Validator) */}
        <div id="authenticated-validator-view" style={{display: "none"}}>
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
                      <h1>0x7F...A3D2</h1>
                      <span className="status-badge active">Active</span>
                    </div>
                  </div>
                  <div className="validator-score">
                    <div className="score-label">Score</div>
                    <div className="score-value">97.5</div>
                  </div>
                </div>
                
                <div className="combined-stake-card">
        <div className="stake-card-header">
          <h3>My Stake Overview <i className="fas fa-info-circle info-icon" title=""></i></h3>
          <div className="total-stake-value highlight">17,000 DMD</div>
        </div>
        
        <div className="stake-breakdown">
          <div className="stake-item">
            <div className="stake-item-header">
              <span className="stake-label">My pool stake <i className="fas fa-info-circle info-icon" title=""></i></span>
              <span className="stake-value highlight">10,100 DMD</span>
            </div>
            <div className="stake-change positive">+5 DMD since 01.01.24</div>
            <div className="stake-note">Connectivity reports: 0</div>
            <div className="stake-actions">
              <button className="btn-primary btn-sm">Stake</button>
              <button className="btn-secondary btn-sm">Unstake</button>
              <button className="btn-secondary btn-sm">History</button>
              <button className="btn-secondary btn-sm">Remove pool</button>
            </div>
          </div>
          
          <div className="stake-item">
            <div className="stake-item-header">
              <span className="stake-label">My stake on other pools <i className="fas fa-info-circle info-icon" title=""></i></span>
              <span className="stake-value highlight">7,000 DMD</span>
            </div>
            <div className="stake-change positive">+5 DMD since 01.01.24</div>
            <button className="btn-secondary btn-sm">History</button>
          </div>
        </div>
        
        <div className="stake-distribution-section">
          <div className="distribution-header">
            <span className="distribution-label">Stake Distribution <i className="fas fa-info-circle info-icon" title=""></i></span>
          </div>
          <div className="stake-distribution">
            <div className="stake-bar">
              <div className="own-stake" style={{width: "59%"}} data-tooltip="59% own stake"></div>
              <div className="delegated-stake" style={{width: "41%"}} data-tooltip="41% delegated"></div>
            </div>
            <div className="stake-labels">
              <span className="own-stake-label">59% own stake</span>
              <span className="delegated-stake-label">41% delegated</span>
            </div>
          </div>
        </div>
      </div>

                <div className="validator-stats-row">
        <div className="stat-card">
          <div className="stat-label">Monthly rewards <i className="fas fa-info-circle info-icon" title=""></i></div>
          <div className="stat-value highlight">100 DMD</div>
          <div className="stat-note">Earned per 1000DMD = 5,88DMD</div>
          <button className="btn-secondary btn-sm">History</button>
        </div>

        <div className="stat-card">
          <div className="stat-label">Delegated stake to my pool <i className="fas fa-info-circle info-icon" title=""></i></div>
          <div className="stat-value highlight">100 DMD</div>
          <div className="stat-change positive">+5 DMD since 01.01.24</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Node operator shared reward <i className="fas fa-info-circle info-icon" title=""></i></div>
          <div className="stat-value highlight">9%</div>
          <div className="stat-note">0x9f515...62F94</div>
          <button className="btn-primary btn-sm" id="edit-reward-btn">Edit</button>
        </div>
      </div>
                
                <div className="node-stake-panel">
        <div className="node-stake-header">
          <h3>Voting power <i className="fas fa-info-circle info-icon" title=""></i></h3>
          <div className="node-stake-value highlight">12%</div>
        </div>
        
        <div className="node-stake-details">
          <div className="node-stake-info">
            <div className="voting-power">
              <div>
                <span className="info-value negative">-0.01%</span>
                <span className="info-label">since 01.01.24</span>
              </div>
              <span className="proposals-info">Proposals created: 10</span>
            </div>
            <button className="btn-secondary btn-sm">History</button>
          </div>
        </div>
      </div>
              </div>
            </div>
          </section>

          {/* Delegates Section */}
          <section className="delegates-section">
            <div className="container">
              <h2>Delegates</h2>
              <div className="table-container">
                <table className="delegates-table">
                  <thead>
                    <tr>
                      <th>Delegate</th>
                      <th>Delegated Stake</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="delegate-info">
                          <div className="wallet-icon">
                            <div className="wallet-icon-inner" style={{background: "linear-gradient(45deg, #FF5E62, #FF9966)"}}></div>
                          </div>
                          <span>0x8A...B4F1</span>
                        </div>
                      </td>
                      <td>3,500 DMD</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="delegate-info">
                          <div className="wallet-icon">
                            <div className="wallet-icon-inner" style={{background: "linear-gradient(45deg, #56CCF2, #2F80ED)"}}></div>
                          </div>
                          <span>0x3C...D9E7</span>
                        </div>
                      </td>
                      <td>2,750 DMD</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="delegate-info">
                          <div className="wallet-icon">
                            <div className="wallet-icon-inner" style={{background: "linear-gradient(45deg, #A17FE0, #5D26C1)"}}></div>
                          </div>
                          <span>0x5D...F2A8</span>
                        </div>
                      </td>
                      <td>2,250 DMD</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="delegate-info">
                          <div className="wallet-icon">
                            <div className="wallet-icon-inner" style={{background: "linear-gradient(45deg, #F97794, #623AA2)"}}></div>
                          </div>
                          <span>0x9B...C4D3</span>
                        </div>
                      </td>
                      <td>1,500 DMD</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Validators I've Staked On Section */}
          <section className="validators-staked">
            <div className="container">
              <h2>Validators I've Staked On</h2>
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
                    <tr>
                      <td>
                        <div className="validator-info">
                          <div className="wallet-icon">
                            <div className="wallet-icon-inner" style={{background: "linear-gradient(45deg, #FF5E62, #FF9966)"}}></div>
                          </div>
                          <span>0x8A...B4F1</span>
                        </div>
                      </td>
                      <td>25,430 DMD</td>
                      <td>500 DMD</td>
                      <td>12.5%</td>
                      <td>98.2</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="validator-info">
                          <div className="wallet-icon">
                            <div className="wallet-icon-inner" style={{background: "linear-gradient(45deg, #56CCF2, #2F80ED)"}}></div>
                          </div>
                          <span>0x3C...D9E7</span>
                        </div>
                      </td>
                      <td>18,750 DMD</td>
                      <td>250 DMD</td>
                      <td>9.2%</td>
                      <td>95.7</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* DAO Section */}
          <section className="dao-overview">
            <div className="container">
              <h2>DAO</h2>
              <div className="dao-stats-grid">
                <div className="dao-stat-card">
                  <h3>Count</h3>
                  <p className="stat-value">24</p>
                </div>
                <div className="dao-stat-card">
                  <h3>Phase</h3>
                  <p className="stat-value">Proposal</p>
                </div>
                <div className="dao-stat-card">
                  <h3>Time till end</h3>
                  <p className="stat-value countdown">2d 14h 35m</p>
                </div>
                <div className="dao-stat-card">
                  <h3>Governance Pot</h3>
                  <p className="stat-value">15,750 DMD</p>
                </div>
              </div>
              <div className="dao-actions">
                <a href="dao.html" className="btn-primary">Go to DAO <i className="fas fa-arrow-right"></i></a>
              </div>
            </div>
          </section>

          {/* Network Statistics Section */}
          <section className="statistics">
            <div className="container">
              <div className="statistics-header">
                <h2 className="fade-in">DMD: your protocol's<br/>connection to the<br/>global digital economy</h2>
                <div className="big-stat">
                  <span className="big-stat-value">4M+</span>
                  <span className="big-stat-label">Total DMD Emission</span>
                </div>
              </div>
              <div className="stats-grid">
                <div className="stat-card fade-in">
                  <h3>Current Epoch</h3>
                  <p className="stat-value">1,245</p>
                </div>
                <div className="stat-card fade-in">
                  <h3>Next Round</h3>
                  <p className="stat-value">12h 34m</p>
                </div>
                <div className="stat-card fade-in">
                  <h3>Stake Start Time</h3>
                  <p className="stat-value">08:00 UTC</p>
                </div>
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
                    <tr>
                      <td>
                        <div className="validator-info">
                          <div className="wallet-icon">
                            <div className="wallet-icon-inner" style={{background: "linear-gradient(45deg, #FF5E62, #FF9966)"}}></div>
                          </div>
                          <span>0x8A...B4F1</span>
                        </div>
                      </td>
                      <td>25,430 DMD</td>
                      <td>12.5%</td>
                      <td>98.2</td>
                    </tr>
                    <tr>
                      <td>
                        <div className="validator-info">
                          <div className="wallet-icon">
                            <div className="wallet-icon-inner" style={{background: "linear-gradient(45deg, #56CCF2, #2F80ED)"}}></div>
                          </div>
                          <span>0x3C...D9E7</span>
                        </div>
                      </td>
                      <td>18,750 DMD</td>
                      <td>9.2%</td>
                      <td>95.7</td>
                    </tr>
                    <tr className="current-user">
                      <td>
                        <div className="validator-info">
                          <div className="wallet-icon">
                            <div className="wallet-icon-inner" style={{background: "linear-gradient(45deg, #6EE7B7, #3B82F6)"}}></div>
                          </div>
                          <span>0x7F...A3D2 (You)</span>
                        </div>
                      </td>
                      <td>15,750 DMD</td>
                      <td>7.8%</td>
                      <td>97.5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="validators-actions">
                <a href="validators.html" className="btn-primary">See the list <i className="fas fa-arrow-right"></i></a>
              </div>
            </div>
          </section>
        </div>

        {/* Create Pool Modal */}
        <div className="modal" id="create-pool-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create a Validator Pool</h3>
              <span className="close-modal">&times;</span>
            </div>
            <div className="modal-body">
              <form id="create-pool-form">
                <div className="form-group">
                  <label htmlFor="initial-stake">Initial Stake (DMD)</label>
                  <input type="number" id="initial-stake" placeholder="Minimum 10000 DMD"/>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Create Pool</button>
                  <button type="button" className="btn-secondary cancel-modal">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Update Rewards Modal */}
        <div className="modal" id="update-rewards-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Update Shared Rewards</h3>
              <span className="close-modal">&times;</span>
            </div>
            <div className="modal-body">
              <form id="update-rewards-form">
                <div className="form-group">
                  <label htmlFor="new-reward-share">New Reward Share (%)</label>
                  <input type="number" id="new-reward-share" placeholder="Enter percentage (0-100)"/>
                  <p className="form-help">This is the percentage of rewards that will be shared with your delegates.</p>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Update</button>
                  <button type="button" className="btn-secondary cancel-modal">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section className="features">
          <div className="container">
            <div className="section-header">
              <h2 className="fade-in">Blockchain that scales</h2>
              <p>DMD Diamond is a fair-launched, truly decentralized Layer 1 blockchain, built by a dedicated community — without a company, premine, or ICO. Established in 2013, it has continuously evolved to prioritize security, efficiency, and decentralization.</p>
              <a href="https://github.com/DMDcoin/whitepaper/wiki/A.-Home" target="_blank" className="btn-primary">Learn more about DMD <i className="fas fa-arrow-right"></i></a>
            </div>

            <div className="features-grid">
              <div className="feature-card fade-in">
                <div className="feature-icon">
                  <i className="fas fa-network-wired"></i>
                </div>
                <h3>Decentralized</h3>
              </div>
              <div className="feature-card fade-in">
                <div className="feature-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3>Secure</h3>
              </div>
              <div className="feature-card fade-in">
                <div className="feature-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3>Scalable</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Design Section */}
        <section className="design-section">
          <div className="container">
            <div className="design-grid">
              <div className="design-content">
                <h2>The Next Evolution of DMD Diamond</h2>
                <p>DMD Diamond is relaunching as a fully EVM-compatible Layer 1, designed to empower developers and projects with cutting-edge blockchain technology.</p>
                <a href="https://github.com/DMDcoin/whitepaper/wiki/A.-Home" target="_blank" className="btn-primary">Explore the ecosystem <i className="fas fa-arrow-right"></i></a>
              </div>
              <div className="design-features">
                <div className="design-feature">
                  <div className="feature-icon">
                    <i className="fas fa-bolt"></i>
                  </div>
                  <div className="feature-text">
                    <h4>Lightning Fast</h4>
                    <p>500ms block times</p>
                  </div>
                </div>
                <div className="design-feature">
                  <div className="feature-icon">
                    <i className="fas fa-lock"></i>
                  </div>
                  <div className="feature-text">
                    <h4>HBBFT Protocol</h4>
                    <p>Secure cross-chain transfers</p>
                  </div>
                </div>
                <div className="design-feature">
                  <div className="feature-icon">
                    <i className="fas fa-code-branch"></i>
                  </div>
                  <div className="feature-text">
                    <h4>EVM Compatibility</h4>
                    <p>Build exactly what you need</p>
                  </div>
                </div>
                <div className="design-feature">
                  <div className="feature-icon">
                    <i className="fas fa-server"></i>
                  </div>
                  <div className="feature-text">
                    <h4>Validator Network</h4>
                    <p>Decentralized consensus</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Smart Contracts Section */}
        <section className="smart-contracts">
          <div className="container">
            <div className="smart-contracts-grid">
              <div className="smart-contracts-content">
                <h2 className="fade-in">Smart contracts<br/>done smarter</h2>
                <p>The Diamond platform offers a secure, energy-efficient environment for smart contract execution—leveraging DMD's high-performance blockchain architecture.</p>
                <a href="validators.html" className="btn-primary">Start Staking <i className="fas fa-arrow-right"></i></a>
              </div>
            </div>
          </div>
          <div className="cosmic-elements contracts-elements">
            <div className="glow glow-blue"></div>
          </div>
        </section>

        {/* Network Statistics Section */}
        <section className="statistics">
          <div className="container">
            <div className="statistics-header">
              <h2 className="fade-in">DMD: your protocol's<br/>connection to the<br/>global digital economy</h2>
              <div className="big-stat">
                <span className="big-stat-value">4M+</span>
                <span className="big-stat-label">Total DMD Emission</span>
              </div>
            </div>
            <div className="stats-grid">
              <div className="stat-card fade-in">
                <h3>Current Epoch</h3>
                <p className="stat-value">396</p>
              </div>
              <div className="stat-card fade-in">
                <h3>Key Gen. Round</h3>
                <p className="stat-value">1</p>
              </div>
              <div className="stat-card fade-in">
                <h3>Epoch Start Time</h3>
                <p className="stat-value">22 May 2025 16:41:57</p>
              </div>
              <div className="stat-card fade-in">
                <h3>Epoch Start Block</h3>
                <p className="stat-value">112839</p>
              </div>
              <div className="stat-card fade-in">
                <h3>Active Validators</h3>
                <p className="stat-value">25</p>
              </div>
              <div className="stat-card fade-in">
                <h3>Valid Candidates</h3>
                <p className="stat-value">61</p>
              </div>
              <div className="stat-card fade-in">
                <h3>Min. Gas Fee</h3>
                <p className="stat-value">1 Gwei</p>
              </div>
              <div className="stat-card fade-in">
                <h3>Reinsert Pot</h3>
                <p className="stat-value">345662.1747 DMD</p>
              </div>
              <div className="stat-card fade-in">
                <h3>Delta Pot</h3>
                <p className="stat-value">512829.4899 DMD</p>
              </div>
              <div className="stat-card fade-in">
                <h3>Claiming Pot</h3>
                <p className="stat-value">2114280.8052 DMD</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="testimonial">
          <div className="container">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"As a true blockchain purist, DMD Diamond's core values ​include complete decentralization. DMD Diamond is a community-driven project with no corporations behind us."</p>
                <div className="testimonial-author">
                  <div className="author-logo">Origin</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section className="community">
          <div className="container">
            <h2 className="fade-in">A fast-growing, global <br/> community</h2>
            <p>Whether you're a developer, creator, or supporter, there's a place for you in the Diamond ecosystem. Build dApps on our fast, secure, and energy-efficient chain. Help shape the future of the blockchain with the help of decentralized governance. Or simply stake and participate in consensus—every role matters.
              Join the community. Build with purpose. Own your impact.</p>

            <div className="community-stats">
              <div className="community-stat">
                <i className="fas fa-users"></i>
                <h3>Community Size</h3>
                <p>1,500+ members</p>
              </div>
              <div className="community-stat">
                <i className="fas fa-code"></i>
                <h3>Core team</h3>
                <p>10+ active developers</p>
              </div>
              <div className="community-stat">
                <i className="fas fa-project-diagram"></i>
                <h3>Projects Built</h3>
                <p>5+ on top of DMD chain</p>
              </div>
              <div className="community-stat">
                <i className="fas fa-globe"></i>
                <h3>Global Reach</h3>
                <p>50+ countries</p>
              </div>
            </div>
          </div>
        </section>

        {/* News Section */}
        <section className="news">
          <div className="container">
            <h2 className="fade-in">News & Updates</h2>
            <div className="news-card">
              <div className="news-content">
                <h3>Connect to DMD</h3>
                <p>Are you a third-party company seeking a sustainable blockchain solution with industry-leading features for hosting your project? Look no further!</p>
                <a href="#" className="btn-small">Learn more</a>
              </div>
              <div className="news-image">
              </div>
            </div>
          </div>
        </section>

        {/* Become Participant Section */}
        <section className="participate">
          <div className="container">
            <h2 className="fade-in">Start Staking</h2>
            <div className="participate-grid">
              <div className="participate-card fade-in">
                <div className="participate-icon">
                  <i className="fas fa-wallet"></i>
                </div>
                <h3>Seamless Staking Experience</h3>
                <p>Begin your journey by connecting your cryptocurrency wallet and explore the variety of staking options available. Our intuitive UI ensures a smooth and straightforward staking process.</p>
              </div>
              <div className="participate-card fade-in">
                <div className="participate-icon">
                  <i className="fas fa-chart-bar"></i>
                </div>
                <h3>Real-Time Analytics</h3>
                <p>Stay informed with transparent data on staking pools, performance, and rewards. Our platform provides you with the insights needed to make the best staking decisions.</p>
              </div>
              <div className="participate-card fade-in">
                <div className="participate-icon">
                  <i className="fas fa-coins"></i>
                </div>
                <h3>Earn Rewards</h3>
                <p>By staking your DMD coins, you actively participate in transaction validation, securing the blockchain, and in return, receive additional DMD as rewards.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq">
          <div className="container">
            <h2 className="fade-in">Frequently Asked Questions</h2>
            <FAQ count={6} />
            <div className="faq-actions">
              <a href="faqs.html" className="btn-primary">See all FAQs <i className="fas fa-arrow-right"></i></a>
            </div>
          </div>
        </section>
    </div>
  );
}
