import { TextCell } from "@/src/components/Tables"
import { BASE_COLUMNS, type IBaseResultsData } from "@/src/components/Tables/presets/results/common"
import { formatTime } from "@/src/core/helpers"
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
        cell: (info) => (
            <TextCell style={{ flexBasis: 120 }}>{formatTime(info.getValue() as number)}</TextCell>
        ),
    }),
    raceHelper.accessor("gap", {
        header: "Gap",
        cell: (info) => (
            <TextCell style={{ flexBasis: 84 }}>{formatTime(info.getValue() as number)}</TextCell>
        ),
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
