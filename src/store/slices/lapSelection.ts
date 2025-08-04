import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type TDriverLapSelectionState = [string, number][]

const initialState: TDriverLapSelectionState = []

export type TSelection = {
    driver: string
    lap: number
}

const DriverLapSelectionSlice = createSlice({
    name: "lapSelection",
    initialState,
    reducers: {
        toggle: (state, action: PayloadAction<TSelection[]>) => {
            const newState = [...state]
            for (const { driver, lap } of action.payload) {
                const i = state.findIndex(
                    ([existingDriver, existingLap]) =>
                        existingDriver === driver && existingLap === lap,
                )
                if (i !== -1) {
                    state.splice(i, 1)
                } else {
                    newState.push([driver, lap])
                }
            }

            return newState
        },
    },
    selectors: {
        isSelected: (state, selection: TSelection) =>
            !!state.find(([driver, lap]) => driver === selection.driver && lap === selection.lap),
    },
})

export const { toggle: toggleDriverLapSelection } = DriverLapSelectionSlice.actions
export const { isSelected } = DriverLapSelectionSlice.selectors

export default DriverLapSelectionSlice.reducer
