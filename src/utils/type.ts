/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-29 18:00:07
 * @LastEditTime: 2020-12-11 14:09:29
 * @Description: 整个项目会用到的接口和类型定义
 */
export type Windows = Record<string|number, Tab[]>

export type WindowsAttach = Record<string|number, chrome.windows.Window>


export interface Action {
    type: string | number
    payload: unknown
}

export interface TabsAction extends Action {
    payload: Tab[]
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

export type NoElements<T> = { [P in keyof T]: never };
export type EmptyObject = NoElements<Record<string,never>>;