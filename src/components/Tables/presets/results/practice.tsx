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
            <TextCell key="time" style={{ flexBasis: 120 }}>
                {formatTime(info.getValue() as number)}
            </TextCell>
        ),
        header: () => <Text key="laptime">Laptime</Text>,
        size: 120,
    }),
    helper.accessor("gap", {
        cell: (info) => (
            <TextCell key="gap" style={{ flexBasis: 84 }}>
                {info.getValue()}
            </TextCell>
        ),
        header: () => <Text key="gap">Gap</Text>,
        size: 84,
    }),
]
