"use client"

import type { LapSelectionData } from "@/src/client/generated"
import { formatTime, getAlternativePlotColor } from "@/src/core/helpers"
import { Circle, useFont } from "@shopify/react-native-skia"
import { View, Text, StyleSheet } from "react-native"
import { CartesianChart, Scatter, useChartPressState, useChartTransformState } from "victory-native"
import SpaceMono from "@/assets/fonts/SpaceMono-Regular.ttf"
import { Button } from "@/src/components/ui/Button"
import { useState } from "react"
import type { SharedValue } from "react-native-reanimated"
import { useZoomReset } from "@/src/components/Plots/hooks/useZoomReset"

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
    return <Circle cx={x} cy={y} r={8} color="black" />
}

const styleSheet = StyleSheet.create({
    wrapper: {
        width: "100%",
        height: 500,
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    footer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
})

export const SessionLaptimesScatterplot = ({ data }: { data: LapSelectionData }) => {
    const { driver_lap_data: drivers, color_map: colors } = data

    const indices = drivers[0].laps.map((_, index) => index + 1)

    const driverNames = data.driver_lap_data.map((driver) => driver.driver)

    const { state: pressState, isActive: isPressActive } = useChartPressState({
        x: 0,
        y: Object.fromEntries(drivers.map((driver) => [driver.driver, 0])),
    })

    const font = useFont(SpaceMono, 13)

    const [showOutliers, setShowOutliers] = useState(true)

    const plotData = indices.map((index) => {
        const entries = drivers.map((driver) => {
            const isFlyingLap =
                !driver.laps[index - 1]?.is_inlap && !driver.laps[index - 1]?.is_outlap
            return [
                driver.driver,
                showOutliers
                    ? (driver.laps[index - 1].laptime ?? null)
                    : isFlyingLap
                      ? (driver.laps[index - 1].laptime ?? null)
                      : null,
            ]
        })
        entries.push(["lap", index])
        return Object.fromEntries(entries)
    })

    const { transformState } = useZoomReset()

    return (
        <View style={styleSheet.wrapper}>
            <CartesianChart
                data={plotData}
                xKey="lap"
                yKeys={driverNames}
                padding={{ left: 8, right: 8, top: 8 }}
                axisOptions={{
                    font: font,
                    axisSide: {
                        x: "bottom",
                        y: "left",
                    },
                    labelPosition: {
                        x: "outset",
                        y: "inset",
                    },
                    formatYLabel: (value) => formatTime(value),
                }}
                transformState={transformState}
                chartPressState={pressState}
                transformConfig={{
                    pan: {
                        enabled: false,
                    },
                    pinch: {
                        enabled: true,
                    },
                }}
            >
                {({ points }) =>
                    driverNames.map((name) => (
                        <>
                            <Scatter
                                key={name}
                                points={points[name]}
                                color={
                                    colors[name].style === "default"
                                        ? colors[name].color
                                        : getAlternativePlotColor(colors[name].color)
                                }
                                radius={3}
                            />
                            {isPressActive &&
                                driverNames.map((name) => (
                                    <ToolTip
                                        key={name}
                                        x={pressState.x.position}
                                        y={pressState.y[name].position}
                                    />
                                ))}
                        </>
                    ))
                }
            </CartesianChart>
            <View style={styleSheet.footer}>
                <Button onPress={() => setShowOutliers(!showOutliers)}>
                    <Text>Toggle outliers</Text>
                </Button>
            </View>
        </View>
    )
}
