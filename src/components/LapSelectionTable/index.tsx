import type { LapSelectionData } from "@/src/client/generated"
import { getColor } from "@/src/colorScheme"
import { TrackMetric } from "@/src/components/Laptime"
import { Button } from "@/src/components/ui/Button"
import { COLOR_MAP, type TCompound } from "@/src/components/ui/TyreCompounds"
import { formatTime } from "@/src/core/helpers"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useState } from "react"
import { FlatList, StyleSheet, Pressable, View, Text } from "react-native"
import * as FontSizes from "@/src/fontSizes"
import { useTelemetryPrefetchOnSelectionChange } from "@/src/components/LapSelectionTable/useTelemetryPrefetch"
import { useTelemetryLapSelection } from "@/src/atoms/telemetryLapSelection"

const styleSheet = StyleSheet.create({
    wrapper: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingTop: 8,
        paddingBottom: 4,
        boxShadow: "0px 2px 4px 0.5px rgba(0, 0, 0, 0.2)",
    },
    lapList: {
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 8,
    },
    cardWrapper: {
        paddingBlock: 8,
        paddingInline: 16,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    driverText: {
        fontSize: FontSizes.Title.sm,
        fontWeight: "500",
    },
    button: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "33%",
    },
    s1Column: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        flexBasis: "33%",
        gap: 4,
    },
    s2Column: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        flexBasis: "33%",
        gap: 4,
    },
    s3Column: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        flexBasis: "33%",
        gap: 4,
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
        color: getColor("foreground"),
    },
    separator: {
        width: "100%",
        borderWidth: 1,
        marginBlock: 4,
        borderColor: getColor("border"),
    },
})

const mapDriverToAbbreviation = (driver: string) => driver.split(" ")[1].slice(0, 3)

export const LapSelectionTable = ({ data }: { data: LapSelectionData }) => {
    const [selectedDriverIndex, setDriverIndex] = useState(0)

    const selectedDriverData = data.driver_lap_data[selectedDriverIndex].laps
    const currentDriver = data.driver_lap_data[selectedDriverIndex].driver

    const hasLeft = selectedDriverIndex > 0
    const hasRight = selectedDriverIndex < data.driver_lap_data.length - 1

    useTelemetryPrefetchOnSelectionChange()
    const { isLapSelected, toggleSelection } = useTelemetryLapSelection()

    return (
        <>
            <View style={styleSheet.wrapper}>
                {hasLeft && (
                    <Button
                        style={{ ...styleSheet.button }}
                        onPress={() => setDriverIndex(selectedDriverIndex - 1)}
                    >
                        <Ionicons name="chevron-back-outline" />
                        <Text style={{ textAlign: "left" }}>
                            {mapDriverToAbbreviation(
                                data.driver_lap_data[selectedDriverIndex - 1].driver,
                            )}
                        </Text>
                    </Button>
                )}
                <View style={{ width: "33%" }}>
                    <Text style={{ textAlign: "center" }}>
                        {mapDriverToAbbreviation(currentDriver)}
                    </Text>
                </View>
                {hasRight && (
                    <Button
                        style={styleSheet.button}
                        onPress={() => setDriverIndex(selectedDriverIndex + 1)}
                    >
                        <Text style={{ textAlign: "right" }}>
                            {mapDriverToAbbreviation(
                                data.driver_lap_data[selectedDriverIndex + 1].driver,
                            )}
                        </Text>
                        <Ionicons name="chevron-forward-outline" />
                    </Button>
                )}
            </View>
            <FlatList
                data={selectedDriverData.map((item, index) => ({ ...item, lap: index + 1 }))}
                contentContainerStyle={styleSheet.lapList}
                ItemSeparatorComponent={() => <View style={styleSheet.separator} />}
                renderItem={({ item }) => {
                    const Compound = COLOR_MAP[item.compound_id as TCompound]
                    return (
                        <Pressable onPress={() => toggleSelection(currentDriver, item.lap)}>
                            <View
                                key={item.id}
                                style={{
                                    ...styleSheet.cardWrapper,
                                    borderColor: getColor("border"),
                                }}
                            >
                                <View style={styleSheet.s1Column}>
                                    <View
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 8,
                                        }}
                                    >
                                        <Text style={styleSheet.timeText}>Lap {item.lap}</Text>
                                        {isLapSelected(currentDriver, item.lap) && (
                                            <Ionicons name="checkmark-outline" color="green" />
                                        )}
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
                                            style={styleSheet.timeText}
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
                        </Pressable>
                    )
                }}
            />
        </>
    )
}
