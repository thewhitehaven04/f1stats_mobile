import { TextCell } from "@/src/components/Tables"
import { BASE_COLUMNS, type IBaseResultsData } from "@/src/components/Tables/presets/results/common"
import type { RACE_COLUMNS } from "@/src/components/Tables/presets/results/mapper"
import { formatTime } from "@/src/core/helpers"
import { createColumnHelper } from "@tanstack/react-table"
import { Text } from "react-native"

export interface IRaceData extends IBaseResultsData {
    time: number | null
    gap: number | null
    child: {
        rows: (string | null | number)[]
        columns: typeof RACE_COLUMNS
    }
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
            <TextCell key="laptime" style={{ flexBasis: 160 }}>
                {formatTime(info.getValue() as number)}
            </TextCell>
        ),
        size: 160,
    }),
    raceHelper.accessor("gap", {
        header: "Gap",
        cell: (info) => (
            <TextCell key="gap" style={{ flexBasis: 84 }}>
                {formatTime(info.getValue() as number)}
            </TextCell>
        ),
        size: 84,
    }),
]

const detailsHelper = createColumnHelper<IExpandedRaceData>()

export const RACE_DETAILS_COLUMNS = [
    detailsHelper.accessor("gridPosition", {
        header: "Grid",
        cell: (info) => <Text key='gridPosition'>{info.getValue()}</Text>,
    }),
    detailsHelper.accessor("points", {
        header: "Points",
        cell: (info) => <Text key='points'>{info.getValue()}</Text>,
    }),
    detailsHelper.accessor("status", {
        header: "Info",
        cell: (info) => <Text key='status'>{info.getValue()}</Text>,
    }),
]
