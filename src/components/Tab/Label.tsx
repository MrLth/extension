import * as React from 'react'
import { memo, useCallback, useRef, useState, useEffect } from 'react'
import { throttle } from 'api'
import { CustomProps, Tab } from 'api/type'
import { recordActionAdd } from 'store/record/actions'
import { RecordDispatch } from 'store/record/type'

import defaultIcon from '@img/defaultIcon.svg'
import IconFont from '../IconFont'
import { useConcent } from 'concent'

import c from './index.module.scss'
import { moduleClassnames } from 'api'
const cn = moduleClassnames.bind(null, c)

const PopupWindowTab = memo(function PopupWindowTab(props: {
    tab: Tab & CustomProps
    windowId: number | string
    index: number
    openTab: (tab: Tab & CustomProps) => void
    closeTab: (tabId: number) => void
    duplicateTab: (tabId: number) => void
    discardTab: (windowId: number | string, tabId: number) => void
    recordDispatch: RecordDispatch
    updPopupFramePosition: (top: number, left: number) => void
}) {
    const {
        tab,
        windowId,
        index,
        openTab,
        // mousedownCb,
        // mouseupCb,
        // dragOverCb,
        closeTab,
        // hiddenDropDiv,
        // duplicateTab,
        discardTab,
        recordDispatch,
        // canvasEl,
        updPopupFramePosition
    } = props

    const {
        globalState: { windowSize }
    } = useConcent('$$global')

    useEffect(() => {
        console.log('windowSize', windowSize)
    }, [windowSize])

    console.log('render')

    const [refresh, setRefresh] = useState(tab.userSelected)
    const [dragable, setDragable] = useState(false)
    const [isDragover, setIsDragover] = useState(false)

    const onClick = useCallback(
        (e) => {
            if (e.shiftKey || e.ctrlKey) {
                tab.userSelected = !Boolean(tab.userSelected)
                setRefresh(!refresh)
            } else {
                openTab(tab)
            }
            e.stopPropagation()
        },
        [refresh]
    )

    const handleDragOver = useCallback(
        throttle((e: DragEvent) => {
            // setIsDragover(true);
            function getLi(target: HTMLElement): HTMLElement {
                if (
                    'LI' == target.tagName ||
                    !target.parentElement ||
                    target.classList.contains('window')
                ) {
                    return target
                }
                return getLi(target.parentElement)
            }
            const li = getLi(e.target as HTMLElement)
            const { y, height } = li.getBoundingClientRect()
            const { clientY } = e
            // console.log('top/bottom', clientY < y + height / 2);

            // dragOverCb(li, clientY < y + height / 2, +windowId, index)
        }, 333),
        [windowId, index]
    )

    const refDragObj = useRef({
        timerId: -1,
        delay: 700
    })
    const jsx = (
        <>
            <div className='btn-wrapper'>
                {tab.discarded && 'z'}
                <button
                    onClick={(e) => {
                        recordDispatch(
                            recordActionAdd({
                                url: tab.url,
                                title: tab.title,
                                host: tab.userHost,
                                route: tab.userRoute,
                                para: tab.userPara
                            })
                        )
                        e.stopPropagation()
                    }}
                >
                    •
                </button>
                <button
                    onClick={(e) => {
                        discardTab(windowId, tab.id)
                        e.stopPropagation()
                    }}
                    disabled={tab.discarded}
                >
                    z
                </button>
                {/* <button
        onClick={() => {
            duplicateTab(tab.id)
        }}>
        复制
    </button> */}
                <button
                    onClick={() => {
                        closeTab(tab.id)
                    }}
                >
                    x
                </button>
            </div>
        </>
    )

    return (
        <li
            className={cn('label', {
                selected: tab.userSelected,
                activated: tab.active,
                dragable,
                dragover: isDragover
            })}
            onClick={onClick}
            onMouseUpCapture={(e) => {
              if (e.button === 2){
                updPopupFramePosition(e.clientY, e.clientX)
              }
                console.log('onMouseUpCapture', e.clientX, e.clientY, e.button)
            }}
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={(e) => {
                e.stopPropagation()

                clearTimeout(refDragObj.current.timerId)
                refDragObj.current.timerId = setTimeout(() => {
                    setDragable(true)
                }, refDragObj.current.delay)
                // mousedownCb(tab.windowId, tab.index, !Boolean(tab.userSelected))
                // e.preventDefault()
            }}
            onMouseLeave={() => {
                clearTimeout(refDragObj.current.timerId)
            }}
            onMouseUp={(e) => {
                // mouseupCb(tab.windowId, tab.index)
                clearTimeout(refDragObj.current.timerId)
                setDragable(false)
                e.stopPropagation()
            }}
            onDragStart={(e) => {
                if (!dragable) e.preventDefault()
                else {
                    e.dataTransfer.effectAllowed = 'move'
                    e.dataTransfer.setData('text/plain', JSON.stringify(tab))
                    // e.dataTransfer.setDragImage(canvasEl.current, 25, 25)
                }
            }}
            onDragEnd={() => {
                setDragable(false)
            }}
            onDragLeave={() => {
                setIsDragover(false)
            }}
            onDragOver={(e) => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'

                handleDragOver(e)
            }}
            onDrop={() => {
                // hiddenDropDiv()
            }}
            draggable='true'
        >
            <div className={c['unit-tab']}>
                <img
                    src={
                        tab.favIconUrl !== ''
                            ? `chrome://favicon/size/18@2x/${tab.url}`
                            : defaultIcon
                    }
                />
                {tab.title}
            </div>
            <div className={c['btn-close']}>
                <IconFont
                    type='icon-close'
                    onClick={(e: MouseEvent) => {
                        closeTab(tab.id)
                        e.stopPropagation()
                    }}
                />
            </div>
        </li>
    )
})

export default memo(PopupWindowTab)
