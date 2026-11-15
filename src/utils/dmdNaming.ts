import type Web3 from 'web3';
import BigNumber from 'bignumber.js';
import type { DmdDnsConfig, DmdDnsSummary, DmdWebsiteTarget, DmdWebsiteTargetType } from '@/types/dmdNaming';
import { formatDmd } from '@/utils/format';

const DMD_NAME_PATTERN = /^[a-z0-9-]+$/;

export const DMD_DNS_ZONE = 'dmd.domains';

const IPV4_PATTERN = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
const IPV6_GROUP_PATTERN = /^[0-9a-f]{1,4}$/i;
const HOSTNAME_LABEL_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
const EMAIL_LOCAL_PART_PATTERN = /^[a-z0-9._+-]+$/;

const MAX_HOSTNAME_LENGTH = 253;
const MAX_LABEL_LENGTH = 63;
const MAX_EMAIL_LENGTH = 254;
const MAX_LOCAL_PART_LENGTH = 64;

export const EMPTY_DNS_CONFIG: DmdDnsConfig = { website: { type: 'none', value: '' }, emailForwarding: '' };

const DNS_RECORD_TYPES: Record<Exclude<DmdWebsiteTargetType, 'none'>, string> = {
  ipv4: 'A',
  ipv6: 'AAAA',
  cname: 'CNAME',
};

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
  return formatDmd(new BigNumber(web3.utils.fromWei(wei, 'ether')));
}

