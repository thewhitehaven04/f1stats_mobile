import type { RowSelectionState } from "@tanstack/react-table"
import { atom } from 'jotai'

export const DriverSelection = atom<RowSelectionState>({})