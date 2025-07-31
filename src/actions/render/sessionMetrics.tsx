"use server"
import { darkTheme, lightTheme } from "@/src/colorScheme"
import { fetchSessionMetrics } from "@/src/fetchers/session"
import * as FontSizes from "@/src/fontSizes"
import Ionicons from "@expo/vector-icons/Ionicons"
import { format } from "date-fns"
import { Text, View } from "react-native"

async function renderSeasonMetrics({
    season,
    event,
    session,
    darkMode,
}: {
    season: string
    event: string
    session: string
    darkMode: boolean
}) {
    const metrics = await fetchSessionMetrics({
        session,
        season: Number.parseInt(season),
        event,
    })

    return (
        <View
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 24,
                alignContent: "space-evenly",
                padding: 16,
            }}
        >
            <View
                style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}
            >
                <Text
                    style={{
                        fontSize: FontSizes.Title.md,
                        fontWeight: 600,
                        color: darkMode ? darkTheme.foreground : lightTheme.foreground,
                    }}
                >
                    {metrics.sessionData.eventName} - {metrics.sessionData.sessionType}
                </Text>
                <Text
                    style={{
                        fontSize: FontSizes.Body,
                        color: darkMode ? darkTheme.foreground : lightTheme.foreground,
                    }}
                >
                    {format(metrics.sessionData.startTime, "MMM dd, HH:MM")} -{" "}
                    {format(metrics.sessionData.endTime, "HH:MM")}
                </Text>
            </View>
            <View
                style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-evenly",
                }}
            >
                <View
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        alignItems: "center",
                    }}
                >
                    <Ionicons
                        name="thermometer-outline"
                        size={32}
                        style={{ color: darkMode ? darkTheme.foreground : lightTheme.foreground }}
                    />
                    <View>
                        <Text
                            style={{
                                fontSize: FontSizes.Body,
                                color: darkMode ? darkTheme.foreground : lightTheme.foreground,
                            }}
                        >
                            {metrics.weather.airTempStart} - {metrics.weather.airTempEnd}°C
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        alignItems: "center",
                    }}
                >
                    <Ionicons
                        name="car-sport-outline"
                        size={32}
                        style={{ color: darkMode ? darkTheme.foreground : lightTheme.foreground }}
                    />
                    <View>
                        <Text
                            style={{
                                fontSize: FontSizes.Body,
                                color: darkMode ? darkTheme.foreground : lightTheme.foreground,
                            }}
                        >
                            {metrics.weather.trackTempStart} - {metrics.weather.trackTempEnd}°C
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        alignItems: "center",
                    }}
                >
                    <Ionicons
                        name="water-outline"
                        size={32}
                        style={{ color: darkMode ? darkTheme.foreground : lightTheme.foreground }}
                    />
                    <View>
                        <Text
                            style={{
                                fontSize: FontSizes.Body,
                                color: darkMode ? darkTheme.foreground : lightTheme.foreground,
                            }}
                        >
                            {metrics.weather.humidityStart} - {metrics.weather.humidityEnd} %
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default renderSeasonMetrics
