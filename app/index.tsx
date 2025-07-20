import { getColor } from "@/src/colorScheme"
import { Button } from "@/src/components/ui/Button"
import { Link } from "expo-router"
import { StyleSheet, Text, View } from "react-native"

export const rootStyleSheet = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 16,
    },
    buttonTitle: {
        fontSize: 24,
    },
    title: {
        fontSize: 48,
        fontWeight: 600,
    },
})

export default function Index() {
    return (
        <View
            style={StyleSheet.compose(rootStyleSheet.container, {
                backgroundColor: getColor("background"),
            })}
        >
            <Link href="/season/2024" asChild>
                <Button variant="outline" size="large">
                    <Text style={rootStyleSheet.buttonTitle}>Start</Text>
                </Button>
            </Link>
            <Text style={rootStyleSheet.title}>F1Stats</Text>
        </View>
    )
}
