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
import { HistorySection } from 'models/history/state'
import Section from './Section'
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
    const { effect, reducer, state } = ctx
    const { tab } = ctx.connectedState

    const dom = {
        list: null as HTMLUListElement
    }
    const common = {
        listHeight: 0,
        listCount: 0,
        isLoading: false
    }
    const fn = {
        loadSection(index: number, startTime: number, endTime: number) {
            if (common.isLoading) return
            common.isLoading = true
            chrome.history.search({ text: '', startTime, endTime, maxResults: 9999 }, (result) => {
                const rstList = sortNativeHistory(result)
                const startTime = result[result.length - 1].lastVisitTime

                reducer.history.updSection({
                    index,
                    list: rstList,
                    height: calcHeight(rstList),
                    startTime,
                    status: 'completed'
                })
                if (state.historySectionList[index + 1]?.status === 'loading') {
                    fn.loadSection(index + 1, startTime - 1000 * 60 * 60 * 24, startTime)
                } else {
                    common.isLoading = false
                }
            })
        }
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
        const startTime = new Date().setHours(0, 0, 0, 0) - 1000 * 60 * 60 * 24
        const endTime = new Date().setHours(23, 59, 59, 999)
        chrome.history.search({ text: '', startTime }, (result) => {
            const rstList = sortNativeHistory(result)

            const section: HistorySection = {
                index: 0,
                top: 12,
                height: calcHeight(rstList),
                list: rstList,
                status: 'completed',
                startTime,
                endTime
            }

            reducer.history.pushNewSection(section)
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
        },
        scrollCb(e: React.UIEvent<HTMLUListElement, UIEvent>) {
            e.stopPropagation()
            const viewedHeight = dom.list.scrollTop + common.listHeight


            if (viewedHeight > state.historySectionList[state.historySectionList.length - 1].top) {
                const list = state.historySectionList
                const len = state.historySectionList.length
                const theLastSection = list[len - 1]

                const startTime = theLastSection.startTime - 1000 * 60 * 60 * 24
                const endTime = theLastSection.startTime

                reducer.history.pushNewSection({
                    index: len,
                    top: theLastSection.top + theLastSection.height,
                    height: common.listHeight,
                    list: [],
                    status: 'loading',
                    startTime,
                    endTime
                })

                fn.loadSection(len, startTime, endTime)
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
    return (
        <div className={c['content']}>
            <div className={c['title']}>
                <div>History</div>
                <div>
                    <IconFont type='iconadd' onClick={() => console.log(settings.test().clientHeight)}></IconFont>

                </div>
            </div>
            <ul className={c['list']} ref={settings.refList} onScroll={settings.scrollCb} style={{ position: 'relative' }}>
                {
                    state.historySectionList.map(section =>
                        <Section key={section.index} status={section.status} section={section} settings={settings} />
                    )
                }
            </ul>

        </div>
    )
}

export default History
