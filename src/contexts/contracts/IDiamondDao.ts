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

export type ProposalCanceled = ContractEventLog<{
  proposer: string;
  proposalId: string;
  reason: string;
  0: string;
  1: string;
  2: string;
}>;
export type ProposalCreated = ContractEventLog<{
  proposer: string;
  proposalId: string;
  targets: string[];
  values: string[];
  calldatas: string[];
  title: string;
  description: string;
  discussionUrl: string;
  proposalFee: string;
  0: string;
  1: string;
  2: string[];
  3: string[];
  4: string[];
  5: string;
  6: string;
  7: string;
  8: string;
}>;
export type ProposalExecuted = ContractEventLog<{
  caller: string;
  proposalId: string;
  0: string;
  1: string;
}>;
export type SetChangeAbleParameters = ContractEventLog<{
  allowed: boolean;
  setter: string;
  getter: string;
  params: string[];
  0: boolean;
  1: string;
  2: string;
  3: string[];
}>;
export type SetCreateProposalFee = ContractEventLog<{
  fee: string;
  0: string;
}>;
export type SetIsCoreContract = ContractEventLog<{
  contractAddress: string;
  isCore: boolean;
  0: string;
  1: boolean;
}>;
export type SubmitVote = ContractEventLog<{
  voter: string;
  proposalId: string;
  vote: string;
  0: string;
  1: string;
  2: string;
}>;
export type SubmitVoteWithReason = ContractEventLog<{
  voter: string;
  proposalId: string;
  vote: string;
  reason: string;
  0: string;
  1: string;
  2: string;
  3: string;
}>;
export type SwitchDaoPhase = ContractEventLog<{
  phase: string;
  start: string;
  end: string;
  0: string;
  1: string;
  2: string;
}>;
export type VotingFinalized = ContractEventLog<{
  caller: string;
  proposalId: string;
  accepted: boolean;
  0: string;
  1: string;
  2: boolean;
}>;

