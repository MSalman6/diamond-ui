import type Web3 from 'web3';
import BigNumber from 'bignumber.js';

const DMD_NAME_PATTERN = /^[a-z0-9-]+$/;

export function normalizeDmdNameInput(input: string): string {
  return input.trim().toLowerCase();
}

export function stripDmdSuffix(input: string): string {
  return input.trim().replace(/\.dmd$/i, '');
}

export function validateDmdName(name: string): string | null {
  if (name.length < 2 || name.length > 63) {
    return 'Use lowercase letters, numbers and hyphens only.';
  }
  if (!DMD_NAME_PATTERN.test(name)) {
    return 'Use lowercase letters, numbers and hyphens only.';
  }
  if (name.startsWith('-') || name.endsWith('-') || name.includes('--')) {
    return 'Use lowercase letters, numbers and hyphens only.';
  }
  return null;
}

export function formatDmdName(name: string): string {
  return name.endsWith('.dmd') ? name : `${name}.dmd`;
}

export function bareDmdName(name: string): string {
  return name.replace(/\.dmd$/i, '');
}

export function formatDmdAmount(web3: Web3, wei: string): string {
  const amount = new BigNumber(web3.utils.fromWei(wei, 'ether'));
  if (amount.isZero()) {
    return '0 DMD';
  }
  return `${amount.toFormat(4, BigNumber.ROUND_DOWN).replace(/\.?0+$/, '')} DMD`;
}

export function formatDmdDate(timestampSeconds?: number | null): string {
  if (!timestampSeconds || !Number.isFinite(timestampSeconds)) {
    return '—';
  }
  return new Date(timestampSeconds * 1000).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function shortenAddress(address: string): string {
  if (address.length < 10) {
    return address;
  }
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
