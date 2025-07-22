"use client"
import { getColor } from "@/src/colorScheme"
import * as FontSizes from "@/src/fontSizes"
import type { ComponentProps } from "react"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"

const styleSheet = StyleSheet.create({
    scrollWrapper: {
        width: "100%",
    },
    wrapper: {
        borderWidth: 0.5,
        borderColor: getColor("border"),
        borderRadius: 16,
        overflow: "hidden",
    },
    header: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    headerTextCell: {
        fontSize: FontSizes.Body,
    },
    cell: {
        borderStartWidth: 0.5,
        borderEndWidth: 0.5,
        height: 40,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingBlock: 4,
        paddingInline: 12,
        flexGrow: 1,
    },
    body: {
        borderColor: getColor("border"),
    },
    row: {
        display: "flex",
        flexDirection: "row",
        gap: 0,
        justifyContent: "flex-start",
        alignItems: "center",
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
    },
    textCell: {
        fontSize: FontSizes.Body,
        textAlign: "center",
    },
})

export const Table = ({ children, style, ...rest }: ComponentProps<typeof View>) => {
    return (
        <ScrollView style={styleSheet.scrollWrapper}>
            <View style={StyleSheet.compose(styleSheet.wrapper, style)} {...rest}>
                {children}
            </View>
        </ScrollView>
    )
}

export const TableHeader = ({ children, style, ...rest }: ComponentProps<typeof View>) => {
    return (
        <View
            style={StyleSheet.compose(
                {
                    ...styleSheet.header,
                    backgroundColor: getColor("muted"),
                    color: getColor("mutedForeground"),
                },
                style,
            )}
            {...rest}
        >
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
            <View
                style={StyleSheet.compose(
                    { ...styleSheet.row, borderColor: getColor("border") },
                    style,
                )}
                {...rest}
            >
                {children}
            </View>
        </Pressable>
    ) : (
        <View
            style={StyleSheet.compose(
                { ...styleSheet.row, borderColor: getColor("border") },
                style,
            )}
            {...rest}
        >
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
        <View
            style={StyleSheet.compose(
                { ...styleSheet.cell, borderColor: getColor("border") },
                style,
            )}
            {...rest}
        >
            {children}
        </View>
    )
}

export const TextCell = ({
    children,
    style,
    textStyle,
    ...rest
}: ComponentProps<typeof View> & { textStyle?: ComponentProps<typeof Text>["style"] }) => {
    return (
        <View
            {...rest}
            style={StyleSheet.compose(
                { ...styleSheet.cell, borderColor: getColor("border") },
                style,
            )}
        >
            <Text style={StyleSheet.compose(styleSheet.textCell, textStyle)}>{children}</Text>
        </View>
    )
}
