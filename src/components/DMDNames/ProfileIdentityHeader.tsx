import type { CSSProperties, ReactNode } from 'react';

type Props = {
  address: string;
  activeName?: string | null;
  wrapperClass?: string;
  avatarStyle?: CSSProperties;
  statusBadge?: ReactNode;
  subtitle?: string;
};

export default function ProfileIdentityHeader({
  address,
  activeName,
  wrapperClass = 'user-wallet',
  avatarStyle,
  statusBadge,
  subtitle = 'User Account',
}: Props) {
  return (
    <div className={wrapperClass}>
      <div className="wallet-icon large">
        <div
          className="wallet-icon-inner"
          style={avatarStyle ?? { background: 'linear-gradient(45deg, #6ee7b7, #3b82f6)' }}
        />
      </div>
      <div className="wallet-details">
        {activeName && <h1 className="profile-dmd-name">{activeName}.dmd</h1>}
        <div className="profile-wallet-row">
          {activeName ? (
            <span className="profile-wallet-address">{address}</span>
          ) : (
            <h1>{address}</h1>
          )}
          {statusBadge}
        </div>
        {!activeName && !statusBadge && subtitle && <p>{subtitle}</p>}
      </div>
    </div>
  );
}
