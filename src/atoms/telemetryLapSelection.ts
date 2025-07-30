import { atom, useAtom } from "jotai"
import { useCallback } from "react"

export const TelemetryLapSelection = atom<[driver: string, lap: number][]>([])

export const useTelemetryLapSelection = () => {
    const [driverLapSelection, setDriverLapSelection] = useAtom(TelemetryLapSelection)

    const toggleSelection = useCallback(
        (driver: string, lap: number) => {
            const selectedDriver = driverLapSelection.find(([d]) => d === driver)

            if (selectedDriver) {
                setDriverLapSelection(driverLapSelection.filter(([d]) => d !== driver))
            } else {
                setDriverLapSelection((selection) => [...selection, [driver, lap]])
            }
        },
        [driverLapSelection, setDriverLapSelection],
    )

    const isLapSelected = useCallback(
        (driver: string, lap: number) =>
            driverLapSelection.find(([d, l]) => d === driver && l === lap),
        [driverLapSelection],
    )

    return { isLapSelected, toggleSelection }
}
