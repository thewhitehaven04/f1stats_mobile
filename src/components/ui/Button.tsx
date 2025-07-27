"use client"
import { getColor } from "@/src/colorScheme"
import { type ComponentProps } from "react"
import { Pressable, type StyleProp, type ViewStyle } from "react-native"
import { StyleSheet } from "react-native"

export const Button = ({
    children,
    variant = "solid",
    size = "regular",
    style,
    ...rest
}: Omit<ComponentProps<typeof Pressable>, "style"> & {
    variant?: "outline" | "solid"
    size?: "regular" | "large"
    style?: StyleProp<ViewStyle>
}) => {
    return (
        <Pressable
            {...rest}
            style={({ pressed }) =>
                StyleSheet.compose(
                    {
                        paddingBlock: size === "regular" ? 8 : 16,
                        paddingInline: size === "regular" ? 16 : 32,
                        borderRadius: 8,
                        backgroundColor:
                            variant === "solid"
                                ? getColor("accent")
                                : getColor("primaryForeground"),
                        borderColor: getColor("border"),
                        borderWidth: variant === "outline" ? 1 : 0,
                        filter: pressed ? "brightness(0.9)" : "none",
                        transform: [
                            {
                                scale: pressed ? 0.98 : 1,
                            },
                        ],
                    },
                    style,
                )
            }
        >
            {children}
        </Pressable>
    )
}
