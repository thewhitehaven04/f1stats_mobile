"use server"
import db from "@/client/db"
import React, { Suspense } from "react"
import { Text } from "react-native"
// import { SeasonEvent } from "@/src/components/SeasonEvent"
import type { TMappedSeasonEvent } from "@/src/EventFetcher/types"

function mapSeasonEvents(
    event: Awaited<ReturnType<typeof getSeasonEvents>>[number],
): TMappedSeasonEvent {
    const rest = {
        name: event.event_name,
        officialName: event.event_official_name,
        country: event.country,
        season: event.season_year,
        dateStart: event.date_start,
    }

    const fp1 = event.event_sessions.find((s) => s.session_type_id === "Practice 1")
    const fp2 = event.event_sessions.find((s) => s.session_type_id === "Practice 2")
    const fp3 = event.event_sessions.find((s) => s.session_type_id === "Practice 3")
    const quali = event.event_sessions.find((s) => s.session_type_id === "Qualifying")
    const race = event.event_sessions.find((s) => s.session_type_id === "Race")
    const sprint = event.event_sessions.find((s) => s.session_type_id === "Sprint")
    const sprintQuali = event.event_sessions.find((s) => s.session_type_id === "Sprint Qualifying")

    if (event.event_format_name === "conventional") {
        return {
            ...rest,
            format: event.event_format_name,
            sessions: {
                fp1: fp1
                    ? {
                          type: fp1.session_type_id,
                          dateStart: fp1.start_time,
                          dateEnd: fp1.end_time,
                      }
                    : null,
                fp2: fp2
                    ? {
                          type: fp2.session_type_id,
                          dateStart: fp2.start_time,
                          dateEnd: fp2.end_time,
                      }
                    : null,
                fp3: fp3
                    ? {
                          type: fp3.session_type_id,
                          dateStart: fp3.start_time,
                          dateEnd: fp3.end_time,
                      }
                    : null,
                quali: quali
                    ? {
                          type: quali.session_type_id,
                          dateStart: quali.start_time,
                          dateEnd: quali.end_time,
                      }
                    : null,
                race: race
                    ? {
                          type: race.session_type_id,
                          dateStart: race.start_time,
                          dateEnd: race.end_time,
                      }
                    : null,
            },
        }
    }

    if (
        event.event_format_name === "sprint_shootout" ||
        event.event_format_name === "sprint_qualifying"
    ) {
        return {
            ...rest,
            format: event.event_format_name,
            sessions: {
                fp1: fp1
                    ? {
                          type: fp1.session_type_id,
                          dateStart: fp1.start_time,
                          dateEnd: fp1.end_time,
                      }
                    : null,
                sprintQuali: sprintQuali
                    ? {
                          type: sprintQuali.session_type_id,
                          dateStart: sprintQuali.start_time,
                          dateEnd: sprintQuali.end_time,
                      }
                    : null,
                sprint: sprint
                    ? {
                          type: sprint.session_type_id,
                          dateStart: sprint.start_time,
                          dateEnd: sprint.end_time,
                      }
                    : null,
                quali: quali
                    ? {
                          type: quali.session_type_id,
                          dateStart: quali.start_time,
                          dateEnd: quali.end_time,
                      }
                    : null,
                race: race
                    ? {
                          type: race.session_type_id,
                          dateStart: race.start_time,
                          dateEnd: race.end_time,
                      }
                    : null,
            },
        }
    }

    if (event.event_format_name === "sprint") {
        return {
            ...rest,
            format: event.event_format_name,
            sessions: {
                fp1: fp1
                    ? {
                          type: fp1.session_type_id,
                          dateStart: fp1.start_time,
                          dateEnd: fp1.end_time,
                      }
                    : null,
                sprintQuali: sprintQuali
                    ? {
                          type: sprintQuali.session_type_id,
                          dateStart: sprintQuali.start_time,
                          dateEnd: sprintQuali.end_time,
                      }
                    : null,
                quali: quali
                    ? {
                          type: quali.session_type_id,
                          dateStart: quali.start_time,
                          dateEnd: quali.end_time,
                      }
                    : null,
                fp2: fp2
                    ? {
                          type: fp2.session_type_id,
                          dateStart: fp2.start_time,
                          dateEnd: fp2.end_time,
                      }
                    : null,
                race: race
                    ? {
                          type: race.session_type_id,
                          dateStart: race.start_time,
                          dateEnd: race.end_time,
                      }
                    : null,
            },
        }
    }
    if (event.event_format_name === "testing") {
        return {
            ...rest,
            format: event.event_format_name,
            sessions: {
                fp1: fp1
                    ? {
                          type: fp1.session_type_id,
                          dateStart: fp1.start_time,
                          dateEnd: fp1.end_time,
                      }
                    : null,
                fp2: fp2
                    ? {
                          type: fp2.session_type_id,
                          dateStart: fp2.start_time,
                          dateEnd: fp2.end_time,
                      }
                    : null,
                fp3: fp3
                    ? {
                          type: fp3.session_type_id,
                          dateStart: fp3.start_time,
                          dateEnd: fp3.end_time,
                      }
                    : null,
            },
        }
    }
    throw new Error("Unknown event format")
}

export async function getSeasonEvents(season: string) {
    return await db.events.findMany({
        where: {
            season_year: Number.parseInt(season),
            event_format_name: {
                not: "testing",
            },
        },
        include: {
            event_sessions: {
                select: {
                    session_type_id: true,
                    start_time: true,
                    end_time: true,
                },
            },
        },
        orderBy: {
            date_start: "asc",
        },
    })
}

export async function fetchEventsWithSessions(season: string): Promise<TMappedSeasonEvent[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                {
                    country: "AUS",
                    dateStart: new Date(),
                    format: "conventional",
                    name: "Melbourne Grand Prix",
                    officialName: "Melbourne Grand Prix",
                    season: 2022,
                    sessions: {
                        fp1: {
                            type: "Practice 1",
                            dateStart: new Date(),
                            dateEnd: new Date(),
                        },
                        fp2: {
                            type: "Practice 1",
                            dateStart: new Date(),
                            dateEnd: new Date(),
                        },
                        fp3: {
                            type: "Practice 1",
                            dateStart: new Date(),
                            dateEnd: new Date(),
                        },
                        quali: {
                            type: "Practice 1",
                            dateStart: new Date(),
                            dateEnd: new Date(),
                        },
                        race: {
                            type: "Practice 1",
                            dateStart: new Date(),
                            dateEnd: new Date(),
                        },
                    },
                },
            ])
        }, 1000)
    })
}

async function renderSeasonEventsAction({ season }: { season: string }) {
    const events = await fetchEventsWithSessions(season)

    return (
        <Suspense fallback={<Text>Loading</Text>}>
            {events.map((e) => (
                <Text key={e.country}>{JSON.stringify(e)}</Text>
            ))}
        </Suspense>
    )
}

export default renderSeasonEventsAction
