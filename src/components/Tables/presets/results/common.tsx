import { getColor } from '@/src/colorScheme'
import { TextCell } from "@/src/components/Tables"
import { createColumnHelper } from "@tanstack/react-table"
import { Text } from 'react-native'

export interface IBaseResultsData {
    driver: { name: string; country: string; id: string; abbreviation: string }
    teamName: { name: string; id: number } | null
}

const helper = createColumnHelper<IBaseResultsData>()

// using explicit element keys to prevent missing key warning
export const BASE_COLUMNS = [
    helper.display({
        cell: (info) => (
            <TextCell key="pos" style={{ flexBasis: 54 }}>
                {info.row.index + 1}
            </TextCell>
        ),
        header: "Pos",
        size: 54,
    }),
    helper.accessor("driver.abbreviation", {
        cell: (info) => (
            <TextCell key="driver" style={{ flexBasis: 72 }}>
                {info.getValue()}
            </TextCell>
        ),
        header: (info) => <Text key={info.column.id}>Driver</Text>,
        size: 72,
    }),
]
