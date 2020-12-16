import * as React from 'react'
import { memo } from 'react'

import Label from './Label'

//#region 样式绑定
import c from './index.module.scss'
import { moduleClassnames } from 'utils'
const cn = moduleClassnames.bind(null, c)
//#endregion

import { Settings } from './index'
import { MyWindow } from 'models/tab/type'

interface Props {
  myWindow: MyWindow
  settings: Settings
  updateKey: number
}

const Window = ({ myWindow, settings }: Props) => {
  const { tabs, attach } = myWindow
  const tabArr = []

  const len = tabs.length
  let nextHost: string | number, host: string | number


  for (let i = 0; i < len; i++) {
    let tab = tabs[i]
    let nextTab = i + 1 !== len && tabs[i + 1]

    const tempArr = []
    const key = tab.id

    nextHost = nextTab.urlInfo?.host ?? NaN
    host = tab.urlInfo?.host ?? NaN

    if (nextHost === host) {
      do {
        tempArr.push(
          <Label
            key={tab.id}
            tab={tab}
            updateKey={tab.updateKey}
            settings={settings}
          />
        )
        i++
        tab = nextTab
        nextTab = i + 1 !== tabs.length && tabs[i + 1]

        host = nextHost
        nextHost = nextTab.urlInfo?.host ?? NaN

      } while (i + 1 < len && nextHost === host)
    }

    tempArr.push(
      <Label
        key={tab.id}
        tab={tab}
        updateKey={tab.updateKey}
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
  log({ Window: attach.id, myWindow }, 'render', 5)
  return (
    <ul
      className={cn('window', {
        'focused': attach?.focused
      })}>
      <div className={cn("window-title")}>window # {attach?.id}</div>
      {tabArr}
    </ul>
  )
}

export default memo(Window)
