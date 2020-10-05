import React, { memo } from 'react'
//#region Import Style
import c from './index.module.scss'
import { moduleClassnames } from 'api'
const cn = moduleClassnames.bind(null, c)
//#endregion

import { useConcent } from 'concent'
import { Fn } from 'api/type'

const width = 120
const itemHeight = 32

export interface PopupOption {
    title: string | JSX.Element
    icon: JSX.Element
    cb?: Fn
}

export interface PopupFrameProps {
    isShow: boolean
    left?: number
    minLeft?: number
    maxRight?: number
    top?: number
    minTop?: number
    maxBottom?: number
    targetTop?: number
    options?: PopupOption[] | (() => PopupOption[])
}

const PopupFrame = (props: PopupFrameProps): JSX.Element => {
    if (!props.isShow) return null

    const { targetTop, isShow } = props
    let { top, left, options, minLeft, maxRight, minTop, maxBottom } = props
    const {
        globalState: { windowSize }
    } = useConcent('$$global')

    if (typeof options === 'function')
        options = options()

    minLeft = minLeft ?? 0
    maxRight = maxRight ?? windowSize.width
    minTop = minTop ?? 0
    maxBottom = maxBottom ?? windowSize.height

    left = left + width > maxRight ? maxRight - width : left
    left = left < minLeft ? minLeft : left

    const height = itemHeight * options.length

    if (top + height > maxBottom) {
        options.reverse()
        top = targetTop !== undefined ? targetTop - height : maxBottom - height
    }
    top = top < minTop ? minTop : top

    console.log('top, left, windowSize', top, left, windowSize)

    return (
        <ul className={c['content']} style={{ top, left, display: isShow ? 'block' : 'none' }}>
            {options.map((v, i) => {
                return <li key={i} onClick={v.cb}>
                    <div>{v.icon}</div>
                    <div>{v.title}</div>
                </li>
            })}
        </ul>
    )
}

export default memo(PopupFrame)
