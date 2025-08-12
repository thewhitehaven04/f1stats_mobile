import { TextCell } from "@/src/components/Tables"
import { BASE_COLUMNS, type IBaseResultsData } from "@/src/components/Tables/presets/results/common"
import { formatTime } from "@/src/core/helpers"
import { createColumnHelper } from "@tanstack/react-table"
import { Text } from "react-native"

export interface IPracticeData extends IBaseResultsData {
    time: number | null
    gap: number | null
    child: {
        rows: []
        columns: []
    }
}

const helper = createColumnHelper<IPracticeData>()

export const PRACTICE_RESULTS_COLUMNS = [
    ...BASE_COLUMNS,
    helper.accessor("time", {
        cell: (info) => (
            <TextCell key={info.column.id}>
                {formatTime(info.getValue() as number)}
            </TextCell>
        ),
        header: () => "Laptime",
        size: 120,
    }),
    helper.accessor("gap", {
        cell: (info) => (
            <TextCell key={info.column.id}>
                {info.getValue()}
            </TextCell>
        ),
        header: () => "Gap",
        size: 84,
    }),
]
