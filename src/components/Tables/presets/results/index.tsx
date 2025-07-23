"use client"
import { getColor } from "@/src/colorScheme"
import { Table, TableBody, TableHeader, TableRow, TextCell } from "@/src/components/Tables"
import { useDriverSelectionDispatch } from "@/src/components/Tables/presets/results/driverSelection"
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
import { Fragment, useMemo } from "react"
import { Pressable, StyleSheet } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated"

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

const styleSheet = StyleSheet.create({
    detailRow: { width: "100%", transformOrigin: "top" },
    textCell: { flex: 1 },
    scroll: { width: "100%", borderRadius: 16 },
})

const DetailsRow = ({
    headers,
    row,
    onPress,
}: {
    headers: string[]
    row: string[]
    onPress: () => void
}) => {
    const style = useMemo(
        () => ({
            ...styleSheet.textCell,
            paddingBlock: 2,
            paddingInline: 4,
            height: 32,
        }),
        [],
    )

    return (
        <Animated.View style={styleSheet.detailRow} entering={FadeInUp} exiting={FadeOutUp}>
            <Pressable onLongPress={onPress}>
                <TableHeader>
                    {headers.map((header) => (
                        <TextCell style={style} key={header}>
                            {header}
                        </TextCell>
                    ))}
                </TableHeader>
            </Pressable>
            <TableRow>
                {row.map((text) => (
                    <TextCell style={style} key={text}>
                        {text}
                    </TextCell>
                ))}
            </TableRow>
        </Animated.View>
    )
}

export const ResultsTable = (props: TResultsData) => {
    const { updateDriverState } = useDriverSelectionDispatch()
    const { getFlatHeaders, getRowModel } = useReactTable({
        columns: props.columns,
        data: props.rows,
        getRowCanExpand: () => props.sessionType !== SessionType.PRACTICE,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onRowSelectionChange: updateDriverState,
        getRowId: (row) => row.driver.id,
    })

    const headers = getFlatHeaders()
    const { rows } = getRowModel()

    return (
        <ScrollView horizontal style={styleSheet.scroll} contentContainerStyle={{ width: "100%", marginBottom: 16 }}>
            <Table>
                <TableHeader>
                    {headers.map((header) => (
                        <TextCell key={header.column.id} style={{ flexBasis: header.getSize() }}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                        </TextCell>
                    ))}
                </TableHeader>
                <TableBody style={{ overflowX: "scroll" }}>
                    {rows.map((row) => (
                        <Fragment key={row.id}>
                            <TableRow
                                onPress={row.getToggleExpandedHandler()}
                                onLongPress={row.getToggleSelectedHandler()}
                                style={{
                                    backgroundColor: getColor("background"),
                                    filter: row.getIsSelected() ? "brightness(0.95)" : "none",
                                }}
                            >
                                {row
                                    .getVisibleCells()
                                    .map((cell) =>
                                        flexRender(cell.column.columnDef.cell, cell.getContext()),
                                    )}
                            </TableRow>
                            {row.getIsExpanded() && (
                                <DetailsRow
                                    headers={row.original.child.columns}
                                    row={row.original.child.rows}
                                    onPress={row.getToggleExpandedHandler()}
                                />
                            )}
                        </Fragment>
                    ))}
                </TableBody>
            </Table>
        </ScrollView>
    )
}
