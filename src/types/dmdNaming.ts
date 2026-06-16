export type DmdNameAvailabilityStatus = 'available' | 'taken' | 'unavailable';

export interface DmdNameAvailabilityResult {
  status: DmdNameAvailabilityStatus;
  ownerAddress?: string;
  registrationFee?: string;
  estimatedGas?: string;
  registrationFeeWei?: string;
  totalEstimatedCost?: string;
}
