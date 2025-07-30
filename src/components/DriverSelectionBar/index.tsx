"use client"
import { getColor } from "@/src/colorScheme"
import { DriverSelection } from '@/src/components/Tables/presets/results/driverSelectionAtom'
import { Button } from "@/src/components/ui/Button"
import { Chip } from "@/src/components/ui/Chip"
import { Link, useLocalSearchParams } from "expo-router"
import { useAtom } from 'jotai'
import { StyleSheet, Text, ScrollView } from "react-native"
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated"

const styleSheet = StyleSheet.create({
    wrapper: {
        width: "100%",
        borderRadius: 16,
        borderWidth: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "baseline",
        gap: 8,
        paddingInline: 16,
        paddingBlock: 8,
    },
    chipWrapper: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        gap: 8,
        alignItems: "center",
        width: "64%",
    },
})

export const DriverSelectionBar = () => {
    const { season, event, session }: { season: string; event: string; session: string } =
        useLocalSearchParams()

    const [driverSelection, setDriverSelection] = useAtom(DriverSelection)

    const deleteDriver = (driver: string) => {
        setDriverSelection((prev) => {
            return {
                ...prev,
                [driver]: false,
            }
        })
    }

    const drivers = Object.entries(driverSelection).filter(([_, isSelected]) => isSelected)
    const driverAbbreviations = drivers.map(([driverId]) => [
        driverId,
        driverId.split(" ")[1].slice(0, 3),
    ])

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
                <ScrollView horizontal contentContainerStyle={styleSheet.chipWrapper}>
                    {driverAbbreviations.map(([driver, abbreviation]) => (
                        <Chip
                            key={driver}
                            label={abbreviation}
                            onPress={() => deleteDriver(driver)}
                        />
                    ))}
                </ScrollView>
                <Link
                    href={{
                        // @ts-ignore
                        pathname: `/season/[season]/event/[event]/session/[session]/laps?${drivers.map(([driver]) => `drivers=${driver}`).join("&")}`,
                        params: {
                            season,
                            event,
                            session,
                        },
                    }}
                    prefetch
                    asChild
                >
                    <Button>
                        <Text>Analyse</Text>
                    </Button>
                </Link>
            </Animated.View>
        )
    )
}
