"use client"
import Ionicons from "@expo/vector-icons/Ionicons"
import { type ComponentProps, createContext, useContext, useEffect, useMemo, useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
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
        borderColor: "var(--ring)",
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
    titleText: {
        fontSize: 16,
    },
    content: {
        padding: 4,
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
            <View {...rest} style={StyleSheet.compose(styles.container, rest.style)}>
                {children}
            </View>
        </CollapsableItemContext.Provider>
    )
}

export const ListItemTitle = (props: ComponentProps<typeof View>) => {
    const { children, style, ...rest } = props

    const { isCollapsed, setIsCollapsed } = useContext(CollapsableItemContext)

    return (
        <View {...rest} style={StyleSheet.compose(styles.titleContainer, style)}>
            <Text style={styles.titleText}>{children}</Text>
            <Pressable onPress={() => setIsCollapsed(!isCollapsed)}>
                <Ionicons name={isCollapsed ? "chevron-down" : "chevron-up"} size={16} />
            </Pressable>
        </View>
    )
}

export const ListItemContent = (props: ComponentProps<typeof View>) => {
    const { children, style, ...rest } = props

    const { isCollapsed } = useContext(CollapsableItemContext)

    const height = useSharedValue(isCollapsed ? 0 : 100)

    const heightStyle = useAnimatedStyle(() => ({
        height: withTiming(height.value, { duration: 300, easing: Easing.inOut(Easing.cubic) }),
    }))

    useEffect(() => {
        height.value = isCollapsed ? 0 : 100
    }, [isCollapsed, height])

    return (
        <Animated.View {...rest} style={[heightStyle, styles.content, style]}>
            {children}
        </Animated.View>
    )
}
