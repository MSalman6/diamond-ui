'use client';
import BigNumber from 'bignumber.js';
import '../SharedStats/SharedStats.css';

const MAX_STAKE_WEI = BigNumber(50000).multipliedBy(1e18);

interface SaturationBarProps {
  totalStakeWei: string | BigNumber;
}

export default function SaturationBar({ totalStakeWei }: SaturationBarProps) {
  const pct = BigNumber(totalStakeWei).dividedBy(MAX_STAKE_WEI).multipliedBy(100);
  const pctNum = Math.min(Math.max(pct.toNumber(), 0), 100);
  const tier = pctNum >= 90 ? 'red' : pctNum >= 70 ? 'yellow' : 'green';
  return (
    <div className="dmd-sat-bar">
      <span className="dmd-sat-bar__label">{pctNum.toFixed(1)}%</span>
      <div className="dmd-sat-bar__track">
        <div
          className={`dmd-sat-bar__fill dmd-sat-bar__fill--${tier}`}
          style={{ width: `${pctNum}%` }}
        />
      </div>
    </div>
  );
}
