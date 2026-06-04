'use client';
import '../SharedStats/SharedStats.css';
import { truncateAddress } from '@/utils/common';

interface ValidatorCellProps {
  address: string;
  subtext?: string;
  subtextClass?: 'green' | 'yellow' | 'red' | '';
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export default function ValidatorCell({ address, subtext, subtextClass = '', onClick }: ValidatorCellProps) {
  return (
    <div className="dmd-validator-cell" onClick={onClick}>
      <span className="dmd-validator-cell__addr">{truncateAddress(address)}</span>
      {subtext && (
        <span className={`dmd-validator-cell__sub${subtextClass ? ` dmd-validator-cell__sub--${subtextClass}` : ''}`}>
          {subtext}
        </span>
      )}
    </div>
  );
}
