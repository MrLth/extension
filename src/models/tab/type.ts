/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-12-12 14:44:53
 * @LastEditTime: 2020-12-15 13:59:56
 * @Description: file content
 */
import { type } from 'utils'
import state from './state'
export type TabState = typeof state

export interface MyTab extends chrome.tabs.Tab {
	lastUpdateTime: number
	urlInfo: URL
}

export type WindowMap = Map<
	number,
	{
		tabs: MyTab[]
		attach?: chrome.windows.Window
		lastEditTime: number
	}
>

export type TabMap = Map<number, MyTab>

export interface RemoveTab {
	tabId: number
	windowId: number
	isWindowClosing: boolean
}

export interface MoveTab {
	tabId: number
	windowId: number
	toIndex: number
	fromIndex: number
}

export interface AvtiveTab {
	tabId: number
	windowId: number
}

export interface AttachTab {
	tabId: number
	windowId: number
	position: number
}

export type DetachTab = AttachTab
