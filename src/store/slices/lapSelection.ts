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
            const deleteItem = (index: number) => {
                state.splice(index, 1)
            } 

            for (const { driver, lap } of action.payload) {
                const i = state.findIndex(
                    ([existingDriver, existingLap]) =>
                        existingDriver === driver && existingLap === lap,
                )
                if (i !== -1) {
                    deleteItem(i)
                } else {
                    state.push([driver, lap])
                }
            }
        },
    },
})

export const { toggle: toggleDriverLapSelection } = DriverLapSelectionSlice.actions

export default DriverLapSelectionSlice.reducer
