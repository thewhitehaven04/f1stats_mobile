"use client"
import { Button } from "@/src/components/ui/Button"
import { Chip } from "@/src/components/ui/Chip"
import { Link, useLocalSearchParams } from "expo-router"
import { StyleSheet, ScrollView } from "react-native"
import { BottomSheet } from "../ui/BottomSheet"
import { useAppDispatch, useAppSelector } from "@/src/store"
import { toggleDriver } from "@/src/store/slices/driverSelection"
import { useMemo } from "react"

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
        width: "90%",
        paddingBlock: 8,
        paddingInline: 16,
    },
})

export const DriverSelectionBar = () => {
    const { season, event, session }: { season: string; event: string; session: string } =
        useLocalSearchParams()

    const dispatch = useAppDispatch()
    const resultSelection = useAppSelector(
        ({ driverSelection }) => driverSelection.driverResultSelection,
    )

    const driverAbbreviations = useMemo(
        () =>
            Object.entries(resultSelection)
                .filter(([_, isSelected]) => isSelected)
                .map(([driverId]) => [driverId, driverId.split(" ")[1].slice(0, 3)]),
        [resultSelection],
    )

    const isVisible = driverAbbreviations.length > 0
    return (
        isVisible && (
            <BottomSheet style={styleSheet.wrapper}>
                <ScrollView horizontal contentContainerStyle={styleSheet.chipWrapper}>
                    {driverAbbreviations.map(([driver, abbreviation]) => (
                        <Chip
                            key={driver}
                            label={abbreviation}
                            onPress={() =>
                                dispatch(
                                    toggleDriver({
                                        driver,
                                    }),
                                )
                            }
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
