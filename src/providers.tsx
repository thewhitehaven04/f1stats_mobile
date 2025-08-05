"use client"

import { store } from "@/src/store"
import { type ReactNode } from "react"
import { Provider } from "react-redux"

export const Providers = ({ children }: { children: ReactNode }) => {
    return <Provider store={store}>{children}</Provider>
}
