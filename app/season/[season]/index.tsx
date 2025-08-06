"use client"
import renderSeasonEventsAction from "@/src/actions/render/seasonEvents"
import { Button } from "@/src/components/ui/Button"
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Link, useLocalSearchParams, useRouter } from "expo-router"
import { Suspense, useMemo } from "react"
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { useSharedValue } from "react-native-reanimated"
import * as FontSizes from '@/src/fontSizes'

const style = StyleSheet.create({
    wrapperContent: {
        width: "100%",
    },
    viewContent: {
        display: "flex",
        flexDirection: "column",
        gap: 16,
        paddingTop: 8,
        paddingInline: 16,
        flex: 0,
    },
    scrollContainer: {
        gap: 16,
    },
    buttonWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
    collectionWrapper: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flex: 1,
    },
    error: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
})

const PAGE_REFRESH_SCROLL_THRESHOLD = 75
const VELOCITY_THRESHOLD = 75

export function ErrorBoundary() {
    return (
        <View>
            <Ionicons name="warning" size={64} />
            <Text style={{ fontSize: FontSizes.Title.lg }}>Something went wrong</Text>
        </View>
    )
}

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
        <SafeAreaView style={{ flex: 1 }}>
            <Suspense fallback={<LoadingSpinner />}>
                <GestureDetector gesture={scrollUp}>
                    <ScrollView contentContainerStyle={style.wrapperContent}>
                        <View style={style.viewContent}>
                            <View style={style.buttonWrapper}>
                                <Link href={`/season/${season}/selectorModal`} asChild>
                                    <Button label={season} />
                                </Link>
                            </View>
                            <View style={style.collectionWrapper}>
                                <ScrollView contentContainerStyle={style.scrollContainer}>
                                    {seasonEvents}
                                </ScrollView>
                            </View>
                        </View>
                    </ScrollView>
                </GestureDetector>
            </Suspense>
        </SafeAreaView>
    )
}
