/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-12-17 14:32:20
 * @LastEditTime: 2020-12-20 15:19:22
 * @Description: 让当前活动标签可视
 */

import { debounce } from 'lodash'
import { LABEL_HEIGHT, WINDOW_TITLE_HEIGHT } from 'models/tab/const'
import { TabState } from 'models/tab/type'
import { MutableRefObject, useEffect, useRef } from 'react'

const effect = debounce(
	(state: TabState, listRef: MutableRefObject<HTMLDivElement>) => {
		if (!state.tabHandler || !listRef.current) return
		const { windows, tabMap } = state.tabHandler

		// 1. 计算标签的 scrollTop
		let tabTop = 0
		for (const v of windows.values()) {
			if (v.attach.focused) {
				tabTop +=
					tabMap.get(v.activeTabId).index * LABEL_HEIGHT + WINDOW_TITLE_HEIGHT
				break
			}
			tabTop += v.tabs.length * LABEL_HEIGHT + WINDOW_TITLE_HEIGHT
		}

		// 2. 不可视 => 可视
		const listHeight = listRef.current.clientHeight
		const listScrollTop = listRef.current.scrollTop
		// 2.1 不可视 => 显示在底部
		if (tabTop > listHeight + listScrollTop) {
			listRef.current.scrollTo({
				top: tabTop - listHeight + LABEL_HEIGHT,
			})
			return
		}
		// 2.1 不可视 => 显示在顶部
		if (tabTop < listScrollTop) {
			listRef.current.scrollTo({
				top: tabTop,
			})
		}
	},
	200
)

export default (
	state: TabState
): {
	listRef: MutableRefObject<HTMLDivElement>
} => {
	const listRef = useRef<HTMLDivElement>()

	const focusWindowId = state.tabHandler?.focusWindow
	const focusTabId = state.tabHandler?.windows.get(focusWindowId)?.activeTabId

	useEffect(() => {
		/** 1. 延迟执行，避免从其它窗口切回时，click 事件无法响应
		 * 出现原因：
		 *    当从其它窗口切回当前窗口时，会优先响应 focus 事件，这个事件会被 TabHandler 捕获并执行，触发重渲染并更改 focusWindowId,
		 * 然后在还没有响应 click 事件前就执行了 effect，造成不符合预期的 BUG
		 */
		effect(state, listRef)
	}, [focusTabId])

	return { listRef }
}
