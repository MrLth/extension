/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-30 20:20:28
 * @LastEditTime: 2020-06-17 16:02:18
 * @Description: file content
 */
import { ACTION } from './actions'

import { Tab, TabsAction, CustomProps, Windows } from '../../api/type'

export function groupTabsReducer (
	state: Windows = {},
	action: TabsAction
): Windows{
	const { type, payload } = action
	switch (type) {
		case ACTION.SET_TABS:
			return state
	}
	return state
}
