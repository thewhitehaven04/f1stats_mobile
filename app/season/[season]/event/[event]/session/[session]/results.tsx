"use client"
import renderSeasonMetrics from "@/src/actions/render/sessionMetrics"
import renderSessionResults from "@/src/actions/render/sessionResults"
import { getColor } from "@/src/colorScheme"
import { DriverSelectionBar } from "@/src/components/DriverSelectionBar"
import { Button } from "@/src/components/ui/Button"
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { increment } from "@/src/store/slices/driverSelection"
import { useLocalSearchParams } from "expo-router"
import { Suspense, useMemo } from "react"
import { ScrollView, StyleSheet, useColorScheme, View, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useSelector } from "react-redux"

const styleSheet = StyleSheet.create({
    wrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 8,
        paddingInline: 16,
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
    },
    footer: {
        position: "absolute",
        bottom: 16,
        width: "90%",
        left: "50%",
        transform: [{ translateX: "-50%" }],
    },
})

export default function ResultsScreen() {
    const { season, session, event }: { season: string; session: string; event: string } =
        useLocalSearchParams()

    const colorScheme = useColorScheme()

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

    return (
        <SafeAreaView edges={["top", "left", "right"]}>
            <View style={styleSheet.wrapper}>
                <Suspense fallback={<LoadingSpinner />}>
                    <ScrollView
                        style={{ width: "100%", flexGrow: 1 }}
                        contentContainerStyle={styleSheet.scroll}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={{ ...styleSheet.card, borderColor: getColor("border") }}>
                            {sessionMetrics}
                        </View>
                        <View style={{ marginBottom: 80 }}>{sessionResults}</View>
                    </ScrollView>
                </Suspense>
            </View>
            <DriverSelectionBar />
        </SafeAreaView>
    )
}
