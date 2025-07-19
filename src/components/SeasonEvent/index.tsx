"use client"
import { alpha3ToAlpha2Map } from "@/src/alpha3toAlpha2map"
import {
    CollapsableListItem,
    ListItemContent,
    ListItemTitle,
} from "@/src/components/ui/CollapsableListItem"
import type { ISession, TMappedSeasonEvent } from "@/src/EventFetcher/types"
import * as FontSizes from "@/src/fontSizes"
import { format } from "date-fns"
import { Link } from "expo-router"
import { StyleSheet, Text, TouchableHighlight, View } from "react-native"
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
        alignItems: "flex-start",
        gap: 8,
    },
    contentWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 8,
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
            <ListItemContent style={seasonEventStyleSheet.contentWrapper} expandedHeight={140}>
                {Object.values(event.sessions).map((s: ISession | null) =>
                    s ? (
                        <TouchableHighlight key={s?.type}>
                            <Link href={`/season/${event.season}/${s.type}`}>
                                <View style={seasonEventStyleSheet.sessionLink}>
                                    <Text style={seasonEventStyleSheet.sessionLinkFont}>
                                        {s.type}
                                    </Text>
                                    <Text style={seasonEventStyleSheet.sessionLinkFont}>
                                        {format(s.dateStart, "dd/MM/yyyy HH:mm")}
                                    </Text>
                                </View>
                            </Link>
                        </TouchableHighlight>
                    ) : null,
                )}
            </ListItemContent>
        </CollapsableListItem>
    )
}
