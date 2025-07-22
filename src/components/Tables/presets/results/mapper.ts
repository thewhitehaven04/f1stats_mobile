import type { IPracticeData } from "@/src/components/Tables/presets/results/practice"
import type { IQualifyingData } from "@/src/components/Tables/presets/results/qualifying"
import type { IRaceData } from "@/src/components/Tables/presets/results/race"
import { formatTime } from "@/src/core/helpers"
import type { TFetchSessionResults } from "@/src/fetchers/results"

export const SessionType = Object.freeze({
    PRACTICE: "Practice",
    QUALIFYING: "Qualifying",
    RACE: "Race",
})

export const RACE_COLUMNS = ["Grid", "Gap", "Status"] as const
export const QUALIFYING_COLUMNS = ["Q1", "Q2", "Q3"] as const

export function sessionResultsToTableRows(
    sessionResults: TFetchSessionResults,
    sessionType: string,
) {
    if (sessionType.toLowerCase().includes("practice")) {
        return {
            rows: sessionResults.map((result) => {
                return {
                    driver: {
                        country: result.drivers?.country_alpha3 || "",
                        name: `${result.drivers?.first_name} ${result.drivers?.last_name}` || "",
                        id: result.drivers?.id || "",
                        abbreviation: result.drivers?.abbreviation || "",
                    },
                    teamName: result.drivers?.driver_team_changes[0].teams
                        ? {
                              name:
                                  result.drivers?.driver_team_changes[0].teams.team_display_name ||
                                  "",
                              id: result.drivers?.driver_team_changes[0].teams.id,
                          }
                        : null,
                    time: result.practice_session_results
                        ? result.practice_session_results.laptime
                        : 0,
                    gap: result.practice_session_results ? result.practice_session_results.gap : 0,
                    child: {
                        columns: [],
                        rows: [],
                    },
                }
            }) satisfies IPracticeData[],
            expandedColumns: [],
            sessionType: SessionType.PRACTICE,
        }
    }

    if (
        sessionType === "Qualifying" ||
        sessionType === "Sprint Qualifying" ||
        sessionType === "Sprint Shootout"
    ) {
        return {
            rows: sessionResults.map((result) => {
                return {
                    driver: {
                        country: result.drivers?.country_alpha3 || "",
                        name: `${result.drivers?.first_name} ${result.drivers?.last_name}` || "",
                        id: result.drivers?.id || "",
                        abbreviation: result.drivers?.abbreviation || "",
                    },
                    teamName: result.drivers?.driver_team_changes[0].teams
                        ? {
                              name:
                                  result.drivers?.driver_team_changes[0].teams.team_display_name ||
                                  "",
                              id: result.drivers?.driver_team_changes[0].teams.id,
                          }
                        : null,
                    time:
                        result.qualifying_session_results?.q3_laptime ??
                        result.qualifying_session_results?.q2_laptime ??
                        result.qualifying_session_results?.q1_laptime ??
                        null,

                    child: {
                        columns: QUALIFYING_COLUMNS,
                        rows: [
                            formatTime(result.qualifying_session_results?.q1_laptime),
                            formatTime(result.qualifying_session_results?.q2_laptime),
                            formatTime(result.qualifying_session_results?.q3_laptime),
                        ],
                    },
                }
            }) satisfies IQualifyingData[],
            sessionType: SessionType.QUALIFYING,
        }
    }
    if (sessionType === "Race" || sessionType === "Sprint") {
        return {
            rows: sessionResults.map((result) => {
                return {
                    driver: {
                        country: result.drivers?.country_alpha3 || "",
                        name: `${result.drivers?.first_name} ${result.drivers?.last_name}` || "",
                        id: result.drivers?.id || "",
                        abbreviation: result.drivers?.abbreviation || "",
                    },
                    gap: result.race_session_results ? result.race_session_results.gap : null,
                    teamName: result.drivers?.driver_team_changes[0].teams
                        ? {
                              name:
                                  result.drivers?.driver_team_changes[0].teams.team_display_name ||
                                  "",
                              id: result.drivers?.driver_team_changes[0].teams.id,
                          }
                        : null,
                    time: result.race_session_results
                        ? result.race_session_results.total_time
                        : null,
                    child: {
                        rows: [
                            result.race_session_results?.grid_position ?? null,
                            result.race_session_results?.points ?? null,
                            result.race_session_results?.result_status ?? null,
                        ],
                        columns: RACE_COLUMNS,
                    },
                }
            }) satisfies IRaceData[],
            sessionType: SessionType.RACE,
        }
    }

    throw new Error("Unknown session type: " + sessionType)
}
