import { getColor } from "@/src/colorScheme"
import type { ReactNode } from "react"
import { StyleSheet, Text, View } from "react-native"

const styles = StyleSheet.create({
    wrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingBlock: 8,
        paddingInline: 16,
    },
    footerLine: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingBlock: 8,
        paddingInline: 16,
    },
})

export const KeysetSeasonPagination = ({
    previous,
    current,
    next,
}: {
    previous?: ReactNode
    current: string
    next?: ReactNode
}) => (
    <View style={{ ...styles.wrapper, backgroundColor: getColor("background") }}>
        {previous ? (
            previous
        ) : (
            <View style={{ width: 64 }}>
                <Text>N/A</Text>
            </View>
        )}
        <View>
            <Text>{current}</Text>
        </View>
        {next ? (
            next
        ) : (
            <View style={{ width: 64 }}>
                <Text>N/A</Text>
            </View>
        )}
    </View>
)
