'use client'

import '../page.css';
import './Profile.css';
import Link from 'next/link';
import BigNumber from 'bignumber.js';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';
import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { truncateAddress } from '@/utils/common';
import { useWeb3Context } from '@/contexts/Web3';
import InfoTooltip from '@/components/InfoTooltip';
import { useStakingContext } from '@/contexts/Staking';
import { useWalletConnect } from '@/contexts/WalletConnect';
import StakeModal from '@/components/Modals/Stake/StakeModal';
import UnstakeModal from '@/components/Modals/Unstake/UnstakeModal';
import CreatePoolModal from '@/components/Modals/CreatePool/CreatePoolModal';
import UpdatePoolOperatorModal from '@/components/Modals/UpdatePoolOperator/UpdatePoolOperatorModal';

export default function ProfilePage() {
  const router = useRouter();
  const { userWallet } = useWeb3Context();
  const { myPool, pools, totalDaoStake } = useStakingContext();
  const { isConnected } = useWalletConnect();

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

  const hasValidator = Boolean(myPool);

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
                        <h1>{userWallet.myAddr && truncateAddress(userWallet.myAddr)}</h1>
                        <p>User Account</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="user-stats-grid">
                    <div className="stat-section">
                      <div className="stat-header">
                        <h3>My delegated stake <InfoTooltip content={<div><p>The total amount of DMD you've staked to validators. This amount remains under your control and can be unstaked at any time unless locked in an active Epoch.</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></h3>
                      </div>
                      <div className="stat-value-container">
                        <div className="stat-value highlight">100.6267 DMD</div>
                        <div className="stat-change positive">+5 DMD since epoch 22</div>
                      </div>
                      <div className="stat-actions">
                        <div>
                          <Link href="/validators" className="btn-primary btn-sm">Stake / Unstake</Link>
                          <CreatePoolModal buttonText="Create pool" />
                        </div>
                        <div>
                          <button onClick={() => toast.info("Coming soon!")} className="btn-secondary btn-sm">History</button>
                        </div>        
                      </div>
                    </div>
                    
                    <div className="stat-section">
                      <div className="stat-header">
                        <h3>Estimated monthly rewards <InfoTooltip content={<div><p>Estimated rewards earned from your active staked over the last 30 days. This value depends on performance and uptime of the validators you've staked with.</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></h3>
                      </div>
                      <div className="stat-value-container">
                        <div className="stat-value highlight">100 DMD</div>
                        <div className="stat-change positive">+5 DMD since epoch 22</div>
                        <div className="stat-note">from staking on 1 validator</div>
                      </div>
                      <div className="stat-actions">
                        <button onClick={() => toast.info("Coming soon!")} className="btn-secondary btn-sm">History</button>
                      </div>
                    </div>
                    
                    <div className="stat-section">
                      <div className="stat-header">
                        <h3>DAO participation <InfoTooltip content={<div><p>Displays the number of governance proposals you have created. As a delegator, your stake indirectly contributes to DAO voting power - but only the validator decides how to vote.</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></h3>
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
                    <div className="score-info">
                      <div className="score-value">97.5</div>
                      <InfoTooltip
                        placement="bottom"
                        content={
                          <div>
                            <p>The Bonus Score measures your validator's performance and uptime.</p>
                            <ul>
                              <li>Staying online and ready increases your score.</li>
                              <li>Downtime, missed key operations, or unavailability decrease it.</li>
                            </ul>
                            <p>Your selection chance for the next epoch is based on <strong>Stake × Bonus Score</strong>.</p>
                            <p>Scores range from <strong>1 to 1000</strong>.</p>
                          </div>
                        }
                      >
                        <i className="fas fa-info-circle info-icon" aria-hidden="true"></i>
                      </InfoTooltip>
                    </div>
                    <button onClick={() => toast.info("Coming soon!")}  className="btn-secondary btn-sm">History</button>
                  </div>
                </div>
                
                <div className="combined-stake-card">
        <div className="stake-card-header">
          <h3>Validator Pool Overview <InfoTooltip content={<div><p>Summary of your total stake, combining your own validator stake and all delegations received.</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></h3>
          <div className="total-stake-value highlight">17,000 DMD</div>
          <div className="cr-count">Connectivity reports: 0</div>
        </div>
        
        <div className="stake-breakdown">
          <div className="stake-item">
            <div className="stake-item-header">
              <span className="stake-label">My validator stake <InfoTooltip content={<div><p>The amount of DMD you've personally staked as a validator in your own pool.</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></span>
              <span className="stake-value highlight">10,100 DMD</span>
            </div>
            <div className="stake-change positive">+5 DMD since epoch 22</div>
            <div className="stake-actions">
              {
                myPool && (
                  <>
                    <StakeModal buttonText="Stake" pool={myPool} />
                    <UnstakeModal buttonText="Unstake" pool={myPool} />
                    <button onClick={() => toast.info("Coming soon!")}  className="btn-secondary btn-sm">History</button>
                    <button className="btn-secondary btn-sm">Remove pool</button>
                  </>
                )
              }
            </div>
          </div>
          
          <div className="stake-item">
            <div className="stake-item-header">
              <span className="stake-label">Delegated stake to my pool <InfoTooltip content={<div><p>The amount of DMD delegated to your pool by other users (excluding your own stake).</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></span>
              <span className="stake-value highlight">7,000 DMD</span>
            </div>
            <div className="stake-change positive">+5 DMD since epoch 22</div>
            <button onClick={() => toast.info("Coming soon!")}  className="btn-secondary btn-sm">History</button>
          </div>
        </div>
        
        <div className="stake-distribution-section">
          <div className="distribution-header">
            <span className="distribution-label">Stake Distribution <InfoTooltip content={<div><p>Visual breakdown showing the ratio between your own stake and delegated stake in your validator pool.</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></span>
          </div>
          <div className="stake-distribution">
            <div className="stake-bar">
              <InfoTooltip placement="top" content={<div><p>59% own stake</p></div>}>
                <div className="own-stake" style={{width: "59%"}} />
              </InfoTooltip>
              <InfoTooltip placement="top" content={<div><p>41% delegated</p></div>}>
                <div className="delegated-stake" style={{width: "41%"}} />
              </InfoTooltip>
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
          <div className="stat-label">Estimated monthly rewards <InfoTooltip content={<div><p>Estimated DMD rewards earned this month based on your validator pool total stake.</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></div>
          <div className="stat-value highlight">100 DMD</div>
          <div className="stat-note">Earned per 1000DMD = 5,88DMD <InfoTooltip content={<div><p>Rewards earned per 1000 DMD staked in the last 30 days.</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></div>
          <button onClick={() => toast.info("Coming soon!")} className="btn-secondary btn-sm">Rewards history</button>
        </div>

        <div className="stat-card">
          <div className="stat-label">My outgoing delegations <InfoTooltip content={<div><p>Amount of DMD you've delegated to other validators from your account (if any).</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></div>
          <div className="stat-value highlight">100 DMD</div>
          <div className="stat-change positive">+5 DMD since epoch 22</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Node operator shared reward <InfoTooltip content={<div><strong>The portion of the validator's 20% reward that is shared with a separate node operator.</strong> <p>Useful when a node owner delegates technical operation to someone else but keeps ownership and voting rights. Configurable per pool (from 0.01% to 20%).</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></div>
          <div className="stat-value highlight">9%</div>
          <div className="stat-note copy-address-container">
            0x9f515...62F94{" "}
            <button
              className="btnIcon"
              id="copy-address"
              title="Copy Address"
              onClick={() => copyData("0x9f515...62F94")}
            >
              <i className="fas fa-copy"></i>
            </button>
          </div>
          {myPool && <UpdatePoolOperatorModal buttonText="Edit" pool={myPool} />}
        </div>
      </div>
                
                <div className="node-stake-panel">
        <div className="node-stake-header">
          <h3>Voting power <InfoTooltip content={<div><p>Voting power is the share of total DAO stake that your validator pool represents (your own stake + delegated stake).</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></h3>
          <div className="node-stake-value highlight">12%</div>
        </div>
        
        <div className="node-stake-details">
          <div className="node-stake-info">
            <div className="voting-power">
              <div>
                <span className="info-value negative">-0.01%</span>
                <span className="info-label">since epoch 22</span>
              </div>
              <span className="proposals-info">Proposals created: 10</span>
            </div>
            <button onClick={() => toast.info("Coming soon!")} className="btn-secondary btn-sm">History</button>
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