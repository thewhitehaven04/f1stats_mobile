import type { AverageTelemetriesResponseDto } from "@/src/client/generated"
import { useFont } from "@shopify/react-native-skia"
import SpaceMono from "@/assets/fonts/SpaceMono-Regular.ttf"
import {
    CartesianChart,
    getTransformComponents,
    Line,
    setScale,
    setTranslate,
    useChartPressState,
    useChartTransformState,
} from "victory-native"
import { useMemo } from "react"
import { getAlternativePlotColor } from "@/src/core/helpers"
import {
    Easing,
    runOnJS,
    useAnimatedReaction,
    useSharedValue,
    withTiming,
    type SharedValue,
} from "react-native-reanimated"
import { Circle } from "react-native-svg"
import { getColor } from "@/src/colorScheme"

const SpeedTooltip = ({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) => {
    return <Circle cx={x.value} cy={y.value} r={8} color="black" />
}

export const AverageTelemetryPlot = ({ data }: { data: AverageTelemetriesResponseDto }) => {
    const { telemetries, color_map: colorMap } = data
    const drivers = telemetries.map((driverTelemetry) => driverTelemetry.driver)

    const font = useFont(SpaceMono, 13)

    const chartData: Record<string, number>[] = useMemo(() => {
        const distance = telemetries[0].telemetry.map(({ distance }) => distance)
        const chartData = distance.map((d) => ({
            distance: d,
        }))

        chartData.forEach((dataInstance, i) => {
            telemetries.forEach(({ telemetry, driver }) => {
                dataInstance[driver] = telemetry[i]?.speed || null
            })
        })

        return chartData
    }, [telemetries])

    const { state: transformState } = useChartTransformState({
        scaleX: 1,
        scaleY: 1,
    })

    const { state: pressState, isActive } = useChartPressState({
        x: 0,
        y: Object.fromEntries(drivers.map((driver) => [driver, 0])),
    })

    const sharedScaleX = useSharedValue(1)

    useAnimatedReaction(
        () => transformState.zoomActive.value,
        (isTransforming, hasTransformed) => {
            if (!isTransforming && hasTransformed) {
                const mtrxValues = getTransformComponents(transformState.matrix.value)
                if (mtrxValues.scaleX < 1 || mtrxValues.scaleX > 3) {
                    sharedScaleX.value = mtrxValues.scaleX
                    sharedScaleX.value = withTiming(1, {
                        duration: 500, 
                        easing: Easing.out(Easing.quad)
                    })
                }
            }
        },
    )

    useAnimatedReaction(
        () => ({
            scaleX: sharedScaleX.value,
        }),
        ({ scaleX }) => {
            const matrix = setTranslate(transformState.matrix.value, 0, 0)
            transformState.matrix.value = setScale(matrix, scaleX)
        },
    )

    return (
        <CartesianChart
            data={chartData}
            xKey="distance"
            yKeys={drivers}
            padding={{ left: 8, right: 8, top: 8 }}
            axisOptions={{
                font,
                axisSide: {
                    x: "bottom",
                    y: "left",
                },
                labelPosition: {
                    x: "outset",
                    y: "inset",
                },
                lineColor: getColor("border"),
            }}
            transformState={transformState}
            chartPressState={pressState}
            transformConfig={{
                pan: {
                    enabled: false,
                },
                pinch: {
                    enabled: true,
                    dimensions: ['x']
                },
            }}
        >
            {({ points }) =>
                drivers.map((driver) => (
                    <>
                        <Line
                            key={driver}
                            points={points[driver]}
                            color={
                                colorMap[driver].style === "default"
                                    ? colorMap[driver].color
                                    : getAlternativePlotColor(colorMap[driver].color)
                            }
                            strokeWidth={2}
                        />
                        {isActive && (
                            <SpeedTooltip
                                x={pressState.x.position}
                                y={pressState.y[driver].position}
                            />
                        )}
                    </>
                ))
            }
        </CartesianChart>
    )
}
