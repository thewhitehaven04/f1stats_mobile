import type { IBaseResultsData } from "@/src/components/Tables/presets/results/common"
import { createColumnHelper } from "@tanstack/react-table"

export interface IQualifyingData extends IBaseResultsData {
    time: number | null
}

export interface IExpandedQualifyingData {
    q1Time: number | null
    q2Time: number | null
    q3Time: number | null
}

const helper = createColumnHelper<IQualifyingData>()

export const QUALIFYING_COLUMNS_RESULTS = [
    helper.display({
        header: "Pos",
        cell: (info) => info.row.index + 1,
    }),
    helper.accessor("driver.abbreviation", {
        header: "Driver",
    }),
    helper.accessor("time", {
        header: "Laptime",
    }),
]

const detailsHelper = createColumnHelper<IExpandedQualifyingData>()

export const QUALIFYING_DETIALS_RESULTS = [
    detailsHelper.accessor("q1Time", {
        header: "Q1",
    }),
    detailsHelper.accessor("q2Time", {
        header: "Q2",
    }),
    detailsHelper.accessor("q3Time", {
        header: "Q3",
    }),
]
