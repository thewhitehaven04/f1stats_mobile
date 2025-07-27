"use client"
import { getColor } from "@/src/colorScheme"
import { useEffect } from "react"
import { View } from "react-native"
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated"

export const LoadingSpinner = () => {
    const rotateDeg = useSharedValue(0)

    const rotation = useAnimatedStyle(() => ({
        transform: [{ rotate: rotateDeg.value * 360 + "deg" }],
    }))

    useEffect(() => {
        rotateDeg.value = withRepeat(
            withTiming(1, {
                duration: 1500,
                easing: Easing.linear,
            }),
            -1,
        )
    }, [rotateDeg])

    return (
        <View
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
            }}
        >
            <Animated.View
                style={[
                    {
                        borderRadius: "50%",
                        borderLeftColor: getColor("accentForeground"),
                        borderRightColor: getColor("accentForeground"),
                        borderTopColor: getColor("accent"),
                        borderBottomColor: getColor("accent"),
                        borderWidth: 4,
                        width: 60,
                        height: 60,
                        boxShadow: `0px 0px 4px 1px ${getColor("muted")}`,
                    },
                    rotation,
                ]}
            />
        </View>
    )
}
