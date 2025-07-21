import { BASE_COLUMNS, type IBaseResultsData } from "@/src/components/Tables/presets/results/common"
import { createColumnHelper } from "@tanstack/react-table"
import { Text } from "react-native"

export interface IRaceData extends IBaseResultsData {
    time: number | null
    gap: number | null
}

export interface IExpandedRaceData {
    gridPosition: number | null
    points: number | null
    status: string | null
}

const raceHelper = createColumnHelper<IRaceData>()

export const RACE_RESULTS_COLUMNS = [
    ...BASE_COLUMNS,
    raceHelper.accessor("time", {
        header: "Laptime",
        cell: (info) => <Text>{info.getValue()}</Text>,
    }),
    raceHelper.accessor("gap", {
        header: "Gap",
        cell: (info) => <Text>{info.getValue()}</Text>,
    }),
]

const detailsHelper = createColumnHelper<IExpandedRaceData>()

export const RACE_DETAILS_COLUMNS = [
    detailsHelper.accessor("gridPosition", {
        header: "Grid",
        cell: (info) => <Text>{info.getValue()}</Text>,
    }),
    detailsHelper.accessor("points", {
        header: "Points",
        cell: (info) => <Text>{info.getValue()}</Text>,
    }),
    detailsHelper.accessor("status", {
        header: "Info",
        cell: (info) => <Text>{info.getValue()}</Text>,
    }),
]
