import { BASE_COLUMNS, type IBaseResultsData } from "@/src/components/Tables/presets/results/common"
import { createColumnHelper } from "@tanstack/react-table"
import { Text } from "react-native"

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
        cell: (info) => <Text>{info.getValue()}</Text>,
    }),
]

const detailsHelper = createColumnHelper<IExpandedQualifyingData>()

export const QUALIFYING_DETIALS_RESULTS = [
    detailsHelper.accessor("q1Time", {
        header: "Q1",
        cell: (info) => <Text>{info.getValue()}</Text>,
    }),
    detailsHelper.accessor("q2Time", {
        header: "Q2",
        cell: (info) => <Text>{info.getValue()}</Text>,
    }),
    detailsHelper.accessor("q3Time", {
        header: "Q3",
        cell: (info) => <Text>{info.getValue()}</Text>,
    }),
]
