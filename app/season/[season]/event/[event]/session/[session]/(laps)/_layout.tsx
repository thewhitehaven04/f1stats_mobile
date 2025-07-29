import { getColor } from '@/src/colorScheme'
import Ionicons from "@expo/vector-icons/Ionicons"
import { Tabs } from "expo-router"

export default function LapsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="laps"
                options={{
                    href: "/season/[season]/event/[event]/session/[session]/(laps)/laps",
                    headerShown: false,
                    sceneStyle: {
                        backgroundColor: getColor('background')
                    },
                    title: "Lap times",
                    headerBackgroundContainerStyle: { backgroundColor: 'red' },
                    tabBarIcon: () => <Ionicons name="timer" size={24} color="black" />,
                }}
            />
            <Tabs.Screen
                name="telemetry"
                options={{
                    href: "/season/[season]/event/[event]/session/[session]/(laps)/telemetry",
                    headerShown: false,
                    sceneStyle: {
                        backgroundColor: getColor('background')
                    },
                    title: "Telemetry",
                    headerBackgroundContainerStyle: { backgroundColor: 'red' },
                    tabBarIcon: () => <Ionicons name="analytics-outline" size={24} color="black" />,
                }}
            />
        </Tabs>
    )
}
