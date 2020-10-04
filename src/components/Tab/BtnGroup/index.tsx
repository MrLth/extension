import { memo, useMemo } from 'react'

import * as React from 'react'

import { CustomProps, Tab } from 'api/type'

const BtnGroup = memo(function BtnGroup(props: {
    createWindow: () => void
    // createWindowOnDropCb: (dragTab: Tab & CustomProps) => void
    // isSelect: boolean
    cancelSelected: () => void
	closeSelectedTab: () => void
    discardSelectedTab:()=>void
    searchTabCb:(text:string)=>void
    recordSelectedTab:()=>void
}) {
    const { createWindow, cancelSelected, closeSelectedTab , discardSelectedTab, searchTabCb, recordSelectedTab} = props

    // const BtnGroupOnSelected = useMemo(() => {
    //     return isSelect ? (
    //         <div>

	// 			<button onClick={recordSelectedTab}>记录</button>
	// 			<button onClick={discardSelectedTab}>丢弃</button>
    //             <button onClick={closeSelectedTab}>关闭</button>
    //             <button onClick={cancelSelected}>取消选择</button>

    //         </div>
    //     ) : null
    // }, [isSelect])
    return (
        <div>
            <input type="text" placeholder="搜索" onChange={(e)=>{searchTabCb(e.target.value)}}/>
            <button
                onClick={createWindow}
                onDragOver={(e) => {
                    e.preventDefault()
                }}
                onDrop={(e) => {
                    e.preventDefault()
                    const tab = JSON.parse(e.dataTransfer.getData('text/plain'))
                    // createWindowOnDropCb(tab)
                }}>
                新窗口
            </button>
            <button>分组</button>
            {/* {BtnGroupOnSelected} */}
        </div>
    )
})

export default BtnGroup
