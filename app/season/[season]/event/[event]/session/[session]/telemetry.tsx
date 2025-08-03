"use client"
import { ApiClient } from "@/src/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { useAtomValue } from "jotai"
import { TelemetryLapSelection } from "@/src/atoms/telemetryLapSelection"
import { buildQueriesFromSelection } from "@/src/components/LapSelectionTable/useTelemetryPrefetch"
import { getAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePost } from "@/src/client/generated"
import { TelemetryPlot } from "@/src/components/Plots/TelemetryPlot"
import { useMemo } from "react"
import { LegendItem } from "@/src/components/Plots/LegendItem"

const styleSheet = StyleSheet.create({
    wrapper: {
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    speedtrace: {
        height: 350,
    },
    brake: {
        height: 150,
    },
    throttle: {
        height: 150,
    },
    rpm: {
        height: 150,
    },
    legend: {
        display: "flex",
        flexDirection: "row",
        gap: 8,
        justifyContent: "space-evenly",
        flexWrap: "wrap",
    },
})

export default function Telemetry() {
    const { season, session, event }: { season: string; session: string; event: string } =
        useLocalSearchParams()

    const selection = useAtomValue(TelemetryLapSelection)

    const queries = buildQueriesFromSelection(selection)
    const { data } = useSuspenseQuery({
        queryKey: [season, event, session, "telemetry", queries],
        queryFn: () =>
            getAverageLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetryAveragePost({
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
            }),
    })

    const {
        data: { telemetries, color_map },
    } = data

    const distance = useMemo(
        () => telemetries[0].telemetry.map(({ distance }) => distance),
        [telemetries],
    )

    const speedtraceData: Record<string, number>[] = useMemo(() => {
        const chartData = distance.map((d) => ({
            distance: d,
        }))

        chartData.forEach((dataInstance, i) => {
            telemetries.forEach(({ telemetry, driver }) => {
                dataInstance[driver] = telemetry[i]?.speed || null
            })
        })

        return chartData
    }, [distance, telemetries])

    const throttleData: Record<string, number>[] = useMemo(() => {
        const chartData = distance.map((d) => ({
            distance: d,
        }))

        chartData.forEach((dataInstance, i) => {
            telemetries.forEach(({ telemetry, driver }) => {
                dataInstance[driver] = telemetry[i]?.throttle || null
            })
        })

        return chartData
    }, [distance, telemetries])

    const brakeData: Record<string, number>[] = useMemo(() => {
        const chartData = distance.map((d) => ({
            distance: d,
        }))

        chartData.forEach((dataInstance, i) => {
            telemetries.forEach(({ telemetry, driver }) => {
                dataInstance[driver] = telemetry[i]?.brake || null
            })
        })

        return chartData
    }, [distance, telemetries])

    const rpmData: Record<string, number>[] = useMemo(() => {
        const chartData = distance.map((d) => ({
            distance: d,
        }))

        chartData.forEach((dataInstance, i) => {
            telemetries.forEach(({ telemetry, driver }) => {
                dataInstance[driver] = telemetry[i]?.rpm || null
            })
        })

        return chartData
    }, [distance, telemetries])

    const yAxes = telemetries.map(({ driver }) => driver)

    return (
        <SafeAreaView style={styleSheet.wrapper}>
            <ScrollView>
                <View style={styleSheet.speedtrace}>
                    <TelemetryPlot chartData={speedtraceData} yAxes={yAxes} colorMap={color_map} />
                </View>
                <View style={styleSheet.throttle}>
                    <TelemetryPlot chartData={throttleData} yAxes={yAxes} colorMap={color_map} />
                </View>
                <View style={styleSheet.brake}>
                    <TelemetryPlot chartData={brakeData} yAxes={yAxes} colorMap={color_map} />
                </View>
                <View style={styleSheet.rpm}>
                    <TelemetryPlot chartData={rpmData} yAxes={yAxes} colorMap={color_map} />
                </View>
                <View style={styleSheet.legend}>
                    {yAxes.map((driver) => (
                        <LegendItem label={driver} plotColor={color_map[driver]} key={driver} />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
