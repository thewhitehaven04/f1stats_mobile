"use client"
import { ApiClient } from "@/src/client"
import { getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost } from "@/src/client/generated"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { SafeAreaView } from "react-native"
import { CartesianChart, Line } from "victory-native"
import SpaceMono from "@/assets/fonts/SpaceMono-Regular.ttf"
import { useMemo } from "react"
import { useFont } from "@shopify/react-native-skia"
import { useAtomValue } from 'jotai'
import { TelemetryLapSelection } from '@/src/atoms/telemetryLapSelection'
import { buildQueriesFromSelection } from '@/src/components/LapSelectionTable/useTelemetryPrefetch'

export default function Telemetry() {
    const { season, session, event }: { season: string; session: string; event: string } =
        useLocalSearchParams()

    const selection = useAtomValue(TelemetryLapSelection)

    const { data } = useSuspenseQuery({
        queryKey: [],
        queryFn: () =>
            getLapTelemetriesApiSeasonYearEventEventSessionSessionTelemetriesPost({
                client: ApiClient,
                body: {
                    queries: buildQueriesFromSelection(selection), 
                },
                path: {
                    session,
                    event,
                    year: season,
                },
                throwOnError: true,
            }),
    })

    const font = useFont(SpaceMono, 13)

    const driverTelemetries = data.data.telemetries

    const drivers = driverTelemetries.map((driverTelemetry) => driverTelemetry.driver) 

    const chartData: Record<string, number>[] = useMemo(() => {
        const distance = driverTelemetries[0].lap.telemetry.map(({ distance }) => distance)
        const chartData = distance.map((d) => ({
            distance: d,
        }))

        chartData.forEach((dataInstance, i) => {
            driverTelemetries.forEach((driverTelemetry) => {
                dataInstance[driverTelemetry.driver] = driverTelemetry.lap.telemetry[i]?.speed || null
            })
        })

        return chartData
    }, [driverTelemetries])

    return (
        <SafeAreaView>
            <CartesianChart data={chartData} xKey="distance" yKeys={drivers}>
                {({ points }) =>
                    drivers.map((driver) => (
                        <Line key={driver} data={points[driver]} xKey="distance" yKey={driver} />
                    ))
                }
            </CartesianChart>
        </SafeAreaView>
    )
}
