import * as React from 'react'
import { useEffect, useState, useMemo, useRef, useCallback, useContext } from 'react'
// import { connect } from "react-redux"
// import classNames = require('classnames')

import './index.scss'

import { debound, deboundFixed } from '@api'
import { Tab, CustomProps, Windows, SelectObj, WindowsAttach } from '@api/type'
import {
    splitUrl,
    selectTabs,
    minimalUpdate,
    groupTabsByWindowId,
    addTab,
    updTab,
    removeWindow,
    removeTab,
    moveTab,
    avtiveTab,
    detachTab,
    attachTab,
    createNewWindows,
    groupWindowsByWindowId,
    getSelectedTab,
    isHaveTabSelected,
    searchTab,
} from '@api/handleTabs'
// import { PopupState } from './store/popup/type'
// import { AppState } from "./store"

import PopupWindow from './PopupWindow'
import BtnGroup from './BtnGroup'
import DropDiv from './DropDiv'
import { RecordContext } from '@store/record'
import { recordActionAdds } from '@store/record/actions'
import { RecordUrl } from '@store/record/type'

export default function Popup(): JSX.Element {
    const [windows, setWindows] = useState<Windows>({})

    //#region 1. 窗口&标签信息
    const refWindows = useRef(windows)
    refWindows.current = useMemo(() => windows, [windows])

    const isEventSleep = useRef(true)

    const handleTabsQueue = useRef([] as Array<(windows: Windows) => Windows>)
    const handleTabsFunc = useCallback(
        deboundFixed(() => {
            // console.log("handleTabsQueue length", handleTabsQueue.current.length);
            if (10 < handleTabsQueue.current.length) {
                handleTabsQueue.current = []
                isEventSleep.current = true
                updateWindowsObj(() => {
                    isEventSleep.current = false
                })
            } else {
                let newWindows = createNewWindows(refWindows.current)
                handleTabsQueue.current.map((func) => {
                    newWindows = func(newWindows)
                })
                handleTabsQueue.current = []
                setWindows(newWindows)
            }
        }, 200),
        []
    )
    useEffect(() => {
        updateWindowsObj(() => {
            isEventSleep.current = false
        })

        const onCreatedListener = (tab: chrome.tabs.Tab) => {
            console.log('**************************************************Created')

            if (isEventSleep.current) return

            handleTabsQueue.current.push((windows) => {
                return addTab(windows, tab.windowId, splitUrl(tab), tab.index)
            })
            handleTabsFunc()
        }
        const onUpdatedListener = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
            console.log('**************************************************Updated')

            if (isEventSleep.current) return
            if (changeInfo?.discarded) return

            handleTabsQueue.current.push((windows) => {
                return updTab(windows, tab.windowId, splitUrl(tab), tabId)
            })
            handleTabsFunc()
        }
        const onRemovedListener = (tabId: number, { windowId, isWindowClosing }: chrome.tabs.TabRemoveInfo) => {
            if (isEventSleep.current) return
            // if (1 === windowId) return
            console.log('**************************************************Removed', tabId, windowId, isWindowClosing)

            const cb = isWindowClosing
                ? (windows: Windows) => {
                    return removeWindow(windows, windowId)
                }
                : (windows: Windows) => {
                    return removeTab(windows, windowId, tabId)
                }
            handleTabsQueue.current.push(cb)
            handleTabsFunc()
        }
        const onMovedListener = (_tabId: number, { windowId, fromIndex, toIndex }: chrome.tabs.TabMoveInfo) => {
            console.log('**************************************************Moved')

            if (isEventSleep.current) return

            handleTabsQueue.current.push((windows) => {
                return moveTab(windows, windowId, fromIndex, toIndex)
            })
            handleTabsFunc()
        }
        const onActivatedListener = ({ tabId, windowId }: chrome.tabs.TabActiveInfo) => {
            console.log('**************************************************Activated')

            if (isEventSleep.current) return

            handleTabsQueue.current.push((windows) => {
                return avtiveTab(windows, windowId, tabId)
            })
            handleTabsFunc()
        }
        const onDetachedListener = (tabId: number, { oldWindowId, oldPosition }: chrome.tabs.TabDetachInfo) => {
            console.log('**************************************************Detached')

            if (isEventSleep.current) return

            handleTabsQueue.current.push((windows) => {
                return detachTab(windows, oldWindowId, tabId, oldPosition)
            })
            handleTabsFunc()
        }
        const onAttachedListener = (tabId: number, { newWindowId, newPosition }: chrome.tabs.TabAttachInfo) => {
            console.log('**************************************************Attached')

            if (isEventSleep.current) return

            handleTabsQueue.current.push((windows) => {
                return attachTab(windows, newWindowId, tabId, newPosition)
            })
            handleTabsFunc()
        }
        // Add event listener
        chrome.tabs.onCreated.addListener(onCreatedListener)
        chrome.tabs.onUpdated.addListener(onUpdatedListener)
        chrome.tabs.onRemoved.addListener(onRemovedListener)
        chrome.tabs.onMoved.addListener(onMovedListener)
        chrome.tabs.onActivated.addListener(onActivatedListener)
        chrome.tabs.onDetached.addListener(onDetachedListener)
        chrome.tabs.onAttached.addListener(onAttachedListener)
        return () => {
            chrome.tabs.onCreated.removeListener(onCreatedListener)
            chrome.tabs.onUpdated.removeListener(onUpdatedListener)
            chrome.tabs.onRemoved.removeListener(onRemovedListener)
            chrome.tabs.onMoved.removeListener(onMovedListener)
            chrome.tabs.onActivated.removeListener(onActivatedListener)
            chrome.tabs.onDetached.removeListener(onDetachedListener)
            chrome.tabs.onAttached.removeListener(onAttachedListener)
        }
    }, [])

    const updateWindowsObj = (cb?: (...args: unknown[]) => unknown) => {
        const startTime = new Date().valueOf()
        chrome.tabs.query({}, (newTabs: Array<Tab & CustomProps>) => {
            const startQueryCbTime = new Date().valueOf() - startTime
            const newObj = groupTabsByWindowId(newTabs)

            Object.keys(refWindows.current).length && minimalUpdate(refWindows.current, newObj)

            const middleTime = new Date().valueOf() - startQueryCbTime - startTime

            setWindows(newObj)
            console.log(
                'update speed times:',
                startQueryCbTime,
                middleTime,
                new Date().valueOf() - middleTime - startQueryCbTime - startTime
            )

            cb && cb()
        })
    }
    //#endregion

    //#region 2. 窗口扩展信息
    const [windowsAttach, setWindowsAttach] = useState<WindowsAttach>({})
    const refWindowsAttach = useRef(windowsAttach)
    refWindowsAttach.current = useMemo(() => windowsAttach, [windowsAttach])

    const updateWindowsAttachProp = useCallback(() => {
        chrome.windows.getAll((windowsInfo) => {
            setWindowsAttach(groupWindowsByWindowId(windowsInfo))
        })
    }, [])
    useEffect(() => {
        updateWindowsAttachProp()
        // const onCreatedListener = ()=>{

        // }
        chrome.windows.onCreated.addListener((windowsAttach) => {
            refWindowsAttach.current[windowsAttach.id] = windowsAttach
            console.log('window create', refWindowsAttach.current)
        })
        chrome.windows.onRemoved.addListener((windowId) => {
            delete refWindowsAttach.current[windowId]
        })
        chrome.windows.onFocusChanged.addListener((windowId) => {
            if (-1 === windowId) return

            const windowsAttach = { ...refWindowsAttach.current }
            const focusedKeys = Object.keys(windowsAttach).filter((key) => windowsAttach[key].focused)
            focusedKeys.map((key) => {
                windowsAttach[key] = { ...windowsAttach[key], focused: false }
            })

            windowsAttach[windowId] = { ...windowsAttach[windowId], focused: true }
            console.log('window FocusChanged', refWindowsAttach.current, windowId)
            setWindowsAttach(windowsAttach)
        })
    }, [])

    const printWindowAttach = useCallback(() => {
        console.log('window Attach', refWindowsAttach.current)
    }, [])
    const updateWindowAttach = useCallback(() => {
        updateWindowsAttachProp()
    }, [])

    const changeWindowAttach = useCallback((windowId: number, updateInfo: chrome.windows.UpdateInfo, isCb = true) => {
        if (isCb)
            chrome.windows.update(windowId, updateInfo, (windowAttach) => {
                const windowsAttach = { ...refWindowsAttach.current }
                windowsAttach[windowAttach.id] = windowAttach

                setWindowsAttach(windowsAttach)
            })
        else chrome.windows.update(windowId, updateInfo)
    }, [])
    //#endregion

    //#region 3. 多选&拖动标签
    const isSelect = useRef(false)
    const selectObj = useRef<SelectObj>({
        startWindow: -1,
        startIndex: -1,
        endWindow: -1,
        endIndex: -1,
        status: false,
    })
    const mousedownCb = useCallback((startWindow: number, startIndex: number, status: boolean) => {
        isSelect.current = true

        selectObj.current = {
            ...selectObj.current,
            startWindow,
            startIndex,
            status: status,
        }
    }, [])
    const mouseupCb = useCallback((endWindow: number, endIndex: number) => {
        // isSelect.current = false
        if (endWindow == selectObj.current.startWindow && endIndex == selectObj.current.startIndex) return
        selectObj.current.endWindow = endWindow
        selectObj.current.endIndex = endIndex

        const newWindows = selectTabs(refWindows.current, selectObj.current)

        isSelect.current = isHaveTabSelected(newWindows)
        setWindows(newWindows)
    }, [])
    const dropCb = useCallback(
        (dragTab: Tab & CustomProps) => {
            const selectTabs: number[] = []
            Object.keys(windows).map((key: keyof typeof windows) => {
                windows[key].map((tab) => {
                    tab.userSelected && selectTabs.push(tab.id)
                })
            })

            if (selectTabs.length) {
                selectTabs.reverse().map((tabId) => {
                    chrome.tabs.move(tabId, dropInfo.current)
                })
                // chrome.tabs.move(selectTabs, dropInfo.current);
            } else {
                chrome.tabs.move(dragTab.id, dropInfo.current)
                console.log('dropInfo', dropInfo.current)
            }

            // setIsHidden(true)
            hiddenDropDiv()
        },
        [windows]
    )

    const [isHidden, setIsHidden] = useState(true)

    const dropDiv = useRef<HTMLElement>()
    const popupDiv = useRef<HTMLElement>()
    useEffect(() => {
        popupDiv.current = document.getElementById('popup')
        dropDiv.current = document.getElementById('drop-div')
    }, [])

    const hiddenDropDiv = useCallback(() => {
        popupDiv.current.appendChild(dropDiv.current)
        setIsHidden(true)
    }, [])

    const dropInfo = useRef({
        windowId: -1,
        index: -1,
    })
    const dragOverCb = useCallback((li: HTMLElement, isInsertBefore: boolean, windowId: number, tabIndex: number) => {
        dropInfo.current.windowId = windowId
        const ul = li.parentElement
        if (isInsertBefore) {
            ul.insertBefore(dropDiv.current, li)
            dropInfo.current.index = 0 != tabIndex ? tabIndex - 1 : 0
        } else {
            ul.insertBefore(dropDiv.current, li.nextElementSibling)
            dropInfo.current.index = tabIndex
        }
        setIsHidden(false)
    }, [])
    //#endregion

    //#region 4. 全局按钮
    const createWindow = useCallback(() => {
        chrome.windows.create()
    }, [])
    const createWindowOnDropCb = useCallback((dragTab: Tab & CustomProps) => {
        const selectTabs = getSelectedTab(refWindows.current)

        0 === selectTabs.length && selectTabs.push(dragTab.id)

        isEventSleep.current = true
        hiddenDropDiv()

        const tabsMovedCb = debound(() => {
            console.log('tabMovedCb')
            updateWindowsObj(() => {
                isEventSleep.current = false
            })
        }, 333)
        chrome.windows.create({ tabId: selectTabs[0] }, ({ id }) => {
            tabsMovedCb()
            const moveProperties = { windowId: id, index: -1 }
            for (let i = 1; i < selectTabs.length; i++) {
                chrome.tabs.move(selectTabs[i], moveProperties, tabsMovedCb)
            }
        })
    }, [])
    const closeSelectedTab = useCallback(() => {
        const selectedTabs = getSelectedTab(refWindows.current)

        isEventSleep.current = true

        const removedCb = debound(() => {
            updateWindowsObj(() => {
                isEventSleep.current = false
            })
        }, 333)

        selectedTabs.map((tab) => {
            chrome.tabs.remove(tab, removedCb)
        })
    }, [])
    const discardSelectedTab = useCallback(() => {
        const selectedTabs = getSelectedTab(refWindows.current)

        isEventSleep.current = true

        const removedCb = debound(() => {
            updateWindowsObj(() => {
                isEventSleep.current = false
            })
        }, 333)

        selectedTabs.map((tab) => {
            chrome.tabs.discard(tab, removedCb)
        })
    }, [])
    const cancelSelected = useCallback(() => {
        const newWindows: Windows = Object.assign({}, refWindows.current)
        Object.keys(newWindows).map((key: keyof typeof newWindows) => {
            let isUpdate = false
            newWindows[key].map((tab, i) => {
                if (tab.userSelected) {
                    isUpdate = true
                    newWindows[key][i] = { ...tab, userSelected: false }
                }
            })
            if (isUpdate) {
                newWindows[key] = [...newWindows[key]]
            }
        })
        isSelect.current = false
        setWindows(newWindows)
    }, [])
    const [searchRstWindows, setSearchRstWindows] = useState<Windows>({})
    const isSearching = useRef(false)
    const searchTabCb = useCallback((text: string) => {
        if (0 === text.length) {
            isSearching.current = false
            setSearchRstWindows({})
        } else {
            isSearching.current = true
            setSearchRstWindows(searchTab(refWindows.current, text.toUpperCase()))

        }
    }, [])
    const recordSelectedTab = useCallback(() => {
        const selectedTabs = [] as Array<RecordUrl>
        Object.keys(refWindows.current).map((key: keyof typeof windows) => {
            refWindows.current[key].map((tab) => {
                tab.userSelected && selectedTabs.push({
                    url: tab.url,
                    title: tab.title,
                    host: tab.userHost,
                    route: tab.userRoute,
                    para: tab.userPara
                })
            })
        })

        recordDispatch(recordActionAdds(selectedTabs))
    }, [])
    //#endregion

    //#region 5. 窗口按钮
    const closeWindow = useCallback((windowId: number) => {
        chrome.windows.remove(windowId)
    }, [])
    const selectWindow = useCallback((windowIdKey: keyof typeof windows) => {
        const newWindows: Windows = Object.assign({}, refWindows.current)
        newWindows[windowIdKey] = [...newWindows[windowIdKey]]

        newWindows[windowIdKey].map((tab, i) => {
            if (!tab.userSelected) {
                newWindows[windowIdKey][i] = { ...tab, userSelected: true }
            }
        })
        isSelect.current = true
        setWindows(newWindows)
    }, [])
    //#endregion

    //#region 6. 标签按钮
    const openTab = useCallback((tab: Tab & CustomProps) => {
        chrome.tabs.update(tab.id, { active: true }, () => {
            // console.log('updated tab:', tab)
        })
    }, [])
    const closeTab = useCallback((tabId: number) => {
        chrome.tabs.remove(tabId)
    }, [])
    const duplicateTab = useCallback((tabId: number) => {
        chrome.tabs.duplicate(tabId)
    }, [])
    const discardTab = useCallback((windowId: number | string, tabId: number) => {
        chrome.tabs.discard(tabId, (tab) => {
            if (!tab) return

            // setWindows(updTab(createNewWindows(refWindows.current), windowId, splitUrl(tab), tabId))
            handleTabsQueue.current.push((windows) => {
                return updTab(windows, windowId, splitUrl(tab), tabId)
            })
            handleTabsFunc()
        })
    }, [])
    //#endregion

    //#region 7. 测试
    const printTabs = useCallback(() => {
        console.log('windows:', windows)
    }, [windows])

    const printUrl = useCallback(
        (isMergeWindows = true) => {
            const compareFunction = (a: { id: number; url: string }, b: { id: number; url: string }) => {
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
            Object.keys(windows).map((key: keyof typeof windows) => {
                windows[key].map((tab) => {
                    if (tab.userProtocol?.includes('http'))
                        hostObjArr.push({
                            sortUrl: tab.userHost.split('.').reverse().join('') + tab.userRoute,
                            url: tab.url,
                            id: tab.id,
                            windowId: tab.windowId,
                        })
                    else {
                        const url = tab.userProtocol ? tab.userProtocol + '://' + tab.userHost : tab.url
                        chromeHostObjArr.push({
                            sortUrl: url,
                            url: tab.url,
                            id: tab.id,
                            windowId: tab.windowId,
                        })
                    }
                })
            })

            hostObjArr = hostObjArr.sort(compareFunction).concat(chromeHostObjArr.sort(compareFunction))

            isEventSleep.current = true
            const tabsMovedCb = debound(() => {
                updateWindowsObj(() => {
                    isEventSleep.current = false
                })
            }, 333)

            let lastUrl: string
            if (isMergeWindows) {
                chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
                    const firstWindowId = tab.windowId
                    hostObjArr.map(({ id, url }) => {
                        if (url === lastUrl) chrome.tabs.remove(id)
                        else {
                            chrome.tabs.move(id, { windowId: firstWindowId, index: -1 }, tabsMovedCb)
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
        [windows]
    )

    const printDropDiv = useCallback(() => {
        console.log('dropDiv:', dropDiv.current)
    }, [])
    const printDropInfo = useCallback(() => {
        console.log('dropInfo:', dropInfo.current)
    }, [])
    //#endregion

    const renderWindows = isSearching.current ? searchRstWindows : windows

    const { dispatch: recordDispatch } = useContext(RecordContext)

    console.log('🌀 Popup Render')
    return (
        <div id="popup">
            <div className="btn-group-wrapper">
                <button
                    onClick={() => {
                        updateWindowsObj()
                    }}>
                    refresh
                </button>
                <button onClick={printTabs}>print tabs</button>
                <button onClick={printDropDiv}>Print dropDiv</button>
                <button onClick={printDropInfo}>Print dropInfo</button>
                <button
                    onClick={() => {
                        printUrl(true)
                    }}>
                    Print printUrl merge
                </button>
                <button
                    onClick={() => {
                        printUrl(false)
                    }}>
                    Print printUrl
                </button>
                <button onClick={handleTabsFunc}>handleTabsFunc</button>
                <button onClick={printWindowAttach}>printWindowAttach</button>
                <button onClick={updateWindowAttach}>updateWindowAttach</button>
            </div>
            <div className="btn-group-wrapper">
                <BtnGroup
                    createWindow={createWindow}
                    createWindowOnDropCb={createWindowOnDropCb}
                    isSelect={isSelect.current}
                    cancelSelected={cancelSelected}
                    closeSelectedTab={closeSelectedTab}
                    discardSelectedTab={discardSelectedTab}
                    searchTabCb={searchTabCb}
                    recordSelectedTab={recordSelectedTab}
                />
            </div>
            {
                Object.keys(renderWindows).map((key: keyof typeof renderWindows) => {
                    return (
                        <PopupWindow
                            tabs={renderWindows[key]}
                            openTab={openTab}
                            windowId={key}
                            key={key}
                            mousedownCb={mousedownCb}
                            mouseupCb={mouseupCb}
                            dragOverCb={dragOverCb}
                            closeWindow={closeWindow}
                            closeTab={closeTab}
                            hiddenDropDiv={hiddenDropDiv}
                            selectWindow={selectWindow}
                            attachInfo={windowsAttach[key]}
                            changeWindowAttach={changeWindowAttach}
                            duplicateTab={duplicateTab}
                            discardTab={discardTab}
                            recordDispatch={recordDispatch}

                        />
                    )
                })}
            <DropDiv isHidden={isHidden} dropCb={dropCb} />
        </div>
    )
}

