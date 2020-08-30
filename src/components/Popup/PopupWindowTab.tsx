import * as React from 'react'
import { memo, useCallback, useRef, useState } from 'react'
import { throttle } from '@api'
import { CustomProps, Tab } from '@api/type'
import { recordActionAdd } from '@store/record/actions'
import { RecordDispatch } from '@store/record/type'
import './index.scss'
import classNames = require('classnames')

import defaultIcon from '@img/defaultIcon.svg'
import IconFont from '../IconFont'

const PopupWindowTab = memo(function PopupWindowTab(props: {
  tab: Tab & CustomProps
  windowId: number | string
  index: number
  openTab: (tab: Tab & CustomProps) => void
  mousedownCb: (startWindow: number, startIndex: number, status: boolean) => void
  mouseupCb: (endWindow: number, endIndex: number) => void
  dragOverCb: (li: HTMLElement, isInsertBefore: boolean, windowId: number, tabIndex: number) => void
  closeTab: (tabId: number) => void
  hiddenDropDiv: () => void
  duplicateTab: (tabId: number) => void
  discardTab: (windowId: number | string, tabId: number) => void
  recordDispatch: RecordDispatch
  canvasEl: React.MutableRefObject<HTMLCanvasElement>
}) {
  const {
    tab,
    windowId,
    index,
    openTab,
    mousedownCb,
    mouseupCb,
    dragOverCb,
    closeTab,
    hiddenDropDiv,
    duplicateTab,
    discardTab,
    recordDispatch,
    canvasEl,
  } = props

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

      dragOverCb(li, clientY < y + height / 2, +windowId, index)
    }, 333),
    [windowId, index]
  )

  const refDragObj = useRef({
    timerId: -1,
    delay: 700,
  })
  const jsx = (
    <>
      <div className="btn-wrapper">
        {tab.discarded && 'z'}
        <button
          onClick={(e) => {
            recordDispatch(
              recordActionAdd({
                url: tab.url,
                title: tab.title,
                host: tab.userHost,
                route: tab.userRoute,
                para: tab.userPara,
              })
            )
            e.stopPropagation()
          }}>
          •
        </button>
        <button
          onClick={(e) => {
            discardTab(windowId, tab.id)
            e.stopPropagation()
          }}
          disabled={tab.discarded}>
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
          }}>
          x
        </button>
      </div>
    </>
  )

  return (
    <li
      className={classNames('unit-tab-wrapper', {
        selected: tab.userSelected,
        activated: tab.active,
        dragable,
        dragover: isDragover,
      })}
      onClick={onClick}
      onMouseUpCapture={(e) => {
        console.log('onMouseUpCapture', e.clientX, e.clientY, e.button)
      }}
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={(e) => {
        e.stopPropagation()

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
      onMouseUp={(e) => {
        mouseupCb(tab.windowId, tab.index)
        clearTimeout(refDragObj.current.timerId)
        setDragable(false)
        e.stopPropagation()
      }}
      onDragStart={(e) => {
        if (!dragable) e.preventDefault()
        else {
          e.dataTransfer.effectAllowed = 'move'
          e.dataTransfer.setData('text/plain', JSON.stringify(tab))
          e.dataTransfer.setDragImage(canvasEl.current, 25, 25)
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
      <div className="unit-tab">
        <img src={tab.favIconUrl !== '' ? tab.favIconUrl : defaultIcon} />
        {tab.title}
      </div>
      <div className="tab-btn-close">
        <IconFont
          type="icon-close"
          onClick={(e: MouseEvent) => {
            closeTab(tab.id)
            e.stopPropagation()
          }}
        />
      </div>
    </li>
  )
})

export default PopupWindowTab
