"use client"

import { store } from '@/src/store'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, type ReactNode } from "react"
import { Provider } from "react-redux"

export const Providers = ({ children }: { children: ReactNode }) => {
    const [client] = useState(
        new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 60 * 1000,
                },
            },
        }),
    )
    return (
        <QueryClientProvider client={client}>
            <Provider store={store}>{children}</Provider>
        </QueryClientProvider>
    )
}
