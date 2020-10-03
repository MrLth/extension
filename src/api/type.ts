/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-29 18:00:07
 * @LastEditTime: 2020-10-03 18:03:39
 * @Description: 整个项目会用到的接口和类型定义
 */
export interface Windows {
    [s: string]: Array<Tab & CustomProps>
    [n: number]: Array<Tab & CustomProps>
}

export interface WindowsAttach {
    [n: number]: chrome.windows.Window
    [s: string]: chrome.windows.Window
}

export interface UpdateWindowQueueObj {
    [nIndex: number]: number
    [sIndex: string]: number
}

export interface TabsObj {
    [s: string]: Tab & CustomProps
    [n: number]: Tab & CustomProps
}


export interface Action {
    type: string | number
    payload: unknown
}

export interface TabsAction extends Action {
    payload: Tab[]
}

export interface CustomProps {
    userSelected?: boolean
    userProtocol?: string
    userHost?: string
    userRoute?: string
    userPara?: string
}

export interface Tab extends chrome.tabs.Tab{
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

export type WindowState = 'normal' | 'minimized' | 'maximized' | 'fullscreen' | 'docked'

export interface Fn {
    (...arg:unknown[]): unknown;
}