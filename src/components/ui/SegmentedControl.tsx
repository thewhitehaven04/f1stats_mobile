"use client"
import { getColor } from "@/src/colorScheme"
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
    type ComponentProps,
    type ReactNode,
} from "react"
import { StyleSheet, Text, View } from "react-native"
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
} from "react-native-reanimated"
import { Pressable } from "react-native-gesture-handler"

const SegmentedControlContext = createContext<string>("")
const SegmentedControlDispatch = createContext({
    setTab: (tab: string) => {},
})

const styleSheet = StyleSheet.create({
    wrapper: {
        display: "flex",
        flexDirection: "row",
        padding: 4,
        borderRadius: 12,
        backgroundColor: getColor("muted"),
        gap: 8,
    },
    selectorText: {
        textAlign: "center",
        color: getColor("foreground"),
        fontWeight: 500,
    },
    selector: {
        borderRadius: 8,
        color: getColor("foreground"),
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        paddingBlock: 4,
        paddingInline: 8,
    },
})

export const Root = ({
    defaultSegment,
    children,
}: {
    defaultSegment: string
    children?: ReactNode
}) => {
    const [activeSegment, setActiveSegment] = useState<string>(defaultSegment)

    const setTab = useCallback((tab: string) => {
        setActiveSegment(tab)
    }, [])

    const dispatchCtxValue = useMemo(
        () => ({
            setTab,
        }),
        [setTab],
    )

    return (
        <SegmentedControlContext.Provider value={activeSegment}>
            <SegmentedControlDispatch.Provider value={dispatchCtxValue}>
                {children}
            </SegmentedControlDispatch.Provider>
        </SegmentedControlContext.Provider>
    )
}

export const Wrapper = (props: ComponentProps<typeof View>) => {
    const wrapperRef = useRef<View>(null)

    return (
        <View
            {...props}
            style={StyleSheet.compose(
                { ...styleSheet.wrapper, borderColor: getColor("border") },
                props.style,
            )}
            ref={wrapperRef}
        />
    )
}

export const SegmentSelector = ({ name, icon }: { name: string; icon?: ReactNode }) => {
    const { setTab } = useContext(SegmentedControlDispatch)
    const activeSegment = useContext(SegmentedControlContext)

    const animationProgress = useSharedValue(0)

    /** without memoization outside of useanimated style the app crashes */
    const fromColor = useMemo(
        () => (activeSegment === name ? getColor("background") : getColor("muted")),
        [activeSegment, name],
    )
    const toColor = useMemo(
        () => (activeSegment === name ? getColor("muted") : getColor("background")),
        [activeSegment, name],
    )
    const style = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(animationProgress.value, [0, 1], [fromColor, toColor]),
    }))

    return (
        <Pressable onPress={() => setTab(name)}>
            <Animated.View style={[styleSheet.selector, style]}>
                {icon ? (
                    <>
                        {icon}
                        <Text style={styleSheet.selectorText}>{name}</Text>
                    </>
                ) : null}
            </Animated.View>
        </Pressable>
    )
}

export const Segment = ({ children, name }: { children: ReactNode; name: string }) => {
    const activeSegment = useContext(SegmentedControlContext)

    return activeSegment === name ? children : null
}
