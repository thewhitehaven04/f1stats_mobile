import type { TRootState } from "@/src/store"
import { createSelector, createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RowSelectionState, Updater } from "@tanstack/react-table"

const initialSelection = {
    driverResultSelection: {} as RowSelectionState,
}

const driverSelectionSlice = createSlice({
    name: "driverSelection",
    initialState: initialSelection,
    reducers: {
        updateSelection: (state, action: PayloadAction<Updater<RowSelectionState>>) => {
            if (typeof action.payload !== "function") {
                state.driverResultSelection = action.payload
            } else {
                state.driverResultSelection = action.payload(state.driverResultSelection)
            }
        },
        toggle: (state, action: PayloadAction<{ driver: string }>) => {
            state.driverResultSelection[action.payload.driver] =
                !state.driverResultSelection[action.payload.driver]
        },
    },
})

export const selectDriverList = createSelector(
    (state: TRootState) => state.driverSelection.driverResultSelection,
    (driverList) =>
        Object.entries(driverList)
            .filter(([_, isSelected]) => isSelected)
            .map(([driver]) => driver),
)

export const { updateSelection, toggle: toggleDriver } = driverSelectionSlice.actions

export default driverSelectionSlice.reducer
