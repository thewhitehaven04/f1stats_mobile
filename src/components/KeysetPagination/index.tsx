import { getColor } from "@/src/colorScheme"
import { Button } from "@/src/components/ui/Button"
import { useRouter } from "expo-router"
import type { ReactNode } from "react"
import { StyleSheet, Text, View } from "react-native"

const styles = StyleSheet.create({
    wrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingBlock: 8,
        paddingInline: 16,
    },
    footerLine: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingBlock: 8,
        paddingInline: 16,
    },
})

export const KeysetPagination = ({
    previous,
    current,
    next,
}: {
    previous?: ReactNode
    current: string
    next?: ReactNode
}) => {
    const router = useRouter()
    return (
        <View>
            <View style={{ ...styles.wrapper, backgroundColor: getColor("background") }}>
                {previous ? previous : <Text>N/A</Text>}
                <View>
                    <Text>{current}</Text>
                </View>
                {next ? next : <Text>N/A</Text>}
            </View>
            <View style={styles.footerLine}>
                <Button onPress={router.back}>
                    <Text>Go back</Text>
                </Button>
            </View>
        </View>
    )
}
