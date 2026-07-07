export type DmdNameAvailabilityStatus = 'available' | 'taken' | 'unavailable';

export interface DmdNameAvailabilityResult {
  status: DmdNameAvailabilityStatus;
  ownerAddress?: string;
  expiresAt?: number;
  registrationFee?: string;
  estimatedGas?: string;
  registrationFeeWei?: string;
  totalEstimatedCost?: string;
}

/** Status of a name owned by a wallet. */
export type OwnedDmdNameStatus = 'active' | 'inactive' | 'expiring-soon' | 'expired';

export interface OwnedDmdNameLastAction {
  type: string;
  timestamp: number;
}

/**
 * A single row of the "Owned names" table.
 */
export interface OwnedDmdName {
  name: string;
  status: OwnedDmdNameStatus;
  expiresAt: number;
  lastAction?: OwnedDmdNameLastAction;
}
