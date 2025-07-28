import { getColor } from "@/src/colorScheme"
import type { ComponentProps } from "react"
import { Text, StyleSheet } from "react-native"

export const TrackMetric = ({
    isPersonalBest,
    isSessionBest,
    value,
    style,
    ...rest
}: ComponentProps<typeof Text> & {
    isPersonalBest?: boolean
    isSessionBest?: boolean
    value: string | number | null | undefined
}) => {
    return (
        <Text
            style={StyleSheet.compose(
                {
                    color: isPersonalBest
                        ? getColor("personalBest")
                        : isSessionBest
                          ? getColor("sessionBest")
                          : getColor("primary"),
                    fontWeight: isPersonalBest || isSessionBest ? "bold" : "normal",
                },
                style,
            )}
            {...rest}
        >
            {value ? value : "N/A"}
        </Text>
    )
}
