"use client"
import { useLocalSearchParams } from "expo-router"
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native"
import { TelemetryPlot } from "@/src/components/Plots/TelemetryPlot"
import { useMemo } from "react"
import { LegendItem } from "@/src/components/Plots/LegendItem"
import { useAppSelector } from "@/src/store"
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner"
import {
    useGetCircuitGeometryQuery,
    useGetLapTelemetriesQuery,
    type TSession,
} from "@/src/store/slices/api"
import { getAlternativePlotColor } from "@/src/core/helpers"
import { BrakePlot } from "@/src/components/Plots/BrakePlot"
import { DeltaCircuitMap } from "@/src/components/CircuitMap"

const styleSheet = StyleSheet.create({
    wrapper: {
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    speedtrace: {
        height: 350,
    },
    deltaData: {
        height: 200,
    },
    brake: {
        height: 80,
    },
    throttle: {
        height: 80,
    },
    rpm: {
        height: 120,
    },
    legend: {
        display: "flex",
        flexDirection: "row",
        gap: 8,
        justifyContent: "space-evenly",
        flexWrap: "wrap",
        width: "90%",
    },
})

export default function Telemetry() {
    const { season, session, event }: { season: string; session: string; event: string } =
        useLocalSearchParams()

    const selection = useAppSelector((state) => state.lapSelection)

    const decodedSession = decodeURIComponent(session) as TSession
    const { data, isLoading } = useGetLapTelemetriesQuery({
        session: decodedSession,
        event,
        year: season,
        selection,
    })

    const { data: geometry } = useGetCircuitGeometryQuery({
        year: season,
        event,
    })

    const distance = useMemo(
        () => data?.telemetries[0].lap.telemetry.map(({ distance }) => distance) || [],
        [data?.telemetries],
    )

    const speedtraceData: Record<string, number>[] = useMemo(() => {
        const chartData = distance.map((d) => ({
            distance: d,
        }))

        chartData.forEach((dataInstance: Record<string, number | null>, i) => {
            data?.telemetries.forEach(({ lap, driver }) => {
                dataInstance[`${driver}-${lap.lap_number}`] = lap.telemetry[i]?.speed || null
            })
        })

        return chartData
    }, [data?.telemetries, distance])

    const throttleData: Record<string, number>[] = useMemo(() => {
        const chartData = distance.map((d) => ({
            distance: d,
        }))

        chartData.forEach((dataInstance: Record<string, number | null>, i) => {
            data?.telemetries.forEach(({ lap, driver }) => {
                dataInstance[`${driver}-${lap.lap_number}`] = lap.telemetry[i]?.throttle || null
            })
        })

        return chartData
    }, [data?.telemetries, distance])

    const brakeData: Record<string, number>[] = useMemo(() => {
        const chartData = distance.map((d) => ({
            distance: d,
        }))

        chartData.forEach((dataInstance: Record<string, number | null>, i) => {
            data?.telemetries.forEach(({ lap, driver }) => {
                dataInstance[`${driver}-${lap.lap_number}`] = lap.telemetry[i]?.brake || null
            })
        })

        return chartData
    }, [data?.telemetries, distance])

    const rpmData: Record<string, number>[] = useMemo(() => {
        const chartData = distance.map((d) => ({
            distance: d,
        }))

        chartData.forEach((dataInstance: Record<string, number | null>, i) => {
            data?.telemetries.forEach(({ lap, driver }) => {
                dataInstance[`${driver}-${lap.lap_number}`] = lap.telemetry[i]?.rpm || null
            })
        })

        return chartData
    }, [data?.telemetries, distance])

    const deltaData: Record<string, number>[] = useMemo(() => {
        const chartData = distance.map((d) => ({
            distance: d,
        }))

        chartData.forEach((dataInstance: Record<string, number | null>, i) => {
            data?.telemetries.forEach(({ delta, driver, lap }) => {
                dataInstance[`${driver}-${lap.lap_number}`] = delta?.delta[i].gap || null
            })
        })

        return chartData
    }, [data?.telemetries, distance])

    const yAxes: string[] = []
    const colorMap: Record<string, string> = {}
    data?.telemetries.forEach(({ lap, driver }) => {
        const axisName = `${driver}-${lap.lap_number}`
        const driverData = data?.color_map[driver]
        yAxes.push(axisName)
        colorMap[axisName] =
            driverData.style === "default"
                ? driverData.color
                : getAlternativePlotColor(driverData.color)
    })

    return (
        <SafeAreaView style={styleSheet.wrapper}>
            {!isLoading && data ? (
                <ScrollView>
                    <View style={{ padding: 8 }}>
                        {geometry ? (
                            <DeltaCircuitMap
                                geometry={geometry}
                                driverDeltas={data.delta}
                                colorMap={colorMap}
                            />
                        ) : (
                            <LoadingSpinner />
                        )}
                    </View>
                    <View style={styleSheet.deltaData}>
                        <TelemetryPlot chartData={deltaData} yAxes={yAxes} colorMap={colorMap} />
                    </View>
                    <View style={styleSheet.speedtrace}>
                        <TelemetryPlot
                            chartData={speedtraceData}
                            yAxes={yAxes}
                            colorMap={colorMap}
                        />
                    </View>
                    <View style={styleSheet.throttle}>
                        <TelemetryPlot chartData={throttleData} yAxes={yAxes} colorMap={colorMap} />
                    </View>
                    <View style={styleSheet.brake}>
                        <BrakePlot chartData={brakeData} yAxes={yAxes} colorMap={colorMap} />
                    </View>
                    <View style={styleSheet.rpm}>
                        <TelemetryPlot chartData={rpmData} yAxes={yAxes} colorMap={colorMap} />
                    </View>
                    <View style={styleSheet.legend}>
                        {yAxes.map((driver) => (
                            <LegendItem label={driver} plotColor={colorMap[driver]} key={driver} />
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <LoadingSpinner />
            )}
        </SafeAreaView>
    )
}
