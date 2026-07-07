import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import type { DMDRegistrarController, DMDNames } from '@/contracts/types';
import type { DmdNameAvailabilityResult, OwnedDmdName } from '@/types/dmdNaming';
import { formatDmdAmount } from '@/utils/dmdNaming';
import { clientApiGet } from '@/lib/apiClient';

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export async function getWalletDmdName(
  contract: DMDRegistrarController,
  walletAddress: string,
): Promise<string | null> {
  const raw = await contract.methods.names(walletAddress).call();
  const name = raw && raw !== '0x' ? Web3.utils.hexToUtf8(raw).trim() : '';
  return name || null;
}

export async function checkNameAvailability(
  contract: DMDRegistrarController,
  web3: Web3,
  name: string,
  walletAddress?: string,
  namesContract?: DMDNames,
): Promise<DmdNameAvailabilityResult> {
  try {
    const isValid = await contract.methods.valid(name).call();
    if (!isValid) {
      return { status: 'unavailable' };
    }

    const isAvailable = await contract.methods.available(name).call();
    if (!isAvailable) {
      let ownerAddress: string | undefined;
      let expiresAt: number | undefined;
      try {
        const labelHash = await contract.methods.getHashOfName(name).call();

        try {
          const owner = await contract.methods.namesReverse(labelHash).call();
          if (owner && owner.toLowerCase() !== ZERO_ADDRESS) {
            ownerAddress = owner;
          }
        } catch {
          ownerAddress = undefined;
        }

        if (namesContract) {
          try {
            const expiry = await namesContract.methods.nameExpires(labelHash).call();
            expiresAt = Number(expiry);
          } catch {
            expiresAt = undefined;
          }
        }
      } catch {
        ownerAddress = undefined;
      }
      return { status: 'taken', ownerAddress, expiresAt };
    }

    const registrationFeeWei = await contract.methods.mintingFee().call();

    const registrationFee = formatDmdAmount(web3, registrationFeeWei);

    let estimatedGas: string | undefined;
    let totalEstimatedCost: string | undefined;
    if (walletAddress) {
      try {
        const gas = await contract.methods.register(name).estimateGas({
          from: walletAddress,
          value: registrationFeeWei,
        });
        const gasPrice = await web3.eth.getGasPrice();
        const gasWei = new BigNumber(gas).times(gasPrice).toFixed(0);
        estimatedGas = formatDmdAmount(web3, gasWei);
        totalEstimatedCost = formatDmdAmount(
          web3,
          new BigNumber(registrationFeeWei).plus(gasWei).toFixed(0),
        );
      } catch {
        estimatedGas = undefined;
        totalEstimatedCost = registrationFee;
      }
    }

    return {
      status: 'available',
      registrationFee,
      estimatedGas,
      registrationFeeWei,
      totalEstimatedCost: totalEstimatedCost ?? registrationFee,
    };
  } catch {
    return { status: 'unavailable' };
  }
}

export async function setOwnName(
  contract: DMDRegistrarController,
  web3: Web3,
  from: string,
  name: string,
  valueWei: string,
  getGasPrice: () => Promise<string>,
  onTransactionHash?: () => void,
): Promise<void> {
  const gasPrice = await getGasPrice();
  const tx = contract.methods.register(name).send({
    from,
    value: valueWei,
    gasPrice,
    type: '0x0',
  });
  if (onTransactionHash) {
    tx.once('transactionHash', onTransactionHash);
  }
  await tx;
}

export async function getActivationEstimate(
  contract: DMDRegistrarController,
  web3: Web3,
  name: string,
  walletAddress: string,
): Promise<{ feeWei: string; fee: string; estimatedGas?: string; totalEstimatedCost: string }> {
  const feeWei = await contract.methods.getActivationFee(walletAddress).call();
  const fee = formatDmdAmount(web3, feeWei);

  let estimatedGas: string | undefined;
  let totalEstimatedCost = fee;
  try {
    const gas = await contract.methods.activate(name).estimateGas({
      from: walletAddress,
      value: feeWei,
    });
    const gasPrice = await web3.eth.getGasPrice();
    const gasWei = new BigNumber(gas).times(gasPrice).toFixed(0);
    estimatedGas = formatDmdAmount(web3, gasWei);
    totalEstimatedCost = formatDmdAmount(web3, new BigNumber(feeWei).plus(gasWei).toFixed(0));
  } catch {
    estimatedGas = undefined;
  }

  return { feeWei, fee, estimatedGas, totalEstimatedCost };
}

export async function activateName(
  contract: DMDRegistrarController,
  from: string,
  name: string,
  valueWei: string,
  getGasPrice: () => Promise<string>,
  onTransactionHash?: () => void,
): Promise<void> {
  const gasPrice = await getGasPrice();
  const tx = contract.methods.activate(name).send({
    from,
    value: valueWei,
    gasPrice,
    type: '0x0',
  });
  if (onTransactionHash) {
    tx.once('transactionHash', onTransactionHash);
  }
  await tx;
}

/**
 * Names owned by a wallet, for the "Owned names" table.
 */
export async function getOwnedNames(walletAddress: string): Promise<OwnedDmdName[]> {
  const response = await clientApiGet<OwnedDmdName[] | { data: OwnedDmdName[] }>(
    `owner/${walletAddress}/names`,
  );

  if (!response.ok) {
    throw new Error(response.error || `Failed to fetch owned names (${response.status})`);
  }

  const payload = response.data as unknown;
  if (Array.isArray(payload)) {
    return payload;
  }
  return (payload as { data?: OwnedDmdName[] })?.data ?? [];
}
