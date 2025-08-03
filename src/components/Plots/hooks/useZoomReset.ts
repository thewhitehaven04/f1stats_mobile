import { Easing, useAnimatedReaction, useSharedValue, withTiming } from 'react-native-reanimated'
import { getTransformComponents, setScale, setTranslate, useChartTransformState } from 'victory-native'

const MIN_ZOOM_SCALE = 1
const MAX_ZOOM_SCALE = 3

export const useZoomReset = () => {
    const sharedScaleX = useSharedValue(1)

    const { state: transformState } = useChartTransformState({
        scaleX: 1,
        scaleY: 1,
    })

    useAnimatedReaction(
        () => transformState.zoomActive.value,
        (isTransforming, hasTransformed) => {
            if (!isTransforming && hasTransformed) {
                const mtrxValues = getTransformComponents(transformState.matrix.value)
                if (mtrxValues.scaleX < MIN_ZOOM_SCALE || mtrxValues.scaleX > MAX_ZOOM_SCALE) {
                    sharedScaleX.value = mtrxValues.scaleX
                    sharedScaleX.value = withTiming(1, {
                        duration: 500, 
                        easing: Easing.out(Easing.quad)
                    })
                }
            }
        },
    )

    useAnimatedReaction(
        () => ({
            scaleX: sharedScaleX.value,
        }),
        ({ scaleX }) => {
            const matrix = setTranslate(transformState.matrix.value, 0, 0)
            transformState.matrix.value = setScale(matrix, scaleX)
        },
    )

    return { transformState }
}