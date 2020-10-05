import * as React from 'react'
import { memo } from 'react'

import { Tab } from 'api/type'
import Label from './Label'

//#region 样式绑定
import c from './index.module.scss'
import { moduleClassnames } from 'api'
const cn = moduleClassnames.bind(null, c)
//#endregion

import { Settings } from './index'

interface Props {
  tabs: Tab[]
  windowId: string | number
  attachInfo: chrome.windows.Window
  settings: Settings
}

const Window = (props: Props) => {
  const { tabs, settings } = props
  const tabArr = []

  const len = tabs.length
  for (let i = 0; i < len; i++) {
    let tab = tabs[i]
    let nextTab = i + 1 !== len && tabs[i + 1]

    const tempArr = []
    const key = tab.id

    if (nextTab.userHost === tab.userHost) {
      do {
        tempArr.push(
          <Label
            key={tab.id}
            tab={tab}
            index={i}
            settings={settings}
          />
        )
        i++
        tab = nextTab
        nextTab = i + 1 !== tabs.length && tabs[i + 1]
      } while (i + 1 < len && nextTab.userHost === tab.userHost)
    }

    tempArr.push(
      <Label
        key={tab.id}
        tab={tab}
        index={i}
        settings={settings}
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

  // #region
  // const jsx1 = (
  //   <>
  //     <div className={c["btn-wrapper"]}>
  //       <button
  //         onClick={(e) => {
  //           selectWindow(windowId)
  //           e.stopPropagation()
  //         }}>
  //         选择
  //       </button>
  //       {attachInfo?.state === 'minimized' ? (
  //         <button
  //           onClick={(e) => {
  //             changeWindowAttach(parseInt(windowId as string), { state: 'normal' })
  //             e.stopPropagation()
  //           }}>
  //           恢复
  //         </button>
  //       ) : (
  //           <button
  //             onClick={(e) => {
  //               changeWindowAttach(parseInt(windowId as string), { state: 'minimized' })
  //               e.stopPropagation()
  //             }}>
  //             最小化
  //           </button>
  //         )}
  //       <button
  //         onClick={(e) => {
  //           closeWindow(+windowId)
  //           e.stopPropagation()
  //         }}>
  //         关闭
  //       </button>
  //     </div>
  //   </>
  // )
  //#endregion

  return (
    <ul
      className={cn('window', {
        'focused': props.attachInfo && props.attachInfo.focused
      })}>
      <div className={cn("window-title")}>window # {props.windowId}</div>
      {tabArr}
    </ul>
  )
}

export default memo(Window)
