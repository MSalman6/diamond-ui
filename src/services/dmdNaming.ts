import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import type { DMDRegistrarController, DMDNames } from '@/contracts/types';
import type {
  DmdNameAvailabilityResult,
  OwnedDmdName,
  OwnedDmdNameStatus,
  DmdDirectoryEntry,
  DmdDirectoryQuery,
  DmdDirectoryResponse,
  DmdNameHistory,
  ActivationFeeTier,
} from '@/types/dmdNaming';
import { formatDmdAmount } from '@/utils/dmdNaming';
import { clientApiGet } from '@/lib/apiClient';
import { buildTxOptions } from '@/utils/txOptions';

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
  const method = contract.methods.register(name);
  const tx = method.send(await buildTxOptions(method, { from, gasPrice, value: valueWei }));
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

const ACTIVATION_FEE_TIERS = [
  { label: 'First activation', numerator: 0 },
  { label: '1st change', numerator: 1 },
  { label: '2nd change', numerator: 2 },
  { label: '3rd & later', numerator: 3 },
];

export async function getActivationFeeSchedule(
  contract: DMDRegistrarController,
  web3: Web3,
  walletAddress: string,
): Promise<ActivationFeeTier[]> {
  const [mintingFeeWei, activationsRaw] = await Promise.all([
    contract.methods.mintingFee().call(),
    contract.methods.activations(walletAddress).call(),
  ]);
  const activationsCount = Math.min(Number(activationsRaw), 3);

  return ACTIVATION_FEE_TIERS.map((tier) => ({
    label: tier.label,
    amount: tier.numerator === 0
      ? 'Free (gas only)'
      : formatDmdAmount(web3, new BigNumber(mintingFeeWei).times(tier.numerator).dividedBy(10).toFixed(0)),
    isCurrent: activationsCount === tier.numerator,
  }));
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
  const method = contract.methods.activate(name);
  const tx = method.send(await buildTxOptions(method, { from, gasPrice, value: valueWei }));
  if (onTransactionHash) {
    tx.once('transactionHash', onTransactionHash);
  }
  await tx;
}

export async function getRenewEstimate(
  contract: DMDRegistrarController,
  web3: Web3,
  name: string,
  walletAddress: string,
): Promise<{ estimatedGas?: string; totalEstimatedCost?: string }> {
  try {
    const gas = await contract.methods.renew(name).estimateGas({ from: walletAddress });
    const gasPrice = await web3.eth.getGasPrice();
    const gasWei = new BigNumber(gas).times(gasPrice).toFixed(0);
    const cost = formatDmdAmount(web3, gasWei);
    return { estimatedGas: cost, totalEstimatedCost: cost };
  } catch {
    return {};
  }
}

export async function renewName(
  contract: DMDRegistrarController,
  from: string,
  name: string,
  getGasPrice: () => Promise<string>,
  onTransactionHash?: () => void,
): Promise<void> {
  const gasPrice = await getGasPrice();
  const method = contract.methods.renew(name);
  const tx = method.send(await buildTxOptions(method, { from, gasPrice }));
  if (onTransactionHash) {
    tx.once('transactionHash', onTransactionHash);
  }
  await tx;
}

export async function getTransferFee(
  namesContract: DMDNames,
  web3: Web3,
): Promise<{ transferFeeWei: string; transferFee: string }> {
  const transferFeeWei = await namesContract.methods.transferFee().call();
  return { transferFeeWei, transferFee: formatDmdAmount(web3, transferFeeWei) };
}

export async function getTransferGasEstimate(
  registrarContract: DMDRegistrarController,
  namesContract: DMDNames,
  web3: Web3,
  name: string,
  from: string,
  to: string,
  transferFeeWei: string,
): Promise<{ estimatedGas?: string; totalEstimatedCost?: string }> {
  try {
    const labelHash = await registrarContract.methods.getHashOfName(name).call();
    const gas = await namesContract.methods
      .transferFrom(from, to, labelHash)
      .estimateGas({ from, value: transferFeeWei });
    const gasPrice = await web3.eth.getGasPrice();
    const gasWei = new BigNumber(gas).times(gasPrice).toFixed(0);
    return {
      estimatedGas: formatDmdAmount(web3, gasWei),
      totalEstimatedCost: formatDmdAmount(web3, new BigNumber(transferFeeWei).plus(gasWei).toFixed(0)),
    };
  } catch {
    return {};
  }
}

