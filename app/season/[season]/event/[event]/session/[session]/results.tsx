"use client"
import renderSeasonMetrics from "@/src/actions/render/sessionMetrics"
import renderSessionResults from "@/src/actions/render/sessionResults"
import { getColor } from "@/src/colorScheme"
import { DriverSelectionBar } from "@/src/components/DriverSelectionBar"
import { DriverSelection } from "@/src/components/Tables/presets/results/driverSelection"
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner"
import { useLocalSearchParams } from "expo-router"
import { Suspense, useMemo } from "react"
import { ScrollView, StyleSheet, View } from "react-native"

const styleSheet = StyleSheet.create({
    wrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
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
        borderWidth: 1,
        width: "100%",
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
        <DriverSelection>
            <View style={styleSheet.wrapper}>
                <ScrollView
                    style={{ overflowY: "visible", }}
                    contentContainerStyle={styleSheet.scroll}
                >
                    <View style={{ ...styleSheet.card, borderColor: getColor("border") }}>
                        <Suspense fallback={<LoadingSpinner />}>{sessionMetrics}</Suspense>
                    </View>
                    <View style={{ marginBottom: 80 }}>
                        <Suspense fallback={<LoadingSpinner />}>{sessionResults}</Suspense>
                    </View>
                </ScrollView>
            </View>
            <View style={styleSheet.footer}>
                <DriverSelectionBar />
            </View>
        </DriverSelection>
    )
}
