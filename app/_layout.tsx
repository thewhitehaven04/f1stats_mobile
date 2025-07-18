"use client"
import { Stack } from "expo-router"

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" />
            <Stack.Screen name="season/[season]" />
        </Stack>
    )
}
