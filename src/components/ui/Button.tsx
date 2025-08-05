"use client"
import { getColor } from "@/src/colorScheme"
import { type ComponentProps, type ReactNode } from "react"
import { Pressable, type StyleProp, type View, type ViewStyle } from "react-native"
import { Text } from "react-native"
import * as FontSizes from "@/src/fontSizes"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

const ANIMATION_DURATION_MS = 90

export const Button = ({
    children,
    variant = "solid",
    size = "regular",
    style,
    contentStyle,
    label,
    ...rest
}: Omit<ComponentProps<typeof Pressable>, "style" | "children"> & {
    variant?: "outline" | "solid"
    size?: "regular" | "large"
    style?: StyleProp<ViewStyle>
    contentStyle?: ComponentProps<typeof View>['style'] 
    label?: string
    children?: ReactNode
}) => {
    const svScale = useSharedValue(1)

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: svScale.value }],
    }))
    const handlePress = () => {
        svScale.value = withTiming(0.97, { duration: ANIMATION_DURATION_MS })
        setTimeout(() => {
            svScale.value = withTiming(1, { duration: ANIMATION_DURATION_MS })
        }, ANIMATION_DURATION_MS)
    }
    return (
        <Pressable
            {...rest}
            onPress={(evt) => {
                handlePress()
                if (rest.onPress) {
                    rest.onPress(evt)
                }
            }}
        >
            <Animated.View
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
                        alignItems: 'center',
                    },
                    contentStyle,
                    animatedStyle,
                ]}
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
            </Animated.View>
        </Pressable>
    )
}
