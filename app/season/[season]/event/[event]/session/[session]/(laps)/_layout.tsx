'use client'
import { getColor } from '@/src/colorScheme'
import Ionicons from "@expo/vector-icons/Ionicons"
import { Tabs } from "expo-router"

export default function LapsLayout() {
    return (
        <Tabs screenOptions={{
            tabBarStyle: {
                backgroundColor: getColor('muted'), 
                borderColor: getColor('muted'), 
            },
        }}>
            <Tabs.Screen
                name="laps"
                options={{
                    href: "./../index",
                    headerShown: false,
                    title: "Lap times",
                    sceneStyle: {
                        backgroundColor: getColor('background')
                    },
                    tabBarIcon: () => <Ionicons name="timer" size={24} color={getColor('mutedForeground')} />,
                }}
            />
            <Tabs.Screen
                name="telemetry"
                options={{
                    href: "./../telemetry",
                    headerShown: false,
                    title: "Telemetry",
                    sceneStyle: {
                        backgroundColor: getColor('background')
                    },
                    tabBarIcon: () => <Ionicons name="analytics-outline" size={24} color={getColor('mutedForeground')} />,
                }}
            />
        </Tabs>
    )
}
