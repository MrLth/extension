/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-12-12 14:44:53
 * @LastEditTime: 2020-12-16 15:29:05
 * @Description: file content
 */
import state from './state'
export type TabState = typeof state

export interface MyTab extends chrome.tabs.Tab {
	lastUpdateTime: number
	urlInfo: URL
}

export type WindowMap = Map<number, MyWindow>

export interface MyWindow {
	tabs: MyTab[]
	attach?: chrome.windows.Window
	lastEditTime: number
}

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

export interface BaseConfig {
	immediate: boolean
}
