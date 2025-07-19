"use client"
import { getColor } from "@/src/colorScheme"
import { View } from "react-native"
import { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

export const LoadingSpinner = () => {
    const rotateDeg = useSharedValue("0deg")

    rotateDeg.value = withTiming(`${rotateDeg.value + 360}deg`, {
        duration: 400,
        easing: Easing.linear,
    })

    const rotation = useAnimatedStyle(() => ({
        transform: [
            {
                rotate: rotateDeg.value,
            },
        ],
    }))

    return (
        <View
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <View
                style={[
                    {
                        borderRadius: "50%",
                        borderLeftColor: getColor("accentForeground"),
                        borderRightColor: getColor("accentForeground"),
                        borderTopColor: getColor("accent"),
                        borderBottomColor: getColor("accent"),
                        borderWidth: 2,
                        width: 40,
                        height: 40,
                    },
                    rotation,
                ]}
            />
        </View>
    )
}
