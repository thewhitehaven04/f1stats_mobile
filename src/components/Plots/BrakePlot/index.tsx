import type { PlotColor } from "@/src/client/generated"
import { getColor } from "@/src/colorScheme"
import { useZoomReset } from "@/src/components/Plots/hooks/useZoomReset"
import { getAlternativePlotColor } from "@/src/core/helpers"
import { useChartPressState, CartesianChart, useLinePath, type PointsArray } from "victory-native"
import SpaceMono from "@/assets/fonts/SpaceMono-Regular.ttf"
import { Path, useFont } from "@shopify/react-native-skia"

const StepLine = ({ points, color }: { points: PointsArray; color: string }) => {
    const { path } = useLinePath(points, {
        curveType: "step",
    })

    return <Path path={path} color={color} />
}

export const BrakePlot = ({
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
            xAxis={{
                font,
                axisSide: 'bottom',
                labelPosition: 'outset',
                lineColor: getColor("border"),
            }}
            yAxis={yAxes.map(() => ({
                font, 
                labelPosition: 'inset',
            }))}
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
                    <StepLine
                        key={driver}
                        points={points[driver]}
                        color={
                            colorMap[driver].style === "default"
                                ? colorMap[driver].color
                                : getAlternativePlotColor(colorMap[driver].color)
                        }
                    />
                ))
            }
        </CartesianChart>
    )
}
