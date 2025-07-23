"use client"
import { useLocalSearchParams } from 'expo-router'
import { View, Text } from "react-native"

export default function LapsScreen() {
    const params = useLocalSearchParams()

    return (
        <View>
            <Text>test</Text>
        </View>
    )
}
