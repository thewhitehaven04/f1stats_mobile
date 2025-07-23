import type { RowSelectionState } from "@tanstack/react-table"
import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

const DriverSelectionContext = createContext<RowSelectionState>({})
const DriverSelectionDispatchContext = createContext<{
    updateDriverState: React.Dispatch<React.SetStateAction<RowSelectionState>>
    deleteDriver: (driverId: string) => void
}>({
    updateDriverState: () => {},
    deleteDriver: () => {},
})

export const DriverSelection = ({ children }: { children?: ReactNode }) => {
    const [drivers, setDrivers] = useState<RowSelectionState>({})

    const deleteDriver = (driverId: string) => {
        setDrivers((prevState) => {
            return {
                ...prevState,
                [driverId]: false,
            }
        })
    }

    const dispatchCtxValue = useMemo(
        () => ({
            updateDriverState: setDrivers,
            deleteDriver,
        }),
        [],
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
