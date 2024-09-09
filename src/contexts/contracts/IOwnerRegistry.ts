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

export type Dropped = ContractEventLog<{
  name: string;
  owner: string;
  0: string;
  1: string;
}>;
export type Reserved = ContractEventLog<{
  name: string;
  owner: string;
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

export interface IOwnerRegistry extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): IOwnerRegistry;
  clone(): IOwnerRegistry;
  methods: {
    getOwner(_name: string | number[]): NonPayableTransactionObject<string>;
  };
  events: {
    Dropped(cb?: Callback<Dropped>): EventEmitter;
    Dropped(options?: EventOptions, cb?: Callback<Dropped>): EventEmitter;

    Reserved(cb?: Callback<Reserved>): EventEmitter;
    Reserved(options?: EventOptions, cb?: Callback<Reserved>): EventEmitter;

    Transferred(cb?: Callback<Transferred>): EventEmitter;
    Transferred(
      options?: EventOptions,
      cb?: Callback<Transferred>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "Dropped", cb: Callback<Dropped>): void;
  once(event: "Dropped", options: EventOptions, cb: Callback<Dropped>): void;

  once(event: "Reserved", cb: Callback<Reserved>): void;
  once(event: "Reserved", options: EventOptions, cb: Callback<Reserved>): void;

  once(event: "Transferred", cb: Callback<Transferred>): void;
  once(
    event: "Transferred",
    options: EventOptions,
    cb: Callback<Transferred>
  ): void;
}
