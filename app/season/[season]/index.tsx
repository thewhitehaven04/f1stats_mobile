"use client"
import renderSeasonEventsAction from "@/src/actions/render/seasonEvents"
import { Button } from "@/src/components/ui/Button"
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner"
import { Link, useLocalSearchParams, useRouter } from "expo-router"
import { Suspense, useMemo, useState } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { useSharedValue } from "react-native-reanimated"

const style = StyleSheet.create({
    wrapperContent: {
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

const PAGE_REFRESH_SCROLL_THRESHOLD = 75
const VELOCITY_THRESHOLD = 75

export default function SeasonScreen() {
    const { season }: { season: string } = useLocalSearchParams()

    const seasonEvents = useMemo(() => renderSeasonEventsAction({ season }), [season])

    const { replace } = useRouter()

    const isSufficientlyPanned = useSharedValue(false)

    const scrollUp = useMemo(
        () =>
            Gesture.Pan()
                .minDistance(10)
                .onUpdate((event) => {
                    console.log(event.translationY)
                    if (
                        event.translationY >= PAGE_REFRESH_SCROLL_THRESHOLD &&
                        event.velocityY >= VELOCITY_THRESHOLD
                    ) {
                        isSufficientlyPanned.value = true
                        replace(`/season/${season}`, {
                            relativeToDirectory: true
                        })
                    }
                })
                .onEnd(() => {
                    if (isSufficientlyPanned) {
                        isSufficientlyPanned.value = false
                    }
                })
                .runOnJS(true),
        [isSufficientlyPanned, replace, season],
    )

    return (
        <GestureDetector gesture={scrollUp}>
            <ScrollView contentContainerStyle={style.wrapperContent}>
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
        </GestureDetector>
    )
}
