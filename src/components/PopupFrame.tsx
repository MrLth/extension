import * as React from 'react'
import { memo } from 'react'

import './PopupFrame.scss'
const PopupFrame = (props: { left?: number; top?: number }): JSX.Element => {
    const { top, left } = props

    console.log('top, left', top, left)
    return (
        // <div className='popup-frame' style={{ top: top + 20, left: left + 10 }}>
        <div className='popup-frame' style={{ top: top + 20, left: left + 10 }}>
            PopupFrame
        </div>
    )
}

export default memo(PopupFrame)
