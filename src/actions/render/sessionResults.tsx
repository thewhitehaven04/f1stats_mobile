import { ResultsTable } from "@/src/components/Tables/presets/results"
import type { IBaseResultsData } from "@/src/components/Tables/presets/results/common"
import {
    SessionType,
    sessionResultsToTableRows,
} from "@/src/components/Tables/presets/results/mapper"
import {
    PRACTICE_RESULTS_COLUMNS,
    type IPracticeData,
} from "@/src/components/Tables/presets/results/practice"
import {
    QUALIFYING_COLUMNS_RESULTS,
    type IQualifyingData,
} from "@/src/components/Tables/presets/results/qualifying"
import { RACE_RESULTS_COLUMNS, type IRaceData } from "@/src/components/Tables/presets/results/race"
import { fetchSessionResults } from "@/src/fetchers/results"
import type { ColumnDef } from "@tanstack/react-table"
import { ScrollView } from "react-native"

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

    const { rows, sessionType, ...rest } = sessionResultsToTableRows(results.data, results.type)

    return (
        <ResultsTable
            columns={
                SESSION_TYPE_COLUMN_MAP[sessionType] as ColumnDef<
                    IPracticeData | IRaceData | IQualifyingData
                >[]
            }
            rows={rows}
            sessionType={sessionType}
            {...rest}
        />
    )
}

export default renderSessionResults
