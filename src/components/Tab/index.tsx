import React from 'react'
import { NoMap, SettingsType, useConcent } from 'concent'
//#region Import Type
import { Tab, Windows, WindowsAttach, Fn } from 'api/type'
import { CtxDeS } from 'types/concent'
//#endregion
//#region Import Function
import { debound, deboundFixed } from 'api'
import ht from 'components/Tab/handleTabs'
//#endregion
//#region Import Components
import Window from './Window'
import PopupFrame, { PopupFrameProps, PopupOption } from '../PopupFrame'
//#endregion
//#region Import Style
import c from './index.module.scss'
import IconFont from 'components/IconFont'
//#endregion


const MAX_REFRESH_THRESHOLD = 16

const initState = () => ({
    popupFrameProps: {
        isShow: false,
        top: 0,
        left: 0,
        options: [] as PopupOption[]
    },
    windowsObj: {} as Windows,
    windowsAttach: {} as WindowsAttach,
    windowsFiltered: {} as Windows,
    isSearching: false
})

type State = ReturnType<typeof initState>
type CtxPre = CtxDeS<Record<string, unknown>, State>

const setup = (ctx: CtxPre) => {
    const { setState, state, effect } = ctx
    const common = {
        isEventSleep: true,

    }
    const handleTabs = {
        queue: [] as Array<(windowsObj: Windows) => Windows>,
        fn: deboundFixed(() => {
            // 超过最大阈值时：使用chrome的api更新
            if (handleTabs.queue.length > MAX_REFRESH_THRESHOLD) {
                handleTabs.queue = []
                common.isEventSleep = true
                handleTabs.refreshWindowsObj(() => common.isEventSleep = false)
                return
            }
            // 默认依次处理queue
            ht.referOldWindows(state.windowsObj)
            let newWindows = ht.createNewWindows(state.windowsObj)
            for (const fn of handleTabs.queue) {
                newWindows = fn(newWindows)
            }
            handleTabs.queue = []
            ht.dereferOldWindows()

            newWindows = ht.batchUpdTabIndex(newWindows)

            setState({ windowsObj: newWindows })
        }, 200),
        refreshWindowsObj(cb?: Fn) {
            chrome.tabs.query({}, (newTabs: Tab[]) => {
                const newObj = ht.groupTabsByWindowId(newTabs)

                Object.keys(state.windowsObj).length && ht.minimalUpdate(state.windowsObj, newObj)

                setState({ windowsObj: newObj })

                cb && cb()
            })
        }
    }
    // 绑定[ window & tab ]更新事件
    effect(() => {
        handleTabs.refreshWindowsObj(() => common.isEventSleep = false)

        const onCreatedListener = (tab: chrome.tabs.Tab) => {
            if (common.isEventSleep) return
            handleTabs.queue.push((windows) => {
                return ht.addTab(windows, tab.windowId, ht.splitUrl(tab), tab.index)
            })
            handleTabs.fn()
        }
        const onUpdatedListener = (
            tabId: number,
            changeInfo: chrome.tabs.TabChangeInfo,
            tab: chrome.tabs.Tab
        ) => {
            if (common.isEventSleep) return
            if (changeInfo?.discarded) return

            handleTabs.queue.push((windows) => {
                return ht.updTab(windows, tab.windowId, ht.splitUrl(tab), tabId)
            })
            handleTabs.fn()
        }
        const onRemovedListener = (
            tabId: number,
            { windowId, isWindowClosing }: chrome.tabs.TabRemoveInfo
        ) => {
            if (common.isEventSleep) return
            const cb = isWindowClosing
                ? (windows: Windows) => {
                    return ht.removeWindow(windows, windowId)
                }
                : (windows: Windows) => {
                    return ht.removeTab(windows, windowId, tabId)
                }
            handleTabs.queue.push(cb)
            handleTabs.fn()
        }
        const onMovedListener = (
            _tabId: number,
            { windowId, fromIndex, toIndex }: chrome.tabs.TabMoveInfo
        ) => {
            if (common.isEventSleep) return

            handleTabs.queue.push((windows) => {
                return ht.moveTab(windows, windowId, fromIndex, toIndex)
            })
            handleTabs.fn()
        }
        const onActivatedListener = ({ tabId, windowId }: chrome.tabs.TabActiveInfo) => {
            if (common.isEventSleep) return

            handleTabs.queue.push((windows) => {
                return ht.avtiveTab(windows, windowId, tabId)
            })
            handleTabs.fn()
        }
        const onDetachedListener = (
            tabId: number,
            { oldWindowId, oldPosition }: chrome.tabs.TabDetachInfo
        ) => {
            if (common.isEventSleep) return

            handleTabs.queue.push((windows) => {
                return ht.detachTab(windows, oldWindowId, tabId, oldPosition)
            })
            handleTabs.fn()

        }
        const onAttachedListener = (
            tabId: number,
            { newWindowId, newPosition }: chrome.tabs.TabAttachInfo
        ) => {
            if (common.isEventSleep) return

            handleTabs.queue.push((windows) => {
                return ht.attachTab(windows, newWindowId, tabId, newPosition)
            })
            handleTabs.fn()
        }
        //#region 事件绑定
        chrome.tabs.onCreated.addListener(onCreatedListener)
        chrome.tabs.onUpdated.addListener(onUpdatedListener)
        chrome.tabs.onRemoved.addListener(onRemovedListener)
        chrome.tabs.onMoved.addListener(onMovedListener)
        chrome.tabs.onActivated.addListener(onActivatedListener)
        chrome.tabs.onDetached.addListener(onDetachedListener)
        chrome.tabs.onAttached.addListener(onAttachedListener)
        //#endregion
        //#region 事件解绑
        return () => {
            chrome.tabs.onCreated.removeListener(onCreatedListener)
            chrome.tabs.onUpdated.removeListener(onUpdatedListener)
            chrome.tabs.onRemoved.removeListener(onRemovedListener)
            chrome.tabs.onMoved.removeListener(onMovedListener)
            chrome.tabs.onActivated.removeListener(onActivatedListener)
            chrome.tabs.onDetached.removeListener(onDetachedListener)
            chrome.tabs.onAttached.removeListener(onAttachedListener)
        }
        //#endregion
    })


    const windowsAttach = {
        upd() {
            chrome.windows.getAll((windowsInfo) => {
                setState({ windowAttach: ht.groupWindowsByWindowId(windowsInfo) })
            })
        }
    }
    // 绑定[ windowsAttach ]更新事件
    effect(() => {
        windowsAttach.upd()

        const onCreatedListener = (windowsAttach: chrome.windows.Window) => {
            const newObj = { ...state.windowsAttach }
            newObj[windowsAttach.id] = windowsAttach
            setState({ windowsAttach: newObj })
        }
        const onRemovedListener = (windowId: number) => {
            const newObj = { ...state.windowsAttach }
            delete newObj[windowId]
            setState({ windowsAttach: newObj })
        }
        const onFocusChangedListener = (windowId: number) => {
            if (-1 === windowId) return

            const newObj = { ...state.windowsAttach }
            const focusedKeys = Object.keys(newObj).filter(
                (key) => newObj[key].focused
            )
            focusedKeys.map((key) => {
                newObj[key] = { ...newObj[key], focused: false }
            })

            newObj[windowId] = { ...newObj[windowId], focused: true }
            setState({ windowsAttach: newObj })
        }
        //#region 事件绑定
        chrome.windows.onCreated.addListener(onCreatedListener)
        chrome.windows.onRemoved.addListener(onRemovedListener)
        chrome.windows.onFocusChanged.addListener(onFocusChangedListener)
        //#endregion
        //#region 事件解绑
        return () => {
            chrome.windows.onCreated.removeListener(onCreatedListener)
            chrome.windows.onRemoved.removeListener(onRemovedListener)
            chrome.windows.onFocusChanged.removeListener(onFocusChangedListener)
        }
        //#endregion
    })

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
            windowsAttach.upd()
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
        closeSelectedTab: () => {
            const [selectedTabs] = ht.getSelectedTab(state.windowsObj)

            common.isEventSleep = true

            const removedCb = debound(() => {
                handleTabs.refreshWindowsObj(() => common.isEventSleep = false)
            }, 333)

            selectedTabs.map((tab) => {
                chrome.tabs.remove(tab, removedCb)
            })
        },
        discardSelectedTab: () => {
            const [selectedTabs] = ht.getSelectedTab(state.windowsObj)


            common.isEventSleep = true

            const cb = debound(() => {
                handleTabs.refreshWindowsObj(() => common.isEventSleep = false)
            }, 333)

            selectedTabs.map((tab) => {
                chrome.tabs.discard(tab, cb)
            })
        },
        cancelSelected: () => {
            const newObj: Windows = { ...state.windowsObj }
            Object.keys(newObj).map((key: keyof typeof newObj) => {
                let isUpdate = false
                newObj[key].map((tab, i) => {
                    if (tab.userSelected) {
                        isUpdate = true
                        newObj[key][i] = { ...tab, userSelected: false }
                    }
                })
                if (isUpdate) {
                    newObj[key] = [...newObj[key]]
                }
            })
            setState({ windowsObj: newObj })
        },
        searchTabCb: (text: string) => {
            if (0 === text.length) {

                state.isSearching = false
                setState({ windowsFiltered: {}, isSearching: false })
            } else {
                state.isSearching = false
                setState({ windowsFiltered: ht.searchTab(state.windowsObj, text.toUpperCase()), isSearching: false })
            }
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
        updateWindowsObj: handleTabs.refreshWindowsObj,
        handleTabsFunc: handleTabs.fn,

        //#endregion
        //#region 窗口按钮
        closeWindow: (windowId: number) => {
            chrome.windows.remove(windowId)
        },
        selectWindow: (windowId: keyof typeof state.windowsObj) => {
            const newObj: Windows = Object.assign({}, state.windowsObj)
            newObj[windowId] = [...newObj[windowId]]

            newObj[windowId].map((tab, i) => {
                if (!tab.userSelected) {
                    newObj[windowId][i] = { ...tab, userSelected: true }
                }
            })

            setState({ windowsObj: newObj })
        },
        //#endregion
        //#region 标签按钮
        duplicateTab: (tabId: number) => {
            chrome.tabs.duplicate(tabId)
        },
        discardTab: (windowId: number | string, tabId: number) => {
            chrome.tabs.discard(tabId, (tab) => {
                if (!tab) return

                handleTabs.queue.push((windows) => {
                    return ht.updTab(windows, windowId, ht.splitUrl(tab), tabId)
                })
                handleTabs.fn()
            })
        },
        //#endregion
        //#region 测试
        printTabs: () => {
            console.log('windows:', state.windowsObj)
        },
        printUrl: (isMergeWindows = true) => {
            const compareFunction = (
                a: { id: number; url: string },
                b: { id: number; url: string }
            ) => {
                if (a.url < b.url) {
                    return -1
                }
                if (a.url > b.url) {
                    return 1
                }

                return 0
            }
            const chromeHostObjArr: {
                id: number
                windowId: number
                sortUrl: string
                url: string
            }[] = []
            let hostObjArr: {
                id: number
                windowId: number
                sortUrl: string
                url: string
            }[] = []
            Object.values(state.windowsObj).forEach(tabs => {
                tabs.forEach(tab => {
                    if (tab.userProtocol?.includes('http'))
                        hostObjArr.push({
                            sortUrl: tab.userHost.split('.').reverse().join('') + tab.userRoute,
                            url: tab.url,
                            id: tab.id,
                            windowId: tab.windowId
                        })
                    else {
                        const url = tab.userProtocol
                            ? tab.userProtocol + '://' + tab.userHost
                            : tab.url
                        chromeHostObjArr.push({
                            sortUrl: url,
                            url: tab.url,
                            id: tab.id,
                            windowId: tab.windowId
                        })
                    }
                })
            })

            hostObjArr = hostObjArr
                .sort(compareFunction)
                .concat(chromeHostObjArr.sort(compareFunction))

            common.isEventSleep = true
            const tabsMovedCb = debound(() => {
                handleTabs.refreshWindowsObj(() => common.isEventSleep = false)
            }, 333)

            let lastUrl: string
            if (isMergeWindows) {
                chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
                    const firstWindowId = tab.windowId
                    hostObjArr.map(({ id, url }) => {
                        if (url === lastUrl) chrome.tabs.remove(id)
                        else {
                            chrome.tabs.move(
                                id,
                                { windowId: firstWindowId, index: -1 },
                                tabsMovedCb
                            )
                            lastUrl = url
                        }
                    })
                })
            } else {
                let lastWindowId: number
                hostObjArr.map(({ id, url, windowId }) => {
                    if (url === lastUrl && windowId === lastWindowId) chrome.tabs.remove(id)
                    else {
                        chrome.tabs.move(id, { index: -1 }, tabsMovedCb)
                        lastWindowId = windowId
                        lastUrl = url
                    }
                })
            }

            // updateWindowsObj()
            // isEventSleep.current = false
        },
        //#endregion
    }
}

export type Settings = SettingsType<typeof setup>
type Ctx = CtxDeS<Record<string, unknown>, State, Settings>

const TabComponent = (): JSX.Element => {
    const { state, settings } = useConcent<Record<string, unknown>, Ctx, NoMap>({ setup, state: initState })

    const renderWindows = state.isSearching ? state.windowsFiltered : state.windowsObj


    return (
        <>
            <div className={c['content']} style={{ minHeight: `${4.9125 + 2 * 7}rem` }}>
                <div className={c['title']}>
                    <div>TAB</div>
                    <div>
                        <IconFont type='icongit-merge-line' onClick={() => settings.printUrl(true)}></IconFont>
                        <IconFont type='iconadd' onClick={settings.createWindow}></IconFont>
                    </div>
                </div>
                {Object.keys(renderWindows).map((key: keyof typeof renderWindows) => {
                    return (
                        <Window
                            key={key}
                            tabs={renderWindows[key]}
                            windowId={key}
                            attachInfo={state.windowsAttach[key]}
                            settings={settings}
                        />
                    )
                })}
                <PopupFrame {...state.popupFrameProps} />
            </div>
        </>
    )
}

export default TabComponent