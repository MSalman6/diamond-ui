import Web3 from 'web3';

import { ValidatorSetHbbft } from '../../contracts/ValidatorSetHbbft';
import JsonValidatorSetHbbft from '../../contract-abis/ValidatorSetHbbft.json';

import { StakingHbbft } from '../../contracts/StakingHbbft';
import JsonStakingHbbft from '../../contract-abis/StakingHbbft.json';

import { KeyGenHistory } from '../../contracts/KeyGenHistory';
import JsonKeyGenHistory from '../../contract-abis/KeyGenHistory.json';

import { BlockRewardHbbft } from '../../contracts/BlockRewardHbbft';
import JsonBlockRewardHbbft from '../../contract-abis/BlockRewardHbbft.json';

import { Registry } from '../../contracts/Registry';
import JsonRegistry from '../../contract-abis/Registry.json';

import { TxPermissionHbbft } from '../../contracts/TxPermissionHbbft';
import JsonTxPermissionHbbft from '../../contract-abis/TxPermissionHbbft.json';

import { RandomHbbft } from '../../contracts/RandomHbbft';
import JsonRandomHbbft  from '../../contract-abis/RandomHbbft.json';

import { BonusScoreSystem } from '../../contracts';
import JsonBonusScoreSystem from '../../contract-abis/BonusScoreSystem.json';

import { CertifierHbbft, ConnectivityTrackerHbbft, DiamondDao, DMDAggregator } from '../../contracts';
import JsonDiamonDao  from '../../contract-abis/DiamondDao.json';
import JsonCertifierHbbft from '../../contract-abis/CertifierHbbft.json';
import JsonConnectivityTrackerHbbft from '../../contract-abis/ConnectivityTrackerHbbft.json';
import JsonHbbtAggregator from '../../contract-abis/DMDAggregator.json';

import BigNumber from 'bignumber.js';
import { BlockType } from '../types/contracts';


export enum KeyGenMode {
  NotAPendingValidator = 0,
  WritePart, 
  WaitForOtherParts,
  WriteAck,
  WaitForOtherAcks,
  AllKeysDone
}

export interface ContractAddresses {
  validatorSetAddress: string
}

// Hex string to number
function h2n(hexString: string) : number {
  return new BigNumber(hexString).toNumber();
}
export class ContractManager {

  private cachedValidatorSetHbbft?: ValidatorSetHbbft;
  private cachedStakingHbbft?: StakingHbbft;
  private cachedKeyGenHistory?: KeyGenHistory;
  private cachedRewardContract?: BlockRewardHbbft;
  private cachedPermission?: TxPermissionHbbft;

  public constructor(public web3: Web3) {

  }

  public static getContractAddresses() : ContractAddresses {
    //todo: query other addresses ?!
    // more intelligent contract manager that queries lazy ?
    return { validatorSetAddress: '0x1000000000000000000000000000000000000001' }
  }

  public getValidatorSetHbbft() : ValidatorSetHbbft {

    if (this.cachedValidatorSetHbbft) {
      return this.cachedValidatorSetHbbft;
    }

    const contractAddresses = ContractManager.getContractAddresses();

    const abi : any = JsonValidatorSetHbbft.abi;
    const validatorSetContract : any = new this.web3.eth.Contract(abi, contractAddresses.validatorSetAddress);
    this.cachedValidatorSetHbbft = validatorSetContract;
    //const validatorSet : ValidatorSetHbbft = validatorSetContract;
    return validatorSetContract;
  }

  public getRegistry() : Registry {
    
    const abi : any = JsonRegistry.abi;
    let result : any = new this.web3.eth.Contract(abi, '0x6000000000000000000000000000000000000000');
    return result;
  }

  public async getRewardHbbft() : Promise<BlockRewardHbbft> {
    if (this.cachedRewardContract) {
      return this.cachedRewardContract;
    }

    const contractAddress = await this.getValidatorSetHbbft().methods.blockRewardContract().call();

    const abi : any = JsonBlockRewardHbbft.abi;
    const result : any = new this.web3.eth.Contract(abi, contractAddress);
    this.cachedRewardContract = result;
    //const validatorSet : ValidatorSetHbbft = validatorSetContract;
    return this.cachedRewardContract!;
  }

  public async getEpoch(blockNumber: number | undefined) : Promise<number> {
    return h2n(await (await this.getStakingHbbft()).methods.stakingEpoch().call());
  }

  public async getEpochStartBlock(blockNumber: BlockType = 'latest') {
    return h2n(await (await this.getStakingHbbft()).methods.stakingEpochStartBlock().call());
  }

  public async getStakingHbbft() : Promise<StakingHbbft> {
    if (this.cachedStakingHbbft) {
      return this.cachedStakingHbbft;
    }

    const contractAddress = await this.getValidatorSetHbbft().methods.stakingContract().call();
    const abi : any = JsonStakingHbbft.abi;
    const stakingContract : any = new this.web3.eth.Contract(abi, contractAddress);
    this.cachedStakingHbbft = stakingContract;
    return stakingContract;
  }

