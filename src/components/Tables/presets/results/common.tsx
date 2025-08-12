import { TextCell } from "@/src/components/Tables"
import { createColumnHelper } from "@tanstack/react-table"

export interface IBaseResultsData {
    driver: { name: string; country: string; id: string; abbreviation: string }
    teamName: { name: string; id: number } | null
}

const helper = createColumnHelper<IBaseResultsData>()

// using explicit element keys to prevent missing key warning
export const BASE_COLUMNS = [
    helper.display({
        cell: (info) => (
            <TextCell key="pos">
                {info.row.index + 1}
            </TextCell>
        ),
        header: "Pos",
        size: 72,
    }),
    helper.accessor("driver.abbreviation", {
        cell: (info) => (
            <TextCell key="driver">
                {info.getValue()}
            </TextCell>
        ),
        header: "Driver",
        size: 72,
    }),
]
