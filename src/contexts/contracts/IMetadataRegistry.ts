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

export type DataChanged = ContractEventLog<{
  name: string;
  key: string;
  plainKey: string;
  0: string;
  1: string;
  2: string;
}>;

export interface IMetadataRegistry extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): IMetadataRegistry;
  clone(): IMetadataRegistry;
  methods: {
    getAddress(
      _name: string | number[],
      _key: string
    ): NonPayableTransactionObject<string>;

    getData(
      _name: string | number[],
      _key: string
    ): NonPayableTransactionObject<string>;

    getUint(
      _name: string | number[],
      _key: string
    ): NonPayableTransactionObject<string>;
  };
  events: {
    DataChanged(cb?: Callback<DataChanged>): EventEmitter;
    DataChanged(
      options?: EventOptions,
      cb?: Callback<DataChanged>
    ): EventEmitter;

    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };

  once(event: "DataChanged", cb: Callback<DataChanged>): void;
  once(
    event: "DataChanged",
    options: EventOptions,
    cb: Callback<DataChanged>
  ): void;
}