export function formatDmdDate(timestampSeconds?: number | null): string {
  if (!timestampSeconds || !Number.isFinite(timestampSeconds)) {
    return '—';
  }
  return new Date(timestampSeconds * 1000).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function shortenAddress(address: string): string {
  if (address.length < 10) {
    return address;
  }
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function formatDnsHostname(name: string): string {
  return `${bareDmdName(name)}.${DMD_DNS_ZONE}`;
}

export function formatForwardingAddress(name: string): string {
  return `${bareDmdName(name)}@${DMD_DNS_ZONE}`;
}

export function dnsRecordType(type: DmdWebsiteTargetType): string | null {
  return type === 'none' ? null : DNS_RECORD_TYPES[type];
}

function parseIpv4(value: string): number[] | null {
  return IPV4_PATTERN.test(value) ? value.split('.').map(Number) : null;
}

function parseIpv6(value: string): number[] | null {
  let address = value;
  let tail: number[] = [];

  const embeddedIpv4 = /^(.*:)([^:]+\.[^:]+)$/.exec(address);
  if (embeddedIpv4) {
    const octets = parseIpv4(embeddedIpv4[2]);
    if (!octets) {
      return null;
    }
    tail = [(octets[0] << 8) | octets[1], (octets[2] << 8) | octets[3]];
    address = embeddedIpv4[1].endsWith('::') ? embeddedIpv4[1] : embeddedIpv4[1].slice(0, -1);
  }

  const halves = address.split('::');
  if (halves.length > 2) {
    return null;
  }

  const toGroups = (part: string) => (part ? part.split(':') : []);
  const head = toGroups(halves[0]);
  const rest = halves.length === 2 ? toGroups(halves[1]) : [];
  if (![...head, ...rest].every((group) => IPV6_GROUP_PATTERN.test(group))) {
    return null;
  }

  const known = head.length + rest.length + tail.length;
  if (halves.length === 1 ? known !== 8 : known > 7) {
    return null;
  }

  return [
    ...head.map((group) => parseInt(group, 16)),
    ...new Array<number>(halves.length === 2 ? 8 - known : 0).fill(0),
    ...rest.map((group) => parseInt(group, 16)),
    ...tail,
  ];
}

function formatIpv6(words: number[]): string {
  let bestStart = -1;
  let bestLength = 1;
  for (let i = 0; i < words.length; i += 1) {
    let length = 0;
    while (words[i + length] === 0) {
      length += 1;
    }
    if (length > bestLength) {
      bestStart = i;
      bestLength = length;
    }
    i += length;
  }

  const hex = words.map((word) => word.toString(16));
  if (bestStart < 0) {
    return hex.join(':');
  }
  return `${hex.slice(0, bestStart).join(':')}::${hex.slice(bestStart + bestLength).join(':')}`;
}

function isValidHostname(hostname: string): boolean {
  if (!hostname || hostname.length > MAX_HOSTNAME_LENGTH) {
    return false;
  }
  const labels = hostname.split('.');
  if (labels.length < 2) {
    return false;
  }
  if (!labels.every((label) => label.length <= MAX_LABEL_LENGTH && HOSTNAME_LABEL_PATTERN.test(label))) {
    return false;
  }
  return /^[a-z]/.test(labels[labels.length - 1]);
}

function isValidEmail(email: string): boolean {
  if (email.length > MAX_EMAIL_LENGTH) {
    return false;
  }
  const at = email.indexOf('@');
  if (at < 0) {
    return false;
  }
  const localPart = email.slice(0, at);
  return localPart.length <= MAX_LOCAL_PART_LENGTH
    && EMAIL_LOCAL_PART_PATTERN.test(localPart)
    && !localPart.startsWith('.')
    && !localPart.endsWith('.')
    && !localPart.includes('..')
    && isValidHostname(email.slice(at + 1));
}

export function normalizeHostnameInput(value: string): string {
  return value.trim().toLowerCase().replace(/\.$/, '');
}

export function normalizeEmailInput(value: string): string {
  return value.trim().toLowerCase();
}

export function parseIpAddress(value: string): DmdWebsiteTarget | null {
  const input = value.trim();
  const ipv4 = parseIpv4(input);
  if (ipv4) {
    return ipv4.some(Boolean) ? { type: 'ipv4', value: ipv4.join('.') } : null;
  }
  const ipv6 = parseIpv6(input);
  if (ipv6) {
    return ipv6.some(Boolean) ? { type: 'ipv6', value: formatIpv6(ipv6) } : null;
  }
  return null;
}

export function validateIpAddress(value: string): string | null {
  if (!value.trim()) {
    return 'Enter an IP address.';
  }
  return parseIpAddress(value) ? null : 'Enter a valid IPv4 or IPv6 address';
}

export function validateHostname(value: string): string | null {
  const hostname = normalizeHostnameInput(value);
  if (!hostname) {
    return 'Enter a hostname.';
  }
  return isValidHostname(hostname) ? null : 'Enter a valid hostname';
}

export function validateForwardingEmail(value: string): string | null {
  const email = normalizeEmailInput(value);
  if (!email) {
    return null;
  }
  return isValidEmail(email) ? null : 'Enter a valid email address';
}

export function ipAddressToHex(target: DmdWebsiteTarget): string {
  if (target.type === 'ipv4') {
    return `0x${target.value.split('.').map((octet) => Number(octet).toString(16).padStart(2, '0')).join('')}`;
  }
  const words = parseIpv6(target.value) ?? [];
  return `0x${words.map((word) => word.toString(16).padStart(4, '0')).join('')}`;
}

export function hexToIpAddress(type: 'ipv4' | 'ipv6', hex: string): string {
  const bytes = hex.replace(/^0x/i, '').match(/../g)?.map((byte) => parseInt(byte, 16)) ?? [];
  if (type === 'ipv4') {
    return bytes.join('.');
  }
  const words: number[] = [];
  for (let i = 0; i + 1 < bytes.length; i += 2) {
    words.push((bytes[i] << 8) | bytes[i + 1]);
  }
  return formatIpv6(words);
}

export function isSameWebsiteTarget(a: DmdWebsiteTarget, b: DmdWebsiteTarget): boolean {
  return a.type === b.type && (a.type === 'none' || a.value === b.value);
}

export function summarizeDnsConfig(config?: DmdDnsConfig | null): DmdDnsSummary {
  const parts: string[] = [];
  const recordType = config ? dnsRecordType(config.website.type) : null;
  if (recordType) {
    parts.push(recordType);
  }
  if (config?.emailForwarding) {
    parts.push('Email');
  }

  if (parts.length === 0) {
    return { state: 'not-set', label: 'Not set' };
  }
  return { state: 'configured', label: parts.join(' + ') };
}
