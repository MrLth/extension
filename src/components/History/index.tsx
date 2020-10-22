import { EmptyObject } from 'api/type'
import { NoMap, SettingsType, useConcent } from 'concent'
import * as React from 'react'
import { CtxMSConn, ItemsType } from 'types/concent'

import { calcHeight, sortNativeHistory } from './api'
//#region Import Style
import c from './index.module.scss'
import IconFont from 'components/IconFont'
import { HistorySection } from 'models/history/state'
import Section from './Section'
//#endregion
//#region Time Ago Init
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { debound, sortByKey } from 'api'
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en')
const timeAgoFormat = (n: number): string => timeAgo.format(n, 'twitter')
//#endregion

import format from 'date-format'
export interface TimeUpdItem {
    timeFormatted: string,
    setTimeFormatted: React.Dispatch<React.SetStateAction<string>>,
    recordTime: number,
    title: string
}
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
const DAY = 86400000
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
        isLoading: false,
        startTime: 0
    }
    const fn = {
        loadSection(index: number, startTime: number, endTime: number) {
            if (common.isLoading) return
            common.isLoading = true
            chrome.history.search({ text: '', startTime, endTime, maxResults: 9999 }, (result) => {
                const rstList = sortNativeHistory(result)

                reducer.history.updSection({
                    index,
                    list: rstList,
                    height: calcHeight(rstList),
                    status: 'completed'
                })
                if (state.historySectionList[index + 1]?.status === 'loading') {
                    fn.loadSection(index + 1, startTime - DAY, startTime)
                } else {
                    common.isLoading = false
                }
            })
        },
        updFirstSection: debound(() => {
            const endTime = new Date().valueOf()
            chrome.history.search({ text: '', startTime: common.startTime, endTime, maxResults: 9999 }, (result) => {
                const rstList = sortNativeHistory(result)
                reducer.history.updSection({
                    index: 0,
                    list: rstList,
                    height: calcHeight(rstList),
                    status: 'completed',
                    endTime
                })
            })
        }, 1500)
    }

    // 监听chrome history事件
    effect(() => {
        const onVisitedListener = () => {
            // console.log('section loading')
            reducer.history.updSection({
                index: 0,
                status: 'loading'
            })
            fn.updFirstSection()
        }
        const onVisitedRemoveListener = (removed: chrome.history.RemovedResult) => {
            console.log('visited removed item:', removed);
            fn.updFirstSection()
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
        const initLoadSection = (top: number, startTime: number, endTime: number) => {
            chrome.history.search({ text: '', startTime, endTime, maxResults: 9999 }, (result) => {
                const rstList = sortNativeHistory(result)
                const index = state.historySectionList.length
                const height = calcHeight(rstList)
                const section: HistorySection = {
                    index,
                    top,
                    height,
                    list: rstList,
                    status: 'completed',
                    startTime,
                    endTime
                }

                reducer.history.pushNewSection(section)

                if (top + height <= common.listHeight) {
                    initLoadSection(top + height, startTime - DAY, startTime)
                }
            })
        }
        const startTime = new Date().setHours(0, 0, 0, 0)
        const endTime = startTime + DAY
        common.startTime = startTime
        initLoadSection(0, startTime, endTime)
    }, [])

    // 每秒更新一次时间
    effect(() => {
        let timerId: number
        const updTimeFormatted = () => {
            timerId = setTimeout(() => {
                updTimeFormatted()
                // console.log('time upd')
                for (const [k, v] of settings.timeUpdMap) {
                    if (typeof v.setTimeFormatted !== 'function') {
                        break
                    }
                    const timeFormatted = timeAgoFormat(v.recordTime)
                    if (timeFormatted !== v.timeFormatted) {
                        v.setTimeFormatted(timeFormatted)
                        v.timeFormatted = timeFormatted
                    }
                }
            }, 1000)
        }
        updTimeFormatted()
        return () => {
            clearTimeout(timerId)
        }
    })

    const settings = {
        openLabel: reducer.$$global.openTab,
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
        scrollCb(e: React.UIEvent<HTMLUListElement, UIEvent>) {
            e.stopPropagation()
            const viewedHeight = dom.list.scrollTop + common.listHeight


            if (viewedHeight > state.historySectionList[state.historySectionList.length - 1].top) {
                const list = state.historySectionList
                const len = state.historySectionList.length
                const theLastSection = list[len - 1]

                const startTime = theLastSection.startTime - DAY
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
        },
        timeUpdMap: new Map<number, TimeUpdItem>(),
        timeAgoFormat,
        test() {
            console.log(state.historySectionList[0].list.map(v => [v.list[0].title, v.list[0].visitTime, v.list[0].visitTime && format('hh:mm:ss', new Date(v.list[0].visitTime)), v.list[0].url]))
        },
        test1() {
            console.log(Array.from(settings.timeUpdMap).map(([k, v]) => v).sort(sortByKey<TimeUpdItem>('recordTime', true)).map(v => [v.title, format('hh:mm:ss', new Date(v.recordTime))]))
        },
    }
    return settings
}
//#region Type Statement
export type Settings = SettingsType<typeof setup>
type Ctx = CtxMSConn<EmptyObject, Module, State, Conn, Settings>
//#endregion
const History = (): JSX.Element => {
    const { state, settings } = useConcent<EmptyObject, Ctx, NoMap>({ module: moduleName, setup, state: initState, connect })
    // console.log('history render')
    return (
        <div className={c['content']}>
            <div className={c['title']}>
                <div>HISTORY</div>
                <div>
                    {/* <IconFont type='iconadd' onClick={settings.test}></IconFont> */}
                    {/* <IconFont type='iconadd' onClick={settings.test1}></IconFont> */}
                </div>
            </div>
            <ul
                ref={settings.refList}
                className={c['list']}
                style={{ position: 'relative' }}
                onScroll={settings.scrollCb}
            >
                {
                    state.historySectionList.map(section =>
                        <Section key={section.index} endTime={section.endTime} top={section.top} status={section.status} section={section} settings={settings} />
                    )
                }
            </ul>
        </div>
    )
}

export default History
