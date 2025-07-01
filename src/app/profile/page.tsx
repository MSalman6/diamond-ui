'use client'

import '../page.css';
import Link from 'next/link';
import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { truncateAddress } from '@/utils/common';
import { useWeb3Context } from '@/contexts/Web3';
import { useStakingContext } from '@/contexts/Staking';
import { useWalletConnect } from '@/contexts/WalletConnect';

export default function ProfilePage() {
  const { userWallet } = useWeb3Context();
  const { myPool, pools, totalDaoStake } = useStakingContext();

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

  const hasValidator = Boolean(myPool);

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
                        <h1>{userWallet.myAddr && truncateAddress(userWallet.myAddr)}</h1>
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
                        <td>{calculateVotingPower(BigNumber(validator.totalStake) || new BigNumber(0))}%</td>
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
                      <h1>{userWallet.myAddr && truncateAddress(userWallet.myAddr)}</h1>
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
    </div>
  );
}