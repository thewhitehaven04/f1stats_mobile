"use client"
import { alpha3ToAlpha2Map } from "@/src/alpha3toAlpha2map"
import { Button } from "@/src/components/ui/Button"
import {
    CollapsableListItem,
    ListItemContent,
    ListItemTitle,
} from "@/src/components/ui/CollapsableListItem"
import type { ISession, TMappedSeasonEvent } from "@/src/fetchers/events/types"
import * as FontSizes from "@/src/fontSizes"
import { format } from "date-fns"
import { Link } from "expo-router"
import { StyleSheet, Text, View } from "react-native"
import CountryFlag from "react-native-country-flag"

const seasonEventStyleSheet = StyleSheet.create({
    title: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        gap: 16,
    },
    headerText: {
        fontSize: FontSizes.Title.md,
        fontWeight: 500,
    },
    sessionLinkFont: {
        fontSize: FontSizes.Body,
        fontWeight: 500,
    },
    sessionLink: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
    },
    contentWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
        paddingInline: 16,
    },
})

export function SeasonEvent({ event }: { event: TMappedSeasonEvent }) {
    return (
        <CollapsableListItem key={event.officialName}>
            <ListItemTitle>
                <View style={seasonEventStyleSheet.title}>
                    <CountryFlag isoCode={alpha3ToAlpha2Map.get(event.country) || "XX"} size={32} />
                    <Text style={seasonEventStyleSheet.headerText}>{event.name}</Text>
                </View>
            </ListItemTitle>
            <ListItemContent
                style={seasonEventStyleSheet.contentWrapper}
                expandedHeight={290}
                expandedPadding={16}
            >
                {Object.values(event.sessions).map((s: ISession | null) =>
                    s ? (
                        <Link
                            key={s.type}
                            href={`/season/${event.season}/event/${event.name}/session/${s.type}/results`}
                            asChild
                        >
                            <Button>
                                <View style={seasonEventStyleSheet.sessionLink}>
                                    <Text
                                        style={{
                                            ...seasonEventStyleSheet.sessionLinkFont,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {s.type}
                                    </Text>
                                    <Text style={seasonEventStyleSheet.sessionLinkFont}>
                                        {format(s.dateStart, "MMM dd HH:mm")}
                                    </Text>
                                </View>
                            </Button>
                        </Link>
                    ) : null,
                )}
            </ListItemContent>
        </CollapsableListItem>
    )
}
