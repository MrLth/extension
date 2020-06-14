import * as React from 'react'
import { useState, useRef, memo, useCallback } from 'react'
import classNames = require('classnames')

import './index.scss'

import { throttle } from './api'
import { Tab, CustomProps } from './api/type'

const PopupWindowTab = memo(function PopupWindowTab(props: {
    tab: Tab & CustomProps
    windowId: string | number
    index: number
    openTab: (tab: Tab & CustomProps) => void
    mousedownCb: (startWindow: number, startIndex: number, status: boolean) => void
    mouseupCb: (endWindow: number, endIndex: number) => void
    dragOverCb: (li: HTMLElement, isInsertBefore: boolean, windowId: number, tabIndex: number) => void
    closeTab: (tabId: number) => void
    hiddenDropDiv: () => void
    duplicateTab: (tabId: number) => void
    discardTab: (windowId: number|string, tabId: number) => void
}) {
    const {
		tab,
		windowId,
        openTab,
        mousedownCb,
        mouseupCb,
        dragOverCb,
        closeTab,
        hiddenDropDiv,
        duplicateTab,
        discardTab,
    } = props

    const [refresh, setRefresh] = useState(tab.userSelected)
    const [dragable, setDragable] = useState(false)
    const [isDragover, setIsDragover] = useState(false)

    const onClick = useCallback(
        (e) => {
            if (e.shiftKey || e.ctrlKey) {
                tab.userSelected = !Boolean(tab.userSelected)
                console.log('clicked', tab.userSelected, tab)
                setRefresh(!refresh)
            } else {
                openTab(tab)
            }
        },
        [refresh]
    )

    const handleDragOver = useCallback(
        throttle((e: DragEvent) => {
            // setIsDragover(true);
            function getLi(target: HTMLElement): HTMLElement {
                if ('LI' == target.tagName || !target.parentElement || target.classList.contains('window')) {
                    return target
                }
                return getLi(target.parentElement)
            }
            const li = getLi(e.target as HTMLElement)
            const { y, height } = li.getBoundingClientRect()
            const { clientY } = e
            // console.log('top/bottom', clientY < y + height / 2);

            dragOverCb(li, clientY < y + height / 2, tab.windowId, tab.index)
        }, 333),
        []
    )

    const refDragObj = useRef({
        timerId: -1,
        delay: 700,
    })

    // console.log('🌀 Render       ', tab.index, tab.title)
    console.log('🌀 Tab Render')
    return (
        <li
            className={classNames({
                selected: tab.userSelected,
                activated: tab.active,
                dragable,
                dragover: isDragover,
            })}
            onClick={onClick}
            onMouseDown={() => {
                clearTimeout(refDragObj.current.timerId)
                refDragObj.current.timerId = setTimeout(() => {
                    setDragable(true)
                }, refDragObj.current.delay)
                mousedownCb(tab.windowId, tab.index, !Boolean(tab.userSelected))
                // e.preventDefault()
            }}
            onMouseLeave={() => {
                clearTimeout(refDragObj.current.timerId)
            }}
            onMouseUp={() => {
                mouseupCb(tab.windowId, tab.index)
                clearTimeout(refDragObj.current.timerId)
                setDragable(false)
            }}
            onDragStart={(e) => {
                if (!dragable) e.preventDefault()
                else {
                    console.log('drag start')
                    e.dataTransfer.effectAllowed = 'move'
                    e.dataTransfer.setData('text/plain', JSON.stringify(tab))
                    // const img = new Image();
                    // img.src = './tabs.png';
                    // e.dataTransfer.setDragImage(img, 0, 0);
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
                hiddenDropDiv()
            }}
            draggable="true">
            <div className="title">{tab.id+' - '+tab.title}</div>

            <div className="btn-wrapper">
                <button
                    onClick={(e) => {
                        discardTab(windowId, tab.id)
                        e.stopPropagation()
                    }}>
                    丢弃
                </button>
                <button
                    onClick={() => {
                        duplicateTab(tab.id)
                    }}>
                    复制
                </button>
                <button
                    onClick={() => {
                        closeTab(tab.id)
                    }}>
                    关闭
                </button>
            </div>
        </li>
    )
})

export default PopupWindowTab
