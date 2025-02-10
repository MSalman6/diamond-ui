import styles from "./styles.module.css";
import UserProfile from "../../../components/Profile";
import Navigation from "../../../components/Navigation";
import { useNavigate, useParams } from "react-router-dom";
import { useDaoContext } from "../../../contexts/DaoContext";
import { useWeb3Context } from "../../../contexts/Web3Context";
import React, { startTransition, useEffect, useState } from "react";
import { useStakingContext } from "../../../contexts/StakingContext";
import { Pool } from "../../../contexts/StakingContext/models/model";
import { timestampToDate, truncateAddress } from "../../../utils/common";

interface PoolDetailsProps {}

const PoolDetails: React.FC<PoolDetailsProps> = ({}) => {
  const navigate = useNavigate();
  const { poolAddress } = useParams();
  const { userWallet, web3Initialized, showLoader } = useWeb3Context();
  const { activeProposals, getMyVote, getActiveProposals } = useDaoContext();
  const { pools, stakingEpoch, claimOrderedUnstake } = useStakingContext();

  const [pool, setPool] = useState<Pool | null>(null);
  const [filteredProposals, setFilteredProposals] = useState<any[]>([]);

  useEffect(() => {
    try {
      if (!activeProposals.length && web3Initialized) {
        showLoader(true, "");
        getActiveProposals();
      }
    } catch(err) {}
  }, [web3Initialized]);

  useEffect(() => {
    const pool = pools.find((pool) => pool.stakingAddress === poolAddress);
    setPool(pool as Pool);
    filterProposals()
  }, [poolAddress, pools, userWallet.myAddr]);

  async function filterProposals() {
    const filteredProposals = await Promise.all(
      activeProposals.map(async (proposal) => {
        if (proposal.proposer === poolAddress && proposal.state == '0') {
          const myVote = await getMyVote(proposal.id);
          return { ...proposal, myVote: myVote.vote };
        } else if (proposal.state == '2') {
          const myVote = await getMyVote(proposal.id);
          if (myVote && myVote.vote != '0') {
            return { ...proposal, myVote: myVote.vote };
          }
        }
        return null;
      })
    );
  
    // Remove null values
    const proposals = filteredProposals.filter((proposal) => proposal !== null);
    setFilteredProposals(proposals || []);
  }

  return (
    <section className="section">

      <div className={styles.detailsSectionContainer + " sectionContainer"}>

      <Navigation start="/staking" />

      <UserProfile forPool={pool} viewFor="other" />

        {/* dao participation table */}
        <div className={styles.daoParticipationContainer}>
          <div className="comparison-row-main">
              <h2 className="heading-3">Validator Candidate DAO Participation</h2>
          </div>

          <table className={styles.styledTable}>
            <thead>
              {
                filteredProposals.length ? (
                  <tr>
                    <td>Date</td>
                    <td>Proposal title</td>
                    <td>Proposal type</td>
                    <td>Voting Result</td>
                    <td></td>
                  </tr>
                ) : (
                  <tr>
                    <th>No DAO Participations</th>
                  </tr>
                )
              }
            </thead>
            <tbody>
              {
                filteredProposals.map((proposal, i) => (
                  <tr key={i}>
                    <td>{timestampToDate(proposal.timestamp)}</td>
                    <td>{proposal.title}</td>
                    <td>{proposal.proposalType}</td>
                    <td>{proposal.myVote == "2" ? "Yes" : proposal.myVote == "1" ? "No" : "Not Voted"}</td>
                    <td><button onClick={() => startTransition(() => {navigate(`/dao/details/${proposal.id}`)})} className="primaryBtn">Details</button></td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PoolDetails;
