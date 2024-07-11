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
} from "./types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export type Initialized = ContractEventLog<{
  version: string;
  0: string;
}>;
export type OwnershipTransferred = ContractEventLog<{
  previousOwner: string;
  newOwner: string;
  0: string;
  1: string;
}>;
export type ReportedMalicious = ContractEventLog<{
  reportingValidator: string;
  maliciousValidator: string;
  blockNumber: string;
  0: string;
  1: string;
  2: string;
}>;
export type SetBanDuration = ContractEventLog<{
  _value: string;
  0: string;
}>;
export type SetMaxValidators = ContractEventLog<{
  _count: string;
  0: string;
}>;
export type SetValidatorInactivityThreshold = ContractEventLog<{
  _value: string;
  0: string;
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

export interface ValidatorSetHbbftMock extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): ValidatorSetHbbftMock;
  clone(): ValidatorSetHbbftMock;
  methods: {
    announceAvailability(
      _blockNumber: number | string | BN,
      _blockhash: string | number[]
    ): NonPayableTransactionObject<void>;

    areDelegatorsBanned(
      _miningAddress: string
    ): NonPayableTransactionObject<boolean>;

    banCounter(arg0: string): NonPayableTransactionObject<string>;

    banDuration(): NonPayableTransactionObject<string>;

    banReason(arg0: string): NonPayableTransactionObject<string>;

    bannedDelegatorsUntil(arg0: string): NonPayableTransactionObject<string>;

    bannedUntil(arg0: string): NonPayableTransactionObject<string>;

    blockRewardContract(): NonPayableTransactionObject<string>;

    canCallAnnounceAvailability(
      _miningAddress: string
    ): NonPayableTransactionObject<boolean>;

    finalizeChange(): NonPayableTransactionObject<void>;

    forceFinalizeNewValidators(): NonPayableTransactionObject<void>;

    getCurrentValidatorsCount(): NonPayableTransactionObject<string>;

    getPendingValidatorKeyGenerationMode(
      _miningAddress: string
    ): NonPayableTransactionObject<string>;

    getPendingValidators(): NonPayableTransactionObject<string[]>;

    getPreviousValidators(): NonPayableTransactionObject<string[]>;

    getPublicKey(_miningAddress: string): NonPayableTransactionObject<string>;

    getRandomIndex(
      _likelihood: (number | string | BN)[],
      _likelihoodSum: number | string | BN,
      _randomNumber: number | string | BN
    ): NonPayableTransactionObject<string>;

    getStakingContract(): NonPayableTransactionObject<string>;

    getValidatorCountSweetSpot(
      _possibleValidatorCount: number | string | BN
    ): NonPayableTransactionObject<string>;

    getValidators(): NonPayableTransactionObject<string[]>;

    handleFailedKeyGeneration(): NonPayableTransactionObject<void>;

    initialize(
      _contractOwner: string,
      _blockRewardContract: string,
      _randomContract: string,
      _stakingContract: string,
      _keyGenHistoryContract: string,
      _validatorInactivityThreshold: number | string | BN,
      _initialMiningAddresses: string[],
      _initialStakingAddresses: string[]
    ): NonPayableTransactionObject<void>;

    isFullHealth(): NonPayableTransactionObject<boolean>;

    isPendingValidator(
      _miningAddress: string
    ): NonPayableTransactionObject<boolean>;

    isReportValidatorValid(
      _miningAddress: string
    ): NonPayableTransactionObject<boolean>;

    isValidator(arg0: string): NonPayableTransactionObject<boolean>;

    isValidatorAbandoned(
      _stakingAddress: string
    ): NonPayableTransactionObject<boolean>;

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

    owner(): NonPayableTransactionObject<string>;

    publicKeyByStakingAddress(
      _stakingAddress: string
    ): NonPayableTransactionObject<string>;

    randomContract(): NonPayableTransactionObject<string>;

    removeMaliciousValidators(
      _miningAddresses: string[]
    ): NonPayableTransactionObject<void>;

    renounceOwnership(): NonPayableTransactionObject<void>;

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

    setBanDuration(
      _banDuration: number | string | BN
    ): NonPayableTransactionObject<void>;

    setBannedUntil(
      _miningAddress: string,
      _bannedUntil: number | string | BN
    ): NonPayableTransactionObject<void>;

    setBlockRewardContract(_address: string): NonPayableTransactionObject<void>;

    setIsFullHealth(_healthy: boolean): NonPayableTransactionObject<void>;

    setKeyGenHistoryContract(
      _address: string
    ): NonPayableTransactionObject<void>;

    setMaxValidators(
      _maxValidators: number | string | BN
    ): NonPayableTransactionObject<void>;

    setRandomContract(_address: string): NonPayableTransactionObject<void>;

    setStakingAddress(
      _miningAddress: string,
      _stakingAddress: string
    ): NonPayableTransactionObject<void>;

    setStakingContract(_address: string): NonPayableTransactionObject<void>;

    setValidatorAvailableSince(
      _validator: string,
      _timestamp: number | string | BN
    ): NonPayableTransactionObject<void>;

    setValidatorInactivityThreshold(
      _seconds: number | string | BN
    ): NonPayableTransactionObject<void>;

    setValidatorInternetAddress(
      _ip: string | number[],
      _port: string | number[]
    ): NonPayableTransactionObject<void>;

    stakingByMiningAddress(arg0: string): NonPayableTransactionObject<string>;

    stakingContract(): NonPayableTransactionObject<string>;

    transferOwnership(newOwner: string): NonPayableTransactionObject<void>;

    validatorAvailableSince(arg0: string): NonPayableTransactionObject<string>;

    validatorAvailableSinceLastWrite(
      arg0: string
    ): NonPayableTransactionObject<string>;

    validatorCounter(arg0: string): NonPayableTransactionObject<string>;

    validatorInactivityThreshold(): NonPayableTransactionObject<string>;
  };
  events: {
    Initialized(cb?: Callback<Initialized>): EventEmitter;
    Initialized(
      options?: EventOptions,
      cb?: Callback<Initialized>
    ): EventEmitter;

    OwnershipTransferred(cb?: Callback<OwnershipTransferred>): EventEmitter;
    OwnershipTransferred(
      options?: EventOptions,
      cb?: Callback<OwnershipTransferred>
    ): EventEmitter;

    ReportedMalicious(cb?: Callback<ReportedMalicious>): EventEmitter;
    ReportedMalicious(
      options?: EventOptions,
      cb?: Callback<ReportedMalicious>
    ): EventEmitter;

    SetBanDuration(cb?: Callback<SetBanDuration>): EventEmitter;
    SetBanDuration(
      options?: EventOptions,
      cb?: Callback<SetBanDuration>
    ): EventEmitter;

    SetMaxValidators(cb?: Callback<SetMaxValidators>): EventEmitter;
    SetMaxValidators(
      options?: EventOptions,
      cb?: Callback<SetMaxValidators>
    ): EventEmitter;

    SetValidatorInactivityThreshold(
      cb?: Callback<SetValidatorInactivityThreshold>
    ): EventEmitter;
    SetValidatorInactivityThreshold(
      options?: EventOptions,
      cb?: Callback<SetValidatorInactivityThreshold>
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

  once(event: "Initialized", cb: Callback<Initialized>): void;
  once(
    event: "Initialized",
    options: EventOptions,
    cb: Callback<Initialized>
  ): void;

  once(event: "OwnershipTransferred", cb: Callback<OwnershipTransferred>): void;
  once(
    event: "OwnershipTransferred",
    options: EventOptions,
    cb: Callback<OwnershipTransferred>
  ): void;

  once(event: "ReportedMalicious", cb: Callback<ReportedMalicious>): void;
  once(
    event: "ReportedMalicious",
    options: EventOptions,
    cb: Callback<ReportedMalicious>
  ): void;

  once(event: "SetBanDuration", cb: Callback<SetBanDuration>): void;
  once(
    event: "SetBanDuration",
    options: EventOptions,
    cb: Callback<SetBanDuration>
  ): void;

  once(event: "SetMaxValidators", cb: Callback<SetMaxValidators>): void;
  once(
    event: "SetMaxValidators",
    options: EventOptions,
    cb: Callback<SetMaxValidators>
  ): void;

  once(
    event: "SetValidatorInactivityThreshold",
    cb: Callback<SetValidatorInactivityThreshold>
  ): void;
  once(
    event: "SetValidatorInactivityThreshold",
    options: EventOptions,
    cb: Callback<SetValidatorInactivityThreshold>
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
