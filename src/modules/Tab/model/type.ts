/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-12-12 14:44:53
 * @LastEditTime: 2021-03-07 00:11:24
 * @Description: tab component's type defined file
 */

export interface MyTab extends chrome.tabs.Tab {
  updateKey: number
  urlInfo: URL
}

export type WindowMap = Map<number, MyWindow>

export interface MyWindow {
  tabs: MyTab[]
  attach?: chrome.windows.Window
  updateKey: number
  activeTabId: number
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

export interface ActiveTab {
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

export type TabStatus = 'normal' | 'uninitialized' | 'selected'
