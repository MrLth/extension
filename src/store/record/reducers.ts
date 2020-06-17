/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-30 20:20:28
 * @LastEditTime: 2020-06-17 23:23:08
 * @Description: file content
 */

import { RecordAction, RECORD_ACTION, RecordUrl } from './type'

export function UrlsReducer(state = [] as RecordUrl[], action: RecordAction): RecordUrl[] {
    const { type, payload } = action
    let newState: RecordUrl[]
    let index: number
    switch (type) {
        case RECORD_ACTION.INIT:
            return payload as RecordUrl[]
        case RECORD_ACTION.ADD:
            if (-1 == state.findIndex((item) => item.url === (payload as RecordUrl).url)) {
                newState = [...state, payload as RecordUrl]
                return newState
            }
            break
        case RECORD_ACTION.ADDS:
            newState = Array.from(state)
            ;(payload as RecordUrl[]).map((item) => {
                index = newState.findIndex((oldItem) => oldItem.url === item.url)
                ;-1 != index && newState.splice(index, 1)
			})
			newState = newState.concat(payload as RecordUrl[])
			return newState
    }
    return state
}
