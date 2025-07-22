import { TextCell } from "@/src/components/Tables"
import { BASE_COLUMNS, type IBaseResultsData } from "@/src/components/Tables/presets/results/common"
import { formatTime } from "@/src/core/helpers"
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
    ...BASE_COLUMNS,
    helper.accessor("time", {
        header: "Laptime",
        cell: (info) => (
            <TextCell style={{ flexBasis: 120 }}>{formatTime(info.getValue() as number)}</TextCell>
        ),
    }),
]

const detailsHelper = createColumnHelper<IExpandedQualifyingData>()

export const QUALIFYING_DETIALS_RESULTS = [
    detailsHelper.accessor("q1Time", {
        header: "Q1",
        cell: (info) => (
            <TextCell style={{ flexBasis: 120 }}>{formatTime(info.getValue() as number)}</TextCell>
        ),
    }),
    detailsHelper.accessor("q2Time", {
        header: "Q2",
        cell: (info) => (
            <TextCell style={{ flexBasis: 120 }}>{formatTime(info.getValue() as number)}</TextCell>
        ),
    }),
    detailsHelper.accessor("q3Time", {
        header: "Q3",
        cell: (info) => (
            <TextCell style={{ flexBasis: 120 }}>{formatTime(info.getValue() as number)}</TextCell>
        ),
    }),
]
