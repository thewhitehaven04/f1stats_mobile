import { ComponentProps } from "react"
import { StyleSheet, ViewStyle, type View } from "react-native"
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated"
import { getColor } from "@/src/colorScheme"

const styleSheet = StyleSheet.create({
    wrapper: {
        width: "100%",
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "baseline",
        gap: 8,
        backgroundColor: getColor("muted"),
        position: "absolute",
        left: "50%",
        transform: [
            {
                translateX: "-50%",
            },
            {
                translateY: "-50%",
            }
        ],
        bottom: 0,
        boxShadow: '0px 2px 4px 0.2px rgba(0, 0, 0, 0.2)',
    },
})

export const BottomSheet = (
    props: Omit<ComponentProps<typeof Animated.View>, "style"> & {
        style?: ComponentProps<typeof View>["style"]
    },
) => {
    return (
        <Animated.View
            entering={SlideInDown.duration(300)}
            exiting={SlideOutDown.duration(300)}
            {...props}
            style={StyleSheet.compose<any, any, ViewStyle>(styleSheet.wrapper, props.style)}
        />
    )
}
