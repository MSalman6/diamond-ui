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
