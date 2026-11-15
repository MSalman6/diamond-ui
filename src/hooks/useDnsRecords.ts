'use client';

import { useCallback, useEffect, useState } from 'react';
import { useWeb3Context } from '@/contexts/Web3';
import { getDnsConfig, getWalletDmdName, supportsDnsRecords } from '@/services/dmdNaming';
import type { DmdDnsConfig } from '@/types/dmdNaming';

export function useDnsRecords(walletAddress: string) {
  const { contractsManager } = useWeb3Context();
  const registrar = contractsManager.diamondRegistryContract;
  const resolver = contractsManager.diamondResolverContract;
  const [supported, setSupported] = useState(false);
  const [activeName, setActiveName] = useState<string | null>(null);
  const [config, setConfig] = useState<DmdDnsConfig | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    setSupported(false);
    if (!resolver) {
      return;
    }

    let cancelled = false;
    supportsDnsRecords(resolver)
      .then((result) => {
        if (!cancelled) setSupported(result);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [resolver]);

  useEffect(() => {
    if (!supported || !registrar || !resolver || !walletAddress) {
      setActiveName(null);
      setConfig(null);
      return;
    }

    let cancelled = false;
    getWalletDmdName(registrar, walletAddress)
      .then(async (name) => {
        const nextConfig = name ? await getDnsConfig(resolver, name) : null;
        if (cancelled) return;
        setActiveName(name);
        setConfig(nextConfig);
      })
      .catch(() => {
        if (cancelled) return;
        setActiveName(null);
        setConfig(null);
      });

    return () => {
      cancelled = true;
    };
  }, [supported, registrar, resolver, walletAddress, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { supported, activeName, config, reload };
}
