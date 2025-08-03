"use client"
import { getColor } from "@/src/colorScheme"
import { Providers } from "@/src/providers"
import Stack from "expo-router/build/layouts/Stack"
import React from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"

export const unstable_settings = {
    initialRouteName: "index",
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView>
            <Providers>
                <Stack>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen
                        name="season/[season]/index"
                        options={{
                            title: `Season calendar`,
                            contentStyle: {
                                backgroundColor: getColor("background"),
                            },
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="season/[season]/selectorModal"
                        options={{
                            presentation: "containedTransparentModal",
                            animation: "fade",
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="season/[season]/event/[event]/session/[session]/results"
                        options={({ route }) => ({
                            contentStyle: {
                                backgroundColor: getColor("background"),
                            },
                            headerShown: false,
                        })}
                    />
                    <Stack.Screen
                        name="season/[season]/event/[event]/session/[session]/laps"
                        options={{
                            contentStyle: {
                                backgroundColor: getColor("background"),
                            },
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="season/[season]/event/[event]/session/[session]/telemetry"
                        options={{
                            contentStyle: {
                                backgroundColor: getColor("background"),
                            },
                            title: "Telemetry"
                        }}
                    />
                </Stack>
            </Providers>
        </GestureHandlerRootView>
    )
}
