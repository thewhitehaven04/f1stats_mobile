import { getColor } from "@/src/colorScheme"
import { Button } from "@/src/components/ui/Button"
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
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
        borderWidth: 1,
        borderRadius: 12,
        width: "100%",
    },
    selectorText: {
        textAlign: "center",
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
    return (
        <View
            {...props}
            style={StyleSheet.compose(
                { ...styleSheet.wrapper, borderColor: getColor("border") },
                props.style,
            )}
        />
    )
}

export const SegmentSelector = ({ name }: { name: string }) => {
    const setSegment = useContext(SegmentedControlDispatch)
    const activeSegment = useContext(SegmentedControlContext)

    return (
        <Button
            variant="solid"
            onPress={() => setSegment.setTab(name)}
            style={{
                filter: activeSegment === name ? "brightness(0.95)" : "none",
                flex: 1,
            }}
        >
            <Text style={styleSheet.selectorText}>{name}</Text>
        </Button>
    )
}

export const Segment = ({ children, name }: { children: ReactNode; name: string }) => {
    const activeSegment = useContext(SegmentedControlContext)

    return activeSegment === name ? children : null
}
