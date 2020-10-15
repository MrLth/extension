import { EmptyObject } from 'api/type'
import Label from './Label'
import { NoMap, SettingsType, useConcent } from 'concent'
import * as React from 'react'
import { CtxMSConn, ItemsType } from 'types/concent'

import { sortNativeHistory } from './api'
import Domain from './Domain'
//#region Import Style
import c from './index.module.scss'
//#endregion

const moduleName = 'history'
const connect = ['tab'] as const
const initState = () => ({
})
//#region Type Statement
type Module = typeof moduleName
type Conn = ItemsType<typeof connect>
type State = ReturnType<typeof initState>
type CtxPre = CtxMSConn<EmptyObject, Module, State, Conn>
//#endregion
const setup = (ctx: CtxPre) => {
    const { effect, reducer } = ctx
    const { tab } = ctx.connectedState

    // 监听事件
    effect(() => {
        const onVisitedListener = (result: chrome.history.HistoryItem) => {
            console.log("visited history item: ", result);
        }
        const onVisitedRemoveListener = (removed: chrome.history.RemovedResult) => {
            console.log('visited removed item:', removed);

        }

        chrome.history.onVisited.addListener(onVisitedListener)
        chrome.history.onVisitRemoved.addListener(onVisitedRemoveListener)
        return () => {
            chrome.history.onVisited.removeListener(onVisitedListener)
            chrome.history.onVisitRemoved.removeListener(onVisitedRemoveListener)
        }
    }, [])

    // 初始化historyObj
    effect(() => {
        chrome.history.search({ text: '' }, (result) => {
            reducer.history.initHistoryObj(sortNativeHistory(result))
        })
    }, [])

    const settings = {
        openLabel: (url: string) => {
            let tabInfo: {
                id: number,
                windowId: number
            } = null
            // 如果标签已经打开，则只需跳转，否则新建标签页打开
            outerFor: for (const tabs of Object.values(tab.windowsObj)) {
                for (const tab of tabs) {
                    if (tab.url === url) {
                        tabInfo = { id: tab.id, windowId: tab.windowId }
                        break outerFor
                    }
                }
            }
            if (tabInfo !== null) {
                chrome.tabs.update(tabInfo.id, { active: true })
                chrome.windows.update(tabInfo.windowId, { focused: true })
            } else {
                window.open(url)
            }

        }
    }
    return settings
}
//#region Type Statement
export type Settings = SettingsType<typeof setup>
type Ctx = CtxMSConn<EmptyObject, Module, State, Conn, Settings>
//#endregion
const History = (): JSX.Element => {
    const { state, settings } = useConcent<EmptyObject, Ctx, NoMap>({ module: moduleName, setup, state: initState, connect })

    const { historyObj } = state

    console.log('historyObj', historyObj)
    return (
        <div className={c['content']}>
            <div className={c['title']}>
                <div>History</div>
                <div>
                </div>
            </div>
            <ul className={c['list']}>
                {
                    Object.keys(historyObj).map((key) =>
                        historyObj[key].length > 1
                            ? <Domain key={key} domain={key} list={historyObj[key]} settings={settings} />
                            : <Label key={key} item={historyObj[key][0]} settings={settings} />
                    )
                }
            </ul>

        </div>
    )
}

export default History
