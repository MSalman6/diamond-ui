import Link from 'next/link';
import type { DmdNameAvailabilityResult } from '@/types/dmdNaming';

type Props = {
  state: 'invalid' | 'available' | 'taken' | 'unavailable';
  name: string;
  rawInput?: string;
  result?: DmdNameAvailabilityResult;
  onCreateName?: () => void;
};

export default function DmdNameSearchResult({ state, name, rawInput, result, onCreateName }: Props) {
  const label = rawInput ?? name;
  const fullName = `${name}.dmd`;

  if (state === 'invalid') {
    return (
      <div className="dmd-search-result dmd-search-result-invalid">
        <div className="dmd-search-result-badge">
          <i className="fas fa-times-circle"></i> Invalid
        </div>
        <div className="dmd-search-result-body">
          <p><strong>{label} cannot be used</strong></p>
          <p>Use lowercase letters, numbers and hyphens only.</p>
        </div>
      </div>
    );
  }

  if (state === 'available') {
    return (
      <div className="dmd-search-result dmd-search-result-available">
        <div className="dmd-search-result-badge">
          <i className="fas fa-check-circle"></i> Available
        </div>
        <div className="dmd-search-result-body">
          <p><strong>{fullName} is available</strong></p>
          {(result?.mintingFee || result?.estimatedGas) && (
            <p>
              {result?.mintingFee && `Minting fee: ${result.mintingFee}`}
              {result?.mintingFee && result?.estimatedGas && ' · '}
              {result?.estimatedGas && `Estimated gas: ${result.estimatedGas}`}
            </p>
          )}
        </div>
        <button type="button" className="dmd-btn-create" onClick={onCreateName}>
          Create name
        </button>
      </div>
    );
  }

  if (state === 'taken') {
    return (
      <div className="dmd-search-result dmd-search-result-taken">
        <div className="dmd-search-result-badge">
          <i className="fas fa-exclamation-circle"></i> Taken
        </div>
        <div className="dmd-search-result-body">
          <p><strong>{fullName} is already registered</strong></p>
          <p>
            {result?.expiresAt && `Expires: ${result.expiresAt} · `}
            <Link href={`/dmd-names/history/${name}`}>View history</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="dmd-search-result dmd-search-result-unavailable">
      <div className="dmd-search-result-badge">
        <i className="fas fa-exclamation-triangle"></i> Unavailable
      </div>
      <div className="dmd-search-result-body">
        <p><strong>Blockchain unavailable</strong></p>
        <p>Unable to verify username availability. Please try again later.</p>
      </div>
    </div>
  );
}
