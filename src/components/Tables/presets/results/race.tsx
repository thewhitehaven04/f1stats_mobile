import { TextCell } from "@/src/components/Tables"
import { BASE_COLUMNS, type IBaseResultsData } from "@/src/components/Tables/presets/results/common"
import type { RACE_COLUMNS } from "@/src/components/Tables/presets/results/mapper"
import { formatTime } from "@/src/core/helpers"
import { createColumnHelper } from "@tanstack/react-table"

export interface IRaceData extends IBaseResultsData {
    time: number | null
    gap: number | null
    child: {
        rows: (string | null | number)[]
        columns: typeof RACE_COLUMNS
    }
}

export interface IExpandedRaceData {
    gridPosition: number | null
    points: number | null
    status: string | null
}

const raceHelper = createColumnHelper<IRaceData>()

export const RACE_RESULTS_COLUMNS = [
    ...BASE_COLUMNS,
    raceHelper.accessor("time", {
        header: "Total time",
        cell: (info) => (
            <TextCell key="totalTime" style={{ flexBasis: 132 }}>
                {formatTime(info.getValue() as number)}
            </TextCell>
        ),
        size: 132,
    }),
    raceHelper.accessor("gap", {
        header: "Gap",
        cell: (info) => (
            <TextCell key="gap" style={{ flexBasis: 96 }}>
                {formatTime(info.getValue() as number)}
            </TextCell>
        ),
        size: 96,
    }),
]