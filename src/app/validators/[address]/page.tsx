'use client';

import { useParams } from 'next/navigation';

export default function ValidatorDetails() {
  const params = useParams();
  const address = params?.address as string;

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Validator Details</h1>
      <p>Pool Address: {address}</p>
    </div>
  );
}
