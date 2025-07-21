import type { IBaseResultsData } from "@/src/components/Tables/presets/results/common"
import { createColumnHelper } from "@tanstack/react-table"

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
    raceHelper.display({
        header: "Pos",
    }),
    raceHelper.accessor("driver.abbreviation", {
        header: "Driver",
    }),
    raceHelper.accessor("time", {
        header: "Laptime",
    }),
    raceHelper.accessor("gap", {
        header: "Gap",
    }),
]

const detailsHelper = createColumnHelper<IExpandedRaceData>()

export const RACE_DETAILS_COLUMNS = [
    detailsHelper.accessor("gridPosition", {
        header: "Grid",
    }),
    detailsHelper.accessor("points", {
        header: "Points",
    }),
    detailsHelper.accessor("status", {
        header: "Info",
    }),
]
