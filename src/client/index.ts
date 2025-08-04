import {
    getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost,
    getSessionLaptimesFilteredApiSeasonYearEventEventSessionSessionLapsPost,
} from "@/src/client/generated"
import { buildQueriesFromSelection } from "@/src/components/LapSelectionTable/useTelemetryPrefetch"
import { createClient } from "@hey-api/client-fetch"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const baseUrl = process.env.EXPO_PUBLIC_API_URL

const ApiClient = createClient({
    baseUrl,
})

export type TSession =
    | "Race"
    | "Sprint"
    | "Sprint Qualifying"
    | "Sprint"
    | "Practice 1"
    | "Practice 2"
    | "Practice 3"

type TSessionArgs = {
    year: string
    event: string
    session: TSession
}

export const ApiSlice = createApi({
    reducerPath: "laps",
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (build) => ({
        getLaps: build.query({
            queryFn: async (args: TSessionArgs & { driverSelection: string[] }) => {
                return await getSessionLaptimesFilteredApiSeasonYearEventEventSessionSessionLapsPost(
                    {
                        client: ApiClient,
                        path: args,
                        body: {
                            queries: args.driverSelection.map((driver) => ({
                                driver,
                                lap_filter: null,
                            })),
                        },
                        throwOnError: true,
                    },
                )
            },
        }),
        getLapTelemetries: build.query({
            queryFn: async ({
                selection,
                ...args
            }: TSessionArgs & { selection: [string, number][] }) => {
                return await getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost({
                    client: ApiClient,
                    path: args,
                    body: {
                        queries: buildQueriesFromSelection(selection),
                    },
                    throwOnError: true,
                })
            },
        }),
        getAverageTelemetries: build.query({
            queryFn: async ({
                selection,
                ...args
            }: TSessionArgs & { selection: [string, number][] }) => {
                return await getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost({
                    client: ApiClient,
                    path: args,
                    body: {
                        queries: buildQueriesFromSelection(selection),
                    },
                    throwOnError: true,
                })
            },
        }),
    }),
})

export const {
    useGetAverageTelemetriesQuery,
    useGetLapsQuery,
    useGetLapTelemetriesQuery,
    usePrefetch,
} = ApiSlice
