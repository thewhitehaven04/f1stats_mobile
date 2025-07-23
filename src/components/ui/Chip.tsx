import { getColor } from "@/src/colorScheme"
import type { ComponentProps } from "react"
import { View, StyleSheet, Pressable, Text } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

const styleSheet = StyleSheet.create({
    chip: {
        borderRadius: 16,
        borderWidth: 1,
        paddingInline: 8,
        paddingBlock: 4,
    },
})

export const Chip = ({
    children,
    style,
    onPress,
    label,
    ...rest
}: ComponentProps<typeof View> & { onPress?: () => void; label?: string }) => {
    return (
        <Pressable onPress={onPress}>
            <Animated.View
                entering={FadeIn.springify(0.1)}
                exiting={FadeOut}
                style={StyleSheet.compose(
                    {
                        ...styleSheet.chip,
                        backgroundColor: getColor("muted"),
                        color: getColor("mutedForeground"),
                        borderColor: getColor("border"),
                    },
                    style,
                )}
                {...rest}
            >
                {label ? <Text>{label}</Text> : children}
            </Animated.View>
        </Pressable>
    )
}
