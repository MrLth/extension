import { EmptyObject } from 'api/type'
import Label from './Label'
import { NoMap, SettingsType, useConcent } from 'concent'
import * as React from 'react'
import { CtxMSConn, ItemsType } from 'types/concent'

import { calcHeight, sortNativeHistory } from './api'
import Domain from './Domain'
//#region Import Style
import c from './index.module.scss'
import IconFont from 'components/IconFont'
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

//#region 常量定义
const ITEM_HEIGHT = 28
//#endregion


const setup = (ctx: CtxPre) => {
    const { effect, reducer } = ctx
    const { tab } = ctx.connectedState

    const dom = {
        list: null as HTMLUListElement
    }
    const common = {
        listHeight: 0,
        listCount: 0
    }

    // 监听chrome history事件
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
        chrome.history.search({ text: '', startTime: 0, maxResults: common.listCount}, (result) => {
            const rstList = sortNativeHistory(result)
            console.log('height', calcHeight(rstList))
            reducer.history.initHistoryObj(rstList)
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

        },
        refList: {
            set current(v: HTMLUListElement) {
                console.log('setter called')
                common.listHeight = v.clientHeight
                common.listCount = Math.ceil(common.listHeight / ITEM_HEIGHT)
                dom.list = v
            },
            get current() {
                return dom.list
            }
        },
        test() {
            console.log('dom.content', dom.list)
            return dom.list
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

    const { domainHistoryList } = state

    console.log('historyObj', domainHistoryList)
    return (
        <div className={c['content']}>
            <div className={c['title']}>
                <div>History</div>
                <div>
                    <IconFont type='iconadd' onClick={() => console.log(settings.test().clientHeight)}></IconFont>

                </div>
            </div>
            <ul className={c['list']} ref={settings.refList} onScroll={()=>console.log('socll')}>
                {
                    domainHistoryList.map((item) =>
                        item.list.length > 1
                            ? <Domain key={item.list[0].lastVisitTime} domain={item.domain} list={item.list} settings={settings} />
                            : <Label key={item.list[0].lastVisitTime} item={item.list[0]} settings={settings} />
                    )
                }
            </ul>

        </div>
    )
}

export default History
