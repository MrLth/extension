/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-12-12 14:44:53
 * @LastEditTime: 2021-04-28 18:54:07
 * @Description: tab component's type defined file
 */

export interface MyTab extends chrome.tabs.Tab {
  updateKey: number
  urlInfo: URL
  position: {
    top: number
  }
  openedTabIds?: Set<number>
}

export type DisplayMode = 'tiled' | 'tree'

export type WindowMap = Map<number, MyWindow>

export interface MyWindow {
  tabs: MyTab[]
  position: {
    top: number,
    height: number
  }
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
