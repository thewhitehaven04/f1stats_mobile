import type { LapSelectionData } from "@/src/client/generated"
import { getColor } from "@/src/colorScheme"
import { createContext, Fragment, useContext, useMemo } from "react"
import Svg, { G, Line, Rect, Text } from "react-native-svg"
import * as d3 from "d3"
import { formatTime, getAlternativePlotColor, mapDriverToAbbreviation } from "@/src/core/helpers"
import { useWindowDimensions } from "react-native"

const X_PADDING = 50
const Y_PADDING = 20
const DEFAULT_TICK_SIZE = 8
const Y_LABEL_OFFSET = -35
const X_LABEL_OFFSET = 4

const getLaptimeBoxStatistics = (laptimes: (number | null)[]) => {
    const filteredLaptimes = laptimes.filter((time) => time !== null).sort((a, b) => a - b)
    const q1 = d3.quantileSorted(filteredLaptimes, 0.25) || 0
    const q3 = d3.quantileSorted(filteredLaptimes, 0.75) || 0
    const median = d3.quantileSorted(filteredLaptimes, 0.5) || 0

    const iqr = q3 - q1
    const min = q1 - 1.5 * iqr
    const max = q3 + 1.5 * iqr

    return { q1, q3, min, max, median }
}

const YAxis = ({
    min,
    max,
    tickSize = DEFAULT_TICK_SIZE,
}: {
    min: number
    max: number
    tickSize: number
}) => {
    const { svgHeight, yAxis } = useContext(BoxChartContext)

    const ticks = useMemo(() => yAxis.ticks(Math.min(Math.floor(max - min), 8)), [max, min, yAxis])

    return (
        <G>
            <Line
                y1={Y_PADDING}
                y2={svgHeight - Y_PADDING}
                x1={X_PADDING}
                x2={X_PADDING}
                strokeWidth={1.5}
                stroke={getColor("foreground")}
            />
            {ticks.map((tick) => {
                const y = yAxis(tick)
                return (
                    <Fragment key={tick}>
                        <Line
                            stroke={getColor("foreground")}
                            strokeWidth={1.5}
                            y1={y}
                            y2={y}
                            x1={X_PADDING - tickSize / 2}
                            x2={X_PADDING + tickSize / 2}
                        />
                        <Text
                            x={X_PADDING - tickSize + Y_LABEL_OFFSET}
                            y={y + X_LABEL_OFFSET}
                            fill={getColor("foreground")}
                            fontSize={14}
                        >
                            {formatTime(tick).slice(0, 6)}
                        </Text>
                    </Fragment>
                )
            })}
        </G>
    )
}

const XAxis = ({
    tickSize = DEFAULT_TICK_SIZE,
    groupLabels,
}: {
    tickSize: number
    groupLabels: string[]
}) => {
    const { svgHeight, svgWidth, xAxis } = useContext(BoxChartContext)

    return (
        <G>
            <Line
                x1={X_PADDING}
                x2={X_PADDING + svgWidth}
                y1={svgHeight - Y_PADDING}
                y2={svgHeight - Y_PADDING}
                strokeWidth={1.5}
                stroke={getColor("foreground")}
            />
            {groupLabels.map((label) => {
                const x = xAxis(label)
                return (
                    <Fragment key={label}>
                        <Line
                            key={label}
                            y1={svgHeight - Y_PADDING + tickSize / 2}
                            y2={svgHeight - Y_PADDING - tickSize / 2}
                            x1={x}
                            x2={x}
                            strokeWidth={1.5}
                            stroke={getColor("foreground")}
                        />
                        <Text fontSize={14} x={x} y={svgHeight} translateX={xAxis.bandwidth() / 2 - 8}>
                            {mapDriverToAbbreviation(label)}
                        </Text>
                    </Fragment>
                )
            })}
        </G>
    )
}

/** context with chart-level info, like dimensions */
const BoxChartContext = createContext<{
    svgHeight: number
    svgWidth: number
    xAxis: d3.ScaleBand<string>
    yAxis: d3.ScaleLinear<number, number>
}>({
    svgHeight: 0,
    svgWidth: 0,
    xAxis: d3.scaleBand(),
    yAxis: d3.scaleLinear(),
})

