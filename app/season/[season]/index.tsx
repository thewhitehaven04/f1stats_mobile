"use client"
import renderSeasonEventsAction from "@/src/actions/render/seasonEvents"
import { Button } from "@/src/components/ui/Button"
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner"
import { Link, useLocalSearchParams, useRouter } from "expo-router"
import { Suspense, useMemo } from "react"
import { PlatformColor, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { useSharedValue } from "react-native-reanimated"

const style = StyleSheet.create({
    wrapperContent: {
        width: "100%",
    },
    viewContent: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        paddingTop: 8,
        paddingInline: 16,
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
                    if (
                        event.translationY >= PAGE_REFRESH_SCROLL_THRESHOLD &&
                        event.velocityY >= VELOCITY_THRESHOLD
                    ) {
                        isSufficientlyPanned.value = true
                        replace(`/season/${season}`, {
                            relativeToDirectory: true,
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
                <SafeAreaView>
                    <View style={style.viewContent}>
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                            }}
                        >
                            <Link href={`/season/${season}/selectorModal`} asChild>
                                <Button>
                                    <Text style={style.seasonSelector}>{season}</Text>
                                </Button>
                            </Link>
                        </View>
                        <Suspense fallback={<LoadingSpinner />}>
                            <ScrollView contentContainerStyle={style.scrollContainer}>
                                {seasonEvents}
                            </ScrollView>
                        </Suspense>
                    </View>
                </SafeAreaView>
            </ScrollView>
        </GestureDetector>
    )
}
