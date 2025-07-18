import { getColor } from "@/src/colorScheme"
import type { ComponentProps } from "react"
import { Pressable } from "react-native"

export const Button = ({
    children,
    variant = "solid",
    size = "regular",
    ...rest
}: Omit<ComponentProps<typeof Pressable>, "style"> & {
    variant?: "outline" | "solid"
    size?: "regular" | "large"
}) => {
    return (
        <Pressable
            {...rest}
            style={{
                paddingBlock: size === "regular" ? 8 : 16,
                paddingInline: size === "regular" ? 16 : 32,
                borderRadius: 8,
                backgroundColor:
                    variant === "solid" ? getColor("accent") : getColor("primaryForeground"),
                borderColor: getColor("border"),
                borderWidth: variant === "outline" ? 1 : 0,
            }}
        >
            {children}
        </Pressable>
    )
}
