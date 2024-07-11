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

export interface ITxPermission extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): ITxPermission;
  clone(): ITxPermission;
  methods: {
    allowedTxTypes(
      _sender: string,
      _to: string,
      arg2: number | string | BN,
      _gasPrice: number | string | BN,
      _data: string | number[]
    ): NonPayableTransactionObject<{
      typesMask: string;
      cache: boolean;
      0: string;
      1: boolean;
    }>;
  };
  events: {
    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };
}
