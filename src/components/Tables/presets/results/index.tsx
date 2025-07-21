import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/src/components/Tables"
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
        getRowCanExpand: (row) => props.sessionType === SessionType.PRACTICE,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <Table>
            <TableHeader>
                {getFlatHeaders().map((header) => (
                    <TableCell key={header.id}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                ))}
            </TableHeader>
            <TableBody>
                {getRowModel().rows.map((row) => (
                    <TableRow key={row.id} onPress={() => console.log("expand")}>
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
