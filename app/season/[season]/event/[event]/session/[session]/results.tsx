"use client"
import renderSeasonMetrics from "@/src/actions/render/sessionMetrics"
import renderSessionResults from "@/src/actions/render/sessionResults"
import { getColor } from "@/src/colorScheme"
import { DriverSelectionBar } from "@/src/components/DriverSelectionBar"
import { BEZIER_IN_OUT_BASE } from "@/src/components/ui/CollapsableListItem"
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner"
import { useAppSelector } from "@/src/store"
import { useLocalSearchParams } from "expo-router"
import { Suspense, useEffect, useMemo } from "react"
import { StyleSheet, useColorScheme, View } from "react-native"
import Animated, {
    Easing,
    FadingTransition,
    LinearTransition,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated"
import { SafeAreaView } from "react-native-safe-area-context"

const styleSheet = StyleSheet.create({
    wrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        paddingTop: 8,
        paddingInline: 16,
        gap: 16,
        height: "100%",
    },
    scroll: {
        flexDirection: "column",
        alignItems: "stretch",
        gap: 16,
        flexGrow: 1,
    },
    card: {
        borderRadius: 16,
        borderWidth: 0,
        width: "100%",
        backgroundColor: getColor("muted"),
        flexGrow: 0,
        flexShrink: 0,
    },
    footer: {
        position: "absolute",
        bottom: 16,
        width: "90%",
        left: "50%",
    },
})

export default function ResultsScreen() {
    const { season, session, event }: { season: string; session: string; event: string } =
        useLocalSearchParams()

    const colorScheme = useColorScheme()
    const resultSelection = useAppSelector(
        ({ driverSelection }) => driverSelection.driverResultSelection,
    )

    const hasSelection = !!Object.entries(resultSelection).filter(([_, isSelected]) => isSelected)
        .length

    const sessionMetrics = useMemo(
        () =>
            renderSeasonMetrics({
                season,
                session: decodeURIComponent(session),
                event: decodeURIComponent(event),
                darkMode: colorScheme === "dark",
            }),
        [season, session, event, colorScheme],
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

    const svPadding = useSharedValue(hasSelection ? 96 : 16)

    const padding = useAnimatedStyle(() => ({
        padding: svPadding.value,
    }))

    useEffect(() => {
        if (hasSelection) {
            svPadding.value = withTiming(96, { duration: 300 })
        } else {
            svPadding.value = withTiming(16, { duration: 300 })
        }
    }, [hasSelection, svPadding])

    return (
        <SafeAreaView edges={["top", "left", "right"]}>
            <Animated.View style={[styleSheet.wrapper, padding]}>
                <Suspense fallback={<LoadingSpinner />}>
                    <View style={{ ...styleSheet.card, borderColor: getColor("border") }}>
                        {sessionMetrics}
                    </View>
                    {sessionResults}
                </Suspense>
            </Animated.View>
            <DriverSelectionBar />
        </SafeAreaView>
    )
}
