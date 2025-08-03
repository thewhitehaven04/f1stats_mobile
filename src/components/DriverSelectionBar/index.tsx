"use client"
import { DriverSelection } from "@/src/components/Tables/presets/results/driverSelectionAtom"
import { Button } from "@/src/components/ui/Button"
import { Chip } from "@/src/components/ui/Chip"
import { Link, useLocalSearchParams } from "expo-router"
import { useAtom } from "jotai"
import { StyleSheet, ScrollView } from "react-native"
import { BottomSheet } from "../ui/BottomSheet"

const styleSheet = StyleSheet.create({
    chipWrapper: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        gap: 8,
        alignItems: "center",
        width: "64%",
    },
    wrapper: {
        width: '90%',
        paddingBlock: 8,
        paddingInline: 16
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
            <BottomSheet style={styleSheet.wrapper}>
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
                        pathname: "/season/[season]/event/[event]/session/[session]/laps",
                        params: {
                            season,
                            event,
                            session,
                        },
                    }}
                    asChild
                >
                    <Button variant="outline" label="Analyse" />
                </Link>
            </BottomSheet>
        )
    )
}
