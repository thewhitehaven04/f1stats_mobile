import { type SessionQuery } from "@/src/client/generated"
import { createClient } from "@hey-api/client-fetch"

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL

export const ApiClient = createClient({
    baseUrl: BASE_URL,
})

export const buildQueriesFromSelection = (selection: [string, number][]) => {
    const queries: SessionQuery[] = []

    for (const [driver, lap] of selection) {
        const drv = queries.find((q) => q.driver === driver)

        if (!drv) {
            queries.push({
                driver,
                lap_filter: [lap],
            })
        } else {
            if (drv.lap_filter) {
                drv.lap_filter.push(lap)
            }
        }
    }

    return queries
}
