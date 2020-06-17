/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-31 21:19:42
 * @LastEditTime: 2020-06-17 22:04:53
 * @Description: file content
 */
export interface RecordContextProps{
	urls: RecordUrl[]
	dispatch?: RecordDispatch
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

export interface RecordUrl{
	url: string
	title: string
	host?: string
	route?: string
	para?: string
}