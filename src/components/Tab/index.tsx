import React from 'react'
import { NoMap, SettingsType, useConcent } from 'concent'
//#region Import Type
import { Tab, Windows, WindowsAttach, Fn, EmptyObject } from 'utils/type'
import { CtxMSConn, ItemsType } from 'utils/concent'
//#endregion
//#region Import Function
import { debound, deboundFixed, debug } from 'utils'
//#endregion
//#region Import Components
import Window from './Window'
import PopupFrame, { PopupFrameProps, PopupOption } from '../PopupFrame'
//#endregion
//#region Import Style
import c from './index.module.scss'
import IconFont from 'components/IconFont'
import { Recording } from 'models/record/state'
//#endregion



const moduleName = 'tab'
const connect = ['record'] as const

const initState = () => ({
    popupFrameProps: {
        isShow: false,
        top: 0,
        left: 0,
        options: [] as PopupOption[]
    },
    // windowsObj: {} as Windows,
    windowsAttach: {} as WindowsAttach,
    windowsFiltered: {} as Windows,
    isSearching: false
})
//#region Type Statement
type Module = typeof moduleName
type Conn = ItemsType<typeof connect>
type State = ReturnType<typeof initState>
type CtxPre = CtxMSConn<EmptyObject, Module, State, Conn>
//#endregion
const setup = (ctx: CtxPre) => {
    const { setState, state, effect, reducer } = ctx
    // const { record } = ctx.connectedState

    const common = {
        isEventSleep: false,
    }

    // 绑定[ window & tab ]更新事件
    effect(() => {
        const onCreated = (tab: chrome.tabs.Tab) => {
            if (common.isEventSleep) return
            state.tabHandler?.createTab(tab)
        }
        const onUpdated = (
            _tabId: number,
            _changeInfo: chrome.tabs.TabChangeInfo,
            tab: chrome.tabs.Tab
        ) => {
            if (common.isEventSleep) return
            state.tabHandler?.updateTab(tab)
        }
        const onRemoved = (
            tabId: number,
            { windowId, isWindowClosing }: chrome.tabs.TabRemoveInfo
        ) => {
            if (common.isEventSleep) return
            state.tabHandler?.removeTab({ tabId, windowId, isWindowClosing })
        }
        const onMoved = (
            tabId: number,
            { windowId, fromIndex, toIndex }: chrome.tabs.TabMoveInfo
        ) => {
            if (common.isEventSleep) return
            state.tabHandler?.moveTab({ tabId, windowId, fromIndex, toIndex })
        }
        const onActivated = ({ tabId, windowId }: chrome.tabs.TabActiveInfo) => {
            if (common.isEventSleep) return
            state.tabHandler?.avtiveTab({ tabId, windowId })
        }
        const onDetached = (
            tabId: number,
            { oldWindowId: windowId, oldPosition: position }: chrome.tabs.TabDetachInfo
        ) => {
            if (common.isEventSleep) return
            state.tabHandler?.detachTab({ tabId, windowId, position })
        }
        const onAttached = (
            tabId: number,
            { newWindowId: windowId, newPosition: position }: chrome.tabs.TabAttachInfo
        ) => {
            if (common.isEventSleep) return
            state.tabHandler?.attachTab({ tabId, windowId, position })
        }
        //#region 事件绑定
        chrome.tabs.onCreated.addListener(onCreated)
        chrome.tabs.onUpdated.addListener(onUpdated)
        chrome.tabs.onRemoved.addListener(onRemoved)
        chrome.tabs.onMoved.addListener(onMoved)
        chrome.tabs.onActivated.addListener(onActivated)
        chrome.tabs.onDetached.addListener(onDetached)
        chrome.tabs.onAttached.addListener(onAttached)
        //#endregion
        //#region 事件解绑
        return () => {
            chrome.tabs.onCreated.removeListener(onCreated)
            chrome.tabs.onUpdated.removeListener(onUpdated)
            chrome.tabs.onRemoved.removeListener(onRemoved)
            chrome.tabs.onMoved.removeListener(onMoved)
            chrome.tabs.onActivated.removeListener(onActivated)
            chrome.tabs.onDetached.removeListener(onDetached)
            chrome.tabs.onAttached.removeListener(onAttached)
        }
        //#endregion
    }, [])


    effect(() => {
        reducer.tab.init(null)
    }, [])

    // 绑定[ windowsAttach ]更新事件
    effect(() => {
        const onCreated = (windowsAttach: chrome.windows.Window) => {
            debug({ title: 'windows.onCreated', para: { windowsAttach } })
        }
        const onRemoved = (windowId: number) => {
            debug({ title: 'windows.onRemoved', para: { windowId } })

        }
        const onFocusChanged = (windowId: number) => {
            debug({ title: 'windows.onFocusChanged', para: { windowId } })

        }
        chrome.windows.onCreated.addListener(onCreated)
        chrome.windows.onRemoved.addListener(onRemoved)
        chrome.windows.onFocusChanged.addListener(onFocusChanged)
        return () => {
            chrome.windows.onCreated.removeListener(onCreated)
            chrome.windows.onRemoved.removeListener(onRemoved)
            chrome.windows.onFocusChanged.removeListener(onFocusChanged)
        }
    }, [])

    // Setting
    return {
        closeTab: (tabId: number) => {
            chrome.tabs.remove(tabId)
        },
        openTab: (tab: Tab) => {
            chrome.tabs.update(tab.id, { active: true })
            chrome.windows.update(tab.windowId, { focused: true })
        },
        // popupFrame
        updPopupFrameProps: (obj: PopupFrameProps) => {
            setState({ popupFrameProps: obj })
        },
        printWindowAttach: () => {
            console.log('window Attach', state.windowsAttach)
        },
        updateWindowAttach: () => {
            // windowsAttach.upd()
        },
        changeWindowAttach: (windowId: number, updateInfo: chrome.windows.UpdateInfo, isCb = true) => {
            if (isCb)
                chrome.windows.update(windowId, updateInfo, (windowAttach) => {
                    const newObj = { ...state.windowsAttach }
                    newObj[windowAttach.id] = windowAttach

                    setState({ windowAttach: newObj })
                })
            else chrome.windows.update(windowId, updateInfo)
        },
        //#region 全局按钮
        createWindow: () => {
            chrome.windows.create()
        },
        recordSelectedTab: () => {
            // const selectedTabs = [] as Array<RecordUrl>
            // Object.values(state.windowsObj).map((tabs) => {
            //     tabs.map((tab) => {
            //         tab.userSelected &&
            //             selectedTabs.push({
            //                 url: tab.url,
            //                 title: tab.title,
            //                 host: tab.userHost,
            //                 route: tab.userRoute,
            //                 para: tab.userPara
            //             })
            //     })
            // })

            // FIXME:
            // recordDispatch(recordActionAdds(selectedTabs))
        },

        //#endregion
        //#region 窗口按钮
        closeWindow: (windowId: number) => {
            chrome.windows.remove(windowId)
        },

        //#endregion
        //#region 标签按钮
        duplicateTab: (tabId: number) => {
            chrome.tabs.duplicate(tabId)
        },
        discardTab: (windowId: number | string, tabId: number) => {
            // chrome.tabs.discard(tabId, (tab) => {
            //     if (!tab) return

            //     handleTabs.queue.push((windows) => {
            //         return ht.updTab(windows, windowId, ht.splitUrl(tab), tabId)
            //     })
            //     handleTabs.fn()
            // })
        },
        //#endregion
        //#region 测试
        recordAllTab: () => {
            // const newRecording: Recording = {
            //     urls: [],
            //     recordTime: new Date()
            // }

            // Object.values(state.windowsObj).forEach((tabs) => {
            //     // concat不会改变原数组，所以这里使用push
            //     Array.prototype.push.apply(newRecording.urls, tabs.map(v => ({
            //         title: v.title,
            //         url: v.url
            //     })))
            // })

            // ctx.reducer.record.addRecord(newRecording)
        }
        //#endregion
    }
}
//#region Type Statement
export type Settings = SettingsType<typeof setup>
type Ctx = CtxMSConn<EmptyObject, Module, State, Conn, Settings>
//#endregion
const TabComponent = (): JSX.Element => {
    const { state, settings } = useConcent<EmptyObject, Ctx, NoMap>({ module: moduleName, setup, state: initState, connect })

    const { windows } = state.tabHandler ?? {}

    log({ Tab: 'Tab' }, 'render', 5)
    return (
        <>
            <div className={c['content']}>
                <div className={c['title']}>
                    <div>TAB</div>
                    <div>
                        {/* <IconFont type='iconjump_to_top' onClick={() => settings.recordAllTab()}></IconFont> */}
                        {/* <IconFont type='icongit-merge-line' onClick={() => settings.printUrl(true)}></IconFont> */}
                        {/* <IconFont type='iconadd' onClick={settings.createWindow}></IconFont> */}
                    </div>
                </div>
                <div className={c['list']}>
                    {
                        windows && [...windows.entries()].map(([k, v]) => {
                            log({ k, v })
                            return <Window
                                key={k}
                                myWindow={v}
                                settings={settings}
                                lastEditTime={v.lastEditTime}
                            />
                        })
                    }
                </div>
            </div>
            <PopupFrame {...state.popupFrameProps} />
        </>
    )
}

export default TabComponent