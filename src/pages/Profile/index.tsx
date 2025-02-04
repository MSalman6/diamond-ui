import React from "react";
import copy from "copy-to-clipboard";
import BigNumber from "bignumber.js";
import { toast } from "react-toastify";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import Tooltip from "../../components/Tooltip";
import { truncateAddress } from "../../utils/common";
import { useWeb3Context } from "../../contexts/Web3Context";
import Jazzicon, { jsNumberForAddress } from "react-jazzicon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStakingContext } from "../../contexts/StakingContext";
import { faArrowDownLong, faArrowUpLong } from "@fortawesome/free-solid-svg-icons";

interface UserProfileProps {}

const UserProfile: React.FC<UserProfileProps> = ({ }) => {
  const navigate = useNavigate();
  const { userWallet } = useWeb3Context();

  const {
    pools,
    myPool,
  } = useStakingContext();

  const copyData = (data: string) => {
    copy(data);
    toast.success("Copied to clipboard");
  };

  return (
    <section className={styles.heroSection + " hero-section"}>
      <div className="hero-container">

        <div className={styles.infoContainer}>
          {
            userWallet.myAddr ? <Jazzicon diameter={60} seed={jsNumberForAddress(userWallet.myAddr)} />
              : <Jazzicon diameter={60} seed={Math.round(Math.random() * 10000000)} />
          }
          <div>
            <p>User</p>
            <p onClick={() => copyData(userWallet.myAddr)}>{truncateAddress(userWallet.myAddr)}</p>
          </div>
          {
            myPool && (
              <p className={myPool?.isActive || (myPool?.isToBeElected || myPool?.isPendingValidator) ? styles.poolActive : styles.poolBanned}>
                {myPool?.isActive ? "Active" : (myPool?.isToBeElected || myPool?.isPendingValidator) ? "Valid" : "Invalid"}
              </p>
            )
          }
        </div>

        <div className={styles.boxContainer}>
          <div className={`${styles.block} ${styles.blockLarge}`}>
            <p className={styles.boxHeading}>Pool Stake <Tooltip text="" /></p>
            <p className={styles.boxDescriptionBig}>1000 DMD</p>
            <p className={styles.boxDescriptionSmall}>
              <FontAwesomeIcon className={styles.arrowGreen} icon={faArrowUpLong} />
              5 DMD since 01.01.24
            </p>
            <div className={styles.boxBtns}>
              <div>
                <button className="primaryBtn">Stake</button>
                <button className="primaryBtn">Unstake</button>
              </div>
              <button className="primaryBtn">History</button>
              <button className="primaryBtn">Remove pool</button>
            </div>
          </div>
          <div className={styles.block}>
            <p className={styles.boxHeading}>Score <Tooltip text="" /></p>
            <p className={styles.boxDescriptionBig}>921</p>
            <p className={styles.boxDescriptionSmall}>
              <FontAwesomeIcon className={styles.arrowRed} icon={faArrowDownLong} />
              10 since 01.01.24
            </p>
            <div className={styles.boxBtns}>
              <button className="primaryBtn">History</button>
            </div>
          </div>
          <div className={styles.block}>
            <p className={styles.boxHeading}>Voting Power</p>
            <p className={styles.boxDescriptionBig}>12%</p>
            <p className={styles.boxDescriptionSmall}>
              <FontAwesomeIcon className={styles.arrowRed} icon={faArrowDownLong} />
              0.01% since 01.01.24
            </p>
            <p className={styles.boxDescriptionSmallBold}>
              Proposals created in the current Dao Phase: 10
            </p>
          </div>
          <div className={styles.block}>
            <p className={styles.boxHeading}>Monthly rewards <Tooltip text="" /></p>
            <p className={styles.boxDescriptionBig}>100 DMD</p>
            <p className={styles.boxDescriptionSmall}>
              Earned per 1000 DMD = 5.88 DMD
            </p>
            <div className={styles.boxBtns}>
              <button className="primaryBtn">History</button>
            </div>
          </div>
          <div className={styles.block}>
            <p className={styles.boxHeading}>Node operator shared reward</p>
            <p className={styles.boxDescriptionBig}>9%</p>
            <p className={styles.boxDescriptionSmall}>
              0x9515...62F94
            </p>
            <div className={styles.boxBtns}>
              <button className="primaryBtn">Edit</button>
            </div>
          </div>
          <div className={styles.block}>
            <p className={styles.boxHeading}>My Total Stake</p>
            <p className={styles.boxDescriptionBig}>17000 DMD</p>
            <p className={styles.boxDescriptionSmall}>
              <FontAwesomeIcon className={styles.arrowGreen} icon={faArrowUpLong} />
              5 DMD since 01.01.24
            </p>
          </div>
          <div className={styles.block}>
            <p className={styles.boxHeading}>Stake on other pools</p>
            <p className={styles.boxDescriptionBig}>7000 DMD</p>
            <p className={styles.boxDescriptionSmall}>
              <FontAwesomeIcon className={styles.arrowGreen} icon={faArrowUpLong} />
              5 DMD since 01.01.24
            </p>
          </div>
          <div className={styles.block}>
            <p className={styles.boxHeading}>Delegated stake</p>
            <p className={styles.boxDescriptionBig}>100 DMD</p>
            <p className={styles.boxDescriptionSmall}>
              <FontAwesomeIcon className={styles.arrowGreen} icon={faArrowUpLong} />
              5 DMD since 01.01.24
            </p>
          </div>
        </div>
      </div>

         <div className={styles.heroContainer + " hero-container"}>
             {myPool && (
                <>
                    <div className="comparison-row-main">
                        <h2 className="heading-3">Delegates</h2>
                    </div>
                    <table className={styles.styledTable}>
                        {
                        (() => {
                                return (
                                    myPool && myPool.delegators.length ? (
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
                                                myPool && myPool.delegators.length ? myPool.delegators.map((delegator, i) => (
                                                <tr key={i} className={styles.tableBodyRow}>
                                                    <td>
                                                        <Jazzicon diameter={40} seed={jsNumberForAddress(delegator.address)} />
                                                    </td>
                                                    <td>{delegator.address}</td>
                                                    <td>{BigNumber(delegator.amount).dividedBy(10**18).toFixed(4, BigNumber.ROUND_DOWN)} DMD</td>
                                                </tr>
                                                )) : myPool && (
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
                </>
            ) }
        </div>

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
                                                        <tr key={i} onClick={() => navigate(`/staking/details/${pool.stakingAddress}`)} className={styles.tableBodyRow}>
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
    </section>
  );
};

export default UserProfile;
