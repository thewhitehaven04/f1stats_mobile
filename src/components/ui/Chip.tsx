import { getColor } from "@/src/colorScheme"
import type { ComponentProps } from "react"
import { StyleSheet, Pressable, Text } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

const styleSheet = StyleSheet.create({
    chip: {
        borderRadius: 16,
        borderWidth: 1,
        paddingInline: 8,
        paddingBlock: 4,
        backgroundColor: getColor("background"),
        color: getColor("accent"),
        borderColor: getColor('ring')
    },
})

export const Chip = ({
    children,
    style,
    onPress,
    label,
    ...rest
}: ComponentProps<typeof Animated.View> & { onPress?: () => void; label?: string }) => {
    return (
        <Pressable onPress={onPress}>
            <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={StyleSheet.compose(styleSheet.chip, style)}
                {...rest}
            >
                {label ? <Text style={{ color: getColor("foreground") }}>{label}</Text> : children}
            </Animated.View>
        </Pressable>
    )
}
