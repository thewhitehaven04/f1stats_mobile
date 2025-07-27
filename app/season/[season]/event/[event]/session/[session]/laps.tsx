"use client"
import { useLocalSearchParams } from "expo-router"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ApiClient } from "@/src/client"
import { getSessionLaptimesFilteredApiSeasonYearEventEventSessionSessionLapsPost } from "@/src/client/generated"
import { Suspense, useState } from "react"
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner"
import { Button } from "@/src/components/ui/Button"
import Ionicons from "@expo/vector-icons/Ionicons"
import { COLOR_MAP, TyreCompound, type TCompound } from "@/src/components/ui/TyreCompounds"
import * as FontSizes from "@/src/fontSizes"
import { TrackMetric } from "@/src/components/Laptime"
import { getColor } from "@/src/colorScheme"
import { formatTime } from "@/src/core/helpers"

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
    cardWrapper: {
        paddingBlock: 8,
        paddingInline: 16,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 8,
        borderWidth: 1,
        borderRadius: 8,
    },
    driverText: {
        fontSize: FontSizes.Title.sm,
        fontWeight: "500",
    },
    dataRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "space-between",
        width: "100%",
    },
    titleRow: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
    },
    timeText: {
        fontSize: FontSizes.Body,
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
            <ScrollView key={selectedDriverIndex}>
                <View style={styleSheet.lapList}>
                    {selectedDriverData.map((driverData, index) => {
                        const Compound = COLOR_MAP[driverData.compound_id as TCompound]

                        return (
                            <View
                                key={driverData.id}
                                style={{
                                    ...styleSheet.cardWrapper,
                                    borderColor: getColor("border"),
                                }}
                            >
                                <View style={styleSheet.titleRow}>
                                    <View>
                                        <Text style={{ fontSize: FontSizes.Body }}>
                                            Lap {index + 1}
                                        </Text>
                                    </View>
                                    <View>
                                        <TrackMetric
                                            value={formatTime(driverData.laptime)}
                                            isPersonalBest={driverData.is_pb}
                                            style={{
                                                fontSize: FontSizes.Body,
                                            }}
                                        />
                                    </View>
                                    <View>
                                        <Compound width={24} height={24} />
                                    </View>
                                </View>
                                <View style={styleSheet.dataRow}>
                                    <View>
                                        <Text style={styleSheet.timeText}>S1</Text>
                                    </View>
                                    <View>
                                        <Text style={styleSheet.timeText}>S2</Text>
                                    </View>
                                    <View>
                                        <Text style={styleSheet.timeText}>S3</Text>
                                    </View>
                                </View>
                                <View style={styleSheet.dataRow}>
                                    <View>
                                        <TrackMetric
                                            value={formatTime(driverData.sector_1_time)}
                                            isPersonalBest={driverData.is_personal_best_s1}
                                            isSessionBest={driverData.is_best_s1}
                                        />
                                    </View>
                                    <View>
                                        <TrackMetric
                                            value={formatTime(driverData.sector_2_time)}
                                            isPersonalBest={driverData.is_personal_best_s2}
                                            isSessionBest={driverData.is_best_s2}
                                        />
                                    </View>
                                    <View>
                                        <TrackMetric
                                            value={formatTime(driverData.sector_3_time)}
                                            isPersonalBest={driverData.is_personal_best_s3}
                                            isSessionBest={driverData.is_best_s3}
                                        />
                                    </View>
                                </View>
                                <View style={styleSheet.dataRow}>
                                    <View>
                                        <TrackMetric
                                            value={driverData.speedtrap_1}
                                            isSessionBest={driverData.is_best_st1}
                                        />
                                    </View>
                                    <View>
                                        <TrackMetric
                                            value={driverData.speedtrap_2}
                                            isSessionBest={driverData.is_best_st2}
                                        />
                                    </View>
                                    <View>
                                        <TrackMetric
                                            value={driverData.speedtrap_fl}
                                            isSessionBest={driverData.is_best_stfl}
                                        />
                                    </View>
                                </View>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        </Suspense>
    )
}
