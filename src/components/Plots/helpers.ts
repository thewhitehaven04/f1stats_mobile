export const getTicksFromRange = (min: number, max: number, count: number) => {
    const midTicks = Array.from({ length: count }).map(
        (_, index) => (min + ((index + 1) * (max - min)) / (count + 1)).toFixed(1),
    )
    return [min.toFixed(1), ...midTicks, max.toFixed(1)]
}
