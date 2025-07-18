"use client"
import { alpha3ToAlpha2Map } from "@/src/alpha3toAlpha2map"
import {
    CollapsableListItem,
    ListItemContent,
    ListItemTitle,
} from "@/src/components/ui/CollapsableListItem"
import type { ISession, TMappedSeasonEvent } from "@/src/EventFetcher/types"
import { format } from "date-fns"
import { Link } from "expo-router"
import { FlatList, StyleSheet, Text, TouchableHighlight, View } from "react-native"
import CountryFlag from "react-native-country-flag"

const seasonEventStyleSheet = StyleSheet.create({
    title: {
        display: "flex",
        flexDirection: "row",
        gap: 8,
    },
    headerText: {
        fontSize: 14,
        fontWeight: 500,
    },
    sessionLink: {
        fontSize: 14,
        fontWeight: 500,
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
    },
})

export function SeasonEvent({ event }: { event: TMappedSeasonEvent }) {
    return (
        <CollapsableListItem key={event.officialName}>
            <ListItemTitle>
                <View style={seasonEventStyleSheet.title}>
                    <CountryFlag isoCode={alpha3ToAlpha2Map.get(event.country) || "XX"} size={16} />
                    <Text style={seasonEventStyleSheet.headerText}>{event.name}</Text>
                </View>
            </ListItemTitle>
            <ListItemContent>
                <FlatList
                    data={Object.values(event.sessions).map((s: ISession | null) => ({
                        title: s?.type,
                        dateStart: s?.dateStart,
                        dateEnd: s?.dateEnd,
                    }))}
                    contentContainerStyle={{ gap: 8 }}
                    renderItem={({ item }) =>
                        item.title && item.dateStart && item.dateEnd ? (
                            <TouchableHighlight>
                                <Link href={`/season/${event.season}/${item.title}`}>
                                    <View style={seasonEventStyleSheet.sessionLink}>
                                        <Text>{item.title}</Text>
                                        <Text>{format(item.dateStart, "dd/MM/yyyy HH:mm")}</Text>
                                    </View>
                                </Link>
                            </TouchableHighlight>
                        ) : null
                    }
                />
            </ListItemContent>
        </CollapsableListItem>
    )
}
