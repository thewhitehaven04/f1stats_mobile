import { TelemetryLapSelection, useTelemetryLapSelection } from "@/src/atoms/telemetryLapSelection"
import { ApiClient } from "@/src/client"
import {
    getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost,
    type SessionQuery,
} from "@/src/client/generated"
import { useQueryClient } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { useAtomValue } from 'jotai'
import { useEffect, useRef } from "react"

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
    const client = useQueryClient()
    const { season, session, event }: { season: string; session: string; event: string } =
        useLocalSearchParams()

    const timeoutRef = useRef<number>(null)

    const selection = useAtomValue(TelemetryLapSelection)

    useEffect(() => {
        const queries = buildQueriesFromSelection(selection)
        timeoutRef.current = setTimeout(
            () =>
                client.prefetchQuery({
                    queryKey: [season, session, event, "telemetry", queries],
                    queryFn: () =>
                        getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost({
                            client: ApiClient,
                            body: {
                                queries,
                            },
                            path: {
                                session,
                                event,
                                year: season,
                            },
                        }),
                    staleTime: Infinity,
                }),
            500,
        )

        return () => clearTimeout(timeoutRef.current)
    }, [client, event, season, session, selection])
}
