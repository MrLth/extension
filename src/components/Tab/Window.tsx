import { memo } from 'react'

import * as React from 'react'

import { Tab, CustomProps } from 'api/type'
import Label from './Label'
import { RecordDispatch } from 'store/record/type'

import c from './index.module.scss'
import { moduleClassnames } from 'api'
const cn = moduleClassnames.bind(null, c)

const Window = memo(function PopupWindow(props: {
  tabs: Array<Tab & CustomProps>
  windowId: string | number
  openTab: (tab: Tab & CustomProps) => void
  closeWindow: (windowId: number) => void
  closeTab: (tabId: number) => void
  selectWindow: (windowIdKey: string | number) => void
  attachInfo: chrome.windows.Window
  changeWindowAttach: (
    windowsId: number,
    updateInfo: chrome.windows.UpdateInfo,
    isCb?: boolean
  ) => void
  duplicateTab: (tabId: number) => void
  discardTab: (windowId: number | string, tabId: number) => void
  recordDispatch: RecordDispatch
  updPopupFramePosition: (top: number, left: number) => void
}) {
  const {
    tabs,
    openTab,
    windowId,
    closeTab,
    closeWindow,
    selectWindow,
    attachInfo,
    changeWindowAttach,
    duplicateTab,
    discardTab,
    recordDispatch,
    updPopupFramePosition
  } = props
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
          <Label
            tab={tab}
            key={tab.id}
            windowId={windowId}
            index={i}
            openTab={openTab}
            // mousedownCb={mousedownCb}
            // mouseupCb={mouseupCb}
            // dragOverCb={dragOverCb}
            closeTab={closeTab}
            // hiddenDropDiv={hiddenDropDiv}
            duplicateTab={duplicateTab}
            discardTab={discardTab}
            recordDispatch={recordDispatch}
            // canvasEl={canvasEl}
            updPopupFramePosition={updPopupFramePosition}
          />
        )
        i++
        tab = nextTab
        nextTab = i + 1 !== tabs.length && tabs[i + 1]
      } while (i + 1 < tabs.length && nextTab.userHost === tab.userHost)
    }

    tempArr.push(
      <Label
        tab={tab}
        key={tab.id}
        windowId={windowId}
        index={i}
        openTab={openTab}
        // mousedownCb={mousedownCb}
        // mouseupCb={mouseupCb}
        // dragOverCb={dragOverCb}
        closeTab={closeTab}
        // hiddenDropDiv={hiddenDropDiv}
        duplicateTab={duplicateTab}
        discardTab={discardTab}
        recordDispatch={recordDispatch}
        // canvasEl={canvasEl}
        updPopupFramePosition={updPopupFramePosition}
      />
    )

    tabArr.push(
      tempArr.length === 1 ? (
        tempArr
      ) : (
          <div className={c["tab-group"]} key={key}>
            {tempArr}
          </div>
        )
    )
  }

  const jsx1 = (
    <>
      <div className={c["btn-wrapper"]}>
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
    </>
  )

  console.log('attachInfo && attachInfo.focused', attachInfo && attachInfo.focused)
  return (
    <ul
      className={cn('window', {
        'focused': attachInfo && attachInfo.focused
      })}>
      <div className={cn("window-title")}>window # {windowId}</div>
      {tabArr}
    </ul>
  )
})

export default Window
