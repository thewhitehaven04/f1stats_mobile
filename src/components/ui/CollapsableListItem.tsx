"use client"
import { getColor } from "@/src/colorScheme"
import Ionicons from "@expo/vector-icons/Ionicons"
import {
    type ComponentProps,
    createContext,
    useContext,
    useMemo,
    useState,
} from "react"
import { Pressable, StyleSheet, View } from "react-native"
import Animated, {
    Easing,
    FadeOut,
    LinearTransition,
} from "react-native-reanimated"

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        borderWidth: 1,
        width: "100%",
        minHeight: 0,
        overflow: 'hidden',
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
        padding: 16
    },
    icon: {
        color: getColor("primary"),
    },
})

const noop = () => {}

const CollapsableItemContext = createContext<{
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
    isCollapsed: boolean
}>({ setIsCollapsed: noop, isCollapsed: false })

const bezierInOutBase = [0.25, 0.1, 0.25, 1] as const

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
                layout={LinearTransition.duration(350).easing(Easing.bezierFn(...bezierInOutBase))}
            >
                {children}
            </Animated.View>
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
    const { children, style, ...rest } = props

    const { isCollapsed, setIsCollapsed } = useContext(CollapsableItemContext)
    const [isPressed, setIsPressed] = useState(false)

    return (
        <View {...rest} style={StyleSheet.compose(styles.titleContainer, style)}>
            <View style={{ flexShrink: 1, flexGrow: 1, flexBasis: "100%" }}>{children}</View>
            <Pressable
                onPressIn={() => setIsPressed(true)}
                onPressOut={() => setIsPressed(false)}
                onPress={() => setIsCollapsed(!isCollapsed)}
                style={{ flexShrink: 0, flexGrow: 1 }}
            >
                <Ionicons name={getChevronStyle(isCollapsed, isPressed)} style={styles.icon} size={24} />
            </Pressable>
        </View>
    )
}

export const ListItemContent = (
    props: ComponentProps<typeof View>,
) => {
    const { children, style, ...rest } = props

    const { isCollapsed } = useContext(CollapsableItemContext)

    return !isCollapsed ? (
        <Animated.View {...rest} exiting={FadeOut} style={[styles.content, style]}>
            {children}
        </Animated.View>
    ) : null
}
