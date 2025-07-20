"use client"

import { getColor } from "@/src/colorScheme"
import { KeysetPagination } from "@/src/components/KeysetPagination"
import { Button } from "@/src/components/ui/Button"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Link, useLocalSearchParams } from "expo-router"
import { Platform, Pressable, StatusBar, StyleSheet, Text, View } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"

const modalStyleSheet = StyleSheet.create({
    wrapper: {
        backdropFilter: "brightness(0.3) blur(2px)",
    },
    navButton: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
})

const SUPPORTED_SEASONS = ["2023", "2024", "2025"]

export default function SeasonSelectorModal() {
    const { season }: { season: string } = useLocalSearchParams()
    const previous = SUPPORTED_SEASONS[SUPPORTED_SEASONS.indexOf(season) - 1]
    const next = SUPPORTED_SEASONS[SUPPORTED_SEASONS.indexOf(season) + 1]

    return (
        <Animated.View entering={FadeIn} style={modalStyleSheet.wrapper}>
            <Link href={".."} asChild>
                <Pressable style={StyleSheet.absoluteFill} />
            </Link>
            <Animated.View
                style={{
                    backgroundColor: getColor("background"),
                }}
            >
                <KeysetPagination
                    current={season}
                    previous={
                        previous ? (
                            <Link href={`/season/${previous}`} style={{}}>
                                <Button size="regular">
                                    <View style={modalStyleSheet.navButton}>
                                        <Ionicons name="chevron-back-outline" size={18} />
                                        <Text>{previous}</Text>
                                    </View>
                                </Button>
                            </Link>
                        ) : null
                    }
                    next={
                        next ? (
                            <Link href={`/season/${next}`}>
                                <Button size="regular">
                                    <View style={modalStyleSheet.navButton}>
                                        <Text>{next}</Text>
                                        <Ionicons name="chevron-forward-outline" size={18} />
                                    </View>
                                </Button>
                            </Link>
                        ) : null
                    }
                />
                <StatusBar barStyle={Platform.OS === "ios" ? "light-content" : "default"} />
            </Animated.View>
        </Animated.View>
    )
}
