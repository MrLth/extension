/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-13 17:35:56
 * @LastEditTime: 2021-01-02 22:27:47
 * @Description: file content
 */

import { debug, proxyMethods, type } from 'utils'
import { IActionCtxBase as IAC } from 'concent'
import { Fn } from 'utils/type'
import { cloneDeep, debounce } from 'lodash-es'
import {
	AttachTab,
	ActiveTab,
	DetachTab,
	BaseConfig,
	MoveTab,
	MyTab,
	RemoveTab,
	TabMap,
	TabState,
	WindowMap,
	MyWindow,
} from './type'

export class TabHandler {
	queue: Fn[] = []
	windows: WindowMap
	tabMap: TabMap = new Map()
	updIndexWindows = new Map<number, number>()
	updTimeWindows = new Set<number>()
	focusWindow: number

	constructor(
		nativeTabs: chrome.tabs.Tab[],
		windowsAttaches: chrome.windows.Window[]
	) {
		// 1. 更新 windows
		this.windows = nativeTabs.reduce((map, c) => {
			const myTab = this.initTab(c)
			// hashmap
			this.tabMap.set(c.id, myTab)

			if (map.has(c.windowId)) {
				const myWindow = map.get(c.windowId)
				// 2. 更新 tabs
				myWindow.tabs.push(myTab)
				// 3. 更新 activeTabId
				if (myTab.active) myWindow.activeTabId = myTab.id
			} else {
				// initial myWindow
				map.set(c.windowId, {
					tabs: [myTab],
					attach: windowsAttaches.find((v) => v.id === c.windowId),
					updateKey: +new Date(),
					activeTabId: myTab.id,
				})
			}
			return map
		}, new Map() as WindowMap)

		// 2. 更新当前焦点窗口
		const focusWindow = windowsAttaches.find((v) => v.focused)
		this.focusWindow = focusWindow ? focusWindow.id : -1
	}

	initTab(tab: chrome.tabs.Tab): MyTab {
		const urlStr = tab.url || tab.pendingUrl

		const urlInfo = urlStr ? new URL(urlStr) : undefined

		return Object.assign(tab, {
			updateKey: +new Date(),
			urlInfo,
		})
	}

	createWindow(attach: chrome.windows.Window): void {
		this.push(() => {
			this.windows.set(attach.id, {
				tabs: [],
				attach,
				updateKey: +new Date(),
				activeTabId: -1,
			})
		})
	}

	createTab(tab: chrome.tabs.Tab): void {
		this.push(() => {
			// 1. 新建
			const myTab = this.initTab(tab)
			this.tabMap.set(tab.id, myTab)
			if (!this.windows.has(tab.windowId)) {
				// 2. 新建窗口
				// this.windows.set(tab.windowId, {
				// 	tabs: [myTab],
				// 	attach: null,
				// 	updateKey: +new Date(),
				// })
				// // 3.更新窗口信息
				// this.updAttach = true
				// TODO: Debug
				log('createTab', 'error', 4)
			} else {
				// 2. 添加到已有窗口
				this.windows.get(tab.windowId).tabs.splice(tab.index, 0, myTab)
				// 3. 更新窗口修改时间
				this.updTimeWindows.add(tab.windowId)
				// 4. 更新窗口标签索引
				this.updTabsWindows(tab.windowId, tab.index)
			}
		})
	}

	updateTab(tab: chrome.tabs.Tab): void {
		this.push(() => {
			if (this.tabMap.has(tab.id)) {
				// 1. 存在则更新
				const myTab = this.tabMap.get(tab.id)
				Object.assign(myTab, tab)
				TabHandler.regenerateUpdateKey(myTab)
			} else {
				// TODO: DEBUG
				log('updateTab', 'error', 4)
			}
			// 2. 更新窗口修改时间
			this.updTimeWindows.add(tab.windowId)
		})
	}

