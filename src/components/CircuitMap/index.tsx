import { encodeSVGPath, SVGPathData } from "svg-pathdata"
import { StyleSheet, View, Text } from "react-native"
import * as FontSizes from "@/src/fontSizes"
import type { CircuitGeometryDto, FastestDelta } from "@/src/client/generated"
import Svg, { Path } from "react-native-svg"
import { LegendItem } from "@/src/components/Plots/LegendItem"
import { getColor } from '@/src/colorScheme'

const HEIGHT = 400

export function getPath({
    xStart,
    yStart,
    xEnd,
    yEnd,
    X,
    Y,
    aspect_ratio,
}: {
    xStart: number
    yStart: number
    xEnd: number
    yEnd: number
    X: number
    Y: number
    aspect_ratio: number
}) {
    const width = HEIGHT * aspect_ratio
    return encodeSVGPath([
        {
            type: SVGPathData.MOVE_TO,
            relative: false,
            x: (xStart / X) * width,
            y: (yStart / Y) * HEIGHT,
        },
        {
            type: SVGPathData.LINE_TO,
            relative: false,
            x: (xEnd / X) * width,
            y: (yEnd / Y) * HEIGHT,
        },
    ])
}

const styleSheet = StyleSheet.create({
    wrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 8,
        gap: 8,
    },
    title: {
        fontSize: FontSizes.Title.md,
        fontWeight: 500,
    },
    legend: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 12,
    },
})

export function DeltaCircuitMap(props: {
    geometry: CircuitGeometryDto
    driverDeltas: FastestDelta[]
    colorMap: Record<string, string>
}) {
    const { geometry, driverDeltas, colorMap } = props
    const minX = geometry.geojson.bbox?.[0] || 0 - 10
    const maxY = geometry.geojson.bbox?.[1] || 0 - 10
    const maxX = geometry.geojson.bbox?.[2] || 0 + 10
    const minY = geometry.geojson.bbox?.[3] || 0 + 10

    const X = maxX - minX
    const Y = maxY - minY
    const aspect_ratio = Math.abs(X / Y)

    return (
        <View style={styleSheet.wrapper}>
            <Text style={styleSheet.title}>Circuit map</Text>
            <Svg
                width={HEIGHT * aspect_ratio}
                height={HEIGHT}
                translate={`rotate(${-geometry.rotation})`}
            >
                {geometry.geojson.geometry?.coordinates.map((pos, index) => {
                    const first = pos
                    const second =
                        geometry.geojson.geometry?.coordinates[
                            index === geometry.geojson.geometry?.coordinates.length - 1
                                ? index
                                : index + 1
                        ]

                    const xStart = first[0] - minX
                    const yStart = first[1] - minY
                    if (!second) return null
                    const xEnd = second[0] - minX
                    const yEnd = second[1] - minY
                    return (
                        <Path
                            // biome-ignore lint/suspicious/noArrayIndexKey: static array
                            key={index}
                            d={getPath({
                                xStart,
                                yStart,
                                xEnd,
                                yEnd,
                                X,
                                Y,
                                aspect_ratio,
                            })}
                            fill="white"
                            stroke={getColor('foreground')}
                            strokeWidth="4.5"
                        />
                    )
                })}
                {driverDeltas.map((pos, index) => {
                    const first = pos.point
                    const second =
                        driverDeltas[index === driverDeltas.length - 1 ? index : index + 1].point

                    const xStart = first[0] - minX
                    const yStart = first[1] - minY
                    if (!second) return null
                    const xEnd = second[0] - minX
                    const yEnd = second[1] - minY
                    return (
                        <Path
                            // biome-ignore lint/suspicious/noArrayIndexKey: static array
                            key={index}
                            d={getPath({
                                xStart,
                                yStart,
                                xEnd,
                                yEnd,
                                X,
                                Y,
                                aspect_ratio,
                            })}
                            fill="white"
                            stroke={colorMap[pos.driver]}
                            strokeWidth="4"
                        />
                    )
                })}
            </Svg>
            <View style={styleSheet.legend}>
                {Object.entries(colorMap).map(([driver, plotColor]) => (
                    <LegendItem key={driver} label={driver} plotColor={plotColor} />
                ))}
            </View>
        </View>
    )
}
