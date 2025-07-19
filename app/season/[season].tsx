"use client"
import renderSeasonEventsAction from "@/src/actions/renderSeasonEventsAction"
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner"
import { useLocalSearchParams } from "expo-router"
import { Suspense, useMemo } from "react"
import { ScrollView, StyleSheet } from "react-native"

const style = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 16,
        paddingInline: 16,
    },
})

export default function Season() {
    const { season }: { season: string } = useLocalSearchParams()
    const seasonEvents = useMemo(() => renderSeasonEventsAction({ season }), [season])
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <ScrollView contentContainerStyle={style.container}>{seasonEvents}</ScrollView>
        </Suspense>
    )
}