	removeTab({ tabId, windowId, isWindowClosing }: RemoveTab): void {
		this.push(() => {
			// 1. 关闭窗口
			if (isWindowClosing) return this.removeWindow(windowId, { immediate: true })
			// 2. 或者只关闭标签
			if (this.windows.has(windowId)) {
				const { tabs } = this.windows.get(windowId)
				const i = tabs.findIndex((v) => v.id === tabId)
				tabs.splice(i, 1)
				this.tabMap.delete(tabId)
				// 3. 更新窗口修改时间
				this.updTimeWindows.add(windowId)
				// 4. 更新窗口标签索引
				this.updTabsWindows(windowId, i)
			}
		})
	}

	moveTab({ tabId, windowId, fromIndex, toIndex }: MoveTab): void {
		this.push(() => {
			if (this.windows.has(windowId)) {
				const { tabs } = this.windows.get(windowId)
				// 1. 优先使用 fromIndex
				if (tabs[fromIndex].id !== tabId) {
					// 2. 获取初始位置
					const i = tabs.findIndex((v) => v.id === tabId)
					if (i === -1) {
						// TODO: DEBUG
						log('moveTab 1', 'error', 4)
						return
					}
					fromIndex = i
				}
				// 3. 更新位置
				const [myTab] = tabs.splice(fromIndex, 1)
				tabs.splice(toIndex, 0, myTab)
				// 4. 更新窗口修改时间
				this.updTimeWindows.add(windowId)
				// 5. 更新窗口标签索引
				this.updTabsWindows(windowId, Math.min(fromIndex, toIndex))
			} else {
				// TODO: DEBUG
				log('moveTab 2', 'error', 4)
			}
		})
	}

	activeTab({ tabId, windowId }: ActiveTab): void {
		this.push(() => {
			if (this.windows.has(windowId) && this.tabMap.has(tabId)) {
				// 1. 更新标签状态
				const tab = this.tabMap.get(tabId)
				tab.active = true
				// 2. 取消上次焦点的标签
				const myWindow = this.windows.get(windowId)
				if (this.tabMap.has(myWindow.activeTabId)) {
					const last = this.tabMap.get(myWindow.activeTabId)
					last.active = false
					TabHandler.regenerateUpdateKey(last)
				} else {
					log({ activeTab: myWindow.activeTabId }, 'error', 4)
				}
				// 3. 更新标签
				TabHandler.regenerateUpdateKey(tab)
				// 4. 更新窗口 activeTabId
				myWindow.activeTabId = tabId
				// 5. 更新窗口
				this.updTimeWindows.add(windowId)
			} else {
				// TODO: DEBUG
				log('activeTab', 'error', 4)
			}
		})
	}

	detachTab({ tabId, windowId, position }: DetachTab): void {
		this.push(() => {
			if (this.windows.has(windowId) && this.tabMap.has(tabId)) {
				const { tabs } = this.windows.get(windowId)
				// 1. 获取正确的 position
				if (tabs[position].id !== tabId) {
					const i = tabs.findIndex((v) => v.id === tabId)
					if (i === -1) {
						// TODO: DEBUG
						log('detachTab 1', 'error', 4)
						return
					}
					position = i
				}
				// 2. 从原来的窗口中移除
				tabs.splice(position, 1)
				// 3. 更改 windowId
				this.tabMap.get(tabId).windowId = null
				// 4. 更新窗口修改时间
				this.updTimeWindows.add(windowId)
				// 5. 更新窗口标签索引
				this.updTabsWindows(windowId, position)
			} else {
				// TODO: DEBUG
				log('detachTab 2', 'error', 4)
			}
		})
	}

	attachTab({ tabId, windowId, position }: AttachTab): void {
		this.push(() => {
			if (this.windows.has(windowId) && this.tabMap.has(tabId)) {
				const { tabs } = this.windows.get(windowId)
				// 1. 加入窗口
				tabs.splice(position, 0, this.tabMap.get(tabId))
				// 2. 更新 windowId
				this.tabMap.get(tabId).windowId = windowId
				// 3. 更新窗口修改时间
				this.updTimeWindows.add(windowId)
				// 4. 更新窗口标签索引
				this.updTabsWindows(windowId, position)
			} else {
				// TODO: DEBUG
				log('attachTab', 'error', 4)
			}
		})
	}

