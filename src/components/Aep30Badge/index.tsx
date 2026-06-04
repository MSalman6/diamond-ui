'use client';
import '../SharedStats/SharedStats.css';

interface Aep30BadgeProps {
  aep30: number; // 0.0 – 1.0
}

export default function Aep30Badge({ aep30 }: Aep30BadgeProps) {
  const pct = aep30 * 100;
  const tier = pct >= 80 ? 'green' : pct >= 50 ? 'yellow' : 'red';
  return (
    <span className={`dmd-aep30-badge dmd-aep30-badge--${tier}`}>
      {pct.toFixed(0)}%
    </span>
  );
}
