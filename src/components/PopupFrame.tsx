import * as React from 'react'
import { memo, useMemo } from 'react'

import './PopupFrame.scss'
import { useConcent } from 'concent'

const width = 120
const itemHeight = 32
const itemCount = 2

const PopupFrame = (props: { left?: number; top?: number }): JSX.Element => {
    const { top } = props
    let { left } = props


    const {
        globalState: { windowSize }
    } = useConcent('$$global')

    console.log('top, left, windowSize', top, left, windowSize)

    left = useMemo(
        () => (windowSize.width > left + width ? left : left - width),
        [windowSize, left]
    )

    return (
        <div className='popup-frame' style={{ top: top + 10, left: left + 10 }}>
            {/* <div className='popup-frame'> */}
            PopupFrame
        </div>
    )
}

export default memo(PopupFrame)
