'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useDaoContext } from '@/contexts/DAO';
import { useWeb3Context } from '@/contexts/Web3';
import { useStakingContext } from '@/contexts/Staking';

const STORAGE_KEY = 'dmd_dao_voting_phase_notice_seen';

function readSeenMap(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeSeenMap(map: Record<string, string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

// Renders nothing; toasts a validator owner's votable-proposal count once per
// daoPhaseCount (dismissal tracked per wallet in localStorage).
export default function DaoVotingPhaseNotice() {
  const { daoPhase, daoPhaseCount, activeProposals, getMyVote } = useDaoContext();
  const { userWallet } = useWeb3Context();
  const { myPool } = useStakingContext();
  const myAddr = userWallet?.myAddr;
  const isValidatorOwner = Boolean(myPool);

  const [votedByMe, setVotedByMe] = useState<Record<string, boolean>>({});
  const shownForKeyRef = useRef<string | null>(null);

  useEffect(() => {
    setVotedByMe({});
    shownForKeyRef.current = null;
  }, [myAddr]);

  const isVotingPhase = Boolean(daoPhase?.phase) && daoPhase.phase !== '0';
  const votableProposals = useMemo(
    () => (isVotingPhase ? activeProposals.filter((p) => p.state === '2') : []),
    [isVotingPhase, activeProposals]
  );

  useEffect(() => {
    if (!myAddr || !isValidatorOwner || !isVotingPhase || votableProposals.length === 0) return;
    let cancelled = false;

    (async () => {
      const idsToFetch = votableProposals
        .map((p) => String(p.id))
        .filter((id) => votedByMe[id] === undefined);
      if (!idsToFetch.length) return;

      const results = await Promise.all(
        idsToFetch.map(async (id) => {
          try {
            const vote = await getMyVote(id, myAddr);
            return Number(vote?.timestamp) > 0;
          } catch {
            return false;
          }
        })
      );

      if (!cancelled) {
        setVotedByMe((prev) => {
          const next = { ...prev };
          idsToFetch.forEach((id, idx) => { next[id] = results[idx]; });
          return next;
        });
      }
    })();

    return () => { cancelled = true; };
  }, [myAddr, isValidatorOwner, isVotingPhase, votableProposals, votedByMe, getMyVote]);

  useEffect(() => {
    if (!myAddr || !isValidatorOwner || !isVotingPhase || !daoPhaseCount || votableProposals.length === 0) return;

    const allResolved = votableProposals.every((p) => votedByMe[String(p.id)] !== undefined);
    if (!allResolved) return;

    if (shownForKeyRef.current === daoPhaseCount) return;

    const seenMap = readSeenMap();
    const addrKey = myAddr.toLowerCase();
    if (seenMap[addrKey] === daoPhaseCount) {
      shownForKeyRef.current = daoPhaseCount;
      return;
    }

    const votableCount = votableProposals.filter((p) => !votedByMe[String(p.id)]).length;
    shownForKeyRef.current = daoPhaseCount;
    seenMap[addrKey] = daoPhaseCount;
    writeSeenMap(seenMap);

    if (votableCount > 0) {
      toast.info(
        `New DAO voting phase started — ${votableCount} proposal${votableCount === 1 ? '' : 's'} you can vote on.`,
        { autoClose: false }
      );
    }
  }, [myAddr, isValidatorOwner, isVotingPhase, daoPhaseCount, votableProposals, votedByMe]);

  return null;
}
