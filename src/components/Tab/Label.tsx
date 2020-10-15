import React, { memo } from 'react'
import { Tab } from 'api/type'

import defaultIcon from '@img/defaultIcon.svg'
import IconFont from '../IconFont'

import c from './index.module.scss'
import { moduleClassnames } from 'api'
const cn = moduleClassnames.bind(null, c)

import { Settings } from './index'

interface Props {
    tab: Tab
    index: number
    settings: Settings
}

const getLabelDom = (dom: HTMLElement): HTMLElement => {
    if (dom === document.body)
        return null
    if (dom.tagName.toLowerCase() == 'li')
        return dom
    return getLabelDom(dom.parentElement)
}

const Label = (props: Props) => {
    const { tab, settings } = props

    return (
        <li
            className={cn('label', {
                activated: tab.active
            })}
            onClick={(e) => {
                e.stopPropagation()
                settings.openTab(tab)
            }}
            //#region 右键事件
            onMouseUpCapture={(e) => {
                e.preventDefault()
                if (e.button === 2) {
                    const dom = getLabelDom(e.target as HTMLElement)
                    const { bottom, left, right, top } = dom.getBoundingClientRect()
                    settings.updPopupFrameProps(
                        {
                            isShow: true,
                            top: bottom,
                            left: e.clientX,
                            targetTop: top,
                            minLeft: left,
                            maxRight: right,
                            options: [
                                {
                                    title: '取消',
                                    icon: <IconFont type='iconcancel1f' />,
                                    cb: () => settings.updPopupFrameProps({ isShow: false })
                                },
                                {
                                    title: '记录',
                                    icon: <IconFont type='iconrecord_on' />,
                                    cb: () => console.log(2)
                                },
                                {
                                    title: '休眠',
                                    icon: <IconFont type='iconsleepmode' />,
                                    cb: () => console.log(3)
                                },
                                {
                                    title: '分组',
                                    icon: <IconFont type='icongit-merge-line' />,
                                    cb: () => console.log(4)
                                }
                            ]
                        })
                }
            }}
            onContextMenu={(e) => e.preventDefault()}
        //#endregion
        >
            <div className={c['unit-tab']}>
                <img
                    src={
                        tab.url !== ''
                            ? `chrome://favicon/size/18@2x/${tab.url}`
                            : defaultIcon
                    }
                />
                {tab.title}
            </div>
            <div className={c['btn-close']}>
                <IconFont
                    type='iconclose'
                    onClick={(e: MouseEvent) => {
                        settings.closeTab(tab.id)
                        e.stopPropagation()
                    }}
                />
            </div>
        </li>
    )
}

export default memo(Label)
