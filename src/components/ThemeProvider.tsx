'use client';

import { useEffect, useState } from 'react';
import { initializeTheme } from '@/utils/theme';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    initializeTheme();
  }, []);

  // Prevent hydration mismatch by not rendering theme-dependent content on server
  if (!isClient) {
    return <>{children}</>;
  }

  return <>{children}</>;
}