/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-29 18:00:07
 * @LastEditTime: 2021-02-24 16:59:30
 * @Description: 整个项目会用到的接口和类型定义
 */
export type Windows = Record<string | number, Tab[]>

export type WindowsAttach = Record<string | number, chrome.windows.Window>

export interface Action {
  type: string | number
  payload: unknown
}

export interface TabsAction extends Action {
  payload: Tab[]
}

export interface Tab extends chrome.tabs.Tab {
  userSelected?: boolean
  userProtocol?: string
  userHost?: string
  userRoute?: string
  userPara?: string
}

export interface SelectObj {
  startWindow: number
  startIndex: number
  endWindow: number
  endIndex: number
  status?: boolean
  isReverse?: boolean
}

export type WindowState =
  | 'normal'
  | 'minimized'
  | 'maximized'
  | 'fullscreen'
  | 'docked'

// eslint-disable-next-line @typescript-eslint/ban-types
export type Fn = Function

export type Obj = Record<string | number, unknown>

export type Keys = Array<string | number>

export type NoElements<T> = { [P in keyof T]: never }
export type EmptyObject = NoElements<Record<string, never>>
