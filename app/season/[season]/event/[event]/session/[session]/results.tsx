"use client"
import renderSeasonMetrics from "@/src/actions/render/sessionMetrics"
import { useLocalSearchParams } from "expo-router"
import { useMemo } from "react"
import { View } from "react-native"

export default function ResultsScreen() {
    const { season, session, event }: { season: string; session: string; event: string } =
        useLocalSearchParams()

    const sessionMetrics = useMemo(
        () =>
            renderSeasonMetrics({
                season,
                session: decodeURIComponent(session),
                event: decodeURIComponent(event),
            }),
        [season, session, event],
    )
    return <View style={{ paddingTop: 8, paddingInline: 16 }}>{sessionMetrics}</View>
}
