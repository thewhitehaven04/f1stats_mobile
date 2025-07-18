import { oklch2hex } from "colorizr"
import { Appearance } from "react-native"

const lightThemeOklch = {
    background: [1, 0, 0],
    foreground: [0.141, 0.005, 285.823],
    card: [1, 0, 0],
    cardForeground: [0.141, 0.005, 285.823],
    popover: [1, 0, 0],
    popoverForeground: [0.141, 0.005, 285.823],
    primary: [0.21, 0.006, 285.885],
    primaryForeground: [0.985, 0, 0],
    secondary: [0.967, 0.001, 286.375],
    secondaryForeground: [0.21, 0.006, 285.885],
    muted: [0.967, 0.001, 286.375],
    mutedForeground: [0.552, 0.016, 285.938],
    accent: [0.967, 0.001, 286.375],
    accentForeground: [0.21, 0.006, 285.885],
    destructive: [0.577, 0.245, 27.325],
    border: [0.92, 0.004, 286.32],
    input: [0.92, 0.004, 286.32],
    ring: [0.705, 0.015, 286.067],
    chart1: [0.646, 0.222, 41.116],
    chart2: [0.6, 0.118, 184.704],
    chart3: [0.398, 0.07, 227.392],
    chart4: [0.828, 0.189, 84.429],
    chart5: [0.769, 0.188, 70.08],
    sidebar: [0.985, 0, 0],
    sidebarForeground: [0.141, 0.005, 285.823],
    sidebarPrimary: [0.21, 0.006, 285.885],
    sidebarPrimaryForeground: [0.985, 0, 0],
    sidebarAccent: [0.967, 0.001, 286.375],
    sidebarAccentForeground: [0.21, 0.006, 285.885],
    sidebarBorder: [0.92, 0.004, 286.32],
    sidebarRing: [0.705, 0.015, 286.067],
} satisfies Record<string, [number, number, number]>

const darkThemeOklch = {
    background: [0.141, 0.005, 285.823],
    foreground: [0.985, 0, 0],
    card: [0.21, 0.006, 285.885],
    cardForeground: [0.985, 0, 0],
    popover: [0.21, 0.006, 285.885],
    popoverForeground: [0.985, 0, 0],
    primary: [0.92, 0.004, 286.32],
    primaryForeground: [0.21, 0.006, 285.885],
    secondary: [0.274, 0.006, 286.033],
    secondaryForeground: [0.985, 0, 0],
    muted: [0.274, 0.006, 286.033],
    mutedForeground: [0.705, 0.015, 286.067],
    accent: [0.274, 0.006, 286.033],
    accentForeground: [0.985, 0, 0],
    destructive: [0.704, 0.191, 22.216],
    border: [1, 0, 0],
    input: [1, 0, 0],
    ring: [0.552, 0.016, 285.938],
    chart1: [0.488, 0.243, 264.376],
    chart2: [0.696, 0.17, 162.48],
    chart3: [0.769, 0.188, 70.08],
    chart4: [0.627, 0.265, 303.9],
    chart5: [0.645, 0.246, 16.439],
    sidebar: [0.21, 0.006, 285.885],
    sidebarForeground: [0.985, 0, 0],
    sidebarPrimary: [0.488, 0.243, 264.376],
    sidebarPrimaryForeground: [0.985, 0, 0],
    sidebarAccent: [0.274, 0.006, 286.033],
    sidebarAccentForeground: [0.985, 0, 0],
    sidebarBorder: [1, 0, 0],
    sidebarRing: [0.552, 0.016, 285.938],
} satisfies Record<string, [number, number, number]>

const lightTheme = Object.fromEntries(
    Object.entries(lightThemeOklch).map(([k, v]) => [k, oklch2hex(v)]),
) as Record<keyof typeof lightThemeOklch, string>

const darkTheme = Object.fromEntries(
    Object.entries(darkThemeOklch).map(([k, v]) => [k, oklch2hex(v)]),
) as Record<keyof typeof darkThemeOklch, string>

export const getColor = (color: keyof typeof lightTheme) =>
    Appearance.getColorScheme() === "dark" ? darkTheme[color] : lightTheme[color]
