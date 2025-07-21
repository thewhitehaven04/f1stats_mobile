import type { IPracticeData } from "@/src/components/Tables/presets/results/practice"
import type {
    IExpandedQualifyingData,
    IQualifyingData,
} from "@/src/components/Tables/presets/results/qualifying"
import type { IExpandedRaceData, IRaceData } from "@/src/components/Tables/presets/results/race"
import type { TFetchSessionResults } from "@/src/fetchers/results"

export const SessionType = Object.freeze({
    PRACTICE: "Practice",
    QUALIFYING: "Qualifying",
    RACE: "Race",
})

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
                } satisfies IPracticeData
            }),
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
                        (result.qualifying_session_results?.q1_laptime &&
                            result.qualifying_session_results.q2_laptime &&
                            result.qualifying_session_results.q3_laptime) ??
                        null,
                    q1Time: result.qualifying_session_results?.q1_laptime || null,
                    q2Time: result.qualifying_session_results?.q2_laptime || null,
                    q3Time: result.qualifying_session_results?.q3_laptime || null,
                } satisfies IQualifyingData & IExpandedQualifyingData
            }),
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
                    status: result.race_session_results?.result_status || null,
                    gridPosition: result.race_session_results?.grid_position || null,
                    points: result.race_session_results?.points || null,
                } satisfies IRaceData & IExpandedRaceData
            }),
            sessionType: SessionType.RACE,
        }
    }

    throw new Error("Unknown session type: " + sessionType)
}
