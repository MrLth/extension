/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-29 18:00:07
 * @LastEditTime: 2020-06-16 21:02:06
 * @Description: 整个项目会用到的接口和类型定义
 */
export interface Windows {
	[s: string]: Array<Tab & CustomProps>
	[n: number]: Array<Tab & CustomProps>
}

export interface WindowsAttach{
	[n:number]: chrome.windows.Window
	[s:string]: chrome.windows.Window
}

export interface TabsObj {
	[s: string]: Tab & CustomProps
	[n: number]: Tab & CustomProps
}

export import Tab = chrome.tabs.Tab

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

export interface SelectObj {
	startWindow: number
	startIndex: number
	endWindow: number
	endIndex: number
	status?: boolean
	lastSelectObj?: SelectObj
}


export type WindowState =  "normal"| "minimized" | "maximized" | "fullscreen" |"docked"