export async function transferName(
  registrarContract: DMDRegistrarController,
  namesContract: DMDNames,
  from: string,
  to: string,
  name: string,
  transferFeeWei: string,
  getGasPrice: () => Promise<string>,
  onTransactionHash?: () => void,
): Promise<void> {
  const labelHash = await registrarContract.methods.getHashOfName(name).call();
  const gasPrice = await getGasPrice();
  const method = namesContract.methods.transferFrom(from, to, labelHash);
  const tx = method.send(await buildTxOptions(method, { from, gasPrice, value: transferFeeWei }));
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

/**
 * Indexed history timeline for a single DMD name.
 */
export async function getNameHistory(name: string): Promise<DmdNameHistory> {
  const response = await clientApiGet<DmdNameHistory>(`name/${name}/history`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('NOT_FOUND');
    }
    throw new Error(response.error || `Failed to fetch name history (${response.status})`);
  }

  return response.data;
}

/**
 * Normalizes a single directory row from the indexed backend.
 */
function normalizeDirectoryEntry(raw: any): DmdDirectoryEntry {
  const ownerAddress = raw.ownerAddress ?? raw.owner ?? raw.address ?? '';
  const createdAt = Number(raw.createdAt ?? raw.created_at ?? raw.registeredAt ?? 0);
  const expiresAt = Number(raw.expiresAt ?? raw.expires_at ?? raw.expiry ?? 0);
  const rawStatus = raw.status as string | undefined;
  const knownStatuses: OwnedDmdNameStatus[] = ['active', 'inactive', 'expiring-soon', 'expired'];
  const status: OwnedDmdNameStatus = knownStatuses.includes(rawStatus as OwnedDmdNameStatus)
    ? (rawStatus as OwnedDmdNameStatus)
    : expiresAt && expiresAt * 1000 < Date.now() ? 'expired' : 'inactive';

  return { name: raw.name, ownerAddress, status, createdAt, expiresAt };
}

/**
 * Paginated/filterable public directory of all DMD names.
 */
export async function getNamesDirectory(query: DmdDirectoryQuery = {}): Promise<DmdDirectoryResponse> {
  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.status) params.set('status', query.status);
  if (query.createdFrom) params.set('createdFrom', String(query.createdFrom));
  if (query.createdTo) params.set('createdTo', String(query.createdTo));
  if (query.expiresFrom) params.set('expiresFrom', String(query.expiresFrom));
  if (query.expiresTo) params.set('expiresTo', String(query.expiresTo));
  if (query.sortBy) params.set('sortBy', query.sortBy);
  if (query.order) params.set('order', query.order);
  params.set('limit', String(pageSize));
  params.set('offset', String(offset));

  const response = await clientApiGet<{ data: any[]; count: number; limit: number; offset: number } | any[]>(
    `names?${params.toString()}`,
  );

  if (!response.ok) {
    throw new Error(response.error || `Failed to fetch DMD names directory (${response.status})`);
  }

  const payload = response.data as unknown;
  const rows = Array.isArray(payload) ? payload : (payload as { data?: any[] })?.data ?? [];
  const count = Array.isArray(payload) ? rows.length : (payload as { count?: number })?.count ?? rows.length;

  return {
    items: rows.map(normalizeDirectoryEntry),
    total: count,
    page,
    pageSize,
  };
}

/**
 * Names hidden via DAO moderation.
 */
export async function getBlacklistedNames(): Promise<Set<string>> {
  try {
    const response = await clientApiGet<string[] | { name: string }[] | { data: unknown[] }>('names/blacklisted');
    if (!response.ok) {
      return new Set();
    }

    const payload = response.data as unknown;
    const list = Array.isArray(payload) ? payload : (payload as { data?: unknown[] })?.data ?? [];
    const names = list
      .map((entry) => (typeof entry === 'string' ? entry : (entry as { name?: string })?.name))
      .filter((n): n is string => !!n);
    return new Set(names);
  } catch {
    return new Set();
  }
}
