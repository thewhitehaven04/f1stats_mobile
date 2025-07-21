import { TextCell } from "@/src/components/Tables"
import { createColumnHelper } from "@tanstack/react-table"

export interface IBaseResultsData {
    driver: { name: string; country: string; id: string; abbreviation: string }
    teamName: { name: string; id: number } | null
}

const helper = createColumnHelper<IBaseResultsData>()

export const BASE_COLUMNS = [
    helper.display({
        cell: (info) => <TextCell style={{ width: 48 }}>{info.row.index + 1}</TextCell>,
        header: "Pos",
        size: 48,
    }),
    helper.accessor("driver.abbreviation", {
        cell: (info) => <TextCell style={{ width: 60 }}>{info.getValue()}</TextCell>,
        header: "Driver",
        size: 60,
    }),
]
