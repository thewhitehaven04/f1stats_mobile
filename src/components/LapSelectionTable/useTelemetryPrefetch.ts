import { TelemetryLapSelection } from "@/src/atoms/telemetryLapSelection"
import { ApiClient } from "@/src/client"
import {
    getAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePost,
    type SessionQuery,
} from "@/src/client/generated"
import { usePrefetchQuery } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { useAtomValue } from "jotai"

export const buildQueriesFromSelection = (selection: [string, number][]) => {
    const queries: SessionQuery[] = []

    for (const [driver, lap] of selection) {
        const drv = queries.find((q) => q.driver === driver)

        if (!drv) {
            queries.push({
                driver,
                lap_filter: [lap],
            })
        } else {
            if (drv.lap_filter) {
                drv.lap_filter.push(lap)
            }
        }
    }

    return queries
}

export const useTelemetryPrefetchOnSelectionChange = () => {
    const { season, session, event }: { season: string; session: string; event: string } =
        useLocalSearchParams()

    const selection = useAtomValue(TelemetryLapSelection)
    const queries = buildQueriesFromSelection(selection)

    usePrefetchQuery({
        queryKey: [season, session, event, "telemetry", queries],
        queryFn: () => {
            if (!queries.length) {
                return null
            }

            return getAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePost({
                client: ApiClient,
                body: {
                    queries,
                },
                path: {
                    session,
                    event,
                    year: season,
                },
            })
        },
    })
}
