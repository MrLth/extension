/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-13 17:35:56
 * @LastEditTime: 2020-12-14 17:01:10
 * @Description: file content
 */

import { tab } from 'models'
import { Fn } from 'utils/type'
import { MoveTab, MyTab, RemoveTab, TabMap, WindowMap } from './type'

class TabHandler {
	queue: Fn[] = []
	windows: WindowMap
	tabMap: TabMap = new Map()
	delay = 100
	private updIndexWindows = new Set<number>()
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

	createTab(tab: chrome.tabs.Tab, { immediate = false }) {
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
				this.updWindowEditTime(tab.windowId)
				// 4. 更新窗口标签索引
				this.updIndexWindows.add(tab.windowId)
			}
		}

		if (immediate) task()
		else this.push(task)
	}

	updateTab(tab: chrome.tabs.Tab) {
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
			}
			// 2. 更新窗口修改时间
			this.updWindowEditTime(tab.windowId)
		})
	}

	removeTab({ tabId, windowId, isWindowClosing }: RemoveTab) {
		this.push(() => {
			// 1. 关闭窗口
			if (isWindowClosing) return this.closeWindow(windowId)
			// 2. 或者只关闭标签
			if (this.windows.has(windowId)) {
				const { tabs } = this.windows.get(windowId)
				const i = tabs.findIndex((v) => v.id === tabId)
				tabs.splice(i, 1)
				this.tabMap.delete(tabId)
				// 3. 更新窗口修改时间
				this.updWindowEditTime(windowId)
				// 4. 更新窗口标签索引
				this.updIndexWindows.add(windowId)
			}
		})
	}

	moveTab({ tabId, windowId, toIndex }: MoveTab) {
		if (this.windows.has(windowId)){

		}
	}

	closeWindow(windowId: number) {
		if (!this.windows.has(windowId)) return
		// 1. 删除窗口下所有标签
		for (const tab of this.windows.get(windowId).tabs) {
			this.tabMap.delete(tab.id)
		}
		// 2. 关闭窗口
		this.windows.delete(windowId)
	}

	private updWindowEditTime(windowId: number) {
		if (this.windows.has(windowId))
			this.windows.get(windowId).lastEditTime = +new Date()
	}

	private push(task: Fn) {
		this.queue.push(task)
		this.run()
	}

	private run() {
		if (!this.running) {
			this.running = true
			setTimeout(() => {
				this.running = false
				for (const cb of this.queue) {
					cb()
				}
			}, this.delay)
		}
	}

	// refresh(new){

	// }
}
// Promise.all([
// 	new Promise((resolve) => chrome.tabs.query({}, (v) => resolve(v))),
// 	new Promise((resolve) => chrome.windows.getAll((v) => resolve(v))),
// ]).then(([a, b]) => {console.log(new TabHandler(a,b))})

(window as any).TabHandler = TabHandler
