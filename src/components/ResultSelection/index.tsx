"use client"
import { getColor } from "@/src/colorScheme"
import {
    useDriverSelection,
    useDriverSelectionDispatch,
} from "@/src/components/Tables/presets/results/driverSelection"
import { Chip } from "@/src/components/ui/Chip"
import { StyleSheet } from "react-native"
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated"

const styleSheet = StyleSheet.create({
    wrapper: {
        width: "90%",
        borderRadius: 32,
        borderWidth: 1,
        backgroundColor: "blue",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 8,
        paddingInline: 16,
        paddingBlock: 8,
    },
})

export const ResultsSection = () => {
    const driverSelection = useDriverSelection()
    const { deleteDriver } = useDriverSelectionDispatch()

    const driverAbbreviations = Object.entries(driverSelection)
        .filter(([_, isSelected]) => isSelected)
        .map(([driverId]) => [driverId, driverId.split(" ")[1].slice(0, 3)])

    const isVisible = driverAbbreviations.length > 0
    return (
        isVisible && (
            <Animated.View
                entering={SlideInDown.duration(300)}
                exiting={SlideOutDown.duration(300)}
                style={[
                    {
                        ...styleSheet.wrapper,
                        borderColor: getColor("border"),
                        backgroundColor: getColor("card"),
                    },
                ]}
            >
                {driverAbbreviations.map(([driver, abbreviation]) => (
                    <Chip key={driver} label={abbreviation} onPress={() => deleteDriver(driver)} />
                ))}
            </Animated.View>
        )
    )
}
