'use client'

import '../page.css';
import { useEffect } from 'react';

export default function ProfilePage() {
  useEffect(() => {
    const button = document.getElementById("connect-wallet-btn");
    const userView = document.getElementById("authenticated-user-view");
    const validatorView = document.getElementById("authenticated-validator-view");
  
    const toggleViews = () => {
      if (userView && validatorView) {
        const isUserVisible = userView.style.display !== "none";
        userView.style.display = isUserVisible ? "none" : "block";
        validatorView.style.display = isUserVisible ? "block" : "none";
      }
    };
  
    button?.addEventListener("click", toggleViews);
  
    return () => {
      button?.removeEventListener("click", toggleViews);
    };
  }, []);

  return (
    <div>
        {/* Authenticated User View (Without Validator) */}
        <div id="authenticated-user-view" style={{display: "block"}}>
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
                        <h3>My delegated stake <i className="fas fa-info-circle info-icon" title=""></i></h3>
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
                        <div className="stat-note">Total voting power of the Staked With: 1.33%</div>
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
              <span className="stake-label">My delegated stake <i className="fas fa-info-circle info-icon" title=""></i></span>
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
    </div>
  );
}