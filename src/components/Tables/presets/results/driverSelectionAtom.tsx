import type { RowSelectionState } from "@tanstack/react-table"
import { atom, useAtomValue } from "jotai"

export const DriverSelection = atom<RowSelectionState>({})

export const useDriverSelectionList = () => {
    const driverSelection = useAtomValue(DriverSelection)
    return Object.entries(driverSelection)
        .filter(([_, isSelected]) => isSelected)
        .map(([driver]) => driver)
}
