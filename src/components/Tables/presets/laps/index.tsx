"use client"

import React from "react"
import { StyleSheet, View, Text } from "react-native"
import * as FontSizes from "@/src/fontSizes"
import { TyreCompound, type TCompound } from "@/src/components/ui/TyreCompound"
import { formatTime } from "@/src/core/helpers"
import { getColor } from "@/src/colorScheme"

const styleSheet = StyleSheet.create({
    wrapper: {
        paddingBlock: 8,
        paddingInline: 16,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: 8,
        borderWidth: 1,
        borderRadius: 8
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
        justifyContent: "flex-start",
        gap: 16,
    },
    timeText: {
        fontSize: FontSizes.Body,
    },
})

export const LapCard = (props: {
    lapNumber: number
    laptime: number | null
    s1: number | null
    isPBS1: boolean,
    isSBS1: boolean,
    s2: number | null
    s3: number | null
    st1: number | null
    st2: number | null
    stFL: number | null
    isPersonalBest: boolean
    isSessionBest: boolean
    compound: string
}) => (
    <View style={{ ...styleSheet.wrapper, borderColor: getColor("border") }}>
        <View style={styleSheet.titleRow}>
            <View>
                <Text style={{...styleSheet.timeText, fontWeight: 500}}>{formatTime(props.laptime)}</Text>
            </View>
            <View>
                <TyreCompound type={props.compound as TCompound} />
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
                <Text style={styleSheet.timeText}>{formatTime(props.s1)}</Text>
            </View>
            <View>
                <Text style={styleSheet.timeText}>{formatTime(props.s2)}</Text>
            </View>
            <View>
                <Text style={styleSheet.timeText}>{formatTime(props.s3)}</Text>
            </View>
        </View>
        <View style={styleSheet.dataRow}>
            <View>
                <Text style={styleSheet.timeText}>{props.st1} kph</Text>
            </View>
            <View>
                <Text style={styleSheet.timeText}>{props.st2} kph</Text>
            </View>
            <View>
                <Text style={styleSheet.timeText}>{props.stFL} kph</Text>
            </View>
        </View>
    </View>
)
