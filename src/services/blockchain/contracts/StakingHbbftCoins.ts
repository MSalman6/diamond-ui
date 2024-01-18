/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type BN from "bn.js";
import type { ContractOptions } from "web3-eth-contract";
import type { EventLog } from "web3-core";
import type { EventEmitter } from "events";
import type {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "../types/contracts";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export type ClaimedOrderedWithdrawal = ContractEventLog<{
  fromPoolStakingAddress: string;
  staker: string;
  stakingEpoch: string;
  amount: string;
  0: string;
  1: string;
  2: string;
  3: string;
}>;
export type ClaimedReward = ContractEventLog<{
  fromPoolStakingAddress: string;
  staker: string;
  stakingEpoch: string;
  nativeCoinsAmount: string;
  0: string;
  1: string;
  2: string;
  3: string;
}>;
export type MovedStake = ContractEventLog<{
  fromPoolStakingAddress: string;
  toPoolStakingAddress: string;
  staker: string;
  stakingEpoch: string;
  amount: string;
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
}>;
export type OrderedWithdrawal = ContractEventLog<{
  fromPoolStakingAddress: string;
  staker: string;
  stakingEpoch: string;
  amount: string;
  0: string;
  1: string;
  2: string;
  3: string;
}>;
export type PlacedStake = ContractEventLog<{
  toPoolStakingAddress: string;
  staker: string;
  stakingEpoch: string;
  amount: string;
  0: string;
  1: string;
  2: string;
  3: string;
}>;
export type WithdrewStake = ContractEventLog<{
  fromPoolStakingAddress: string;
  staker: string;
  stakingEpoch: string;
  amount: string;
  0: string;
  1: string;
  2: string;
  3: string;
}>;

export interface StakingHbbftCoins extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): StakingHbbftCoins;
  clone(): StakingHbbftCoins;
  methods: {
    MAX_CANDIDATES(): NonPayableTransactionObject<string>;

    addPool(
      _miningAddress: string,
      _publicKey: string | number[],
      _ip: string | number[]
    ): PayableTransactionObject<void>;

    areStakeAndWithdrawAllowed(): NonPayableTransactionObject<boolean>;

    candidateMinStake(): NonPayableTransactionObject<string>;

    claimOrderedWithdraw(
      _poolStakingAddress: string
    ): NonPayableTransactionObject<void>;

    claimReward(
      _stakingEpochs: (number | string | BN)[],
      _poolStakingAddress: string
    ): NonPayableTransactionObject<void>;

    currentKeyGenExtraTimeWindow(): NonPayableTransactionObject<string>;

    delegatorMinStake(): NonPayableTransactionObject<string>;

    delegatorStakeSnapshot(
      arg0: string,
      arg1: string,
      arg2: number | string | BN
    ): NonPayableTransactionObject<string>;

    getPoolInternetAddress(_poolAddress: string): NonPayableTransactionObject<{
      0: string;
      1: string;
    }>;

    getPoolPublicKey(_poolAddress: string): NonPayableTransactionObject<string>;

    getPools(): NonPayableTransactionObject<string[]>;

    getPoolsInactive(): NonPayableTransactionObject<string[]>;

    getPoolsLikelihood(): NonPayableTransactionObject<{
      likelihoods: string[];
      sum: string;
      0: string[];
      1: string;
    }>;

    getPoolsToBeElected(): NonPayableTransactionObject<string[]>;

    getPoolsToBeRemoved(): NonPayableTransactionObject<string[]>;

    getRewardAmount(
      _stakingEpochs: (number | string | BN)[],
      _poolStakingAddress: string,
      _staker: string
    ): NonPayableTransactionObject<string>;

    incrementStakingEpoch(): NonPayableTransactionObject<void>;

    initialize(
      stakingParams: [
        string,
        string[],
        number | string | BN,
        number | string | BN,
        number | string | BN,
        number | string | BN,
        number | string | BN,
        number | string | BN
      ],
      _publicKeys: (string | number[])[],
      _internetAddresses: (string | number[])[]
    ): NonPayableTransactionObject<void>;

    isInitialized(): NonPayableTransactionObject<boolean>;

    isPoolActive(_stakingAddress: string): NonPayableTransactionObject<boolean>;

    maxStakeAmount(): NonPayableTransactionObject<string>;

    maxWithdrawAllowed(
      _poolStakingAddress: string,
      _staker: string
    ): NonPayableTransactionObject<string>;

    maxWithdrawOrderAllowed(
      _poolStakingAddress: string,
      _staker: string
    ): NonPayableTransactionObject<string>;

    moveStake(
      _fromPoolStakingAddress: string,
      _toPoolStakingAddress: string,
      _amount: number | string | BN
    ): NonPayableTransactionObject<void>;

    notifyAvailability(
      _stakingAddress: string
    ): NonPayableTransactionObject<void>;

    notifyKeyGenFailed(): NonPayableTransactionObject<void>;

    notifyNetworkOfftimeDetected(
      detectedOfflineTime: number | string | BN
    ): NonPayableTransactionObject<void>;

    orderWithdraw(
      _poolStakingAddress: string,
      _amount: number | string | BN
    ): NonPayableTransactionObject<void>;

    orderWithdrawEpoch(
      arg0: string,
      arg1: string
    ): NonPayableTransactionObject<string>;

    orderedWithdrawAmount(
      arg0: string,
      arg1: string
    ): NonPayableTransactionObject<string>;

    orderedWithdrawAmountTotal(
      arg0: string
    ): NonPayableTransactionObject<string>;

    poolDelegatorInactiveIndex(
      arg0: string,
      arg1: string
    ): NonPayableTransactionObject<string>;

    poolDelegatorIndex(
      arg0: string,
      arg1: string
    ): NonPayableTransactionObject<string>;

    poolDelegators(
      _poolStakingAddress: string
    ): NonPayableTransactionObject<string[]>;

    poolDelegatorsInactive(
      _poolStakingAddress: string
    ): NonPayableTransactionObject<string[]>;

    poolInactiveIndex(arg0: string): NonPayableTransactionObject<string>;

    poolIndex(arg0: string): NonPayableTransactionObject<string>;

    poolInfo(arg0: string): NonPayableTransactionObject<{
      publicKey: string;
      internetAddress: string;
      port: string;
      0: string;
      1: string;
      2: string;
    }>;

    poolToBeElectedIndex(arg0: string): NonPayableTransactionObject<string>;

    poolToBeRemovedIndex(arg0: string): NonPayableTransactionObject<string>;

    removeMyPool(): NonPayableTransactionObject<void>;

    removePool(_stakingAddress: string): NonPayableTransactionObject<void>;

    removePools(): NonPayableTransactionObject<void>;

    rewardWasTaken(
      arg0: string,
      arg1: string,
      arg2: number | string | BN
    ): NonPayableTransactionObject<boolean>;

    setCandidateMinStake(
      _minStake: number | string | BN
    ): NonPayableTransactionObject<void>;

    setDelegatorMinStake(
      _minStake: number | string | BN
    ): NonPayableTransactionObject<void>;

    setPoolInfo(
      _publicKey: string | number[],
      _ip: string | number[],
      _port: string | number[]
    ): NonPayableTransactionObject<void>;

    setStakingEpochStartTime(
      _timestamp: number | string | BN
    ): NonPayableTransactionObject<void>;

    setValidatorInternetAddress(
      _validatorAddress: string,
      _ip: string | number[],
      _port: string | number[]
    ): NonPayableTransactionObject<void>;

    stake(_toPoolStakingAddress: string): PayableTransactionObject<void>;

    stakeAmount(
      arg0: string,
      arg1: string
    ): NonPayableTransactionObject<string>;

    stakeAmountByCurrentEpoch(
      _poolStakingAddress: string,
      _staker: string
    ): NonPayableTransactionObject<string>;

    stakeAmountTotal(arg0: string): NonPayableTransactionObject<string>;

    stakeFirstEpoch(
      arg0: string,
      arg1: string
    ): NonPayableTransactionObject<string>;

    stakeLastEpoch(
      arg0: string,
      arg1: string
    ): NonPayableTransactionObject<string>;

    stakingEpoch(): NonPayableTransactionObject<string>;

    stakingEpochStartBlock(): NonPayableTransactionObject<string>;

    stakingEpochStartTime(): NonPayableTransactionObject<string>;

    stakingFixedEpochDuration(): NonPayableTransactionObject<string>;

    stakingFixedEpochEndTime(): NonPayableTransactionObject<string>;

    stakingTransitionTimeframeLength(): NonPayableTransactionObject<string>;

    stakingWithdrawDisallowPeriod(): NonPayableTransactionObject<string>;

    startTimeOfNextPhaseTransition(): NonPayableTransactionObject<string>;

    validatorSetContract(): NonPayableTransactionObject<string>;

    withdraw(
      _fromPoolStakingAddress: string,
      _amount: number | string | BN
    ): NonPayableTransactionObject<void>;
  };
  events: {
    ClaimedOrderedWithdrawal(
      cb?: Callback<ClaimedOrderedWithdrawal>
    ): EventEmitter;
    ClaimedOrderedWithdrawal(
      options?: EventOptions,
      cb?: Callback<ClaimedOrderedWithdrawal>
    ): EventEmitter;

    ClaimedReward(cb?: Callback<ClaimedReward>): EventEmitter;
    ClaimedReward(
      options?: EventOptions,
      cb?: Callback<ClaimedReward>
    ): EventEmitter;

    MovedStake(cb?: Callback<MovedStake>): EventEmitter;
    MovedStake(options?: EventOptions, cb?: Callback<MovedStake>): EventEmitter;

    OrderedWithdrawal(cb?: Callback<OrderedWithdrawal>): EventEmitter;
    OrderedWithdrawal(
      options?: EventOptions,
      cb?: Callback<OrderedWithdrawal>
    ): EventEmitter;

    PlacedStake(cb?: Callback<PlacedStake>): EventEmitter;
    PlacedStake(
      options?: EventOptions,
      cb?: Callback<PlacedStake>
    ): EventEmitter;

    WithdrewStake(cb?: Callback<WithdrewStake>): EventEmitter;
    WithdrewStake(
      options?: EventOptions,
      cb?: Callback<WithdrewStake>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(
    event: "ClaimedOrderedWithdrawal",
    cb: Callback<ClaimedOrderedWithdrawal>
  ): void;
  once(
    event: "ClaimedOrderedWithdrawal",
    options: EventOptions,
    cb: Callback<ClaimedOrderedWithdrawal>
  ): void;

  once(event: "ClaimedReward", cb: Callback<ClaimedReward>): void;
  once(
    event: "ClaimedReward",
    options: EventOptions,
    cb: Callback<ClaimedReward>
  ): void;

  once(event: "MovedStake", cb: Callback<MovedStake>): void;
  once(
    event: "MovedStake",
    options: EventOptions,
    cb: Callback<MovedStake>
  ): void;

  once(event: "OrderedWithdrawal", cb: Callback<OrderedWithdrawal>): void;
  once(
    event: "OrderedWithdrawal",
    options: EventOptions,
    cb: Callback<OrderedWithdrawal>
  ): void;

  once(event: "PlacedStake", cb: Callback<PlacedStake>): void;
  once(
    event: "PlacedStake",
    options: EventOptions,
    cb: Callback<PlacedStake>
  ): void;

  once(event: "WithdrewStake", cb: Callback<WithdrewStake>): void;
  once(
    event: "WithdrewStake",
    options: EventOptions,
    cb: Callback<WithdrewStake>
  ): void;
}
