import Color from "color"

export const formatTime = (time_s: number | null | undefined) => {
    if (!time_s) return "N/A"
    const hours = Math.floor(time_s / 3600)
    const minutes = Math.floor((time_s % 3600) / 60)
    const seconds = Math.floor(time_s % 60).toString()
    const thousandths = Math.floor((time_s % 1) * 1000)
        .toString()
        .padStart(3, "0")

    if (minutes === 0 && hours === 0) {
        return `${seconds}.${thousandths}`
    }
    if (hours === 0) {
        return `${minutes}:${seconds.padStart(2, "0")}.${thousandths}`
    }
    return `${hours}:${minutes}:${seconds.padStart(2, "0")}.${thousandths}`
}

export function getAlternativePlotColor(color: string) {
    return Color(color).isDark() ? Color(color).lighten(0.2).hex() : Color(color).darken(0.2).hex()
}
