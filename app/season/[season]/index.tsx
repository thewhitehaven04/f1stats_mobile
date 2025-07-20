"use client"
import renderSeasonEventsAction from "@/src/actions/render/seasonEvents"
import { Button } from "@/src/components/ui/Button"
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner"
import { Link, useLocalSearchParams } from "expo-router"
import { Suspense, useMemo } from "react"
import { ScrollView, StyleSheet, Text } from "react-native"

const style = StyleSheet.create({
    wrapContainer: {
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 16,
        paddingBlock: 16,
        width: "100%",
    },
    scrollContainer: {
        gap: 16,
    },
})

export default function SeasonScreen() {
    const { season }: { season: string } = useLocalSearchParams()

    const seasonEvents = useMemo(() => renderSeasonEventsAction({ season }), [season])

    return (
        <ScrollView contentContainerStyle={style.wrapContainer}>
            <Link href={`/season/${season}/selectorModal`} asChild>
                <Button>
                    <Text>{season}</Text>
                </Button>
            </Link>
            <Suspense fallback={<LoadingSpinner />}>
                <ScrollView contentContainerStyle={style.scrollContainer}>
                    {seasonEvents}
                </ScrollView>
            </Suspense>
        </ScrollView>
    )
}
