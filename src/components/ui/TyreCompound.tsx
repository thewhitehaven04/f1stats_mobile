import SoftTyre from "@/assets/images/tyres/soft.svg"
import MediumTyre from "@/assets/images/tyres/medium.svg"
import HardTyre from "@/assets/images/tyres/hard.svg"
import IntermediateTyre from "@/assets/images/tyres/intermediate.svg"
import WetTyre from "@/assets/images/tyres/wet.svg"

export type TCompound = "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET"

const COLOR_MAP: Record<TCompound, string> = {
    SOFT: SoftTyre,
    MEDIUM: MediumTyre,
    HARD: HardTyre,
    INTERMEDIATE: IntermediateTyre,
    WET: WetTyre,
}

export const TyreCompound = ({ type }: { type: TCompound }) => COLOR_MAP[type]
