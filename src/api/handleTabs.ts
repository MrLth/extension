/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-06-07 21:58:08
 * @LastEditTime: 2020-06-22 20:09:08
 * @Description: file content
 */

import { Windows, WindowsAttach, CustomProps, Tab, SelectObj } from './type'

const windowsA = {}
const windowsB = {}
export function createNewWindows(windows: Windows): Windows {
    const windowsC = windows !== windowsA ? windowsA : windowsB
    Object.keys(windowsC).map((key: keyof typeof windowsC) => {
        delete windowsC[key]
    })
    return Object.assign(windowsC, windows)
}
function createNewWindow(windows: Windows, windowKey: keyof typeof windows) {
    if (windows[windowKey]) windows[windowKey] = [...windows[windowKey]]
    else windows[windowKey] = []
    return windows[windowKey]
}
export function addTab(
    windows: Windows,
    windowKey: keyof typeof windows,
    tab: Tab & CustomProps,
    tabIndex = -1
): Windows {
    // const newWindows = createNewWindows(windows)
    const newWindow = createNewWindow(windows, windowKey)
    if (-1 === tabIndex) newWindow.push(tab)
    else newWindow.splice(tabIndex, 0, tab)
    return windows
}
export function updTab(
    windows: Windows,
    windowKey: keyof typeof windows,
    tab: Tab & CustomProps,
    tabId: number
): Windows {
    // const newWindows = createNewWindows(windows)
    const newWindow = createNewWindow(windows, windowKey)
    const tabIndex = newWindow.findIndex((tab) => tab.id === tabId)
    if (-1 === tabIndex) newWindow.push(tab)
    else newWindow[tabIndex] = tab

    tab.active && avtiveTab(windows, windowKey, tabId, false)

    return windows
}
export function removeTab(windows: Windows, windowKey: keyof typeof windows, tabId: number): Windows {
    // const newWindows = createNewWindows(windows)
    const newWindow = createNewWindow(windows, windowKey)
    const tabIndex = newWindow.findIndex((tab) => tab.id === tabId)
    if (-1 != tabIndex) newWindow.splice(tabIndex, 1)

    return updTabIndex(windows, windowKey, false)
}
export function removeWindow(
    windows: Windows,
    windowKey: keyof typeof windows
    // isNewWindows = true
): Windows {
    // if (isNewWindows) {
    // 	windows = createNewWindows(windows)
    // }
    delete windows[windowKey]
    return windows
}
export function moveTab(windows: Windows, windowKey: keyof typeof windows, form: number, to: number): Windows {
    // const newWindows = createNewWindows(windows)
    const newWindow = createNewWindow(windows, windowKey)

    const [transit] = newWindow.splice(form, 1)
    newWindow.splice(to, 0, transit)

    return updTabIndex(windows, windowKey, false, Math.min(form, to))
}
export function updTabIndex(
    windows: Windows,
    windowKey: keyof typeof windows,
    isNewWindow = true,
    startIndex = 0
): Windows {
    let window: Array<Tab & CustomProps>
    if (isNewWindow) {
        // windows = createNewWindows(windows)
        window = createNewWindow(windows, windowKey)
    } else window = windows[windowKey]

    for (let i = startIndex; i < window.length; i++) {
        window[i].index = i
    }

    // window.map((tab, i) => (tab.index = i))

    return windows
}
export function avtiveTab(
    windows: Windows,
    windowKey: keyof typeof windows,
    tabId: number,
    isNewWindow = true
): Windows {
    let window: Array<Tab & CustomProps>

    if (isNewWindow) {
        // windows = createNewWindows(windows)
        window = createNewWindow(windows, windowKey)
    } else window = windows[windowKey]

    const oldIndex = window.findIndex((tab) => tab.active)
    const index = window.findIndex((tab) => tab.id === tabId)
    window[oldIndex] = { ...window[oldIndex], active: false }
    window[index] = { ...window[index], active: true }

    return windows
}
const transit = {} as { [n: number]: Tab & CustomProps }
export function detachTab(windows: Windows, windowKey: keyof typeof windows, tabId: number, index: number): Windows {
    // const newWindows = createNewWindows(windows)
    const newWindow = createNewWindow(windows, windowKey)

    transit[tabId] = newWindow.splice(index, 1)[0]
    console.log('transit', transit)

    if (0 === window.length) removeWindow(windows, windowKey)
    else updTabIndex(windows, windowKey, false, index)

    return windows
}
export function attachTab(windows: Windows, windowKey: keyof typeof windows, tabId: number, index: number): Windows {
    // const newWindows = createNewWindows(windows)
    const newWindow = createNewWindow(windows, windowKey)

    console.log('transit', transit)
    Object.assign(transit[tabId], { windowId: windowKey })

    newWindow.splice(index, 0, transit[tabId])
    delete transit[tabId]

    avtiveTab(windows, windowKey, index, false)

    return updTabIndex(windows, windowKey, false, index)
}

