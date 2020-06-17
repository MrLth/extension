/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-30 20:12:51
 * @LastEditTime: 2020-06-17 22:38:29
 * @Description: file content
 */

import { RECORD_ACTION, RecordAction, RecordUrl } from './type'

export function recordActionInit(urls: RecordUrl[]): RecordAction {
    return {
        type: RECORD_ACTION.INIT,
        payload: urls,
    }
}

export function recordActionAdd(url: RecordUrl): RecordAction {
    return {
        type: RECORD_ACTION.ADD,
        payload: url,
    }
}

export function recordActionAdds(urls: RecordUrl[]): RecordAction {
    return {
        type: RECORD_ACTION.ADDS,
        payload: urls,
    }
}
