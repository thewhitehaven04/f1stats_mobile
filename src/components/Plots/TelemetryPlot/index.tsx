import type { PlotColor } from "@/src/client/generated"
import { useFont } from "@shopify/react-native-skia"
import SpaceMono from "@/assets/fonts/SpaceMono-Regular.ttf"
import { CartesianChart, Line, useChartPressState } from "victory-native"
import { getAlternativePlotColor } from "@/src/core/helpers"
import { getColor } from "@/src/colorScheme"
import { useZoomReset } from "@/src/components/Plots/hooks/useZoomReset"

export const TelemetryPlot = ({
    chartData,
    colorMap,
    yAxes,
}: {
    chartData: Record<string, number>[]
    colorMap: Record<string, PlotColor>
    yAxes: string[]
}) => {
    const font = useFont(SpaceMono, 13)

    const { state: pressState } = useChartPressState({
        x: 0,
        y: Object.fromEntries(yAxes.map((driver) => [driver, 0])),
    })

    const { transformState } = useZoomReset()

    return (
        <CartesianChart
            data={chartData}
            xKey="distance"
            yKeys={yAxes}
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
                    dimensions: ["x"],
                },
            }}
        >
            {({ points }) =>
                yAxes.map((driver) => (
                    <Line
                        key={driver}
                        points={points[driver]}
                        color={
                            colorMap[driver].style === "default"
                                ? colorMap[driver].color
                                : getAlternativePlotColor(colorMap[driver].color)
                        }
                        strokeWidth={1.8}
                    />
                ))
            }
        </CartesianChart>
    )
}
