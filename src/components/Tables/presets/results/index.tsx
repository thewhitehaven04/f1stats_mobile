"use client"
import { Table, TableBody, TableHeader, TableRow, TextCell } from "@/src/components/Tables"
import { SessionType } from "@/src/components/Tables/presets/results/mapper"
import type { IPracticeData } from "@/src/components/Tables/presets/results/practice"
import { type IQualifyingData } from "@/src/components/Tables/presets/results/qualifying"
import { type IRaceData } from "@/src/components/Tables/presets/results/race"
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { useEffect } from "react"
import { Pressable } from "react-native"
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated"

type TResultsData =
    | {
          rows: IPracticeData[]
          columns: ColumnDef<IPracticeData, any>[]
          sessionType: typeof SessionType.PRACTICE
      }
    | {
          rows: IRaceData[]
          columns: ColumnDef<IRaceData, any>[]
          sessionType: typeof SessionType.RACE
      }
    | {
          rows: IQualifyingData[]
          columns: ColumnDef<IQualifyingData, any>[]
          sessionType: typeof SessionType.QUALIFYING
      }

const DetailsRow = ({
    headers,
    row,
    onPress,
}: {
    headers: string[]
    row: string[]
    onPress: () => void
}) => {
    const svTranslate = useSharedValue(-100)
    const svOpacity = useSharedValue(0)

    useEffect(() => {
        svTranslate.value = withTiming(0, {
            duration: 300,
            easing: Easing.inOut(Easing.quad),
        })
        svOpacity.value = withTiming(1, {
            duration: 300,
            easing: Easing.out(Easing.quad),
        })
    }, [svTranslate, svOpacity])

    const scaleStyle = useAnimatedStyle(() => ({
        opacity: svOpacity.value,
        transform: [
            {
                translateY: `${svTranslate.value}%`,
            },
        ],
    }))

    return (
        <Animated.View style={[{ width: "100%", transformOrigin: "top", zIndex: -1 }, scaleStyle]}>
            <Pressable onPress={onPress}>
                <TableHeader>
                    {headers.map((header) => (
                        <TextCell style={{ flex: 1 }} key={header}>
                            {header}
                        </TextCell>
                    ))}
                </TableHeader>
            </Pressable>
            <TableRow>
                {row.map((text) => (
                    <TextCell style={{ flex: 1 }} key={text}>
                        {text}
                    </TextCell>
                ))}
            </TableRow>
        </Animated.View>
    )
}

export const ResultsTable = (props: TResultsData) => {
    const { getFlatHeaders, getRowModel } = useReactTable({
        columns: props.columns,
        data: props.rows,
        getRowCanExpand: () => props.sessionType !== SessionType.PRACTICE,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    })

    return (
        <Table>
            <TableHeader>
                {getFlatHeaders().map((header) => (
                    <TextCell key={header.column.id} style={{ flexBasis: header.getSize() }}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                    </TextCell>
                ))}
            </TableHeader>
            <TableBody style={{ position: "relative" }}>
                {getRowModel().rows.map((row) => (
                    <>
                        <TableRow
                            key={row.id}
                            onPress={row.getToggleExpandedHandler()}
                            style={{ zIndex: 2 }}
                        >
                            {row
                                .getVisibleCells()
                                .map((cell) =>
                                    flexRender(cell.column.columnDef.cell, cell.getContext()),
                                )}
                        </TableRow>
                        {row.getIsExpanded() && props.sessionType !== SessionType.PRACTICE && (
                            <DetailsRow
                                headers={row.original.child.columns}
                                row={row.original.child.rows}
                                onPress={row.getToggleExpandedHandler()}
                            />
                        )}
                    </>
                ))}
            </TableBody>
        </Table>
    )
}
