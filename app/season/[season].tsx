import renderSeasonEventsAction from "@/src/actions/renderSeasonEventsAction"
import { Suspense } from "react"
import { Text, View } from "react-native"

export default function Season() {
    return (
        <Suspense fallback={<Text>Loading</Text>}>
            <View
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {renderSeasonEventsAction({ season: "2024" })}
            </View>
        </Suspense>
    )
}
