"use client"
import { getColor } from "@/src/colorScheme"
import Ionicons from "@expo/vector-icons/Ionicons"
import { type ComponentProps, createContext, useContext, useEffect, useMemo, useState } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated"

const styles = StyleSheet.create({
    container: {
        borderRadius: 4,
        borderWidth: 1,
        width: "100%",
        minHeight: 0,
    },
    titleContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBlock: 4,
        paddingInline: 8,
    },
    content: {
        padding: 4,
        overflow: "hidden",
    },
})

const noop = () => {}

const CollapsableItemContext = createContext<{
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
    isCollapsed: boolean
}>({ setIsCollapsed: noop, isCollapsed: false })

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
            <View
                {...rest}
                style={StyleSheet.compose(
                    {
                        ...styles.container,
                        borderColor: getColor("border"),
                    },
                    rest.style,
                )}
            >
                {children}
            </View>
        </CollapsableItemContext.Provider>
    )
}

const getChevronStyle = (isCollapsed: boolean, isFocused: boolean) => {
    if (!isFocused) {
        return isCollapsed ? "chevron-down" : "chevron-up"
    }
    return isCollapsed ? "chevron-down-circle" : "chevron-up-circle"
}

export const ListItemTitle = (props: ComponentProps<typeof View>) => {
    const { children, style, ...rest } = props

    const { isCollapsed, setIsCollapsed } = useContext(CollapsableItemContext)
    const [isPressed, setIsPressed] = useState(false)

    return (
        <View {...rest} style={StyleSheet.compose(styles.titleContainer, style)}>
            <View>{children}</View>
            <Pressable
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
                onPress={() => setIsCollapsed(!isCollapsed)}
            >
                <Ionicons name={getChevronStyle(isCollapsed, isPressed)} size={32} />
            </Pressable>
        </View>
    )
}

export const ListItemContent = (
    props: ComponentProps<typeof View> & { expandedHeight: number },
) => {
    const { children, style, expandedHeight, ...rest } = props

    const { isCollapsed } = useContext(CollapsableItemContext)

    const svHeight = useSharedValue(isCollapsed ? 0 : expandedHeight)

    const heightStyle = useAnimatedStyle(() => ({
        height: withTiming(svHeight.value, { duration: 300, easing: Easing.inOut(Easing.cubic) }),
    }))

    useEffect(() => {
        svHeight.value = isCollapsed ? 0 : expandedHeight
    }, [isCollapsed, expandedHeight, svHeight])

    return (
        <Animated.View {...rest} style={[heightStyle, styles.content, style]}>
            {children}
        </Animated.View>
    )
}
