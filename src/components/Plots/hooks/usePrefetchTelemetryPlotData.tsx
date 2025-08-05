import { usePrefetch, type TSession } from "@/src/store/slices/api"
import { useCallback, useEffect } from "react"

export const useTelemetryPrefetch = (props: {
    season: string
    event: string
    session: string
    selection: [string, number][]
}) => {
    const { season, session, event, selection } = props
    const prefetch = usePrefetch("getAverageTelemetries", {
        ifOlderThan: 0.5,
    })

    const prefetchTelemetryData = useCallback(
        ({ selection }: { selection: [string, number][] }) => {
            prefetch({
                selection,
                session: decodeURIComponent(session) as TSession,
                event: decodeURIComponent(event),
                year: season,
            })
        },
        [event, prefetch, season, session],
    )

    useEffect(() => {
        if (selection.length > 0) {
            prefetchTelemetryData({ selection })
        }
    }, [selection, prefetchTelemetryData])
}
