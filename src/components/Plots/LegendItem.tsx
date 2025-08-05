"use client"

import type { PlotColor } from "@/src/client/generated"
import { getColor } from "@/src/colorScheme"
import { getAlternativePlotColor, mapDriverToAbbreviation } from "@/src/core/helpers"
import { StyleSheet, View, Text } from "react-native"
import Svg, { Rect } from "react-native-svg"

const styleSheet = StyleSheet.create({
    wrapper: {
        display: "flex",
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
    },
    text: {
        color: getColor("foreground"),
    },
})

export const LegendItem = ({ label, plotColor }: { label: string; plotColor: PlotColor }) => {
    const color =
        plotColor.style === "alternative"
            ? getAlternativePlotColor(plotColor.color)
            : plotColor.color
    return (
        <View style={styleSheet.wrapper}>
            <Svg width={28} height={12} fill={getColor("background")}>
                <Rect width={28} height={12} stroke={color} strokeWidth={4} />
            </Svg>
            <Text style={styleSheet.text}>{mapDriverToAbbreviation(label)}</Text>
        </View>
    )
}
