"use client"
import { getColor } from "@/src/colorScheme"
import Ionicons from "@expo/vector-icons/Ionicons"
import { type ComponentProps, createContext, useContext, useMemo, useState } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import Animated, {
    Easing,
    FadeOut,
    LinearTransition,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated"

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        borderWidth: 1,
        width: "100%",
        minHeight: 0,
        overflow: "hidden",
    },
    titleContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 8,
        alignItems: "center",
    },
    content: {
        overflow: "hidden",
        width: "100%",
        padding: 16,
    },
})

const noop = () => {}

const CollapsableItemContext = createContext<{
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
    isCollapsed: boolean
}>({ setIsCollapsed: noop, isCollapsed: false })

export const BEZIER_IN_OUT_BASE = [0.25, 0.1, 0.25, 1] as const

const getChevronStyle = (isCollapsed: boolean) => {
    return isCollapsed ? "chevron-down" : "chevron-up"
}

export const CollapsableListItem = (
    props: ComponentProps<typeof View> & { isCollapsedDefault?: boolean },
) => {
    const { children, isCollapsedDefault = true, ...rest } = props

    const [isCollapsed, setIsCollapsed] = useState(isCollapsedDefault)

    const ctxValue = useMemo(
        () => ({
            setIsCollapsed,
            isCollapsed,
        }),
        [isCollapsed],
    )

    return (
        <CollapsableItemContext.Provider value={ctxValue}>
            <Animated.View
                {...rest}
                style={StyleSheet.compose(
                    {
                        ...styles.container,
                        borderColor: getColor("border"),
                    },
                    rest.style,
                )}
                layout={LinearTransition.duration(350).easing(
                    Easing.bezierFn(...BEZIER_IN_OUT_BASE),
                )}
            >
                {children}
            </Animated.View>
        </CollapsableItemContext.Provider>
    )
}

export const ListItemTitle = (
    props: ComponentProps<typeof View> & { collapseTimeout?: number },
) => {
    const { children, style, ...rest } = props

    const { isCollapsed, setIsCollapsed } = useContext(CollapsableItemContext)

    const svIconScale = useSharedValue(1)

    const iconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: svIconScale.value }],
    }))

    const handlePress = () => {
        svIconScale.value = withTiming(0.97, { duration: 75 })

        setTimeout(() => {
            svIconScale.value = withTiming(1, { duration: 75 })
        }, 75)
    }

    return (
        <View {...rest} style={StyleSheet.compose(styles.titleContainer, style)}>
            <View style={{ flexShrink: 1, flexGrow: 1, flexBasis: "100%" }}>{children}</View>
            <Pressable
                onPress={() => {
                    handlePress()
                    setIsCollapsed(!isCollapsed)
                }}
                style={{
                    flexShrink: 0,
                    flexGrow: 1,
                }}
            >
                <View style={iconStyle}>
                    <Ionicons name={getChevronStyle(isCollapsed)} size={24} />
                </View>
            </Pressable>
        </View>
    )
}

export const ListItemContent = (props: ComponentProps<typeof View>) => {
    const { children, style, ...rest } = props

    const { isCollapsed } = useContext(CollapsableItemContext)

    return !isCollapsed ? (
        <Animated.View {...rest} exiting={FadeOut} style={[styles.content, style]}>
            {children}
        </Animated.View>
    ) : null
}
