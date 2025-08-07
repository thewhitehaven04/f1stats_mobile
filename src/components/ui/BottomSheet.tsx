import { ComponentProps } from "react"
import { StyleSheet, ViewStyle, type View } from "react-native"
import Animated, { Easing, SlideInDown, SlideOutDown } from "react-native-reanimated"
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
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.12), 0 6px 6px rgba(0, 0, 0, 0.08)',
    },
})

export const BottomSheet = (
    props: Omit<ComponentProps<typeof Animated.View>, "style"> & {
        style?: ComponentProps<typeof View>["style"]
    },
) => {
    return (
        <Animated.View
            entering={SlideInDown.duration(300).easing(Easing.inOut(Easing.quad))}
            exiting={SlideOutDown.duration(300).easing(Easing.inOut(Easing.quad))}
            {...props}
            style={StyleSheet.compose<any, any, ViewStyle>(styleSheet.wrapper, props.style)}
        />
    )
}
