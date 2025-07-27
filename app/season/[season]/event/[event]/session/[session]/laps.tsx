"use client"
import { useLocalSearchParams } from "expo-router"
import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native"
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
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth: 1,
        borderRadius: 8,
    },
    driverText: {
        fontSize: FontSizes.Title.sm,
        fontWeight: "500",
    },
    s1Column: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 8,
    },
    s2Column: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
    },
    s3Column: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 8,
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
            <FlatList
                data={selectedDriverData}
                contentContainerStyle={styleSheet.lapList}
                renderItem={({ item }) => {
                    const Compound = COLOR_MAP[item.compound_id as TCompound]
                    return (
                        <View
                            key={item.id}
                            style={{
                                ...styleSheet.cardWrapper,
                                borderColor: getColor("border"),
                            }}
                        >
                            <View style={styleSheet.s1Column}>
                                <View>
                                    <Text style={{ fontSize: FontSizes.Body }}>Lap 1</Text>
                                </View>
                                <View>
                                    <Text style={styleSheet.timeText}>S1</Text>
                                </View>
                                <View>
                                    <TrackMetric
                                        value={formatTime(item.sector_1_time)}
                                        isPersonalBest={item.is_personal_best_s1}
                                        isSessionBest={item.is_best_s1}
                                    />
                                </View>
                                <View>
                                    <TrackMetric
                                        value={item.speedtrap_1}
                                        isSessionBest={item.is_best_st1}
                                    />
                                </View>
                            </View>
                            <View style={styleSheet.s2Column}>
                                <View>
                                    <TrackMetric
                                        value={formatTime(item.laptime)}
                                        isPersonalBest={item.is_pb}
                                        style={{
                                            fontSize: FontSizes.Body,
                                        }}
                                    />
                                </View>
                                <View>
                                    <Text style={styleSheet.timeText}>S2</Text>
                                </View>
                                <View>
                                    <TrackMetric
                                        value={formatTime(item.sector_2_time)}
                                        isPersonalBest={item.is_personal_best_s2}
                                        isSessionBest={item.is_best_s2}
                                    />
                                </View>
                                <View>
                                    <TrackMetric
                                        value={item.speedtrap_2}
                                        isSessionBest={item.is_best_st2}
                                    />
                                </View>
                            </View>
                            <View style={styleSheet.s3Column}>
                                <View>
                                    <Compound width={24} height={24} />
                                </View>
                                <View>
                                    <Text style={styleSheet.timeText}>S3</Text>
                                </View>
                                <View>
                                    <TrackMetric
                                        value={formatTime(item.sector_3_time)}
                                        isPersonalBest={item.is_personal_best_s3}
                                        isSessionBest={item.is_best_s3}
                                    />
                                </View>
                                <View>
                                    <TrackMetric
                                        value={item.speedtrap_fl}
                                        isSessionBest={item.is_best_stfl}
                                    />
                                </View>
                            </View>
                        </View>
                    )
                }}
            />
        </Suspense>
    )
}
