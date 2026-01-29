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
import { useDaoContext } from '@/contexts/DAO';
import { useWalletConnect } from '@/contexts/WalletConnect';
import StakeModal from '@/components/Modals/Stake/StakeModal';
import UnstakeModal from '@/components/Modals/Unstake/UnstakeModal';
import CreatePoolModal from '@/components/Modals/CreatePool/CreatePoolModal';
import UpdatePoolOperatorModal from '@/components/Modals/UpdatePoolOperator/UpdatePoolOperatorModal';

export default function ProfilePage() {
  const router = useRouter();
  const { userWallet } = useWeb3Context();
  const { myPool, pools, totalDaoStake, myTotalStake, myCandidateStake } = useStakingContext();
  const { isConnected } = useWalletConnect();
  const { allDaoProposals } = useDaoContext();

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
                  
                  <div className="user-stats-grid">
                    <div className="stat-section">
                      <div className="stat-header">
                        <h3>My delegated stake <InfoTooltip content={<div><p>The total amount of DMD you've staked to validators. This amount remains under your control and can be unstaked at any time unless locked in an active Epoch.</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></h3>
                      </div>
                      <div className="stat-value-container">
                        <div className="stat-value highlight">{formatDMDAmount(myDelegatedStakeWei)}</div>
                        <div className="stat-change positive" style={{display:'none'}}>+ DMD since last epoch</div>
                      </div>
                      <div className="stat-actions">
                        <div className="stat-action-group">
                          <Link href="/validators?sort=myStake&direction=descending" className="btn-primary btn-sm">Stake/Unstake</Link>
                          <CreatePoolModal buttonText="Create pool" />
                        </div>
                        <div>
                          <button onClick={() => toast.info("Coming soon!")} className="btn-secondary btn-sm">History</button>
                        </div>        
                      </div>
                    </div>
                    
                    <div className="stat-section">
                      <div className="stat-header">
                        <h3>Monthly rewards <InfoTooltip content={<div><p>Rewards earned from your current staked DMD over the past 30 days. This estimate depends on the performance and uptime of the validator(s) you’ve delegated to.</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></h3>
                      </div>
                      <div className="stat-value-container">
                        <div className="stat-value highlight">—</div>
                        <div className="stat-change positive" style={{display:'none'}}>+ DMD since epoch</div>
                        <div className="stat-note">from staking on {stakedValidators.length} validator{stakedValidators.length === 1 ? '' : 's'}</div>
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
                        <div className="stat-value highlight">{myProposalsCreated} proposal{myProposalsCreated === 1 ? '' : 's'} created</div>
                        <div className="stat-note">Total voting power of the Staked With: {stakedWithVotingPowerPct}%</div>
                      </div>
                      <div className="stat-actions">
                        <Link href="/dao" className="btn-primary btn-sm">Go to DAO</Link>
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
                        <span className="stake-value highlight">{formatDMDAmount(delegatedStakeWei)}</span>
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

                  <div className="validator-stats-row">
                  <div className="stat-card">
                    <div className="stat-label">Monthly rewards <InfoTooltip content={<div><p>DMD rewards earned this month based on your validator pool total stake.</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></div>
                    <div className="stat-value highlight">—</div>
                    <div className="stat-note">Estimate coming soon <InfoTooltip content={<div><p>Reward estimation is under development.</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></div>
                    <button onClick={() => toast.info("Coming soon!")} className="btn-secondary btn-sm">Rewards history</button>
                  </div>

                  <div className="stat-card">
                    <div className="stat-label">My outgoing delegations <InfoTooltip content={<div><p>Amount of DMD you've delegated to other validators from your account (if any).</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></div>
                    <div className="stat-value highlight">{formatDMDAmount(myOutgoingDelegationsWei)}</div>
                    <div className="stat-change positive" style={{display:'none'}}>+ DMD since epoch</div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-label">Node operator shared reward <InfoTooltip content={<div><p>The portion of the validator's 20% reward that is shared with a separate node operator.</p> <p>Useful when a node owner delegates technical operation to someone else but keeps ownership and voting rights. Configurable per pool (from 0.01% to 20%).</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></div>
                    <div className="stat-value highlight">{myPool?.poolOperatorShare ? BigNumber(myPool.poolOperatorShare).dividedBy(100).toFixed(2) + '%' : '—'}</div>
                    <div className="stat-note copy-address-container">
                      {myPool?.poolOperator ? truncateAddress(myPool.poolOperator) : '—'}{' '}
                      <button
                        className="btnIcon"
                        id="copy-address"
                        title="Copy Address"
                        onClick={() => myPool?.poolOperator && copyData(myPool.poolOperator)}
                      >
                        <i className="fas fa-copy"></i>
                      </button>
                    </div>
                    {myPool && <UpdatePoolOperatorModal buttonText="Edit" pool={myPool} />}
                  </div>
                </div>
                          
                <div className="validator-stats-row">
                  {/* Voting power card */}
                  <div className="stat-card">
                    <div className="stat-label">Voting power <InfoTooltip content={<div><p>Voting power is the share of total DAO stake that your validator pool represents (your own stake + delegated stake).</p></div>}><i className="fas fa-info-circle info-icon" aria-hidden="true"></i></InfoTooltip></div>
                    <div className="stat-value highlight">{myPool?.votingPower && myPool.votingPower.toString() !== 'NaN' ? `${myPool.votingPower.toString()}%` : '0%'}</div>
                    <div className="stat-note" style={{display:'none'}}><span className="info-value negative">-</span> since epoch</div>
                    <div className="stat-note">Proposals created: {myProposalsCreated}</div>
                    <button onClick={() => toast.info("Coming soon!")} className="btn-secondary btn-sm">History</button>
                  </div>

                  {/* Score card */}
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
                    <div className="cr-count">Connectivity reports: {myPool?.connectivityReport ?? '—'}</div>
                    <div className="stat-change positive cr-change" style={{display:'none'}}>+ points since epoch</div>
                    <button onClick={() => toast.info("Coming soon!")} className="btn-secondary btn-sm">History</button>
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