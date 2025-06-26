import Web3 from 'web3';
import BigNumber from 'bignumber.js';

// Contract ABIs
import {
  ValidatorSetHbbft as JsonValidatorSetHbbft,
  StakingHbbft as JsonStakingHbbft,
  KeyGenHistory as JsonKeyGenHistory,
  BlockRewardHbbft as JsonBlockRewardHbbft,
  Registry as JsonRegistry,
  TxPermissionHbbft as JsonTxPermissionHbbft,
  RandomHbbft as JsonRandomHbbft,
  BonusScoreSystem as JsonBonusScoreSystem,
  DiamondDao as JsonDiamonDao,
  CertifierHbbft as JsonCertifierHbbft,
  ConnectivityTrackerHbbft as JsonConnectivityTrackerHbbft,
  DMDAggregator as JsonHbbtAggregator
} from '../../contracts/abis';

// Contract Types
import { 
  CertifierHbbft, 
  ConnectivityTrackerHbbft, 
  DiamondDao, 
  DMDAggregator, 
  BonusScoreSystem, 
  TxPermissionHbbft, 
  BlockRewardHbbft, 
  ValidatorSetHbbft, 
  StakingHbbft, 
  KeyGenHistory, 
  Registry, 
  RandomHbbft 
} from '@/contracts/types';

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

  public constructor(public web3: Web3) {}

  public static getContractAddresses() : ContractAddresses {
    return { validatorSetAddress: '0x1000000000000000000000000000000000000001' }
  }

  public getValidatorSetHbbft() : ValidatorSetHbbft {

    if (this.cachedValidatorSetHbbft) {
      return this.cachedValidatorSetHbbft;
    }

    const contractAddresses = ContractManager.getContractAddresses();

    const abi = JsonValidatorSetHbbft.abi as any;
    const validatorSetContract = new this.web3.eth.Contract(abi, contractAddresses.validatorSetAddress) as unknown as ValidatorSetHbbft;
    this.cachedValidatorSetHbbft = validatorSetContract;
    return validatorSetContract;
  }

  public getRegistry() : Registry {
    const abi = JsonRegistry.abi as any;
    const result = new this.web3.eth.Contract(abi, '0x6000000000000000000000000000000000000000') as unknown as Registry;
    return result;
  }

  public async getRewardHbbft() : Promise<BlockRewardHbbft> {
    if (this.cachedRewardContract) {
      return this.cachedRewardContract;
    }

    const contractAddress = await this.getValidatorSetHbbft().methods.blockRewardContract().call();

    const abi = JsonBlockRewardHbbft.abi as any;
    const result = new this.web3.eth.Contract(abi, contractAddress) as unknown as BlockRewardHbbft;
    this.cachedRewardContract = result;
    return this.cachedRewardContract!;
  }

  public async getEpoch() : Promise<number> {
    return h2n(await (await this.getStakingHbbft()).methods.stakingEpoch().call());
  }

  public async getEpochStartBlock() {
    return h2n(await (await this.getStakingHbbft()).methods.stakingEpochStartBlock().call());
  }

  public async getStakingHbbft() : Promise<StakingHbbft> {
    if (this.cachedStakingHbbft) {
      return this.cachedStakingHbbft;
    }

    const contractAddress = await this.getValidatorSetHbbft().methods.stakingContract().call();
    const abi = JsonStakingHbbft.abi as any;
    const stakingContract = new this.web3.eth.Contract(abi, contractAddress) as unknown as StakingHbbft;
    this.cachedStakingHbbft = stakingContract;
    return stakingContract;
  }

  public getContractPermission() : TxPermissionHbbft {        
    if (this.cachedPermission ) {
      return this.cachedPermission;
    }

    // address from chain spec.
    const configuredAddress = '0x4000000000000000000000000000000000000001';

    const abi = JsonTxPermissionHbbft.abi as any;
    const permissionContract = new this.web3.eth.Contract(abi, configuredAddress) as unknown as TxPermissionHbbft;
    this.cachedPermission = permissionContract;
    return permissionContract;
  }

  public async getKeyGenHistory() : Promise<KeyGenHistory> {
    if (this.cachedKeyGenHistory) {
      return this.cachedKeyGenHistory;
    }

    const contractAddress = await this.getValidatorSetHbbft().methods.keyGenHistoryContract().call();
    const abi = JsonKeyGenHistory.abi as any;
    const contract = new this.web3.eth.Contract(abi, contractAddress) as unknown as KeyGenHistory;
    this.cachedKeyGenHistory = contract;
    return contract;
  }

  public async isValidatorAvailable(miningAddress: string) {
     const validatorAvailableSince = new BigNumber(await (await this.getValidatorSetHbbft()).methods.validatorAvailableSince(miningAddress).call());
     return !validatorAvailableSince.isZero();
  }

  public async getValidators() {
    return await this.getValidatorSetHbbft().methods.getValidators().call();
  }

  public async getPendingValidators() {
    return await this.getValidatorSetHbbft().methods.getPendingValidators().call();
  }


  public async getPendingValidatorState(validator: string) : Promise<KeyGenMode> {
    return h2n(await this.getValidatorSetHbbft().methods
      .getPendingValidatorKeyGenerationMode(validator).call());
  }

  public async getKeyPARTBytesLength(validator: string) {
    const part = await this.getKeyPART(validator);
    return (part.length - 2) / 2;
  }

  public async getKeyPART(validator: string) : Promise<string> {
    return await (await this.getKeyGenHistory()).methods.getPart(validator).call();
  }

  public async getKeyACKSNumber(validator: string) : Promise<number> {
    return h2n(await (await this.getKeyGenHistory()).methods.getAcksLength(validator).call());
  }

  public async getCurrentKeyGenRound() : Promise<number> {
    return h2n(await (await this.getKeyGenHistory()).methods.getCurrentKeyGenRound().call());
  }

  public async getRandomHbbft(): Promise<RandomHbbft> {
    const contractAddress = await this.getValidatorSetHbbft().methods.randomContract().call();

    const abi = JsonRandomHbbft.abi as any;
    const contract = new this.web3.eth.Contract(abi, contractAddress) as unknown as RandomHbbft;
    return contract;
  }

  public getDaoContract(): DiamondDao {
    const contractAddress = '0xDA0da0da0Da0Da0Da0DA00DA0da0da0DA0DA0dA0';

    const abi = JsonDiamonDao.abi as any;
    const contract = new this.web3.eth.Contract(abi, contractAddress) as unknown as DiamondDao;
    return contract;
  }

  public async getCertifierHbbft(): Promise<CertifierHbbft> {
    const contractAddress = '0x65219102B1AFBC624C56CDbf02186B8341703456';

    const abi = JsonCertifierHbbft.abi as any;
    const contract = new this.web3.eth.Contract(abi, contractAddress) as unknown as CertifierHbbft;
    return contract;
  }

  public async getConnectivityTracker(): Promise<ConnectivityTrackerHbbft> {
    const bsContract = await this.getBonusScoreSystem();
    const contractAddress = await bsContract.methods.connectivityTracker().call();
    const abi = JsonConnectivityTrackerHbbft.abi as any;
    const contract = new this.web3.eth.Contract(abi, contractAddress) as unknown as ConnectivityTrackerHbbft;
    return contract;
  }

  public async getDMDAggregator(): Promise<DMDAggregator> {
    const contractAddress = process.env.NEXT_PUBLIC_AGGREGAOTR_CONTRACT_ADDRESS || '0x9990000000000000000000000000000000000000';

    const abi = JsonHbbtAggregator.abi as any;
    const contract = new this.web3.eth.Contract(abi, contractAddress) as unknown as DMDAggregator;
    return contract;
  }

  public async getBonusScoreSystem(): Promise<BonusScoreSystem> {
    const contractAddress = await this.getValidatorSetHbbft().methods.bonusScoreSystem().call();
    const abi = JsonBonusScoreSystem.abi as any;
    const contract = new this.web3.eth.Contract(abi, contractAddress) as unknown as BonusScoreSystem;
    return contract;
  }
}
