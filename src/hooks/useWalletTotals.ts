'use client';

import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { useWeb3Context } from '@/contexts/Web3';
import { useStakingContext } from '@/contexts/Staking';
import { useIsPrivacyMode } from '@/contexts/PrivacyMode';
import type { Pool } from '@/contexts/types/models';

const ZERO = new BigNumber(0);

export interface WalletTotals {
  liquidWei: BigNumber;          // spendable native balance held on the address
  ownStakeWei: BigNumber;        // stake in the pool whose stakingAddress is the connected address
  delegatedWei: BigNumber;       // stake in every other pool
  stakedWei: BigNumber;          // ownStakeWei + delegatedWei
  totalWei: BigNumber;           // liquidWei + stakedWei
  pendingWithdrawWei: BigNumber; // ordered withdrawals, which sit in neither bucket above
  isLoading: boolean;
  isHidden: boolean;
  isConnected: boolean;
}

const EMPTY = {
  liquidWei: ZERO,
  ownStakeWei: ZERO,
  delegatedWei: ZERO,
  stakedWei: ZERO,
  totalWei: ZERO,
  pendingWithdrawWei: ZERO,
  isLoading: false,
  isConnected: false,
};

/**
 * Everything the connected address controls, split into the buckets the chain keeps it in.
 *
 * The totals are derived from `pools` rather than read from the staking context's
 * `myTotalStake`, because that value is assigned inside a `setPools` updater callback and can
 * therefore be counted twice under StrictMode. Deriving here also yields the own/delegated
 * split in the same pass.
 *
 * Ordered withdrawals are reported separately and never folded into `stakedWei`: `orderWithdraw`
 * moves coins out of `stakeAmount` on-chain, and they only reach the address once claimed.
 */
export function useWalletTotals(): WalletTotals {
  const { userWallet } = useWeb3Context();
  const { pools, isSyncingPools, stakesSyncedFor } = useStakingContext();
  const isHidden = useIsPrivacyMode();

  const myAddr = userWallet?.myAddr ?? '';
  const myBalance = userWallet?.myBalance;

  return useMemo<WalletTotals>(() => {
    if (!myAddr) return { ...EMPTY, isHidden };

    const lowerAddr = myAddr.toLowerCase();
    const liquidWei = new BigNumber(myBalance ?? 0);

    let ownStakeWei = ZERO;
    let delegatedWei = ZERO;
    let pendingWithdrawWei = ZERO;

    for (const pool of pools as Pool[]) {
      const myStake = new BigNumber(pool.myStake ?? 0);

      if (myStake.isGreaterThan(0)) {
        if (pool.stakingAddress?.toLowerCase() === lowerAddr) {
          ownStakeWei = ownStakeWei.plus(myStake);
        } else {
          delegatedWei = delegatedWei.plus(myStake);
        }
      }

      pendingWithdrawWei = pendingWithdrawWei.plus(new BigNumber(pool.orderedWithdrawAmount ?? 0));
    }

    const stakedWei = ownStakeWei.plus(delegatedWei);

    return {
      liquidWei,
      ownStakeWei,
      delegatedWei,
      stakedWei,
      totalWei: liquidWei.plus(stakedWei),
      pendingWithdrawWei,
      isLoading: isSyncingPools || stakesSyncedFor !== myAddr,
      isHidden,
      isConnected: true,
    };
  }, [myAddr, myBalance, pools, isSyncingPools, stakesSyncedFor, isHidden]);
}
