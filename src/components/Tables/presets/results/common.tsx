import { TextCell } from "@/src/components/Tables"
import { createColumnHelper } from "@tanstack/react-table"

export interface IBaseResultsData {
    driver: { name: string; country: string; id: string; abbreviation: string }
    teamName: { name: string; id: number } | null
}

const helper = createColumnHelper<IBaseResultsData>()

export const BASE_COLUMNS = [
    helper.display({
        cell: (info) => <TextCell style={{ flexBasis: 60 }}>{info.row.index + 1}</TextCell>,
        header: "Pos",
        size: 60,
    }),
    helper.accessor("driver.abbreviation", {
        cell: (info) => <TextCell style={{ flexBasis: 84 }}>{info.getValue()}</TextCell>,
        header: "Driver",
        size: 84,
    }),
]
