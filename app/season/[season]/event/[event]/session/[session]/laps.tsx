"use client"
import { Link, useLocalSearchParams } from "expo-router"
import { StyleSheet } from "react-native"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner"
import * as SegmentedControl from "@/src/components/ui/SegmentedControl"
import { SessionLaptimesScatterplot } from "@/src/components/Plots/SessionLaptimesScatterplot"
import { getDriverLaps } from "@/src/fetchers/laps"
import { LapSelectionTable } from "@/src/components/LapSelectionTable"
import { useDriverSelectionList } from "@/src/components/Tables/presets/results/driverSelectionAtom"
import { useAtomValue } from "jotai"
import { TelemetryLapSelection } from "@/src/atoms/telemetryLapSelection"
import { Button } from "@/src/components/ui/Button"
import { BottomSheet } from "@/src/components/ui/BottomSheet"
import { SafeAreaView } from "react-native-safe-area-context"

const styleSheet = StyleSheet.create({
    bottomSheet: {
        width: "90%",
        bottom: 100,
    },
    bottomSheetButton: {
        width: "100%",
        height: "100%",
    },
})

export default function LapsScreen() {
    const { season, session, event }: { season: string; session: string; event: string } =
        useLocalSearchParams()

    const selectedDrivers = useDriverSelectionList()

    const { data } = useSuspenseQuery({
        queryKey: [season, session, event, selectedDrivers],
        queryFn: async () =>
            getDriverLaps({
                event,
                season,
                session,
                drivers: selectedDrivers,
            }),
    })

    const selection = useAtomValue(TelemetryLapSelection)
    const hasSelectedLaps = selection.length > 0

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <SafeAreaView edges={["top", "left", "right"]}>
                <SegmentedControl.Root defaultSegment="Table">
                    <SegmentedControl.Wrapper>
                        <SegmentedControl.SegmentSelector name="Table" />
                        <SegmentedControl.SegmentSelector name="Chart" />
                    </SegmentedControl.Wrapper>
                    <SegmentedControl.Segment name="Table">
                        <LapSelectionTable data={data} />
                        {hasSelectedLaps && (
                            <BottomSheet style={styleSheet.bottomSheet}>
                                <Link
                                    href={{
                                        pathname:
                                            "/season/[season]/event/[event]/session/[session]/telemetry",
                                        params: {
                                            season,
                                            session,
                                            event,
                                        },
                                    }}
                                    asChild
                                >
                                    <Button
                                        label="View telemetry"
                                        style={styleSheet.bottomSheetButton}
                                    />
                                </Link>
                            </BottomSheet>
                        )}
                    </SegmentedControl.Segment>
                    <SegmentedControl.Segment name="Chart">
                        <SessionLaptimesScatterplot data={data} />
                    </SegmentedControl.Segment>
                </SegmentedControl.Root>
            </SafeAreaView>
        </Suspense>
    )
}
