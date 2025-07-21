import { ResultsTable } from "@/src/components/Tables/presets/results"
import { SESSION_TYPE_COLUMN_MAP } from "@/src/components/Tables/presets/results/common"
import { sessionResultsToTableRows } from "@/src/components/Tables/presets/results/mapper"
import { fetchSessionResults } from "@/src/fetchers/results"

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
