"use server"
import { SeasonEvent } from "@/src/components/SeasonEvent"
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner"
import { getSeasonEvents } from "@/src/fetchers/events"
import React, { Suspense } from "react"
import { View, Text } from "react-native"
import * as FontSizes from "@/src/fontSizes"

async function renderSeasonEventsAction({ season }: { season: string }) {
    const events = await getSeasonEvents(season)
    const isEmpty = events.length === 0

    return (
        <Suspense fallback={<LoadingSpinner />}>
            {isEmpty && (
                <View
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontSize: FontSizes.Title.sm, fontWeight: 500 }}>
                        Unable to obtain event data for {season} season
                    </Text>
                </View>
            )}
            {events.map((evt) => (
                <SeasonEvent key={evt.officialName} event={evt} />
            ))}
        </Suspense>
    )
}

export default renderSeasonEventsAction