  public getContractPermission() : TxPermissionHbbft {        
    if (this.cachedPermission ) {
      return this.cachedPermission;
    }

    // address from chain spec.
    const configuredAddress = '0x4000000000000000000000000000000000000001';

    const abi : any = JsonTxPermissionHbbft.abi;
    const permissionContract : any = new this.web3.eth.Contract(abi, configuredAddress);
    this.cachedPermission = permissionContract;
    return permissionContract;

    //minimumGasPrice
  }

  public async getKeyGenHistory(blockNumber: BlockType = 'latest') : Promise<KeyGenHistory> {
    
    if (this.cachedKeyGenHistory) {
      return this.cachedKeyGenHistory;
    }

    const contractAddress = await this.getValidatorSetHbbft().methods.keyGenHistoryContract().call();
    const abi : any = JsonKeyGenHistory.abi;
    const contract : any = new this.web3.eth.Contract(abi, contractAddress);
    this.cachedKeyGenHistory = contract;
    return contract;
  }

  public async isValidatorAvailable(miningAddress: string, blockNumber: BlockType = 'latest') {
     const validatorAvailableSince = new BigNumber(await (await this.getValidatorSetHbbft()).methods.validatorAvailableSince(miningAddress).call());
     return !validatorAvailableSince.isZero();
  }

  public async getValidators(blockNumber: BlockType = 'latest') {

    return await this.getValidatorSetHbbft().methods.getValidators().call();
  }

  public async getPendingValidators(blockNumber: BlockType = 'latest') {
    return await this.getValidatorSetHbbft().methods.getPendingValidators().call();
  }


  public async getPendingValidatorState(validator: string, blockNumber: BlockType = 'latest') : Promise<KeyGenMode> {

    return h2n(await this.getValidatorSetHbbft().methods
      .getPendingValidatorKeyGenerationMode(validator).call());
  }

  public async getKeyPARTBytesLength(validator: string, blockNumber: BlockType = 'latest') {
    const part = await this.getKeyPART(validator, blockNumber);
    return (part.length - 2) / 2;
  }

  public async getKeyPART(validator: string, blockNumber: BlockType = 'latest') : Promise<string> {
    return await (await this.getKeyGenHistory()).methods.getPart(validator).call();
  }

  // retrieves only the number of written Acks (so not that much data has to get transferted.
  public async getKeyACKSNumber(validator: string, blockNumber: BlockType = 'latest') : Promise<number> {
    return h2n(await (await this.getKeyGenHistory()).methods.getAcksLength(validator).call());
  }

  public async getCurrentKeyGenRound(blockNumber: BlockType = 'latest') : Promise<number> {

    return h2n(await (await this.getKeyGenHistory()).methods.getCurrentKeyGenRound().call());
  }


  public async getRandomHbbft(): Promise<RandomHbbft> {

    let contractAddress = await this.getValidatorSetHbbft().methods.randomContract().call();

    const abi: any = JsonRandomHbbft.abi;
    const contract: any = new this.web3.eth.Contract(abi, contractAddress);
    return contract;
  }

  public getDaoContract(): DiamondDao {
    let contractAddress = '0xDA0da0da0Da0Da0Da0DA00DA0da0da0DA0DA0dA0';

    const abi: any = JsonDiamonDao.abi;
    const contract: any = new this.web3.eth.Contract(abi, contractAddress);
    return contract;
  }

  public async getCertifierHbbft(): Promise<CertifierHbbft> {
    let contractAddress = '0x65219102B1AFBC624C56CDbf02186B8341703456';

    const abi: any = JsonCertifierHbbft.abi;
    const contract: any = new this.web3.eth.Contract(abi, contractAddress);
    return contract;
  }

  public async getConnectivityTracker(): Promise<ConnectivityTrackerHbbft> {
    let bsContract = await this.getBonusScoreSystem();
    let contractAddress = await bsContract.methods.connectivityTracker().call();
    const abi: any = JsonConnectivityTrackerHbbft.abi;
    const contract: any = new this.web3.eth.Contract(abi, contractAddress);
    return contract;
  }

  public async getDMDAggregator(): Promise<DMDAggregator> {
    let contractAddress =  import.meta.env.VITE_APP_AGGREGAOTR_CONTRACT_ADDRESS || '0x9990000000000000000000000000000000000000';

    const abi: any = JsonHbbtAggregator.abi;
    const contract: any = new this.web3.eth.Contract(abi, contractAddress);
    return contract;
  }

  public async getBonusScoreSystem(blockNumber: BlockType = 'latest'): Promise<BonusScoreSystem> {
    let contractAddress = await this.getValidatorSetHbbft().methods.bonusScoreSystem().call();
    const abi: any = JsonBonusScoreSystem.abi;
    const contract: any = new this.web3.eth.Contract(abi, contractAddress);
    return contract;
  }
}
