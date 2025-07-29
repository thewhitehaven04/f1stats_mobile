import { Tabs } from "expo-router"

export default function LapsLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="Lap details" />
            <Tabs.Screen name="Telemetry" />
        </Tabs>
    )
}
