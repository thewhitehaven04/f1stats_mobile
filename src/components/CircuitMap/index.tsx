import { encodeSVGPath, SVGPathData } from "svg-pathdata"
import { StyleSheet, View, Text, useWindowDimensions } from "react-native"
import * as FontSizes from "@/src/fontSizes"
import type { CircuitGeometryDto, FastestDelta } from "@/src/client/generated"
import Svg, { Path } from "react-native-svg"
import { LegendItem } from "@/src/components/Plots/LegendItem"
import { getColor } from "@/src/colorScheme"

const LEFT_PADDING_PX = 6

const INLINE_PADDING = 40
const BOTTOM_RIGHT_PADDING_FACTOR = 0.95

export function getPath({
    xStart,
    yStart,
    xEnd,
    yEnd,
    X,
    Y,
    aspect_ratio,
    width,
}: {
    xStart: number
    yStart: number
    xEnd: number
    yEnd: number
    X: number
    Y: number
    aspect_ratio: number
    width: number
}) {
    const resolvedWidth = width * BOTTOM_RIGHT_PADDING_FACTOR
    const resolvedHeight = (width / aspect_ratio) * BOTTOM_RIGHT_PADDING_FACTOR
    return encodeSVGPath([
        {
            type: SVGPathData.MOVE_TO,
            relative: false,
            x: LEFT_PADDING_PX + (xStart / X) * resolvedWidth,
            y: LEFT_PADDING_PX + (yStart / Y) * resolvedHeight,
        },
        {
            type: SVGPathData.LINE_TO,
            relative: false,
            x: LEFT_PADDING_PX + (xEnd / X) * resolvedWidth,
            y: LEFT_PADDING_PX + (yEnd / Y) * resolvedHeight,
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
    const { width: deviceWidth } = useWindowDimensions()

    const paddedWidth = deviceWidth - INLINE_PADDING

    const minX = geometry.geojson.bbox?.[0] || 0
    const maxY = geometry.geojson.bbox?.[1] || 0
    const maxX = geometry.geojson.bbox?.[2] || 0
    const minY = geometry.geojson.bbox?.[3] || 0

    const X = maxX - minX
    const Y = maxY - minY
    const aspect_ratio = Math.abs(X / Y)
    // since we want the chart to be a square, we need to scale 
    // down vertically-oriented circuits, and then move the circuit map up by half of the difference
    const translateY = aspect_ratio > 1 ? 0 : -(((1 - aspect_ratio) * paddedWidth) / 2)

    return (
        <View style={styleSheet.wrapper}>
            <Text style={styleSheet.title}>Circuit map</Text>
            <Svg
                width={paddedWidth}
                height={paddedWidth / aspect_ratio}
                style={{
                    transform: [
                        {
                            translateY,
                        },
                        {
                            scale: aspect_ratio > 1 ? 1 : aspect_ratio,
                        },
                    ],
                    marginBottom: translateY * 2,
                }}
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
                                width: paddedWidth,
                            })}
                            fill="white"
                            stroke={getColor("foreground")}
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
                                width: paddedWidth,
                            })}
                            fill="white"
                            stroke={colorMap[pos.driver]}
                            strokeWidth="4.2"
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
