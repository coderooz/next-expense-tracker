'use client';

import type { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { AppProvider } from './AppContext';

export default function AppProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </SessionProvider>
  );
}

export { AppProviders };