export interface IDiamondDao extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): IDiamondDao;
  clone(): IDiamondDao;
  methods: {
    cancel(
      proposalId: number | string | BN,
      reason: string
    ): NonPayableTransactionObject<void>;

    execute(
      proposalId: number | string | BN
    ): NonPayableTransactionObject<void>;

    finalize(
      proposalId: number | string | BN
    ): NonPayableTransactionObject<void>;

    getProposal(
      proposalId: number | string | BN
    ): NonPayableTransactionObject<
      [
        string,
        string,
        string,
        string[],
        string[],
        string[],
        string,
        string,
        string,
        string,
        string,
        string
      ]
    >;

    hashProposal(
      targets: string[],
      values: (number | string | BN)[],
      calldatas: (string | number[])[],
      descriptionHash: string
    ): NonPayableTransactionObject<string>;

    proposalExists(
      proposalId: number | string | BN
    ): NonPayableTransactionObject<boolean>;

    propose(
      targets: string[],
      values: (number | string | BN)[],
      calldatas: (string | number[])[],
      title: string,
      description: string,
      discussionUrl: string
    ): PayableTransactionObject<void>;

    vote(
      proposalId: number | string | BN,
      _vote: number | string | BN
    ): NonPayableTransactionObject<void>;

    voteWithReason(
      proposalId: number | string | BN,
      _vote: number | string | BN,
      reason: string
    ): NonPayableTransactionObject<void>;
  };
  events: {
    ProposalCanceled(cb?: Callback<ProposalCanceled>): EventEmitter;
    ProposalCanceled(
      options?: EventOptions,
      cb?: Callback<ProposalCanceled>
    ): EventEmitter;

    ProposalCreated(cb?: Callback<ProposalCreated>): EventEmitter;
    ProposalCreated(
      options?: EventOptions,
      cb?: Callback<ProposalCreated>
    ): EventEmitter;

    ProposalExecuted(cb?: Callback<ProposalExecuted>): EventEmitter;
    ProposalExecuted(
      options?: EventOptions,
      cb?: Callback<ProposalExecuted>
    ): EventEmitter;

    SetChangeAbleParameters(
      cb?: Callback<SetChangeAbleParameters>
    ): EventEmitter;
    SetChangeAbleParameters(
      options?: EventOptions,
      cb?: Callback<SetChangeAbleParameters>
    ): EventEmitter;

    SetCreateProposalFee(cb?: Callback<SetCreateProposalFee>): EventEmitter;
    SetCreateProposalFee(
      options?: EventOptions,
      cb?: Callback<SetCreateProposalFee>
    ): EventEmitter;

    SetIsCoreContract(cb?: Callback<SetIsCoreContract>): EventEmitter;
    SetIsCoreContract(
      options?: EventOptions,
      cb?: Callback<SetIsCoreContract>
    ): EventEmitter;

    SubmitVote(cb?: Callback<SubmitVote>): EventEmitter;
    SubmitVote(options?: EventOptions, cb?: Callback<SubmitVote>): EventEmitter;

    SubmitVoteWithReason(cb?: Callback<SubmitVoteWithReason>): EventEmitter;
    SubmitVoteWithReason(
      options?: EventOptions,
      cb?: Callback<SubmitVoteWithReason>
    ): EventEmitter;

    SwitchDaoPhase(cb?: Callback<SwitchDaoPhase>): EventEmitter;
    SwitchDaoPhase(
      options?: EventOptions,
      cb?: Callback<SwitchDaoPhase>
    ): EventEmitter;

    VotingFinalized(cb?: Callback<VotingFinalized>): EventEmitter;
    VotingFinalized(
      options?: EventOptions,
      cb?: Callback<VotingFinalized>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "ProposalCanceled", cb: Callback<ProposalCanceled>): void;
  once(
    event: "ProposalCanceled",
    options: EventOptions,
    cb: Callback<ProposalCanceled>
  ): void;

  once(event: "ProposalCreated", cb: Callback<ProposalCreated>): void;
  once(
    event: "ProposalCreated",
    options: EventOptions,
    cb: Callback<ProposalCreated>
  ): void;

  once(event: "ProposalExecuted", cb: Callback<ProposalExecuted>): void;
  once(
    event: "ProposalExecuted",
    options: EventOptions,
    cb: Callback<ProposalExecuted>
  ): void;

  once(
    event: "SetChangeAbleParameters",
    cb: Callback<SetChangeAbleParameters>
  ): void;
  once(
    event: "SetChangeAbleParameters",
    options: EventOptions,
    cb: Callback<SetChangeAbleParameters>
  ): void;

  once(event: "SetCreateProposalFee", cb: Callback<SetCreateProposalFee>): void;
  once(
    event: "SetCreateProposalFee",
    options: EventOptions,
    cb: Callback<SetCreateProposalFee>
  ): void;

  once(event: "SetIsCoreContract", cb: Callback<SetIsCoreContract>): void;
  once(
    event: "SetIsCoreContract",
    options: EventOptions,
    cb: Callback<SetIsCoreContract>
  ): void;

  once(event: "SubmitVote", cb: Callback<SubmitVote>): void;
  once(
    event: "SubmitVote",
    options: EventOptions,
    cb: Callback<SubmitVote>
  ): void;

  once(event: "SubmitVoteWithReason", cb: Callback<SubmitVoteWithReason>): void;
  once(
    event: "SubmitVoteWithReason",
    options: EventOptions,
    cb: Callback<SubmitVoteWithReason>
  ): void;

  once(event: "SwitchDaoPhase", cb: Callback<SwitchDaoPhase>): void;
  once(
    event: "SwitchDaoPhase",
    options: EventOptions,
    cb: Callback<SwitchDaoPhase>
  ): void;

  once(event: "VotingFinalized", cb: Callback<VotingFinalized>): void;
  once(
    event: "VotingFinalized",
    options: EventOptions,
    cb: Callback<VotingFinalized>
  ): void;
}
