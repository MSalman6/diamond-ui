import Link from 'next/link';
import type { OwnedDmdName } from '@/types/dmdNaming';

type Props = {
  names?: OwnedDmdName[];
};

function statusClass(status: OwnedDmdName['status']) {
  if (status === 'active') return 'status-badge active';
  if (status === 'expiring-soon') return 'status-badge dmd-status-expiring';
  return 'status-badge';
}

function displayName(name: string) {
  return name.endsWith('.dmd') ? name : `${name}.dmd`;
}

export default function DmdNamesOwnedTable({ names = [] }: Props) {
  return (
    <div className="dmd-names-owned">
      <h2>Owned names</h2>
      <div className="table-container">
        <table className="validators-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Expiration</th>
              <th>DNS</th>
              <th>Last action</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {names.length === 0 ? (
              <tr>
                <td colSpan={6} className="dmd-names-empty">
                  No owned names to display.
                </td>
              </tr>
            ) : (
              names.map((entry) => (
                <tr key={entry.name}>
                  <td>
                    <Link href={`/dmd-names/history/${entry.name.replace(/\.dmd$/, '')}`}>
                      {displayName(entry.name)}
                    </Link>
                  </td>
                  <td>
                    <span className={statusClass(entry.status)}>
                      {entry.status === 'expiring-soon' ? 'Expiring soon' : entry.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{entry.expiration}</td>
                  <td>{entry.dns}</td>
                  <td>{entry.lastAction}</td>
                  <td>
                    <div className="dmd-names-actions">
                      {entry.status === 'inactive' ? (
                        <button type="button" className="btn-primary btn-sm">Activate</button>
                      ) : (
                        <button type="button" className="btn-secondary btn-sm">Renew</button>
                      )}
                      <button type="button" className="btn-secondary btn-sm">History</button>
                      <button type="button" className="btn-secondary btn-sm">Transfer</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
