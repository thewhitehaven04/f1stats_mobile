import { ApiClient } from "@/src/client"
import { getSessionLaptimesFilteredApiSeasonYearEventEventSessionSessionLapsPost } from "@/src/client/generated"

type TSession =
    | "Race"
    | "Qualifying"
    | "Sprint"
    | "Sprint Qualifying"
    | "Sprint Shootout"
    | "Practice 1"
    | "Practice 2"
    | "Practice 3"

export const getDriverLaps = async ({
    event,
    season,
    session,
    drivers,
}: {
    event: string
    season: string
    session: string
    drivers: string[]
}) => {
    const queries = drivers.map((driver) => ({
        driver,
        lap_filter: null,
    }))

    return getSessionLaptimesFilteredApiSeasonYearEventEventSessionSessionLapsPost({
        client: ApiClient,
        path: {
            event,
            session: session as TSession,
            year: season,
        },
        body: { queries },
        throwOnError: true,
    }).then((res) => res.data)
}
