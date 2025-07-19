"use client"
import { getColor } from "@/src/colorScheme"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Drawer } from "expo-router/drawer"
import React from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"

export default function RootLayout() {
    return (
        <GestureHandlerRootView>
            <Drawer>
                <Drawer.Screen
                    options={{
                        drawerIcon: ({ focused }) => (
                            <Ionicons name={focused ? "home" : "home-outline"} size={24} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="season/[season]"
                    options={{
                        title: `Season calendar`,
                        sceneStyle: {
                            backgroundColor: getColor("background"),
                        },
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    )
}
