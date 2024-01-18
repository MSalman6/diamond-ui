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

export type ReportedMalicious = ContractEventLog<{
  reportingValidator: string;
  maliciousValidator: string;
  blockNumber: string;
  0: string;
  1: string;
  2: string;
}>;
export type ValidatorAvailable = ContractEventLog<{
  validator: string;
  timestamp: string;
  0: string;
  1: string;
}>;
export type ValidatorUnavailable = ContractEventLog<{
  validator: string;
  timestamp: string;
  0: string;
  1: string;
}>;

export interface ValidatorSetHbbft extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): ValidatorSetHbbft;
  clone(): ValidatorSetHbbft;
  methods: {
    announceAvailability(
      _blockNumber: number | string | BN,
      _blockhash: string | number[]
    ): NonPayableTransactionObject<void>;

    areDelegatorsBanned(
      _miningAddress: string
    ): NonPayableTransactionObject<boolean>;

    banCounter(arg0: string): NonPayableTransactionObject<string>;

    banReason(arg0: string): NonPayableTransactionObject<string>;

    bannedDelegatorsUntil(arg0: string): NonPayableTransactionObject<string>;

    bannedUntil(arg0: string): NonPayableTransactionObject<string>;

    blockRewardContract(): NonPayableTransactionObject<string>;

    canCallAnnounceAvailability(
      _miningAddress: string
    ): NonPayableTransactionObject<boolean>;

    finalizeChange(): NonPayableTransactionObject<void>;

    getCurrentTimestamp(): NonPayableTransactionObject<string>;

    getPendingValidatorKeyGenerationMode(
      _miningAddress: string
    ): NonPayableTransactionObject<string>;

    getPendingValidators(): NonPayableTransactionObject<string[]>;

    getPreviousValidators(): NonPayableTransactionObject<string[]>;

    getPublicKey(_miningAddress: string): NonPayableTransactionObject<string>;

    getStakingContract(): NonPayableTransactionObject<string>;

    getValidatorCountSweetSpot(
      _possibleValidatorCount: number | string | BN
    ): NonPayableTransactionObject<string>;

    getValidators(): NonPayableTransactionObject<string[]>;

    handleFailedKeyGeneration(): NonPayableTransactionObject<void>;

    initialize(
      _blockRewardContract: string,
      _randomContract: string,
      _stakingContract: string,
      _keyGenHistoryContract: string,
      _initialMiningAddresses: string[],
      _initialStakingAddresses: string[]
    ): NonPayableTransactionObject<void>;

    isFullHealth(): NonPayableTransactionObject<boolean>;

    isInitialized(): NonPayableTransactionObject<boolean>;

    isPendingValidator(
      _miningAddress: string
    ): NonPayableTransactionObject<boolean>;

    isReportValidatorValid(
      _miningAddress: string
    ): NonPayableTransactionObject<boolean>;

    isValidator(arg0: string): NonPayableTransactionObject<boolean>;

    isValidatorBanned(
      _miningAddress: string
    ): NonPayableTransactionObject<boolean>;

    isValidatorOrPending(
      _miningAddress: string
    ): NonPayableTransactionObject<boolean>;

    isValidatorPrevious(arg0: string): NonPayableTransactionObject<boolean>;

    keyGenHistoryContract(): NonPayableTransactionObject<string>;

    maliceReportedForBlock(
      _miningAddress: string,
      _blockNumber: number | string | BN
    ): NonPayableTransactionObject<string[]>;

    maxValidators(): NonPayableTransactionObject<string>;

    miningByStakingAddress(arg0: string): NonPayableTransactionObject<string>;

    newValidatorSet(): NonPayableTransactionObject<void>;

    notifyUnavailability(
      _stakingAddress: string
    ): NonPayableTransactionObject<void>;

    publicKeyByStakingAddress(
      _stakingAddress: string
    ): NonPayableTransactionObject<string>;

    randomContract(): NonPayableTransactionObject<string>;

    removeMaliciousValidators(
      _miningAddresses: string[]
    ): NonPayableTransactionObject<void>;

    reportMalicious(
      _maliciousMiningAddress: string,
      _blockNumber: number | string | BN,
      arg2: string | number[]
    ): NonPayableTransactionObject<void>;

    reportMaliciousCallable(
      _reportingMiningAddress: string,
      _maliciousMiningAddress: string,
      _blockNumber: number | string | BN
    ): NonPayableTransactionObject<{
      callable: boolean;
      removeReportingValidator: boolean;
      0: boolean;
      1: boolean;
    }>;

    reportingCounter(
      arg0: string,
      arg1: number | string | BN
    ): NonPayableTransactionObject<string>;

    reportingCounterTotal(
      arg0: number | string | BN
    ): NonPayableTransactionObject<string>;

    setMaxValidators(
      _maxValidators: number | string | BN
    ): NonPayableTransactionObject<void>;

    setStakingAddress(
      _miningAddress: string,
      _stakingAddress: string
    ): NonPayableTransactionObject<void>;

    setValidatorInternetAddress(
      _ip: string | number[],
      _port: string | number[]
    ): NonPayableTransactionObject<void>;

    stakingByMiningAddress(arg0: string): NonPayableTransactionObject<string>;

    stakingContract(): NonPayableTransactionObject<string>;

    validatorAvailableSince(arg0: string): NonPayableTransactionObject<string>;

    validatorCounter(arg0: string): NonPayableTransactionObject<string>;

    validatorLastSuccess(arg0: string): NonPayableTransactionObject<string>;
  };
  events: {
    ReportedMalicious(cb?: Callback<ReportedMalicious>): EventEmitter;
    ReportedMalicious(
      options?: EventOptions,
      cb?: Callback<ReportedMalicious>
    ): EventEmitter;

    ValidatorAvailable(cb?: Callback<ValidatorAvailable>): EventEmitter;
    ValidatorAvailable(
      options?: EventOptions,
      cb?: Callback<ValidatorAvailable>
    ): EventEmitter;

    ValidatorUnavailable(cb?: Callback<ValidatorUnavailable>): EventEmitter;
    ValidatorUnavailable(
      options?: EventOptions,
      cb?: Callback<ValidatorUnavailable>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "ReportedMalicious", cb: Callback<ReportedMalicious>): void;
  once(
    event: "ReportedMalicious",
    options: EventOptions,
    cb: Callback<ReportedMalicious>
  ): void;

  once(event: "ValidatorAvailable", cb: Callback<ValidatorAvailable>): void;
  once(
    event: "ValidatorAvailable",
    options: EventOptions,
    cb: Callback<ValidatorAvailable>
  ): void;

  once(event: "ValidatorUnavailable", cb: Callback<ValidatorUnavailable>): void;
  once(
    event: "ValidatorUnavailable",
    options: EventOptions,
    cb: Callback<ValidatorUnavailable>
  ): void;
}
