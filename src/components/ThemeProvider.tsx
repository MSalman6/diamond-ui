'use client';

import { useEffect } from 'react';
import { initializeTheme } from '@/utils/theme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeTheme();
  }, []);

  return <>{children}</>;
}