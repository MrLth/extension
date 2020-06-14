import { memo, useMemo } from 'react'

import * as React from 'react'

import './index.scss'
import { CustomProps, Tab } from './api/type'

const BtnGroup = memo(function BtnGroup(props: {
    createWindow: () => void
    createWindowOnDropCb: (dragTab: Tab & CustomProps) => void
    isSelect: boolean
    cancelSelected: () => void
	closeSelectedTab: () => void
	discardSelectedTab:()=>void
}) {
    const { createWindow, createWindowOnDropCb, isSelect, cancelSelected, closeSelectedTab , discardSelectedTab} = props

    const BtnGroupOnSelected = useMemo(() => {
        return isSelect ? (
            <div>
				<button onClick={discardSelectedTab}>丢弃</button>
                <button onClick={closeSelectedTab}>关闭</button>
                <button onClick={cancelSelected}>取消选择</button>

            </div>
        ) : null
    }, [isSelect])
    return (
        <div>
            <input type="text" placeholder="搜索" />
            <button
                onClick={createWindow}
                onDragOver={(e) => {
                    e.preventDefault()
                }}
                onDrop={(e) => {
                    e.preventDefault()
                    const tab = JSON.parse(e.dataTransfer.getData('text/plain'))
                    createWindowOnDropCb(tab)
                }}>
                新窗口
            </button>
            <button>分组</button>
            {BtnGroupOnSelected}
        </div>
    )
})

export default BtnGroup
