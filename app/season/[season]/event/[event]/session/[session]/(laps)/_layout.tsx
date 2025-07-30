import { getColor } from '@/src/colorScheme'
import Ionicons from "@expo/vector-icons/Ionicons"
import { Tabs } from "expo-router"

export default function LapsLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="laps"
                options={{
                    href: "/season/[season]/event/[event]/session/[session]/(laps)/index",
                    headerShown: false,
                    title: "Lap times",
                    sceneStyle: {
                        backgroundColor: getColor('background')
                    },
                    tabBarIcon: () => <Ionicons name="timer" size={24} color="black" />,
                }}
            />
            <Tabs.Screen
                name="telemetry"
                options={{
                    href: "/season/[season]/event/[event]/session/[session]/(laps)/telemetry",
                    headerShown: false,
                    title: "Telemetry",
                    sceneStyle: {
                        backgroundColor: getColor('background')
                    },
                    tabBarIcon: () => <Ionicons name="analytics-outline" size={24} color="black" />,
                }}
            />
        </Tabs>
    )
}
