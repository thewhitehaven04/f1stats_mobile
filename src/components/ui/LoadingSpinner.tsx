"use client"
import { getColor } from "@/src/colorScheme"
import { View } from "react-native"

export const LoadingSpinner = () => {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <View
                style={{
                    borderRadius: 8,
                    borderLeftColor: getColor("accentForeground"),
                    borderRightColor: getColor("accentForeground"),
                    borderTopColor: getColor("accent"),
                    borderBottomColor: getColor("accent"),
                    width: 40,
                    height: 40,
                }}
            />
        </View>
    )
}
