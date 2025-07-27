"use client"
import { useLocalSearchParams } from "expo-router"
import { View, Text, StyleSheet } from "react-native"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ApiClient } from "@/src/client"
import { getSessionLaptimesFilteredApiSeasonYearEventEventSessionSessionLapsPost } from "@/src/client/generated"
import { Suspense, useState } from "react"
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner"
import { Button } from "@/src/components/ui/Button"
import { LapCard } from "@/src/components/Tables/presets/laps"
import Ionicons from "@expo/vector-icons/Ionicons"

const styleSheet = StyleSheet.create({
    wrapper: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingTop: 8,
    },
    button: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    lapList: {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 8,
        padding: 8,
    },
})

export default function LapsScreen() {
    const {
        season,
        session,
        event,
        drivers,
    }: { season: string; session: string; event: string; drivers: string[] } =
        useLocalSearchParams()

    const queries = drivers.map((driver) => ({
        driver,
        lap_filter: null,
    }))
    const [selectedDriverIndex, setDriverIndex] = useState(0)

    const { data } = useSuspenseQuery({
        queryKey: [season, session, event, drivers],
        queryFn: async () =>
            await getSessionLaptimesFilteredApiSeasonYearEventEventSessionSessionLapsPost({
                client: ApiClient,
                path: {
                    event,
                    session,
                    year: season,
                },
                body: { queries },
                throwOnError: true,
            }),
    })

    const selectedDriverData = data.data.driver_lap_data[selectedDriverIndex].laps
    const currentDriver = data.data.driver_lap_data[selectedDriverIndex].driver

    const hasLeft = selectedDriverIndex > 0
    const hasRight = selectedDriverIndex < data.data.driver_lap_data.length - 1

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <View style={styleSheet.wrapper}>
                {hasLeft && (
                    <Button
                        style={styleSheet.button}
                        onPress={() => setDriverIndex(selectedDriverIndex - 1)}
                    >
                        <Ionicons name="chevron-back-outline" />
                        <Text>{data.data.driver_lap_data[selectedDriverIndex - 1].driver}</Text>
                    </Button>
                )}
                <View>
                    <Text>{currentDriver}</Text>
                </View>
                {hasRight && (
                    <Button
                        style={styleSheet.button}
                        onPress={() => setDriverIndex(selectedDriverIndex + 1)}
                    >
                        <Text>{data.data.driver_lap_data[selectedDriverIndex + 1].driver}</Text>
                        <Ionicons name="chevron-forward-outline" />
                    </Button>
                )}
            </View>
            <View style={styleSheet.lapList}>
                {selectedDriverData.map((driverData, index) => (
                    <LapCard
                        key={driverData.id}
                        isPersonalBest={driverData.is_pb}
                        isSessionBest={false}
                        lapNumber={index + 1}
                        laptime={driverData.laptime}
                        s1={driverData.sector_1_time}
                        s2={driverData.sector_2_time}
                        s3={driverData.sector_3_time}
                        st1={driverData.speedtrap_1}
                        st2={driverData.speedtrap_2}
                        stFL={driverData.speedtrap_fl}
                        compound={driverData.compound_id}
                    />
                ))}
            </View>
        </Suspense>
    )
}
