'use client';
import React from 'react';
import '../SharedStats/SharedStats.css';

interface Rpt30CellProps {
  rpt30: number;
  rpt30_delta?: number | null;
}

export default function Rpt30Cell({ rpt30, rpt30_delta }: Rpt30CellProps) {
  let deltaEl: React.ReactNode = null;
  if (rpt30_delta != null) {
    const sign = rpt30_delta > 0 ? '+' : '';
    const cls = rpt30_delta > 0 ? 'up' : rpt30_delta < 0 ? 'down' : 'flat';
    const arrow = rpt30_delta > 0 ? '▲' : rpt30_delta < 0 ? '▼' : '→';
    deltaEl = (
      <span className={`dmd-rpt30-cell__delta dmd-rpt30-cell__delta--${cls}`}>
        {arrow} {sign}{rpt30_delta.toFixed(2)}
      </span>
    );
  }
  return (
    <div className="dmd-rpt30-cell">
      <span className="dmd-rpt30-cell__value">{rpt30.toFixed(2)} DMD</span>
      <span className="dmd-rpt30-cell__sub">per 1000 / 30d</span>
      {deltaEl}
    </div>
  );
}
