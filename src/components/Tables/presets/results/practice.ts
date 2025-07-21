import type { IBaseResultsData } from "@/src/components/Tables/presets/results/common"
import { createColumnHelper } from "@tanstack/react-table"

export interface IPracticeData extends IBaseResultsData {
    time: number | null
    gap: number | null
}

const helper = createColumnHelper<IPracticeData>()

export const PRACTICE_RESULTS_COLUMNS = [
    helper.display({
        cell: (info) => info.row.index + 1,
        header: "Position",
    }),
    helper.accessor("driver.abbreviation", {
        cell: (info) => info.getValue(),
        header: "Driver",
    }),
    helper.accessor("time", {
        cell: (info) => info.getValue(),
        header: "Laptime",
    }),
    helper.accessor("gap", {
        cell: (info) => info.getValue(),
        header: "Gap",
    }),
]
