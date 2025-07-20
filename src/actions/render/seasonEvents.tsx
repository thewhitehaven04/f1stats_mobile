"use server"
import { SeasonEvent } from "@/src/components/SeasonEvent"
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner"
import { getSeasonEvents } from "@/src/fetchers/events"
import React, { Suspense } from "react"

async function renderSeasonEventsAction({ season }: { season: string }) {
    const events = await getSeasonEvents(season)

    return (
        <Suspense fallback={<LoadingSpinner />}>
            {events.map((evt) => (
                <SeasonEvent key={evt.officialName} event={evt} />
            ))}
        </Suspense>
    )
}

export default renderSeasonEventsAction
