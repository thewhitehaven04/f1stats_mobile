"use client"
import { getColor } from "@/src/colorScheme"
import Stack from "expo-router/build/layouts/Stack"
import React from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"

export const unstable_settings = {
    initialRouteName: "index",
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView>
            <Stack>
                <Stack.Screen name="index" />
                <Stack.Screen
                    name="season/[season]/index"
                    options={{
                        title: `Season calendar`,
                        contentStyle: {
                            backgroundColor: getColor("background"),
                        },
                    }}
                />
                <Stack.Screen
                    name="season/[season]/selectorModal"
                    options={{
                        presentation: "containedTransparentModal",
                        animation: "fade",
                        title: "Select season",
                    }}
                />
                <Stack.Screen
                    name="season/[season]/event/[event]/session/[session]/results"
                    options={({ route }) => ({
                        title: `${route.params.event} - ${route.params.session} results`,
                        contentStyle: {
                            backgroundColor: getColor("background"),
                        },
                    })}
                />
            </Stack>
        </GestureHandlerRootView>
    )
}
