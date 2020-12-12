/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-13 17:35:56
 * @LastEditTime: 2020-12-12 17:00:36
 * @Description: file content
 */

import { Fn } from 'utils/type'
import { MyTab, TabMap, WindowMap } from './type'

class TabHandler {
	queue: Fn[] = []
	windows: WindowMap
    tabMap: TabMap = new Map()
    updateIndex:boolean
    running:boolean
    delay = 100

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

    createTab(tab: chrome.tabs.Tab){
        this.queue.push(()=>{
            const myTab = this.initTab(tab)
            this.tabMap.set(tab.id, myTab)
            this.updateIndex = true
        })
        this.run()
    }

    run(){
        if (!this.running){
            this.running = true
            setTimeout(()=>{
                this.running = false
                for (const cb of this.queue){
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
