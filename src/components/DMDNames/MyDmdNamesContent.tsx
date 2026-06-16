'use client';

import { useCallback, useEffect, useState } from 'react';
import { useWeb3Context } from '@/contexts/Web3';
import DmdNameSearch from './DmdNameSearch';
import DmdNamesOwnedTable from './DmdNamesOwnedTable';
import RegisterNameModal from './RegisterNameModal';
import { getWalletDmdName } from '@/services/dmdNaming';
import type { DmdNameAvailabilityResult } from '@/types/dmdNaming';

type Props = {
  walletAddress: string;
};

export default function MyDmdNamesContent({ walletAddress }: Props) {
  const { contractsManager, web3Initialized } = useWeb3Context();
  const [registeredName, setRegisteredName] = useState<string | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const [registerAvailability, setRegisterAvailability] = useState<DmdNameAvailabilityResult | null>(null);

  const reloadRegisteredName = useCallback(() => {
    const contract = contractsManager.diamondRegistryContract;
    if (!web3Initialized || !contract) {
      setRegisteredName(null);
      return;
    }

    getWalletDmdName(contract, walletAddress).then(setRegisteredName);
  }, [contractsManager.diamondRegistryContract, walletAddress, web3Initialized]);

  useEffect(() => {
    reloadRegisteredName();
  }, [reloadRegisteredName]);

  const openRegister = (name: string, availability: DmdNameAvailabilityResult) => {
    setRegisterName(name);
    setRegisterAvailability(availability);
    setRegisterOpen(true);
  };

  return (
    <>
      <div className="dmd-names-search-card">
        <DmdNameSearch variant="page" showExamples onRegisterName={openRegister} />
      </div>

      <DmdNamesOwnedTable registeredName={registeredName} />

      <RegisterNameModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        name={registerName}
        availability={registerAvailability}
        currentName={registeredName}
        walletAddress={walletAddress}
        onComplete={reloadRegisteredName}
      />
    </>
  );
}
