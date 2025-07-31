"use client"

import { getColor } from "@/src/colorScheme"
import { KeysetSeasonPagination } from "@/src/components/KeysetPagination"
import { Button } from "@/src/components/ui/Button"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Link, useLocalSearchParams, useRouter } from "expo-router"
import { Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"

const modalStyleSheet = StyleSheet.create({
    wrapper: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    navButton: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: 48,
    },
    buttonText: {
        color: getColor("primary"),
    },
})

const SUPPORTED_SEASONS = ["2023", "2024", "2025"]

export default function SeasonSelectorModal() {
    const { season }: { season: string } = useLocalSearchParams()
    const previous = SUPPORTED_SEASONS[SUPPORTED_SEASONS.indexOf(season) - 1]
    const next = SUPPORTED_SEASONS[SUPPORTED_SEASONS.indexOf(season) + 1]
    const { replace } = useRouter()

    const navigateToSeason = (season: string) => {
        replace(`/season/${season}`)
    }

    return (
        <SafeAreaView>
            <Animated.View entering={FadeIn} style={modalStyleSheet.wrapper}>
                <Link href="/" asChild>
                    <Pressable style={{ width: "100%" }} />
                </Link>
                <Animated.View
                    style={{
                        backgroundColor: getColor("background"),
                    }}
                >
                    <KeysetSeasonPagination
                        current={season}
                        previous={
                            previous ? (
                                <Button size="regular" onPress={() => navigateToSeason(previous)}>
                                    <View style={modalStyleSheet.navButton}>
                                        <Ionicons
                                            name="chevron-back-outline"
                                            size={18}
                                            color={getColor("foreground")}
                                        />
                                        <Text style={modalStyleSheet.buttonText}>{previous}</Text>
                                    </View>
                                </Button>
                            ) : null
                        }
                        next={
                            next ? (
                                <Button size="regular" onPress={() => navigateToSeason(next)}>
                                    <View style={modalStyleSheet.navButton}>
                                        <Text style={modalStyleSheet.buttonText}>{next}</Text>
                                        <Ionicons
                                            name="chevron-forward-outline"
                                            size={18}
                                            color={getColor("foreground")}
                                        />
                                    </View>
                                </Button>
                            ) : null
                        }
                    />
                    <StatusBar barStyle={Platform.OS === "ios" ? "light-content" : "default"} />
                </Animated.View>
            </Animated.View>
        </SafeAreaView>
    )
}
