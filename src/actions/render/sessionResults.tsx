import { ResultsTable } from "@/src/components/Tables/presets/results"
import {
    SessionType,
    sessionResultsToTableRows,
} from "@/src/components/Tables/presets/results/mapper"
import { PRACTICE_RESULTS_COLUMNS } from "@/src/components/Tables/presets/results/practice"
import { QUALIFYING_COLUMNS_RESULTS } from "@/src/components/Tables/presets/results/qualifying"
import { RACE_RESULTS_COLUMNS } from "@/src/components/Tables/presets/results/race"
import { fetchSessionResults } from "@/src/fetchers/results"

const SESSION_TYPE_COLUMN_MAP = Object.freeze({
    [SessionType.PRACTICE]: PRACTICE_RESULTS_COLUMNS,
    [SessionType.QUALIFYING]: QUALIFYING_COLUMNS_RESULTS,
    [SessionType.RACE]: RACE_RESULTS_COLUMNS,
})

async function renderSessionResults({
    season,
    event,
    session,
}: {
    season: string
    event: string
    session: string
}) {
    const results = await fetchSessionResults(season, event, session)

    const { rows, sessionType } = sessionResultsToTableRows(results.data, results.type)

    return (
        <ResultsTable
            columns={SESSION_TYPE_COLUMN_MAP[sessionType]}
            data={rows}
            sessionType={sessionType}
        />
    )
}

export default renderSessionResults
