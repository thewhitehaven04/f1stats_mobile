"use client"
import { useLocalSearchParams } from "expo-router"
import { View } from "react-native"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner"
import * as SegmentedControl from "@/src/components/ui/SegmentedControl"
import { LapSelectionTable } from "@/src/components/LapSelectionTable"
import { SessionLaptimesScatterplot } from "@/src/components/Plots/SessionLaptimesScatterplot"
import { getDriverLaps } from "@/src/fetchers/laps"

export default function LapsScreen() {
    const {
        season,
        session,
        event,
        drivers,
    }: { season: string; session: string; event: string; drivers: string[] } =
        useLocalSearchParams()

    const { data } = useSuspenseQuery({
        queryKey: [season, session, event, drivers],
        queryFn: async () =>
            getDriverLaps({
                event,
                season,
                session,
                drivers,
            }),
    })

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <View>
                <SegmentedControl.Root defaultSegment="Table">
                    <SegmentedControl.Wrapper>
                        <SegmentedControl.SegmentSelector name="Table" />
                        <SegmentedControl.SegmentSelector name="Chart" />
                    </SegmentedControl.Wrapper>
                    <SegmentedControl.Segment name="Table">
                        <LapSelectionTable data={data} />
                    </SegmentedControl.Segment>
                    <SegmentedControl.Segment name="Chart">
                        <SessionLaptimesScatterplot data={data} />
                    </SegmentedControl.Segment>
                </SegmentedControl.Root>
            </View>
        </Suspense>
    )
}
