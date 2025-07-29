"use client"
import { useLocalSearchParams } from "expo-router"
import { View } from "react-native"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ApiClient } from "@/src/client"
import { getSessionLaptimesFilteredApiSeasonYearEventEventSessionSessionLapsPost } from "@/src/client/generated"
import { Suspense } from "react"
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner"
import * as SegmentedControl from "@/src/components/ui/SegmentedControl"
import { LapSelectionTable } from "@/src/components/LapSelectionTable"
import { SessionLaptimesScatterplot } from "@/src/components/Plots/SessionLaptimesScatterplot"

export default function LapsScreen() {
    const {
        season,
        session,
        event,
        drivers,
    }: { season: string; session: string; event: string; drivers: string[] } =
        useLocalSearchParams()

    const queries = drivers.map((driver) => ({
        driver,
        lap_filter: null,
    }))
    const { data } = useSuspenseQuery({
        queryKey: [season, session, event, drivers],
        queryFn: async () =>
            await getSessionLaptimesFilteredApiSeasonYearEventEventSessionSessionLapsPost({
                client: ApiClient,
                path: {
                    event,
                    session,
                    year: season,
                },
                body: { queries },
                throwOnError: true,
            }),
    })

    return (
        <Suspense fallback={<LoadingSpinner />}>
            <View style={{ paddingInline: 8, paddingTop: 8 }}>
                <SegmentedControl.Root defaultSegment="Table">
                    <SegmentedControl.Wrapper>
                        <SegmentedControl.SegmentSelector name="Table" />
                        <SegmentedControl.SegmentSelector name="Chart" />
                    </SegmentedControl.Wrapper>
                    <SegmentedControl.Segment name="Table">
                        <LapSelectionTable data={data.data} />
                    </SegmentedControl.Segment>
                    <SegmentedControl.Segment name="Chart">
                        <SessionLaptimesScatterplot data={data.data} />
                    </SegmentedControl.Segment>
                </SegmentedControl.Root>
            </View>
        </Suspense>
    )
}
