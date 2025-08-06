import { getColor } from "@/src/colorScheme"
import { Button } from "@/src/components/ui/Button"
import { Background } from "@react-navigation/elements"
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ComponentProps,
    type ReactNode,
} from "react"
import { StyleSheet, View, Text } from "react-native"

const SegmentedControlContext = createContext<string>("")
const SegmentedControlDispatch = createContext({
    setTab: (tab: string) => {},
})

const styleSheet = StyleSheet.create({
    wrapper: {
        display: "flex",
        flexDirection: "row",
        gap: 8,
        paddingInline: 4,
        paddingBlock: 4,
        borderRadius: 12,
        backgroundColor: getColor("muted"),
    },
    selectorText: {
        textAlign: "center",
        color: getColor("foreground"),
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
    const activeElementRef = useRef<View>(null)

    useEffect(() => {
        const activeTab = activeElementRef.current
        if (activeTab) {
            activeTab.measure((x, y, width) => {
                const left = x
                const right = left + width
            })
        }
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

// x -- top-left horizontal
// y -- top-left vertical
// x + width -- top-right horizontal
// y + height -- bottom-left vertical

export const Wrapper = (props: ComponentProps<typeof View>) => {
    const wrapperRef = useRef<View>(null)

    useEffect(() => {
        if (wrapperRef.current) {
        }
    }, [])

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
    const setSegment = useContext(SegmentedControlDispatch)
    const activeSegment = useContext(SegmentedControlContext)

    return (
        <View style={{ position: "relative" }}>
            <Button
                variant="solid"
                onPress={() => setSegment.setTab(name)}
                contentStyle={{
                    backgroundColor:
                        activeSegment === name ? getColor("background") : "transparent",
                    gap: 8,
                    zIndex: 10,
                }}
                label={!icon ? name : undefined}
            >
                {icon ? (
                    <>
                        {icon}
                        <Text>{name}</Text>
                    </>
                ) : null}
            </Button>
            <Button
                variant="solid"
                onPress={() => setSegment.setTab(name)}
                style={{ position: "absolute", zIndex: 0, top: 0 }}
                contentStyle={{
                    backgroundColor:
                        activeSegment === name ? getColor("background") : "transparent",
                    gap: 8,
                }}
                textStyle={{
                    color: getColor("background"),
                    backgroundColor: getColor("foreground"),
                }}
                label={!icon ? name : undefined}
            >
                {icon ? (
                    <>
                        {icon}
                        <Text>{name}</Text>
                    </>
                ) : null}
            </Button>
        </View>
    )
}

export const Segment = ({ children, name }: { children: ReactNode; name: string }) => {
    const activeSegment = useContext(SegmentedControlContext)

    return activeSegment === name ? children : null
}
