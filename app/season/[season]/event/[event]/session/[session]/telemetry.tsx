"use client"
import { ApiClient } from "@/src/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { SafeAreaView, StyleSheet, View, Text } from "react-native"
import { CartesianChart, Line } from "victory-native"
import SpaceMono from "@/assets/fonts/SpaceMono-Regular.ttf"
import { useMemo } from "react"
import { useFont } from "@shopify/react-native-skia"
import { useAtomValue } from "jotai"
import { TelemetryLapSelection } from "@/src/atoms/telemetryLapSelection"
import { buildQueriesFromSelection } from "@/src/components/LapSelectionTable/useTelemetryPrefetch"
import { getAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePost } from "@/src/client/generated"
import { getAlternativePlotColor } from "@/src/core/helpers"

const styleSheet = StyleSheet.create({
    wrapper: {
        width: "100%",
        height: 500,
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
})

export default function Telemetry() {
    const { season, session, event }: { season: string; session: string; event: string } =
        useLocalSearchParams()

    const selection = useAtomValue(TelemetryLapSelection)

    const queries = buildQueriesFromSelection(selection)
    const { data } = useSuspenseQuery({
        queryKey: [season, event, session, "telemetry", queries],
        queryFn: () => {
            return getAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePost(
                {
                    client: ApiClient,
                    body: {
                        queries,
                    },
                    path: {
                        session,
                        event,
                        year: season,
                    },
                    throwOnError: true,
                },
            )
        },
    })

    const colorMap = data.data.color_map
    const font = useFont(SpaceMono, 13)

    const avgTelemetries = data.data.telemetries

    const drivers = avgTelemetries.map((driverTelemetry) => driverTelemetry.driver)

    const chartData: Record<string, number>[] = useMemo(() => {
        const distance = avgTelemetries[0].telemetry.map(({ distance }) => distance)
        const chartData = distance.map((d) => ({
            distance: d,
        }))

        chartData.forEach((dataInstance, i) => {
            avgTelemetries.forEach(({ telemetry, driver }) => {
                dataInstance[driver] = telemetry[i]?.speed || null
            })
        })

        return chartData
    }, [avgTelemetries])

    return (
        <SafeAreaView style={styleSheet.wrapper}>
            <CartesianChart
                data={chartData}
                xKey="distance"
                yKeys={drivers}
                axisOptions={{
                    font,
                    axisSide: {
                        x: "bottom",
                        y: "left",
                    },
                    labelPosition: {
                        x: "outset",
                        y: "inset",
                    },
                }}
            >
                {({ points }) =>
                    drivers.map((driver) => (
                        <Line
                            key={driver}
                            points={points[driver]}
                            color={
                                colorMap[driver].style === "default"
                                    ? colorMap[driver].color
                                    : getAlternativePlotColor(colorMap[driver].color)
                            }
                            strokeWidth={3}
                        />
                    ))
                }
            </CartesianChart>
            <View>
                <Text>{"Speed (km/h)"}</Text>
            </View>
        </SafeAreaView>
    )
}
