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

export type DataChanged = ContractEventLog<{
  name: string;
  key: string;
  plainKey: string;
  0: string;
  1: string;
  2: string;
}>;
export type Drained = ContractEventLog<{
  amount: string;
  0: string;
}>;
export type Dropped = ContractEventLog<{
  name: string;
  owner: string;
  0: string;
  1: string;
}>;
export type FeeChanged = ContractEventLog<{
  amount: string;
  0: string;
}>;
export type NewOwner = ContractEventLog<{
  old: string;
  current: string;
  0: string;
  1: string;
}>;
export type Reserved = ContractEventLog<{
  name: string;
  owner: string;
  0: string;
  1: string;
}>;
export type ReverseConfirmed = ContractEventLog<{
  name: string;
  reverse: string;
  0: string;
  1: string;
}>;
export type ReverseProposed = ContractEventLog<{
  name: string;
  reverse: string;
  0: string;
  1: string;
}>;
export type ReverseRemoved = ContractEventLog<{
  name: string;
  reverse: string;
  0: string;
  1: string;
}>;
export type Transferred = ContractEventLog<{
  name: string;
  oldOwner: string;
  newOwner: string;
  0: string;
  1: string;
  2: string;
}>;

export interface Registry extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): Registry;
  clone(): Registry;
  methods: {
    canReverse(_data: string): NonPayableTransactionObject<boolean>;

    confirmReverse(_name: string): NonPayableTransactionObject<boolean>;

    confirmReverseAs(
      _name: string,
      _who: string
    ): NonPayableTransactionObject<boolean>;

    drain(): NonPayableTransactionObject<boolean>;

    drop(_name: string | number[]): NonPayableTransactionObject<boolean>;

    fee(): NonPayableTransactionObject<string>;

    getAddress(
      _name: string | number[],
      _key: string
    ): NonPayableTransactionObject<string>;

    getData(
      _name: string | number[],
      _key: string
    ): NonPayableTransactionObject<string>;

    getOwner(_name: string | number[]): NonPayableTransactionObject<string>;

    getReverse(_name: string | number[]): NonPayableTransactionObject<string>;

    getUint(
      _name: string | number[],
      _key: string
    ): NonPayableTransactionObject<string>;

    hasReverse(_name: string | number[]): NonPayableTransactionObject<boolean>;

    owner(): NonPayableTransactionObject<string>;

    proposeReverse(
      _name: string,
      _who: string
    ): NonPayableTransactionObject<boolean>;

    removeReverse(): NonPayableTransactionObject<void>;

    reserve(_name: string | number[]): PayableTransactionObject<boolean>;

    reserved(_name: string | number[]): NonPayableTransactionObject<boolean>;

    reverse(_data: string): NonPayableTransactionObject<string>;

    setAddress(
      _name: string | number[],
      _key: string,
      _value: string
    ): NonPayableTransactionObject<boolean>;

    setData(
      _name: string | number[],
      _key: string,
      _value: string | number[]
    ): NonPayableTransactionObject<boolean>;

    setFee(_amount: number | string | BN): NonPayableTransactionObject<boolean>;

    setOwner(_new: string): NonPayableTransactionObject<void>;

    setUint(
      _name: string | number[],
      _key: string,
      _value: number | string | BN
    ): NonPayableTransactionObject<boolean>;

    transfer(
      _name: string | number[],
      _to: string
    ): NonPayableTransactionObject<boolean>;
  };
  events: {
    DataChanged(cb?: Callback<DataChanged>): EventEmitter;
    DataChanged(
      options?: EventOptions,
      cb?: Callback<DataChanged>
    ): EventEmitter;

    Drained(cb?: Callback<Drained>): EventEmitter;
    Drained(options?: EventOptions, cb?: Callback<Drained>): EventEmitter;

    Dropped(cb?: Callback<Dropped>): EventEmitter;
    Dropped(options?: EventOptions, cb?: Callback<Dropped>): EventEmitter;

    FeeChanged(cb?: Callback<FeeChanged>): EventEmitter;
    FeeChanged(options?: EventOptions, cb?: Callback<FeeChanged>): EventEmitter;

    NewOwner(cb?: Callback<NewOwner>): EventEmitter;
    NewOwner(options?: EventOptions, cb?: Callback<NewOwner>): EventEmitter;

    Reserved(cb?: Callback<Reserved>): EventEmitter;
    Reserved(options?: EventOptions, cb?: Callback<Reserved>): EventEmitter;

    ReverseConfirmed(cb?: Callback<ReverseConfirmed>): EventEmitter;
    ReverseConfirmed(
      options?: EventOptions,
      cb?: Callback<ReverseConfirmed>
    ): EventEmitter;

    ReverseProposed(cb?: Callback<ReverseProposed>): EventEmitter;
    ReverseProposed(
      options?: EventOptions,
      cb?: Callback<ReverseProposed>
    ): EventEmitter;

    ReverseRemoved(cb?: Callback<ReverseRemoved>): EventEmitter;
    ReverseRemoved(
      options?: EventOptions,
      cb?: Callback<ReverseRemoved>
    ): EventEmitter;

    Transferred(cb?: Callback<Transferred>): EventEmitter;
    Transferred(
      options?: EventOptions,
      cb?: Callback<Transferred>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "DataChanged", cb: Callback<DataChanged>): void;
  once(
    event: "DataChanged",
    options: EventOptions,
    cb: Callback<DataChanged>
  ): void;

  once(event: "Drained", cb: Callback<Drained>): void;
  once(event: "Drained", options: EventOptions, cb: Callback<Drained>): void;

  once(event: "Dropped", cb: Callback<Dropped>): void;
  once(event: "Dropped", options: EventOptions, cb: Callback<Dropped>): void;

  once(event: "FeeChanged", cb: Callback<FeeChanged>): void;
  once(
    event: "FeeChanged",
    options: EventOptions,
    cb: Callback<FeeChanged>
  ): void;

  once(event: "NewOwner", cb: Callback<NewOwner>): void;
  once(event: "NewOwner", options: EventOptions, cb: Callback<NewOwner>): void;

  once(event: "Reserved", cb: Callback<Reserved>): void;
  once(event: "Reserved", options: EventOptions, cb: Callback<Reserved>): void;

  once(event: "ReverseConfirmed", cb: Callback<ReverseConfirmed>): void;
  once(
    event: "ReverseConfirmed",
    options: EventOptions,
    cb: Callback<ReverseConfirmed>
  ): void;

  once(event: "ReverseProposed", cb: Callback<ReverseProposed>): void;
  once(
    event: "ReverseProposed",
    options: EventOptions,
    cb: Callback<ReverseProposed>
  ): void;

  once(event: "ReverseRemoved", cb: Callback<ReverseRemoved>): void;
  once(
    event: "ReverseRemoved",
    options: EventOptions,
    cb: Callback<ReverseRemoved>
  ): void;

  once(event: "Transferred", cb: Callback<Transferred>): void;
  once(
    event: "Transferred",
    options: EventOptions,
    cb: Callback<Transferred>
  ): void;
}
