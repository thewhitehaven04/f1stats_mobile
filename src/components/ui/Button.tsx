"use client"
import { getColor } from "@/src/colorScheme"
import { type ComponentProps } from "react"
import { Pressable, type StyleProp, type ViewStyle } from "react-native"
import { Text } from "react-native"
import * as FontSizes from "@/src/fontSizes"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

const ANIMATION_DURATION_MS = 90 

export const Button = ({
    children,
    variant = "solid",
    size = "regular",
    style,
    label,
    ...rest
}: Omit<ComponentProps<typeof Pressable>, "style"> & {
    variant?: "outline" | "solid"
    size?: "regular" | "large"
    style?: StyleProp<ViewStyle>
    label?: string
}) => {
    const svScale = useSharedValue(1)

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withTiming(svScale.value, { duration: 150 })}],
    }))
    const handlePress = () => {
        svScale.value = withTiming(0.98, { duration: ANIMATION_DURATION_MS })
        setTimeout(() => {
            svScale.value = withTiming(1, { duration: ANIMATION_DURATION_MS })
        }, ANIMATION_DURATION_MS)
    }
    return (
        <Animated.View style={animatedStyle}>
            <Pressable
                {...rest}
                style={[
                    {
                        paddingBlock: size === "regular" ? 8 : 16,
                        paddingInline: size === "regular" ? 16 : 32,
                        borderRadius: 8,
                        backgroundColor:
                            variant === "solid"
                                ? getColor("accent")
                                : getColor("primaryForeground"),
                        borderColor: getColor("border"),
                        borderWidth: variant === "outline" ? 1 : 0,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                    },
                    style,
                ]}
                onPress={() => handlePress()}
            >
                {label ? (
                    <Text
                        style={{
                            color: getColor("foreground"),
                            fontSize: size === "large" ? FontSizes.Title.sm : FontSizes.Body,
                        }}
                    >
                        {label}
                    </Text>
                ) : (
                    children
                )}
            </Pressable>
        </Animated.View>
    )
}
