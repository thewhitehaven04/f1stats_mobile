"use client"
import renderSeasonMetrics from "@/src/actions/render/sessionMetrics"
import renderSessionResults from "@/src/actions/render/sessionResults"
import { getColor } from "@/src/colorScheme"
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner"
import { useLocalSearchParams } from "expo-router"
import { Suspense, useMemo } from "react"
import { ScrollView, StyleSheet, View } from "react-native"

const styleSheet = StyleSheet.create({
    wrapper: {
        paddingTop: 8,
        paddingInline: 16,
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
    },
    card: {
        borderRadius: 16,
        borderWidth: 1,
    },
})

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

    const sessionResults = useMemo(
        () =>
            renderSessionResults({
                season,
                session: decodeURIComponent(session),
                event: decodeURIComponent(event),
            }),
        [season, session, event],
    )

    return (
        <ScrollView contentContainerStyle={styleSheet.wrapper}>
            <View style={{ ...styleSheet.card, borderColor: getColor("border") }}>
                <Suspense fallback={<LoadingSpinner />}>{sessionMetrics}</Suspense>
            </View>
            <Suspense fallback={<LoadingSpinner />}>{sessionResults}</Suspense>
        </ScrollView>
    )
}
