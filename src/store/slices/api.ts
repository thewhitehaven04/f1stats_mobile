import { ApiClient, BASE_URL, buildQueriesFromSelection } from "@/src/client"
import {
    getAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePost,
    getCircuitGeojsonApiSeasonYearEventEventCircuitGeojsonGet,
    getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost,
    getSessionLaptimesFilteredApiSeasonYearEventEventSessionSessionLapsPost,
} from "@/src/client/generated"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

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
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: ({ query }) => ({
        getLaps: query({
            queryFn: async (args: TSessionArgs & { driverSelection: string[] }) => {
                return {
                    data: (
                        await getSessionLaptimesFilteredApiSeasonYearEventEventSessionSessionLapsPost(
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
                    ).data,
                }
            },
        }),
        getLapTelemetries: query({
            queryFn: async ({
                selection,
                ...args
            }: TSessionArgs & { selection: [string, number][] }) => {
                return {
                    data: (
                        await getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost(
                            {
                                client: ApiClient,
                                path: args,
                                body: { queries: buildQueriesFromSelection(selection) },
                                throwOnError: true,
                            },
                        )
                    ).data,
                }
            },
        }),
        getAverageTelemetries: query({
            queryFn: async ({
                selection,
                ...args
            }: TSessionArgs & { selection: [string, number][] }) => {
                return {
                    data: (
                        await getAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePost(
                            {
                                client: ApiClient,
                                path: args,
                                body: { queries: buildQueriesFromSelection(selection) },
                                throwOnError: true,
                            },
                        )
                    ).data,
                }
            },
        }),
        getCircuitGeometry: query({
            queryFn: async ({ year, event }: { year: string; event: string }) => {
                return {
                    data: (
                        await getCircuitGeojsonApiSeasonYearEventEventCircuitGeojsonGet({
                            client: ApiClient,
                            path: { year, event },
                            throwOnError: true,
                        })
                    ).data,
                }
            },
        }),
    }),
})

export const {
    useGetLapTelemetriesQuery,
    usePrefetch,
    useGetAverageTelemetriesQuery,
    useGetLapsQuery,
    useGetCircuitGeometryQuery
} = ApiSlice
