"use client"
import { getColor } from "@/src/colorScheme"
import type { ComponentProps } from "react"
import { Pressable, ScrollView, StyleSheet, View } from "react-native"

const styleSheet = StyleSheet.create({
    wrapper: {
        borderWidth: 1,
        borderColor: getColor("border"),
    },
    header: {
        backgroundColor: getColor("muted"),
        color: getColor("mutedForeground"),
        width: "100%",
    },
    cell: {
        borderStartWidth: 1,
        borderEndWidth: 1,
        borderColor: getColor("border"),
    },
    body: {
        borderColor: getColor("foreground"),
    },
    row: {
        width: "100%",
    },
})

export const Table = ({ children, style, ...rest }: ComponentProps<typeof View>) => {
    return (
        <ScrollView>
            <View style={StyleSheet.compose(styleSheet.wrapper, style)} {...rest}>
                {children}
            </View>
        </ScrollView>
    )
}

export const TableHeader = ({ children, style, ...rest }: ComponentProps<typeof View>) => {
    return (
        <View style={StyleSheet.compose(styleSheet.header, style)} {...rest}>
            {children}
        </View>
    )
}

export const TableRow = ({
    children,
    style,
    onPress,
    ...rest
}: ComponentProps<typeof View> & { onPress?: ComponentProps<typeof Pressable>["onPress"] }) => {
    return onPress ? (
        <Pressable onPress={onPress}>
            <View style={StyleSheet.compose(styleSheet.row, style)} {...rest}>
                {children}
            </View>
        </Pressable>
    ) : (
        <View style={StyleSheet.compose(styleSheet.row, style)} {...rest}>
            {children}
        </View>
    )
}

export const TableBody = ({ children, style, ...rest }: ComponentProps<typeof View>) => {
    return (
        <View style={StyleSheet.compose(styleSheet.body, style)} {...rest}>
            {children}
        </View>
    )
}

export const TableCell = ({ children, style, ...rest }: ComponentProps<typeof View>) => {
    return (
        <View style={StyleSheet.compose(styleSheet.cell, style)} {...rest}>
            {children}
        </View>
    )
}
