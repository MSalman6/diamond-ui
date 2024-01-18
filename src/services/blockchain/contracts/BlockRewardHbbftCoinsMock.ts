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

export type CoinsRewarded = ContractEventLog<{
  rewards: string;
  0: string;
}>;

export interface BlockRewardHbbftCoinsMock extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): BlockRewardHbbftCoinsMock;
  clone(): BlockRewardHbbftCoinsMock;
  methods: {
    REWARD_PERCENT_MULTIPLIER(): NonPayableTransactionObject<string>;

    VALIDATOR_MIN_REWARD_PERCENT(): NonPayableTransactionObject<string>;

    addToDeltaPot(): PayableTransactionObject<void>;

    addToReinsertPot(): PayableTransactionObject<void>;

    delegatorShare(
      _stakingEpoch: number | string | BN,
      _delegatorStaked: number | string | BN,
      _validatorStaked: number | string | BN,
      _totalStaked: number | string | BN,
      _poolReward: number | string | BN
    ): NonPayableTransactionObject<string>;

    deltaPot(): NonPayableTransactionObject<string>;

    deltaPotPayoutFraction(): NonPayableTransactionObject<string>;

    epochPercentage(): NonPayableTransactionObject<string>;

    epochPoolNativeReward(
      arg0: number | string | BN,
      arg1: string
    ): NonPayableTransactionObject<string>;

    epochsPoolGotRewardFor(
      _miningAddress: string
    ): NonPayableTransactionObject<string[]>;

    epochsToClaimRewardFrom(
      _poolStakingAddress: string,
      _staker: string
    ): NonPayableTransactionObject<string[]>;

    getDelegatorReward(
      _delegatorStake: number | string | BN,
      _stakingEpoch: number | string | BN,
      _poolMiningAddress: string
    ): NonPayableTransactionObject<string>;

    getValidatorReward(
      _stakingEpoch: number | string | BN,
      _poolMiningAddress: string
    ): NonPayableTransactionObject<string>;

    governancePotAddress(): NonPayableTransactionObject<string>;

    governancePotShareDenominator(): NonPayableTransactionObject<string>;

    governancePotShareNominator(): NonPayableTransactionObject<string>;

    initialize(_validatorSet: string): NonPayableTransactionObject<void>;

    isInitialized(): NonPayableTransactionObject<boolean>;

    nativeRewardUndistributed(): NonPayableTransactionObject<string>;

    reinsertPot(): NonPayableTransactionObject<string>;

    reinsertPotPayoutFraction(): NonPayableTransactionObject<string>;

    reward(_isEpochEndBlock: boolean): NonPayableTransactionObject<string>;

    sendCoins(): PayableTransactionObject<void>;

    setEpochPoolReward(
      _stakingEpoch: number | string | BN,
      _poolMiningAddress: string
    ): PayableTransactionObject<void>;

    setReinsertPotPayoutFraction(
      _value: number | string | BN
    ): NonPayableTransactionObject<void>;

    setSnapshotPoolValidatorStakeAmount(
      _stakingEpoch: number | string | BN,
      _poolMiningAddress: string,
      _amount: number | string | BN
    ): NonPayableTransactionObject<void>;

    setSystemAddress(_address: string): NonPayableTransactionObject<void>;

    setValidatorMinRewardPercent(
      _stakingEpoch: number | string | BN,
      _percent: number | string | BN
    ): NonPayableTransactionObject<void>;

    setdeltaPotPayoutFraction(
      _value: number | string | BN
    ): NonPayableTransactionObject<void>;

    snapshotPoolStakeAmounts(
      _stakingContract: string,
      _stakingEpoch: number | string | BN,
      _miningAddress: string
    ): NonPayableTransactionObject<void>;

    snapshotPoolTotalStakeAmount(
      arg0: number | string | BN,
      arg1: string
    ): NonPayableTransactionObject<string>;

    snapshotPoolValidatorStakeAmount(
      arg0: number | string | BN,
      arg1: string
    ): NonPayableTransactionObject<string>;

    transferReward(
      _nativeCoins: number | string | BN,
      _to: string
    ): NonPayableTransactionObject<void>;

    validatorMinRewardPercent(
      arg0: number | string | BN
    ): NonPayableTransactionObject<string>;

    validatorRewardPercent(
      _stakingAddress: string
    ): NonPayableTransactionObject<string>;

    validatorSetContract(): NonPayableTransactionObject<string>;

    validatorShare(
      _stakingEpoch: number | string | BN,
      _validatorStaked: number | string | BN,
      _totalStaked: number | string | BN,
      _poolReward: number | string | BN
    ): NonPayableTransactionObject<string>;
  };
  events: {
    CoinsRewarded(cb?: Callback<CoinsRewarded>): EventEmitter;
    CoinsRewarded(
      options?: EventOptions,
      cb?: Callback<CoinsRewarded>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "CoinsRewarded", cb: Callback<CoinsRewarded>): void;
  once(
    event: "CoinsRewarded",
    options: EventOptions,
    cb: Callback<CoinsRewarded>
  ): void;
}
