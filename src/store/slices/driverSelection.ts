import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { OnChangeFn, RowSelectionState } from "@tanstack/react-table"

type TDriverSelectionState = RowSelectionState

const initialSelection: TDriverSelectionState = {}

const driverSelectionSlice = createSlice({
    name: "driverSelection",
    initialState: initialSelection,
    reducers: {
        updateSelection: (state, action: PayloadAction<OnChangeFn<TDriverSelectionState>>) => {
            return action.payload(state)
        },
        toggle: (state, action: PayloadAction<{ driver: string }>) => {
            return { ...state, [action.payload.driver]: !state[action.payload.driver] }
        },
    },
    selectors: {
        listLaps: (state) =>
            Object.entries(state)
                .filter(([_, isSelected]) => !isSelected)
                .map(([driver]) => driver),
    },
})

export const { updateSelection, toggle: toggleDriver } = driverSelectionSlice.actions

export const { listLaps } = driverSelectionSlice.selectors

export default driverSelectionSlice.reducer