const Box = (props: {
    label: string
    q1: number
    q3: number
    min: number
    max: number
    median: number
    color: string
}) => {
    const { label, color, q1, q3, min, max, median } = props
    const { yAxis, xAxis } = useContext(BoxChartContext)

    const bandWidth = xAxis.bandwidth()
    const whiskerOffset = bandWidth / 4
    const xBandStart = bandWidth * (1 / 6)

    const boxWidth = bandWidth / 1.5
    const boxHeight = yAxis(q3) - yAxis(q1)

    const xBoxMiddle = (xAxis(label) || 0) + xBandStart + boxWidth / 2

    return (
        <G>
            <Line
                x1={xBoxMiddle - whiskerOffset}
                x2={xBoxMiddle + whiskerOffset}
                y1={yAxis(min)}
                y2={yAxis(min)}
                stroke={color}
                strokeWidth={1.5}
            />
            <Rect
                x={(xAxis(label) || 0) + xBandStart}
                y={yAxis(q1)}
                width={boxWidth}
                height={boxHeight}
                fill={color}
                fillOpacity={0.7}
                stroke={getColor("foreground")}
                strokeWidth={1.5}
            />
            <Line
                x1={xBoxMiddle - whiskerOffset}
                x2={xBoxMiddle + whiskerOffset}
                y1={yAxis(max)}
                y2={yAxis(max)}
                stroke={color}
                strokeWidth={1.5}
            />
            <Line
                x1={xBoxMiddle}
                x2={xBoxMiddle}
                y1={yAxis(min)}
                y2={yAxis(max)}
                stroke={color}
                strokeWidth={1.5}
            />
            <Line
                x1={xBoxMiddle - boxWidth / 2}
                x2={xBoxMiddle + boxWidth / 2}
                y1={yAxis(median)}
                y2={yAxis(median)}
                stroke={getColor("foreground")}
                strokeWidth={1.5}
            />
        </G>
    )
}

export const LaptimeBoxPlot = ({ data }: { data: LapSelectionData }) => {
    const { width, height } = useWindowDimensions()

    const drivers = data.driver_lap_data.map(({ driver }) => driver)
    const svgHeight = height - 144
    const svgWidth = width - 30

    const driverLaptimeStatistics = useMemo(
        () =>
            data.driver_lap_data.map(({ laps, driver }) => ({
                statistics: getLaptimeBoxStatistics(
                    laps
                        .filter((lap) => !lap.is_inlap && !lap.is_outlap)
                        .map(({ laptime }) => laptime),
                ),
                color:
                    data.color_map[driver].style === "alternative"
                        ? getAlternativePlotColor(data.color_map[driver].color)
                        : data.color_map[driver].color,
                driver,
            })),
        [data.color_map, data.driver_lap_data],
    )

    const min = Math.min(...driverLaptimeStatistics.map((stat) => stat.statistics.min))
    const max = Math.max(...driverLaptimeStatistics.map((stat) => stat.statistics.max))

    const xAxis = useMemo(
        () =>
            d3
                .scaleBand()
                .range([X_PADDING, svgWidth - X_PADDING])
                .domain(drivers),
        [drivers, svgWidth],
    )

    const yAxis = useMemo(
        () =>
            d3
                .scaleLinear()
                .domain([min, max])
                .range([svgHeight - Y_PADDING, Y_PADDING]),
        [min, max, svgHeight],
    )

    const ctx = useMemo(
        () => ({ svgHeight, svgWidth, xAxis, yAxis }),
        [svgHeight, svgWidth, xAxis, yAxis],
    )
    return (
        <BoxChartContext.Provider value={ctx}>
            <Svg width={svgWidth} height={svgHeight}>
                <YAxis min={data.min_time || 0} max={data.max_time || 0} tickSize={8} />
                <XAxis tickSize={8} groupLabels={drivers} />
                {driverLaptimeStatistics.map(
                    ({ statistics: { q1, q3, min, max, median }, color, driver }) => (
                        <Box
                            key={driver}
                            label={driver}
                            q1={q1}
                            q3={q3}
                            min={min}
                            max={max}
                            median={median}
                            color={color}
                        />
                    ),
                )}
            </Svg>
        </BoxChartContext.Provider>
    )
}
