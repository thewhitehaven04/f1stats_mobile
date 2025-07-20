"use client"
import { getColor } from "@/src/colorScheme"
import Ionicons from "@expo/vector-icons/Ionicons"
import {
    type ComponentProps,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import { Pressable, StyleSheet, View } from "react-native"
import Animated, {
    Easing,
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
    },
    titleContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 8,
    },
    content: {
        overflow: "hidden",
        width: "100%",
    },
})

const noop = () => {}

const COLLAPSE_TIMEOUT = 300

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

export const ListItemTitle = (
    props: ComponentProps<typeof View> & { collapseTimeout?: number },
) => {
    const { children, style, collapseTimeout = COLLAPSE_TIMEOUT, ...rest } = props

    const { isCollapsed, setIsCollapsed } = useContext(CollapsableItemContext)
    const [isPressed, setIsPressed] = useState(false)

    const collapseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    return (
        <View {...rest} style={StyleSheet.compose(styles.titleContainer, style)}>
            <View>{children}</View>
            <Pressable
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
                onPress={() => {
                    collapseTimeoutRef.current = setTimeout(
                        () => setIsCollapsed(!isCollapsed),
                        isCollapsed ? collapseTimeout : 0,
                    )
                }}
            >
                <Ionicons name={getChevronStyle(isCollapsed, isPressed)} size={24} />
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
        height: withTiming(svHeight.value, {
            duration: COLLAPSE_TIMEOUT,
            easing: Easing.inOut(Easing.cubic),
        }),
    }))

    useEffect(() => {
        svHeight.value = isCollapsed ? 0 : expandedHeight
    }, [isCollapsed, expandedHeight, svHeight])

    return !isCollapsed ? (
        <Animated.View {...rest} style={[heightStyle, styles.content, style]}>
            {children}
        </Animated.View>
    ) : null
}
