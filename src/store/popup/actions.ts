/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-30 20:12:51
 * @LastEditTime: 2020-05-30 20:50:40
 * @Description: file content
 */

import {Tab, TabsAction} from 'api/type'

export const enum ACTION {
    SET_TABS
}

export function setTabs(tabs:Tab[]):TabsAction{
    return {
        type: ACTION.SET_TABS,
        payload: tabs
    }
}

