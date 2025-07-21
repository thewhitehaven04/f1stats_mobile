import { SessionType } from "@/src/components/Tables/presets/results/mapper"
import { PRACTICE_RESULTS_COLUMNS } from "@/src/components/Tables/presets/results/practice"
import { QUALIFYING_COLUMNS_RESULTS } from "@/src/components/Tables/presets/results/qualifying"
import { RACE_RESULTS_COLUMNS } from "@/src/components/Tables/presets/results/race"

export interface IBaseResultsData {
    driver: { name: string; country: string; id: string; abbreviation: string }
    teamName: { name: string; id: number } | null
}

export const SESSION_TYPE_COLUMN_MAP = Object.freeze({
    [SessionType.PRACTICE]: PRACTICE_RESULTS_COLUMNS,
    [SessionType.QUALIFYING]: QUALIFYING_COLUMNS_RESULTS,
    [SessionType.RACE]: RACE_RESULTS_COLUMNS,
})
