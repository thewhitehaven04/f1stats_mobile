"use client"

import { getColor } from "@/src/colorScheme"
import { mapDriverToAbbreviation } from "@/src/core/helpers"
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

export const LegendItem = ({ label, plotColor }: { label: string; plotColor: string }) => (
    <View style={styleSheet.wrapper}>
        <Svg width={28} height={12} fill={getColor("background")}>
            <Rect width={28} height={12} stroke={plotColor} strokeWidth={4} />
        </Svg>
        <Text style={styleSheet.text}>{mapDriverToAbbreviation(label)}</Text>
    </View>
)
