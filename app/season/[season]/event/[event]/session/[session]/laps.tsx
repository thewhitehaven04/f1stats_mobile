"use client"
import { Link, useLocalSearchParams } from "expo-router"
import { StyleSheet, View, Text } from "react-native"
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner"
import * as SegmentedControl from "@/src/components/ui/SegmentedControl"
import { SessionLaptimesScatterplot } from "@/src/components/Plots/SessionLaptimesScatter"
import { LapSelectionTable } from "@/src/components/LapSelectionTable"
import { Button } from "@/src/components/ui/Button"
import { BottomSheet } from "@/src/components/ui/BottomSheet"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAppSelector } from "@/src/store"
import { useGetLapsQuery, type TSession } from "@/src/store/slices/api"
import { selectDriverList } from "@/src/store/slices/driverSelection"
import Ionicons from "@expo/vector-icons/Ionicons"
import { LaptimeBoxPlot } from "@/src/components/Plots/Box"

const styleSheet = StyleSheet.create({
    bottomSheet: {
        width: "90%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        paddingBlock: 8,
        bottom: 40,
    },
    bottomSheetButton: {
        width: "100%",
        height: "100%",
    },
    segmentWrapper: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
})

const TelemetryNavigation = (props: { season: string; session: string; event: string }) => {
    const { season, session, event } = props
    const selectedDriverLaps = useAppSelector((state) => state.lapSelection)
    const hasSelectedLaps = selectedDriverLaps.length > 0

    return hasSelectedLaps ? (
        <BottomSheet style={styleSheet.bottomSheet}>
            <Link
                href={{
                    pathname: "/season/[season]/event/[event]/session/[session]/avgTelemetry",
                    params: {
                        season,
                        session,
                        event,
                    },
                }}
                asChild
            >
                <Button
                    label="Average telemetry"
                    variant="outline"
                    style={styleSheet.bottomSheetButton}
                />
            </Link>
            <Link
                href={{
                    pathname: "/season/[season]/event/[event]/session/[session]/lapTelemetry",
                    params: {
                        season,
                        session,
                        event,
                    },
                }}
                asChild
            >
                <Button
                    label="Lap telemetry"
                    variant="outline"
                    style={styleSheet.bottomSheetButton}
                />
            </Link>
        </BottomSheet>
    ) : null
}

export const LapsView = (props: { season: string; event: string; session: string }) => {
    const { season, session, event } = props
    const selectedDrivers = useAppSelector(selectDriverList)

    const { data, isLoading } = useGetLapsQuery({
        session: decodeURIComponent(session) as TSession,
        event: decodeURIComponent(event),
        year: season,
        driverSelection: selectedDrivers,
    })
    return (
        <>
            <SegmentedControl.Segment name="Table">
                {isLoading || !data ? <LoadingSpinner /> : <LapSelectionTable data={data} />}
                <TelemetryNavigation season={season} session={session} event={event} />
            </SegmentedControl.Segment>
            <SegmentedControl.Segment name="Chart">
                {isLoading || !data ? (
                    <LoadingSpinner />
                ) : (
                    <SessionLaptimesScatterplot data={data} />
                )}
            </SegmentedControl.Segment>
            <SegmentedControl.Segment name="Box plot">
                {isLoading || !data ? <LoadingSpinner /> : <LaptimeBoxPlot data={data} />}
            </SegmentedControl.Segment>
        </>
    )
}

export default function LapsScreen() {
    const { season, session, event }: { season: string; session: string; event: string } =
        useLocalSearchParams()

    return (
        <SafeAreaView edges={["top", "left", "right"]}>
            <SegmentedControl.Root defaultSegment="Table">
                <View style={styleSheet.segmentWrapper}>
                    <SegmentedControl.Wrapper
                        style={{ justifyContent: "center", alignItems: "center", marginBottom: 8 }}
                    >
                        <SegmentedControl.SegmentSelector
                            name="Table"
                            icon={<Ionicons name="menu-outline" size={24} />}
                        />
                        <SegmentedControl.SegmentSelector
                            name="Chart"
                            icon={<Ionicons name="trending-up-outline" size={24} />}
                        />
                        <SegmentedControl.SegmentSelector
                            name="Box plot"
                            icon={<Ionicons name="cube-outline" size={24} />}
                        />
                    </SegmentedControl.Wrapper>
                </View>
                <LapsView season={season} session={session} event={event} />
            </SegmentedControl.Root>
        </SafeAreaView>
    )
}
