"use client"
import { Table, TableBody, TableHeader, TableRow, TextCell } from "@/src/components/Tables"
import { SessionType } from "@/src/components/Tables/presets/results/mapper"
import type { IPracticeData } from "@/src/components/Tables/presets/results/practice"
import type { IExpandedQualifyingData } from "@/src/components/Tables/presets/results/qualifying"
import type { IExpandedRaceData } from "@/src/components/Tables/presets/results/race"
import {
    flexRender,
    getCoreRowModel,
    type TableOptions,
    useReactTable,
} from "@tanstack/react-table"

type TResultsData = IPracticeData | IExpandedRaceData | IExpandedQualifyingData

export const ResultsTable = (
    props: Omit<TableOptions<TResultsData>, "getCoreRowModel"> & {
        sessionType: string
    },
) => {
    const { getFlatHeaders, getRowModel } = useReactTable({
        ...props,
        getRowCanExpand: () => props.sessionType === SessionType.PRACTICE,
        getCoreRowModel: getCoreRowModel(),
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
            <TableBody>
                {getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                        {row
                            .getVisibleCells()
                            .map((cell) =>
                                flexRender(cell.column.columnDef.cell, cell.getContext()),
                            )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