	removeWindow(windowId: number, config?: BaseConfig): void {
		const { immediate = false } = config ?? {}
		const task = () => {
			if (!this.windows.has(windowId)) return
			// 1. 删除窗口下所有标签
			for (const tab of this.windows.get(windowId).tabs) {
				this.tabMap.delete(tab.id)
			}
			// 2. 关闭窗口
			this.windows.delete(windowId)
		}
		if (immediate) task()
		else this.push(task)
	}

	changeFocusWindow(windowId: number): void {
		this.push(() => {
			// 1. 只处理正确获取焦点
			if (windowId === -1) return
			// 2. blur
			if (this.windows.has(this.focusWindow))
				this.windows.get(this.focusWindow).attach.focused = false
			// 3. focus
			if (this.windows.has(windowId))
				this.windows.get(windowId).attach.focused = true
			// 4. update window updateKey
			this.updTimeWindows.add(this.focusWindow)
			this.updTimeWindows.add(windowId)
			// 5. update cache
			this.focusWindow = windowId
		})
	}

	private updTabsWindows(windowId: number, position: number): void {
		const oldPosition = this.updIndexWindows.get(windowId) ?? Infinity
		this.updIndexWindows.set(windowId, Math.min(position, oldPosition))
	}

	private push(task: Fn) {
		this.queue.push(task)
	}

	static regenerateUpdateKey(obj: MyWindow | MyTab): void {
		let newKey
		do {
			newKey = +new Date() * 100 + ((Math.random() * 100) | 0)
		} while (newKey === obj.updateKey)
		obj.updateKey = newKey
	}
}

async function init(
	_?: unknown,
	_state?: TabState,
	ctx?: IAC
): Promise<Partial<TabState>> {
	const [nativeTabs, windowsAttaches] = (await Promise.all([
		new Promise((resolve) => chrome.tabs.query({}, (v) => resolve(v))),
		new Promise((resolve) => chrome.windows.getAll((v) => resolve(v))),
	])) as [chrome.tabs.Tab[], chrome.windows.Window[]]

	const tabHandler = new TabHandler(nativeTabs, windowsAttaches)

	const proxyA = proxyMethods({
		target: tabHandler,
		handler: debounce(() => {
			ctx.dispatch(batchUpdate)
		}),
		proxyKeys: ['push'],
	})

	const proxyB = proxyMethods({
		target: proxyA,
		handler: (target, _thisArg, args) => {
			log({ target: target.name, args }, 'batch', 2)
		},
		ignoreKeys: ['push'],
	})

	return { tabHandler: proxyB }
}

function batchUpdate(_: unknown, state: TabState): Partial<TabState> {
	const { queue, updIndexWindows, updTimeWindows, windows } = state.tabHandler

	updIndexWindows.clear()
	updTimeWindows.clear()

	const tabHandler = cloneDeep(state.tabHandler)
	debug({
		title: `tab / batchUpdate before`,
		multi: {
			tabHandler,
		},
	})

	// 1. 执行更新任务
	for (const fn of queue) {
		try {
			fn()
		} catch (e) {
			debug({
				title: 'batchUpdate Error',
				multi: {
					e,
					queue,
					fn,
				},
				color: 4,
			})
		}
	}
	// 2. 清空队列
	queue.length = 0
	// 3. 更新索引
	for (const [windowId, position] of updIndexWindows.entries()) {
		if (!windows.has(windowId)) continue
		const tabs = windows.get(windowId).tabs
		for (let i = position, len = tabs.length; i < len; i++) {
			tabs[i].index = i
		}
	}
	// 4. 更新窗口修改时间
	for (const windowId of updTimeWindows.values()) {
		if (!windows.has(windowId)) continue
		TabHandler.regenerateUpdateKey(windows.get(windowId))
	}

	return state
}

function openTab(tab: chrome.tabs.Tab | string, state: TabState): void {
	if (typeof tab === 'string') {
		for (const v of state.tabHandler.tabMap.values()) {
			if (v.url === tab) {
				tab = v
				break
			}
		}
		if (typeof tab === 'string') {
			const url = new URL(tab)
			if (!url) return
			window.open(url.href)
			return
		}
	}
	chrome.tabs.update(tab.id, { active: true })
	chrome.windows.update(tab.windowId, { focused: true })
}

export default { init, batchUpdate, openTab }
