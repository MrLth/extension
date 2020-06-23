import { memo } from 'react'

import * as React from 'react'

import './index.scss'

import { Tab, CustomProps } from '@api/type'
import PopupWindowTab from './PopupWindowTab'
import classNames = require('classnames')
import { RecordDispatch } from '@store/record/type'
// import classNames = require('classnames')

const PopupWindow = memo(function PopupWindow(props: {
    tabs: Array<Tab & CustomProps>
    windowId: string | number
    openTab: (tab: Tab & CustomProps) => void
    mousedownCb: (startWindow: number, startIndex: number, status: boolean) => void
    mouseupCb: (endWindow: number, endIndex: number) => void
    dragOverCb: (li: HTMLElement, isInsertBefore: boolean, windowId: number, tabIndex: number) => void
    closeWindow: (windowId: number) => void
    closeTab: (tabId: number) => void
    hiddenDropDiv: () => void
    selectWindow: (windowIdKey: string | number) => void
    attachInfo: chrome.windows.Window
    changeWindowAttach: (windowsId: number, updateInfo: chrome.windows.UpdateInfo, isCb?: boolean) => void
    duplicateTab: (tabId: number) => void
    discardTab: (windowId: number | string, tabId: number) => void
    recordDispatch: RecordDispatch
    canvasEl: React.MutableRefObject<HTMLCanvasElement>
}) {
    const {
        tabs,
        openTab,
        windowId,
        mousedownCb,
        mouseupCb,
        dragOverCb,
        closeTab,
        closeWindow,
        hiddenDropDiv,
        selectWindow,
        attachInfo,
        changeWindowAttach,
        duplicateTab,
        discardTab,
        recordDispatch,
        canvasEl
    } = props

    console.log('🌀 Render    ', windowId)

    // console.log("attach Info", attachInfo);

    const tabArr = []

    for (let i = 0; i < tabs.length; i++) {
        let tab = tabs[i]
        let nextTab = i + 1 !== tabs.length && tabs[i + 1]

        const tempArr = []
        const key = tab.id
        const host = tab.userHost
        const favIconUrl = tab.favIconUrl

        if (nextTab.userHost === tab.userHost) {
            do {
                tempArr.push(
                    <PopupWindowTab
                        tab={tab}
                        key={tab.id}
                        windowId={windowId}
                        index={i}
                        openTab={openTab}
                        mousedownCb={mousedownCb}
                        mouseupCb={mouseupCb}
                        dragOverCb={dragOverCb}
                        closeTab={closeTab}
                        hiddenDropDiv={hiddenDropDiv}
                        duplicateTab={duplicateTab}
                        discardTab={discardTab}
                        recordDispatch={recordDispatch}
                        canvasEl={canvasEl}
                    />
                )
                i++
                tab = nextTab
                nextTab = i + 1 !== tabs.length && tabs[i + 1]
            } while (i + 1 < tabs.length && nextTab.userHost === tab.userHost)
        }

        tempArr.push(
            <PopupWindowTab
                tab={tab}
                key={tab.id}
                windowId={windowId}
                index={i}
                openTab={openTab}
                mousedownCb={mousedownCb}
                mouseupCb={mouseupCb}
                dragOverCb={dragOverCb}
                closeTab={closeTab}
                hiddenDropDiv={hiddenDropDiv}
                duplicateTab={duplicateTab}
                discardTab={discardTab}
                recordDispatch={recordDispatch}
                canvasEl={canvasEl}
            />
        )

        // tabArr.push({ tempArr, key, favIconUrl, host })
        tabArr.push(
            // <div className={classNames({ 'group': tempArr.length > 1 })} key={key}>
            <div className="group" key={key}>
                <div className="title">

                    <img src={favIconUrl} />
                    {host}
                </div>
                {tempArr}
            </div>
        )
    }

    // tabArr.sort((a, b) => b.tempArr.length - a.tempArr.length)

    // console.log('🌀 Window Render')
    return (
        <ul
            className={classNames('window', {
                focused: attachInfo && attachInfo.focused,
                'is-not-normal-window': attachInfo && attachInfo.type != 'normal',
            })}
        // onClick={() => {
        //     changeWindowAttach(parseInt(windowId as string), { focused: true }, false)
        // }}
        >
            <h2 className="title">
                {windowId}
                <div className="btn-wrapper">
                    <button
                        onClick={(e) => {
                            selectWindow(windowId)
                            e.stopPropagation()
                        }}>
                        选择
                    </button>
                    {attachInfo?.state === 'minimized' ? (
                        <button
                            onClick={(e) => {
                                changeWindowAttach(parseInt(windowId as string), { state: 'normal' })
                                e.stopPropagation()
                            }}>
                            恢复
                        </button>
                    ) : (
                            <button
                                onClick={(e) => {
                                    changeWindowAttach(parseInt(windowId as string), { state: 'minimized' })
                                    e.stopPropagation()
                                }}>
                                最小化
                            </button>
                        )}
                    <button
                        onClick={(e) => {
                            closeWindow(+windowId)
                            e.stopPropagation()
                        }}>
                        关闭
                    </button>
                </div>
            </h2>
            {
                tabArr
                // tabArr.map(({ tempArr, key, favIconUrl, host }) =>
                // 	<div className="group" key={key}>
                // 		<div className="title">
                // 			<img src={favIconUrl} />
                // 			{host}
                // 		</div>
                // 		{tempArr}
                // 	</div>
                // )
            }
        </ul >
    )
})

export default PopupWindow
