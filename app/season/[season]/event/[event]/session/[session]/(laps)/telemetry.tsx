'use client'
import { ApiClient } from "@/src/client"
import { getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost } from "@/src/client/generated"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { Text } from "react-native"

export default function Telemetry() {
    const { season, session, event }: { season: string; session: string; event: string } =
        useLocalSearchParams()

    const { data } = useSuspenseQuery({
        queryKey: [],
        queryFn: () =>
            getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost({
                client: ApiClient,
                body: {
                    queries: [],
                },
                path: {
                    session,
                    event,
                    year: season,
                },
            }),
    })
    return <Text>Introducing golden cope</Text>
}
