import copy from "copy-to-clipboard";
import BigNumber from "bignumber.js";
import { toast } from "react-toastify";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import Tooltip from "../../components/Tooltip";
import { truncateAddress } from "../../utils/common";
import React, { startTransition, useEffect } from "react";
import { useWeb3Context } from "../../contexts/Web3Context";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStakingContext } from "../../contexts/StakingContext";

import StakeModal from "../Modals/StakeModal";
import UnstakeModal from "../Modals/UnstakeModal";
import { useDaoContext } from "../../contexts/DaoContext";
import { Proposal } from "../../contexts/DaoContext/types";
import RemoveValidatorModal from "../Modals/RemoveValidatorModal";
import CreateValidatorModal from "../Modals/CreateValidatorModal";
import { Pool } from "../../contexts/StakingContext/models/model";
import UpdatePoolOperatorModal from "../Modals/UpdatePoolOperator";
import { faArrowDownLong, faArrowUpLong } from "@fortawesome/free-solid-svg-icons";

interface UserProfileProps {
  forPool?: Pool | null;
  viewFor: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ forPool, viewFor }) => {
  const navigate = useNavigate();
  const { userWallet } = useWeb3Context();
  const { activeProposals, getMyVote, getActiveProposals } = useDaoContext();

  const {
    pools,
    myPool,
    stakingEpoch,
    myTotalStake,
    myCandidateStake,

    claimOrderedUnstake
  } = useStakingContext();

  const [pool, setPool] = React.useState<Pool | null>(forPool || myPool || null);

  useEffect(() => {
    setPool(forPool || myPool || null);
  }, [forPool, myPool]);

  const copyData = (data: string) => {
    copy(data);
    toast.success("Copied to clipboard");
  };

  const navigateToStakedValidators = () => {
    startTransition(() => {
      navigate('/staking', { state: { filter: 'stakedOn' } });
    });
  };

  const getTotalProposalsCreated = () => {
    let storedProposals: Proposal[] = [];
    const storedProposalsString = localStorage.getItem('allDaoProposals');
    if (storedProposalsString) {
      storedProposals = JSON.parse(storedProposalsString);
    }

    return storedProposals.reduce((acc, proposal) => {
      if (proposal.proposer === pool?.stakingAddress) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }

  return (
    <section className={styles.heroSection + (viewFor == "profile" ? " hero-section" : "")}>
      <div className="hero-container">

        <div className={styles.infoContainer}>
          <Jazzicon diameter={60} seed={jsNumberForAddress(pool ? pool?.stakingAddress : userWallet.myAddr)} />
          <div>
            <span onClick={() => copyData(pool?.stakingAddress ?? userWallet.myAddr)} className={styles.profileAddr}>{truncateAddress(pool ? pool?.stakingAddress : userWallet.myAddr)}</span>
          </div>
          {
            pool && (
              <span className={pool?.isActive || (pool?.isToBeElected || pool?.isPendingValidator) ? styles.poolActive : styles.poolBanned}>
                {pool?.isActive ? "Active" : (pool?.isToBeElected || pool?.isPendingValidator) ? "Valid" : "Invalid"}
              </span>
            )
          }
        </div>

        <div className={styles.boxContainer}>
          {
            pool && (
              <div className={`${styles.block} ${viewFor === "profile" ? styles.blockLarge : ""}`}>
                <p className={styles.boxHeading}>Pool Stake <Tooltip text="" /></p>
                <p className={styles.boxDescriptionBig}>{BigNumber(pool.totalStake).dividedBy(10**18).toFixed(4, BigNumber.ROUND_DOWN)} DMD</p>
                <p className={styles.boxDescriptionSmall}>
                  <FontAwesomeIcon className={styles.arrowGreen} icon={faArrowUpLong} />
                  5 DMD since 01.01.24
                </p>
                <div className={styles.boxBtns}>
                  <div>
                    <StakeModal buttonText="Stake" pool={pool} />
                    {
                        pool && BigNumber(pool.orderedWithdrawAmount).isGreaterThan(0) && BigNumber(pool.orderedWithdrawUnlockEpoch).isLessThanOrEqualTo(stakingEpoch) && userWallet.myAddr ? (
                          <button className="primaryBtn" onClick={() => claimOrderedUnstake(pool)}>Claim</button> ) : (
                          <UnstakeModal buttonText="Unstake" pool={pool} />
                        )
                    }
                    
                  </div>
                  {
                    viewFor === "profile" && (
                      <>
                        <button onClick={() => toast.info("Coming soon!")} className="primaryBtn">History</button>
                        {
                          !pool.isActive && <RemoveValidatorModal buttonText="Remove pool" pool={pool} />
                        }
                      </>
                    )
                  }
                  
                </div>
              </div>
            )
          }
          
          {
            pool && (
              <>
                <div className={styles.block}>
                  <p className={styles.boxHeading}>Score <Tooltip text="" /></p>
                  <p className={styles.boxDescriptionBig}>{pool.score}</p>
                  <p className={styles.boxDescriptionSmall}>
                    <FontAwesomeIcon className={styles.arrowRed} icon={faArrowDownLong} />
                    10 since 01.01.24
                  </p>
                  <div className={styles.boxBtns}>
                    <button onClick={() => toast.info("Coming soon!")} className="primaryBtn">History</button>
                  </div>
                </div>
      
                <div className={styles.block}>
                  <p className={styles.boxHeading}>Voting Power</p>
                  <p className={styles.boxDescriptionBig}>{pool.votingPower.toString()} %</p>
                  <p className={styles.boxDescriptionSmall}>
                    <FontAwesomeIcon className={styles.arrowRed} icon={faArrowDownLong} />
                    0.01% since 01.01.24
                  </p>
                  <p className={styles.boxDescriptionSmallBold}>
                    Proposals created in the current Dao Phase: 10
                  </p>
                </div>
              </>
            )
          }

          {
            viewFor !== "profile" && (
              <div className={styles.block}>
                <p className={styles.boxHeading}>Validator Stake</p>
                <p className={styles.boxDescriptionBig}>10005 DMD</p>
                <p className={styles.boxDescriptionSmall}>
                  <FontAwesomeIcon className={styles.arrowGreen} icon={faArrowUpLong} />
                  5 DMD since 01.01.24
                </p>
              </div>
            )
          }

          {
            viewFor === "profile" && !pool && (
              <div className={styles.block}>
                <p className={styles.boxHeading}>Stake on other pools</p>
                <p className={styles.boxDescriptionBig}>{myCandidateStake.dividedBy(10**18).toFixed(4, BigNumber.ROUND_DOWN)} DMD</p>
                <p className={styles.boxDescriptionSmall}>
                  <FontAwesomeIcon className={styles.arrowGreen} icon={faArrowUpLong} />
                  5 DMD since 01.01.24
                </p>
                <div className={styles.boxBtns}>
                  <div>
                    <button onClick={() => startTransition(() => {navigate('/staking')})} className="primaryBtn">Stake</button>
                    <button onClick={navigateToStakedValidators} className="primaryBtn">Unstake</button>
                  </div>
                  {
                    viewFor === "profile" && (
                      <>
                        <button onClick={() => toast.info("Coming soon!")} className="primaryBtn">History</button>
                        <CreateValidatorModal buttonText="Create pool" />
                      </>
                    )
                  }
                  
                </div>
              </div>
            )
          }

          <div className={styles.block}>
            <p className={styles.boxHeading}>Monthly rewards <Tooltip text="" /></p>
            <p className={styles.boxDescriptionBig}>100 DMD</p>
            <p className={styles.boxDescriptionSmall}>
              Earned per 1000 DMD = 5.88 DMD
            </p>
            <div className={styles.boxBtns}>
              <button onClick={() => toast.info("Coming soon!")} className="primaryBtn">History</button>
            </div>
          </div>

          {
            pool && viewFor === "profile" && (
              <div className={styles.block}>
                <p className={styles.boxHeading}>Node operator shared reward</p>
                <p className={styles.boxDescriptionBig}>
                  {pool.poolOperatorShare && BigNumber(pool.poolOperatorShare).dividedBy(100).toString()} %
                </p>
                <p className={styles.boxDescriptionSmall}>
                  {truncateAddress(pool.poolOperator)}
                </p>
                <div className={styles.boxBtns}>
                  <UpdatePoolOperatorModal buttonText="Edit" pool={pool} />
                </div>
              </div>
            )
          }

          {
            pool && viewFor === "profile" && (
              <div className={styles.block}>
                <p className={styles.boxHeading}>My Total Stake</p>
                <p className={styles.boxDescriptionBig}>{myTotalStake.dividedBy(10**18).toFixed(4, BigNumber.ROUND_DOWN)} DMD</p>
                <p className={styles.boxDescriptionSmall}>
                  <FontAwesomeIcon className={styles.arrowGreen} icon={faArrowUpLong} />
                  5 DMD since 01.01.24
                </p>
              </div>
            )
          }

          {
            viewFor === "profile" && pool && (
              <div className={styles.block}>
                <p className={styles.boxHeading}>Stake on other pools</p>
                <p className={styles.boxDescriptionBig}>{myCandidateStake.dividedBy(10**18).toFixed(4, BigNumber.ROUND_DOWN)} DMD</p>
                <p className={styles.boxDescriptionSmall}>
                  <FontAwesomeIcon className={styles.arrowGreen} icon={faArrowUpLong} />
                  5 DMD since 01.01.24
                </p>
              </div>
            )
          }

          {
            pool && (
              <div className={styles.block}>
                <p className={styles.boxHeading}>Delegated stake</p>
                <p className={styles.boxDescriptionBig}>
                  {pool.delegators.reduce((acc, curr) => BigNumber(acc).plus(curr.amount), new BigNumber(0))
                    .dividedBy(10**18)
                    .toFixed(4, BigNumber.ROUND_DOWN)} DMD
                </p>
                <p className={styles.boxDescriptionSmall}>
                  <FontAwesomeIcon className={styles.arrowGreen} icon={faArrowUpLong} />
                  5 DMD since 01.01.24
                </p>
              </div>
            )
          }

          {
            viewFor == "profile" && !pool && (
              <div className={styles.block}>
                <p className={styles.boxHeading}>DAO participation</p>
                <p className={styles.boxDescriptionBig}>{getTotalProposalsCreated()} proposals created</p>
                <p className={styles.boxDescriptionSmall}>
                  Total voting power of the validators I've staked on: 1.33%
                </p>
                <div className={styles.boxBtns}>
                  <button className="primaryBtn" onClick={() => { startTransition(() => { navigate('/dao') }) }}>Go to DAO</button>
                </div>
              </div>
            )
          }
        </div>
      </div>

         <div className={styles.heroContainer + " hero-container"}>
             {pool && (
                <>
                    <div className="comparison-row-main">
                        <h2 className="heading-3">Delegates</h2>
                    </div>
                    <div className={styles.tableContainer}>
                      <table className={styles.styledTable}>
                          {
                          (() => {
                                  return (
                                      pool && pool.delegators.length ? (
                                          <>
                                              <thead>
                                                  <tr>
                                                      <td></td>
                                                      <td>Wallet</td>
                                                      <td>Delegated Stake</td>
                                                  </tr>
                                              </thead>
                                              <tbody>
                                              {
                                                  pool && pool.delegators.length ? pool.delegators.map((delegator, i) => (
                                                  <tr key={i} className={styles.tableBodyRow}>
                                                      <td>
                                                          <Jazzicon diameter={40} seed={jsNumberForAddress(delegator.address)} />
                                                      </td>
                                                      <td>{delegator.address}</td>
                                                      <td>{BigNumber(delegator.amount).dividedBy(10**18).toFixed(4, BigNumber.ROUND_DOWN)} DMD</td>
                                                  </tr>
                                                  )) : pool && (
                                                      <tr>
                                                      </tr>
                                                  )
                                              }
                                              </tbody>
                                          </>
                                      ) : (
                                          <thead>
                                              <tr>
                                                  <th>No Delegations</th>
                                              </tr>
                                          </thead>
                                      )
                                  )
                              })()
                          }
                      </table>
                    </div>
                </>
            ) }
        </div>

        { 
          viewFor === "profile" && (
            <div className={styles.heroContainer + " hero-container"}>
              <div className={styles.topValidatorsContainer}>
                  <div className="comparison-row-main">
                      <h3 className="heading-3">Validators I've Staked On</h3>
                  </div>
                  <div className={styles.tableContainer}>
                      <table className={styles.styledTable}>
                          {
                            (() => {
                                const hasStakedOnValidators = pools.filter((p) => BigNumber(p.myStake).isGreaterThan(0)).slice(0, 5);
                                return hasStakedOnValidators.length ? (
                                    <>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Wallet</th>
                                                <th>Total Stake</th>
                                                <th>My Stake</th>
                                                <th>Voting Power</th>
                                                <th>Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                pools
                                                    .filter((p) => BigNumber(p.myStake).isGreaterThan(0))  // Sort pools by totalStake in descending order
                                                    .slice(0, 5)  // Get the top 5 pools
                                                    .map((pool, i) => (
                                                        <tr key={i} onClick={() => startTransition(() => { navigate(`/staking/details/${pool.stakingAddress}`); })} className={styles.tableBodyRow}>
                                                          <td>
                                                              <Jazzicon diameter={40} seed={jsNumberForAddress(pool.stakingAddress)} />
                                                          </td>
                                                          <td>{pool.stakingAddress}</td>
                                                          <td>{BigNumber(pool.totalStake).dividedBy(10**18).toFixed(4, BigNumber.ROUND_DOWN)} DMD</td>
                                                          <td>{userWallet.myAddr && BigNumber(pool.myStake) ? BigNumber(pool.myStake).dividedBy(10**18).toFixed(4, BigNumber.ROUND_DOWN) : (<div className={styles.loader}></div>) } DMD</td>
                                                          <td>{pool.votingPower.toString()}%</td>
                                                          <td>{pool.score}</td>
                                                        </tr>
                                                    ))
                                            }
                                        </tbody>
                                    </>
                                ) : (
                                    <thead>
                                        <tr>
                                            <th>No stakes</th>
                                        </tr>
                                    </thead>
                                );
                            })()
                        }
                    </table>
                </div>
              </div>
            </div>
          )
        }
    </section>
  );
};

export default UserProfile;
