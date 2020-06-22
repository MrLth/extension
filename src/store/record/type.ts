import { FaviconUdpAction, FaviconUpdItem, FaviconStorageObj, FaviconStorageAction } from "@store/bookmark/type"

/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-31 21:19:42
 * @LastEditTime: 2020-06-22 17:23:00
 * @Description: file content
 */
export interface RecordContextProps{
	urls?: RecordUrl[]
	dispatch?: RecordDispatch
	faviconUpd?: FaviconUpdItem[]
	faviconUpdDispatch?: FaviconUpdDispatch
	faviconStorage?: FaviconStorageObj
	faviconStorageDispatch?: FaviconStorageDispatch
}

export const enum RECORD_ACTION {
	INIT,
	ADD,
	ADDS
}

export type RecordAction = {
    type: RECORD_ACTION
    payload: unknown
}

export type RecordDispatch = (action:RecordAction)=>unknown
export type FaviconUpdDispatch = (action:FaviconUdpAction)=>unknown
export type FaviconStorageDispatch = (action:FaviconStorageAction)=>unknown


export interface RecordUrl{
	url: string
	title: string
	host?: string
	route?: string
	para?: string
}