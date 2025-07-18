export interface ISession {
    type: string
    dateStart: Date
    dateEnd: Date
}

export interface IConventionalFormatSessions {
    fp1: ISession | null
    fp2: ISession | null
    fp3: ISession | null
    quali: ISession | null
    race: ISession | null
}

export interface ISprintQualifyingFormatSessions {
    fp1: ISession | null
    sprintQuali: ISession | null
    sprint: ISession | null
    quali: ISession | null
    race: ISession | null
}

export interface ITestingFormatSessions {
    fp1: ISession | null
    fp2: ISession | null
    fp3: ISession | null
}

export interface ISprintFormatSessions {
    fp1: ISession | null
    quali: ISession | null
    fp2: ISession | null
    sprintQuali: ISession | null
    race: ISession | null
}

/** take from mapseasonevents return value */

interface IBaseMappedSeasonEvent {
    name: string
    officialName: string
    dateStart: Date
    country: string
    season: number
}

export interface IConventionalMappedSeasonEvent extends IBaseMappedSeasonEvent {
    format: "conventional"
    sessions: IConventionalFormatSessions
}

export interface ISprintMappedSeasonEvent extends IBaseMappedSeasonEvent {
    format: "sprint"
    sessions: ISprintFormatSessions
}

export interface ITestingMappedSeasonEvent extends IBaseMappedSeasonEvent {
    format: "testing"
    sessions: ITestingFormatSessions
}

export interface ISprintQualifyingMappedSeasonEvent extends IBaseMappedSeasonEvent {
    format: "sprint_qualifying" | "sprint_shootout"
    sessions: ISprintQualifyingFormatSessions
}

export type TMappedSession =
    | IConventionalFormatSessions
    | ISprintFormatSessions
    | ITestingFormatSessions
    | ISprintQualifyingFormatSessions

export type TMappedSeasonEvent =
    | IConventionalMappedSeasonEvent
    | ISprintMappedSeasonEvent
    | ITestingMappedSeasonEvent
    | ISprintQualifyingMappedSeasonEvent
