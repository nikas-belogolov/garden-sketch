'use client'
import { Provider as JotaiProvider } from 'jotai'

import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { getQueryClient } from './get-query-client'
import { AuthProvider } from '@/lib/context/AuthContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return (
    <AuthProvider>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </JotaiProvider>
    </AuthProvider>
  )
}