export function selectTabs(obj: Windows, selectObj: SelectObj): Windows {
    const selectWindows = getSelectWindows(obj, selectObj)
    const sortSelectObj = getSortSelectObj(selectWindows, selectObj)

    return createNewObj(obj, sortSelectObj)
}
function getSelectWindows(obj: Windows, selectObj: SelectObj): string[] {
    const { startWindow, endWindow } = selectObj

    const windowKeys = Object.keys(obj)
    const [start, end] = [windowKeys.indexOf('' + startWindow), windowKeys.indexOf('' + endWindow)].sort()

    return windowKeys.slice(start, end + 1)
}
function getSortSelectObj(selectWindows: string[], selectObj: SelectObj): SelectObj {
    let { startIndex, endIndex, startWindow, endWindow } = selectObj

    if (selectWindows[0] != '' + startWindow)
        [startWindow, endWindow, startIndex, endIndex] = [endWindow, startWindow, endIndex, startIndex]
    else if (startWindow == endWindow && startIndex > endIndex) [startIndex, endIndex] = [endIndex, startIndex]

    return { startWindow, endWindow, startIndex, endIndex, status: selectObj.status }
}
function createNewObj(obj: Windows, selectObj: SelectObj): Windows {
    const selectWindows = getSelectWindows(obj, selectObj)
    const { status, startWindow, startIndex, endWindow, endIndex } = selectObj

    const newObj: Windows = Object.assign({}, obj)
    selectWindows.map((key: keyof typeof obj) => {
        newObj[key] = [...newObj[key]]
        newObj[key].map((tab, i) => {
            if (('' + startWindow == key && i < startIndex) || ('' + endWindow == key && i > endIndex)) return

            if (status != tab.userSelected) newObj[key][i] = { ...tab, userSelected: status }
        })
    })

    return newObj
}

export function getSelectedTab(windows: Windows): number[] {
    const selectTabs: number[] = []
    Object.keys(windows).map((key: keyof typeof windows) => {
        windows[key].map((tab) => {
            tab.userSelected && selectTabs.push(tab.id)
        })
    })
    return selectTabs
}
export function isHaveTabSelected(windows: Windows): boolean {
    return (
        -1 !=
        Object.keys(windows).findIndex((key: keyof typeof windows) => {
            return (
                -1 !=
                windows[key].findIndex((tab) => {
                    return tab.userSelected
                })
            )
        })
    )
}

export function groupTabsByWindowId(tabs: Tab[]): Windows {
    const rst: Windows = {}
    tabs.map((tab: Tab & CustomProps) => {
        splitUrl(tab)
        rst[tab.windowId] = rst[tab.windowId] || []
        rst[tab.windowId].push(tab)
    })
    return rst
}
export function groupWindowsByWindowId(windows: chrome.windows.Window[]): WindowsAttach {
    const rst: WindowsAttach = {}
    windows.map((window) => {
        rst[window.id] = window
    })
    return rst
}

export function splitUrl(tab: Tab & CustomProps): Tab & CustomProps {
    const urlReg = /^(http(?:s)?|chrome.*):\/\/(.*?)\/([^\?]*)(\?.*)?/
    const url = tab.url || tab.pendingUrl

    const regRst = urlReg.exec(url)

    if (regRst) {
        tab.userProtocol = regRst[1]
        tab.userHost = regRst[2]
        tab.userRoute = regRst[3]
        tab.userPara = regRst[4]
    } else {
        console.log('splitURL', url, tab)
    }

    return tab
}

