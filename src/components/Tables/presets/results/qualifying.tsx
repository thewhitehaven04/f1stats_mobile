import { TextCell } from "@/src/components/Tables"
import { BASE_COLUMNS, type IBaseResultsData } from "@/src/components/Tables/presets/results/common"
import type { QUALIFYING_COLUMNS } from "@/src/components/Tables/presets/results/mapper"
import { formatTime } from "@/src/core/helpers"
import { createColumnHelper } from "@tanstack/react-table"
import { Text } from 'react-native'

export interface IQualifyingData extends IBaseResultsData {
    time: number | null
    child: {
        rows: (string | number | null)[]
        columns: typeof QUALIFYING_COLUMNS
    }
}

const helper = createColumnHelper<IQualifyingData>()

export const QUALIFYING_COLUMNS_RESULTS = [
    ...BASE_COLUMNS,
    helper.accessor("time", {
        header: (info) => <Text key={info.column.id}>Laptime</Text>,
        cell: (info) => (
            <TextCell key="time" style={{ flexBasis: 160 }}>
                {formatTime(info.getValue() as number)}
            </TextCell>
        ),
        size: 160,
    }),
]
