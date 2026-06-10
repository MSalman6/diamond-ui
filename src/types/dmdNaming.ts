export type DmdNameAvailabilityStatus = 'available' | 'taken' | 'unavailable';

export interface DmdNameAvailabilityResult {
  status: DmdNameAvailabilityStatus;
  expiresAt?: string;
  mintingFee?: string;
  estimatedGas?: string;
}

export type OwnedDmdNameStatus = 'active' | 'inactive' | 'expiring-soon';

export interface OwnedDmdName {
  name: string;
  status: OwnedDmdNameStatus;
  expiration: string;
  dns?: string;
  lastAction: string;
}
