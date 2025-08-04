"use client"
import { Link, useLocalSearchParams } from "expo-router"
import { StyleSheet } from "react-native"
import { Suspense } from "react"
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner"
import * as SegmentedControl from "@/src/components/ui/SegmentedControl"
import { SessionLaptimesScatterplot } from "@/src/components/Plots/SessionLaptimesScatterplot"
import { LapSelectionTable } from "@/src/components/LapSelectionTable"
import { Button } from "@/src/components/ui/Button"
import { BottomSheet } from "@/src/components/ui/BottomSheet"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAppSelector } from "@/src/store"
import { listLaps } from "@/src/store/slices/driverSelection"
import { useGetLapsQuery, usePrefetch, type TSession } from "@/src/client"

const styleSheet = StyleSheet.create({
    bottomSheet: {
        width: "90%",
        bottom: 100,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    bottomSheetButton: {
        width: "100%",
        height: "100%",
    },
})

export default function LapsScreen() {
    const { season, session, event }: { season: string; session: string; event: string } =
        useLocalSearchParams()

    const selectedDrivers = useAppSelector(listLaps)

    const { data, isLoading } = useGetLapsQuery({
        session: decodeURIComponent(session) as TSession,
        event: decodeURIComponent(event),
        year: season,
        driverSelection: selectedDrivers,
    })

    const hasSelectedLaps = selectedDrivers.length > 0
    
    usePrefetch("getLapTelemetries", {
        ifOlderThan: 0.5,
    })
    usePrefetch("getAverageTelemetries", {
        ifOlderThan: 0.5,
    })

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <SafeAreaView edges={["top", "left", "right"]}>
                <SegmentedControl.Root defaultSegment="Table">
                    <SegmentedControl.Wrapper>
                        <SegmentedControl.SegmentSelector name="Table" />
                        <SegmentedControl.SegmentSelector name="Chart" />
                    </SegmentedControl.Wrapper>
                    <SegmentedControl.Segment name="Table">
                        {isLoading || !data ? (
                            <LoadingSpinner />
                        ) : (
                            <LapSelectionTable data={data} />
                        )}
                        {hasSelectedLaps && (
                            <BottomSheet style={styleSheet.bottomSheet}>
                                <Link
                                    href={{
                                        pathname:
                                            "/season/[season]/event/[event]/session/[session]/avgTelemetry",
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
                                <Link
                                    href={{
                                        pathname:
                                            "/season/[season]/event/[event]/session/[session]/lapTelemetry",
                                        params: {
                                            season,
                                            session,
                                            event,
                                        },
                                    }}
                                    asChild
                                >
                                    <Button
                                        label="View average telemetry"
                                        style={styleSheet.bottomSheetButton}
                                    />
                                </Link>
                            </BottomSheet>
                        )}
                    </SegmentedControl.Segment>
                    <SegmentedControl.Segment name="Chart">
                        {isLoading || !data ? (
                            <LoadingSpinner />
                        ) : (
                            <SessionLaptimesScatterplot data={data} />
                        )}
                    </SegmentedControl.Segment>
                </SegmentedControl.Root>
            </SafeAreaView>
        </Suspense>
    )
}