export function minimalUpdate(oldObj: Windows, newObj: Windows): Windows {
    Object.keys(newObj).map((key) => {
        if (!oldObj[key]) return
        const sameTabs = collectTheSameTabsOfOldAndNewWindow(oldObj[key], newObj[key])

        // replace window
        if (sameTabs.length == newObj[key].length) newObj[key] = oldObj[key]
        else {
            // replace sameTabs
            sameTabs.map((tab) => (newObj[key][tab.index] = tab))
        }
    })
    return newObj
}
function collectTheSameTabsOfOldAndNewWindow(oldWindow: Array<Tab & CustomProps>, newWindow: Array<Tab & CustomProps>) {
    const monitorProps = ['url', 'title', 'index', 'id', 'active']
    const sameTabs: Array<Tab & CustomProps> = []

    newWindow.map((tab, i) => {
        if (!oldWindow[i]) return
        const rstBoolArr = monitorProps.map((prop: keyof typeof tab) => tab[prop] === oldWindow[i][prop])

        // all true
        if (!rstBoolArr.includes(false)) {
            sameTabs.push(oldWindow[i])
        }
    })

    return sameTabs
}

export function searchTab(windows: Windows, text: string): Windows {
    const newWindows: Windows = {}
    Object.keys(windows).map((key: keyof typeof windows) => {
        const newWindow: (Tab & CustomProps)[] = []
        windows[key].map((tab) => {
            if (tab.url.toUpperCase().includes(text) || tab.title.toUpperCase().includes(text)) {
                newWindow.push(tab)
            }
        })
        if (newWindow.length != 0) newWindows[key] = newWindow
    })
    return newWindows
}

// function compareSelectObjWithLastSelectObj(
// 	selectWindows: string[],
// 	sortedSelectObj: SelectObj,
// 	lastSelectObj: SelectObj
// ) {
// 	const isMoreThan = (windowIndex1: number, windowIndex2: number): boolean => {
// 		return (
// 			selectWindows.indexOf(`windowId-${sortedSelectObj.startWindow}`) >
// 			selectWindows.indexOf(`windowId-${lastSelectObj.startWindow}`)
// 		)
// 	}

// 	let { startWindow, startIndex, endWindow, endIndex, status } = sortedSelectObj

// 	if (
// 		sortedSelectObj.startWindow == lastSelectObj.startWindow &&
// 		sortedSelectObj.startIndex == lastSelectObj.startIndex
// 	) {
// 		if (
// 			isMoreThan(sortedSelectObj.endWindow, lastSelectObj.endWindow) ||
// 			(sortedSelectObj.endWindow == lastSelectObj.endWindow && sortedSelectObj.endIndex > lastSelectObj.endIndex)
// 		) {
// 			startWindow = lastSelectObj.endWindow
// 			startIndex = lastSelectObj.endIndex
// 			endWindow = sortedSelectObj.endWindow
// 			endIndex = sortedSelectObj.endIndex
// 		}
// 		else {
// 			endWindow = lastSelectObj.endWindow
// 			endIndex = lastSelectObj.endIndex
// 			startWindow = sortedSelectObj.endWindow
// 			startIndex = sortedSelectObj.endIndex
// 			status = !status
// 		}
// 	}
// 	else if (
// 		sortedSelectObj.endWindow == lastSelectObj.endWindow &&
// 		sortedSelectObj.endIndex == lastSelectObj.endIndex
// 	) {
// 		if (
// 			isMoreThan(sortedSelectObj.startWindow, lastSelectObj.startWindow) ||
// 			(sortedSelectObj.startWindow == lastSelectObj.startWindow &&
// 				sortedSelectObj.startIndex > lastSelectObj.startIndex)
// 		) {
// 			startWindow = lastSelectObj.startWindow
// 			startIndex = lastSelectObj.startIndex
// 			endWindow = sortedSelectObj.startWindow
// 			endIndex = sortedSelectObj.startIndex
// 			status = !status
// 		}
// 		else {
// 			endWindow = lastSelectObj.startWindow
// 			endIndex = lastSelectObj.startIndex
// 			startWindow = sortedSelectObj.startWindow
// 			startIndex = sortedSelectObj.startIndex
// 		}
// 	}

// 	return { startWindow, startIndex, endWindow, endIndex, status }
// }
