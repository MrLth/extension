/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-13 17:35:56
 * @LastEditTime: 2020-12-16 17:00:19
 * @Description: file content
 */

import { tab } from 'models'
import { debug, proxyMethods } from 'utils'
import { IActionCtxBase as IAC } from 'concent'
import { Fn, Obj } from 'utils/type'
import { debounce } from 'lodash'
import {
	AttachTab,
	AvtiveTab,
	DetachTab,
	BaseConfig,
	MoveTab,
	MyTab,
	RemoveTab,
	TabMap,
	TabState,
	WindowMap,
} from './type'

export class TabHandler {
	queue: Fn[] = []
	windows: WindowMap
	tabMap: TabMap = new Map()
	updIndexWindows = new Map<number, number>()
	updTimeWindows = new Set<number>()
	private running: boolean
	private updAttach: boolean

	constructor(
		nativeTabs: chrome.tabs.Tab[],
		windowsAttaches: chrome.windows.Window[]
	) {
		this.windows = nativeTabs.reduce((map, c) => {
			const myTab = this.initTab(c)
			// hashmap
			this.tabMap.set(c.id, myTab)

			if (map.has(c.windowId)) {
				map.get(c.windowId).tabs.push(myTab)
			} else {
				// initial myWindow
				map.set(c.windowId, {
					tabs: [myTab],
					attach: windowsAttaches.find((v) => v.id === c.windowId),
					lastEditTime: +new Date(),
				})
			}
			return map
		}, new Map() as WindowMap)
	}

	initTab(tab: chrome.tabs.Tab): MyTab {
		const urlStr = tab.url || tab.pendingUrl

		const urlInfo = urlStr ? new URL(urlStr) : undefined

		return Object.assign(tab, {
			lastUpdateTime: +new Date(),
			urlInfo,
		})
	}

	createTab(tab: chrome.tabs.Tab, config?: BaseConfig): void {
		const { immediate = false } = config ?? {}
		const task = () => {
			// 1. 新建
			const myTab = this.initTab(tab)
			this.tabMap.set(tab.id, myTab)
			if (this.windows.has(tab.windowId)) {
				// 2. 新建窗口
				this.windows.set(tab.windowId, {
					tabs: [myTab],
					attach: null,
					lastEditTime: +new Date(),
				})
				// 3.更新窗口信息
				this.updAttach = true
			} else {
				// 2. 添加到已有窗口
				this.windows.get(tab.windowId).tabs.splice(tab.index, 0, myTab)
				// 3. 更新窗口修改时间
				this.updTimeWindows.add(tab.windowId)
				// 4. 更新窗口标签索引
				this.updTabsWindows(tab.windowId, tab.index)
			}
		}

		log({ this: this })

		if (immediate) task()
		else this.push(task)
	}

	updateTab(tab: chrome.tabs.Tab): void {
		this.push(() => {
			if (this.tabMap.has(tab.id)) {
				// 1. 存在则更新
				this.tabMap.set(tab.id, {
					...this.tabMap.get(tab.id),
					...tab,
					lastUpdateTime: +new Date(),
				})
			} else {
				// 1. 没有就新建
				this.createTab(tab, { immediate: true })
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
			if (isWindowClosing) return this.closeWindow(windowId, { immediate: true })
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

	avtiveTab({ tabId, windowId }: AvtiveTab): void {
		this.push(() => {
			if (this.windows.has(windowId) && this.tabMap.has(tabId)) {
				// 1. 更新标签状态
				Object.assign(this.tabMap.get(tabId), {
					active: true,
					lastUpdateTime: +new Date(),
				})
				// 2. 更新窗口修改时间
				this.updTimeWindows.add(windowId)
			} else {
				// TODO: DEBUG
				log('avtiveTab', 'error', 4)
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
				tabs.splice(position, 1)

				// 2. 更新窗口修改时间
				this.updTimeWindows.add(windowId)
				// 3. 更新窗口标签索引
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

				// 2. 更新窗口修改时间
				this.updTimeWindows.add(windowId)
				// 3. 更新窗口标签索引
				this.updTabsWindows(windowId, position)
			} else {
				// TODO: DEBUG
				log('attachTab', 'error', 4)
			}
		})
	}

	closeWindow(windowId: number, config?: BaseConfig): void {
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
		else this.queue.push(task)
	}

	private updTabsWindows(windowId: number, position: number): void {
		const oldPosition = this.updIndexWindows.get(windowId) ?? Infinity
		this.updIndexWindows.set(windowId, Math.min(position, oldPosition))
	}

	private push(task: Fn) {
		this.queue.push(task)
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

	const tabHandlerProxy1 = proxyMethods({
		target: tabHandler,
		handler: debounce(() => {
			ctx.dispatch(batchUpdate)
		}, 5000),
		proxyKeys: ['push'],
	})

	const tabHandlerProxy2 = proxyMethods({
		target: tabHandlerProxy1,
		handler: (target, thisArg, args) => {
			log({ target: target.name, thisArg, args }, 'tab', 2)
		},
		ignoreKeys: ['push', 'updWindowEditTime'],
	})

	return { tabHandler: tabHandlerProxy2 }
}

function batchUpdate(_: unknown, state: TabState): Partial<TabState> {
	const { queue, updIndexWindows, updTimeWindows, windows } = state.tabHandler

	updIndexWindows.clear()
	updTimeWindows.clear()

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

	for (const [windowId, position] of updIndexWindows.entries()) {
		if (!windows.has(windowId)) continue
		const tabs = windows.get(windowId).tabs
		for (let i = position, len = tabs.length; i < len; i++) {
			tabs[i].index = i
		}
	}

	return state
}

export default { init, batchUpdate }
