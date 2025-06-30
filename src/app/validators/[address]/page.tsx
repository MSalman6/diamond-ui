'use client';

import './ValidatorDetails.css';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, startTransition } from 'react';
import BigNumber from "bignumber.js";
import { truncateAddress, timestampToDate } from '@/utils/common';
import { useWeb3Context } from '@/contexts/Web3';
import { useStakingContext } from '@/contexts/Staking';
import { useDaoContext } from '@/contexts/DAO';
import StakeModal from '@/components/Modals/StakeModal';
import UnstakeModal from '@/components/Modals/UnstakeModal';
import copy from 'copy-to-clipboard';
import { toast } from 'react-toastify';

export default function ValidatorDetails() {
  const params = useParams();
  const router = useRouter();
  const address = params?.address as string;
  
  // Context hooks
  const { userWallet, web3Initialized, showLoader } = useWeb3Context();
  const { activeProposals, getMyVote, getActiveProposals } = useDaoContext();
  const { pools, stakingEpoch, claimOrderedUnstake } = useStakingContext();

  // State
  const [pool, setPool] = useState<any | null>(null);
  const [filteredProposals, setFilteredProposals] = useState<any[]>([]);
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [isUnstakeModalOpen, setIsUnstakeModalOpen] = useState(false);

  // Effects
  useEffect(() => {
    try {
      if (!activeProposals.length && web3Initialized) {
        showLoader(true, "");
        getActiveProposals();
      }
    } catch(err) {}
  }, [web3Initialized]);

  useEffect(() => {
    const foundPool = pools.find((pool) => pool.stakingAddress === address);
    setPool(foundPool || null);
    if (foundPool) {
      filterProposals();
    }
  }, [address, pools, userWallet.myAddr]);

  // Functions
  async function filterProposals() {
    if (!activeProposals.length) return;
    
    const proposals = await Promise.all(
      activeProposals.map(async (proposal) => {
        // Only process proposals where address is relevant
        if (proposal.proposer !== address && proposal.state !== '2') return null;

        const vote = address ? await getMyVote(proposal.id, address) : null;
        // Only proceed if vote exists and vote.timestamp is greater than 0
        if (!vote || +vote.timestamp <= 0) return null;

        if (proposal.proposer === address) {
          return { ...proposal, myVote: vote.vote };
        } else if (vote.vote !== '0') {
          return { ...proposal, myVote: vote.vote };
        }
        return null;
      })
    );

    setFilteredProposals(proposals.filter((proposal) => proposal !== null));
  }

  const copyData = (data: string) => {
    copy(data);
    toast.success("Copied to clipboard");
  };

  const handleStakeClick = () => {
    setIsStakeModalOpen(true);
  };

  const handleUnstakeClick = () => {
    setIsUnstakeModalOpen(true);
  };

  const handleClaimClick = async () => {
    if (pool) {
      await claimOrderedUnstake(pool);
    }
  };

  const navigateToProposal = (proposalId: string) => {
    startTransition(() => {
      router.push(`/dao/details/${proposalId}`);
    });
  };

  // Use the address parameter in the component
  console.log('Validator address:', address);

  // Loading state
  if (!address) {
    return <div>Loading...</div>;
  }

  return (
    <div>
  <section className="validator-hero">
    <div className="cosmic-grid"></div>
    <div className="cosmic-elements">
      <div className="diamond diamond-1"></div>
      <div className="diamond diamond-2"></div>
      <div className="diamond diamond-3"></div>
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>
    </div>
    <div className="container">
      <div className="validator-hero-content">
        <div className="back-link">
          <a href="/validators" onClick={(e) => { e.preventDefault(); router.push('/validators'); }}>
            <i className="fas fa-arrow-left"></i> Back to Validators
          </a>
        </div>
        <div className="validator-header">
  <div className="validator-main-info">
    <div className="validator-identity">
      <div className="address-section">
        <span id="validator-status-badge" className={`status-badge ${pool?.isActive ? 'status-active' : (pool?.isToBeElected || pool?.isPendingValidator) ? 'status-valid' : 'status-inactive'}`}>
          {pool?.isActive ? "Active" : (pool?.isToBeElected || pool?.isPendingValidator) ? "Valid" : "Invalid"}
        </span>
        <h1 id="validator-address">{address ? truncateAddress(address) : 'Loading...'}</h1>
        <div className="address-actions">
          <button className="btn-icon" id="copy-address" title="Copy Address" onClick={() => copyData(address || "")}>
            <i className="fas fa-copy"></i>
          </button>
          <button className="btn-icon" id="view-explorer" title="View in Explorer">
            <i className="fas fa-external-link-alt"></i>
          </button>
        </div>
      </div>
    </div>
    <div className="validator-actions">
      <div className="staking-buttons">
        {(pool?.isActive || pool?.isToBeElected || pool?.isPendingValidator) && 
         BigNumber(pool?.totalStake || 0).isLessThan(BigNumber(50000).multipliedBy(10**18)) && 
         userWallet.myAddr && (
          <button className="btn-primary btn-stake-hero" id="stake-button" onClick={handleStakeClick}>
            <i className="fas fa-plus-circle"></i> Stake
          </button>
        )}
        {pool && 
         BigNumber(pool.orderedWithdrawAmount || 0).isGreaterThan(0) && 
         BigNumber(pool.orderedWithdrawUnlockEpoch || 0).isLessThanOrEqualTo(stakingEpoch) && 
         userWallet.myAddr ? (
          <button className="btn-primary btn-claim-hero" id="claim-button" onClick={handleClaimClick}>
            <i className="fas fa-coins"></i> Claim
          </button>
        ) : pool && 
             BigNumber(pool.myStake || 0).isGreaterThan(0) && 
             userWallet.myAddr && (
          <button className="btn-primary btn-unstake-hero" id="unstake-button" onClick={handleUnstakeClick}>
            <i className="fas fa-minus-circle"></i> Unstake
          </button>
        )}
      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  </section>

<section className="validator-statistics">
  <div className="container">
    <div className="section-title">
      <h2>Validator Statistics</h2>
    </div>
    <div className="stats-grid-wireframe">
      <div className="stat-card-wireframe fade-in">
        <div className="stat-header">
          <h3>Pool stake <i className="fas fa-info-circle info-icon" title="Total stake in this pool"></i></h3>
        </div>
        <p className="stat-value-large">{pool ? BigNumber(pool.totalStake).dividedBy(10**18).toFixed(4, BigNumber.ROUND_DOWN) : 0} DMD</p>
        <div className="stat-trend positive">
          <i className="fas fa-arrow-up"></i> 5 DMD since 01.01.24
        </div>
        <div className="stat-footer">
          <span className="connectivity-info">Connectivity reports: 0 <i className="fas fa-info-circle info-icon" title=""></i></span>
        </div>
      </div>

      <div className="stat-card-wireframe fade-in">
        <div className="stat-header">
          <h3>Score <i className="fas fa-info-circle info-icon" title="Validator score"></i></h3>
        </div>
        <p className="stat-value-large">{pool ? pool.score : 0}</p>
        <div className="stat-trend negative">
          <i className="fas fa-arrow-down"></i> 10 since 01.01.24
        </div>
        <div className="stat-actions">
          <button className="cta-button">History</button>
        </div>
      </div>

      <div className="stat-card-wireframe fade-in">
        <div className="stat-header">
          <h3>Voting power <i className="fas fa-info-circle info-icon" title="Voting power percentage"></i></h3>
        </div>
        <p className="stat-value-large">{pool ? pool.votingPower?.toString() : 0}%</p>
        <div className="stat-trend negative">
          <i className="fas fa-arrow-down"></i> 0.01% since 01.01.24
        </div>
        <div className="stat-footer">
          <span className="proposals-info">Proposals created: {filteredProposals.filter(p => p.proposer === address).length}</span>
        </div>
      </div>

      <div className="stat-card-wireframe fade-in">
        <div className="stat-header">
          <h3>Validator stake <i className="fas fa-info-circle info-icon" title="Validator's own stake"></i></h3>
        </div>
        <p className="stat-value-large">{pool ? BigNumber(pool.ownStake).dividedBy(10**18).toFixed(4, BigNumber.ROUND_DOWN) : 0} DMD</p>
        <div className="stat-trend positive">
          <i className="fas fa-arrow-up"></i> 5 DMD since 01.01.24
        </div>
      </div>

      <div className="stat-card-wireframe fade-in">
        <div className="stat-header">
          <h3>Monthly rewards <i className="fas fa-info-circle info-icon" title=""></i></h3>
        </div>
        <p className="stat-value-large">100 DMD</p>
        <div className="stat-subtitle">Earned per 1000DMD = 5.88DMD</div>
        <div className="stat-actions">
          <button className="cta-button" id="rewards-history-button">History</button>
        </div>
      </div>

      <div className="stat-card-wireframe fade-in">
        <div className="stat-header">
          <h3>Delegated stake <i className="fas fa-info-circle info-icon" title="Total delegated stake"></i></h3>
        </div>
        <p className="stat-value-large">{pool ? BigNumber(pool.totalStake).minus(pool.ownStake).dividedBy(10**18).toFixed(4, BigNumber.ROUND_DOWN) : 0} DMD</p>
        <div className="stat-trend positive">
          <i className="fas fa-arrow-up"></i> 5 DMD since 01.01.24
        </div>
      </div>
    </div>
  </div>
</section>

<section className="delegates-section">
  <div className="container">
    <div className="section-title">
      <h2>Delegates</h2>
      <p>Users who have delegated their tokens to this validator</p>
    </div>
    <div className="delegates-table-container">
      <table className="delegates-table">
        <thead>
          {pool && pool.delegators && pool.delegators.length ? (
            <tr>
              <th>Wallet Address <i className="fas fa-sort"></i></th>
              <th>Delegated Stake <i className="fas fa-sort"></i></th>
              <th>Percentage <i className="fas fa-sort"></i></th>
              <th>Since <i className="fas fa-sort"></i></th>
            </tr>
          ) : (
            <tr>
              <th>No Delegations</th>
            </tr>
          )}
        </thead>
        <tbody>
          {pool && pool.delegators && pool.delegators.length ? 
            pool.delegators.map((delegator: any, i: number) => {
              const delegatedAmount = BigNumber(delegator.amount).dividedBy(10**18);
              const totalStake = BigNumber(pool.totalStake).dividedBy(10**18);
              const percentage = totalStake.isGreaterThan(0) ? delegatedAmount.dividedBy(totalStake).multipliedBy(100).toFixed(1) : '0';
              
              return (
                <tr key={i}>
                  <td>
                    <div className="delegate-address">
                      <div className="address-icon" style={{backgroundColor: `hsl(${(i * 137.5) % 360}, 50%, 50%)`}}></div>
                      <span>{truncateAddress(delegator.address)}</span>
                    </div>
                  </td>
                  <td>{delegatedAmount.toFixed(4, BigNumber.ROUND_DOWN)} DMD</td>
                  <td>{percentage}%</td>
                  <td>Unknown</td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={4}>No delegations found</td>
              </tr>
            )
          }
        </tbody>
      </table>
    </div>
    {pool && pool.delegators && pool.delegators.length > 10 && (
      <div className="pagination">
        <button className="pagination-btn"><i className="fas fa-chevron-left"></i></button>
        <button className="pagination-btn active">1</button>
        <button className="pagination-btn">2</button>
        <button className="pagination-btn">3</button>
        <span className="pagination-ellipsis">...</span>
        <button className="pagination-btn">5</button>
        <button className="pagination-btn"><i className="fas fa-chevron-right"></i></button>
      </div>
    )}
  </div>
</section>

<section className="dao-section">
  <div className="container">
    <div className="section-title">
      <h2>Validator DAO Participation</h2>
      <p>Governance proposals this validator has participated in</p>
    </div>
    <div className="dao-table-container">
      <table className="dao-table">
        <thead>
          {filteredProposals.length ? (
            <tr>
              <th>Date <i className="fas fa-sort"></i></th>
              <th>Proposal Name <i className="fas fa-sort"></i></th>
              <th>Proposal Type <i className="fas fa-sort"></i></th>
              <th>Vote <i className="fas fa-sort"></i></th>
              <th>Status <i className="fas fa-sort"></i></th>
              <th>Action</th>
            </tr>
          ) : (
            <tr>
              <th>No DAO Participations</th>
            </tr>
          )}
        </thead>
        <tbody>
          {filteredProposals.length ?
            filteredProposals.map((proposal, i) => (
              <tr key={i}>
                <td>{timestampToDate(proposal.timestamp)}</td>
                <td>
                  <div className="proposal-name">
                    <span>{proposal.title}</span>
                  </div>
                </td>
                <td><span className="proposal-type protocol">{proposal.proposalType || 'Protocol'}</span></td>
                <td>
                  <span className={`vote-badge ${proposal.myVote == "2" ? "vote-yes" : proposal.myVote == "1" ? "vote-no" : "vote-abstain"}`}>
                    {proposal.myVote == "2" ? "Yes" : proposal.myVote == "1" ? "No" : "Abstain"}
                  </span>
                </td>
                <td><span className="proposal-status passed">Unknown</span></td>
                <td>
                  <button onClick={() => navigateToProposal(proposal.id)} className="cta-button">
                    Details
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6}>No DAO participations found</td>
              </tr>
            )
          }
        </tbody>
      </table>
    </div>
    {filteredProposals.length > 10 && (
      <div className="pagination">
        <button className="pagination-btn"><i className="fas fa-chevron-left"></i></button>
        <button className="pagination-btn active">1</button>
        <button className="pagination-btn">2</button>
        <button className="pagination-btn"><i className="fas fa-chevron-right"></i></button>
      </div>
    )}
  </div>
</section>

{/* React Modal Components */}
{pool && (
  <>
    <StakeModal 
      isOpen={isStakeModalOpen}
      onClose={() => setIsStakeModalOpen(false)}
      pool={pool}
      buttonText="Stake"
    />
    <UnstakeModal 
      isOpen={isUnstakeModalOpen}
      onClose={() => setIsUnstakeModalOpen(false)}
      pool={pool}
      buttonText="Unstake"
    />
  </>
)}
    </div>
  );
}
