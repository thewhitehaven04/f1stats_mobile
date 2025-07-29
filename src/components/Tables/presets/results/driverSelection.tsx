import { getDriverLaps } from "@/src/fetchers/laps"
import { useQueryClient } from "@tanstack/react-query"
import type { RowSelectionState } from "@tanstack/react-table"
import { useLocalSearchParams } from "expo-router"
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

const DriverSelectionContext = createContext<RowSelectionState>({})
const DriverSelectionDispatchContext = createContext<{
    updateDriverState: (state: RowSelectionState) => void
    deleteDriver: (driverId: string) => void
}>({
    updateDriverState: () => {},
    deleteDriver: () => {},
})

export const DriverSelection = ({ children }: { children?: ReactNode }) => {
    const [drivers, setDrivers] = useState<RowSelectionState>({})
    const { season, event, session }: { season: string; event: string; session: string } =
        useLocalSearchParams()

    const deleteDriver = (driverId: string) => {
        setDrivers((prevState) => {
            return {
                ...prevState,
                [driverId]: false,
            }
        })
    }

    const queryClient = useQueryClient()

    const updateDriverState = useCallback(
        (state: RowSelectionState) => {
            setDrivers(state)
            queryClient.prefetchQuery({
                queryKey: [season, event, session, drivers],
                queryFn: () =>
                    getDriverLaps({
                        event,
                        season,
                        session,
                        drivers: Object.entries(state)
                            .filter(([_, isSelected]) => isSelected)
                            .map(([driverId]) => driverId),
                    }),
                staleTime: Infinity,
            })
        },
        [drivers, event, queryClient, season, session],
    )

    const dispatchCtxValue = useMemo(
        () => ({
            updateDriverState,
            deleteDriver,
        }),
        [updateDriverState],
    )

    return (
        <DriverSelectionContext.Provider value={drivers}>
            <DriverSelectionDispatchContext.Provider value={dispatchCtxValue}>
                {children}
            </DriverSelectionDispatchContext.Provider>
        </DriverSelectionContext.Provider>
    )
}

export const useDriverSelection = () => {
    return useContext(DriverSelectionContext)
}

export const useDriverSelectionDispatch = () => {
    return useContext(DriverSelectionDispatchContext)
}
