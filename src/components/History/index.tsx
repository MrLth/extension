import { EmptyObject } from 'api/type'
import { NoMap, SettingsType, useConcent } from 'concent'
import * as React from 'react'
import { CtxMSConn, ItemsType } from 'types/concent'

import { sortNativeHistory } from './api'
//#region Import Style
import c from './index.module.scss'
//#endregion

const moduleName = 'history'
const connect = [] as const
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

    }
    return settings
}
//#region Type Statement
export type Settings = SettingsType<typeof setup>
type Ctx = CtxMSConn<EmptyObject, Module, State, Conn, Settings>
//#endregion
const History = (): JSX.Element => {
    const { state } = useConcent<EmptyObject, Ctx, NoMap>({ module: moduleName, setup, state: initState, connect })

    const { historyObj } = state
    return (
        <div className={c['content']}>
            {Object.keys(historyObj).map((key) =>
                <ul key={key}>
                    {historyObj[key].map((item) =>
                        <li key={item.url}>{item.title}</li>
                    )}
                </ul>
            )}
        </div>
    )
}

export default History
