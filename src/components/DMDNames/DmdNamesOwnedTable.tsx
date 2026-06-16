'use client';

import { formatDmdName } from '@/utils/dmdNaming';

type Props = {
  registeredName: string | null;
};

export default function DmdNamesOwnedTable({ registeredName }: Props) {
  return (
    <div className="dmd-names-owned">
      <h2>Registered name</h2>
      {registeredName ? (
        <p className="dmd-names-registered-value">{formatDmdName(registeredName)}</p>
      ) : (
        <p className="dmd-names-empty">No name registered for this address.</p>
      )}
    </div>
  );
}
