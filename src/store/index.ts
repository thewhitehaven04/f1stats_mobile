import { configureStore } from "@reduxjs/toolkit"
import DriverSelectionReducer from "./slices/driverSelection"
import { ApiSlice } from "@/src/client"
import { useDispatch, useSelector, useStore } from "react-redux"
import DriverLapSelectionReducer from "./slices/lapSelection"

export const store = configureStore({
    reducer: {
        driverSelection: DriverSelectionReducer,
        lapSelection: DriverLapSelectionReducer,
        [ApiSlice.reducerPath]: ApiSlice.reducer,
    },
})

type AppStore = typeof store

export type TRootState = ReturnType<AppStore["getState"]>
export type TRootDispatch = AppStore["dispatch"]

export const useAppDispatch = useDispatch.withTypes<TRootDispatch>()
export const useAppSelector = useSelector.withTypes<TRootState>()
export const useAppStore = useStore.withTypes<AppStore>()
