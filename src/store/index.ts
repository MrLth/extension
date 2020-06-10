/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-30 18:38:52
 * @LastEditTime: 2020-05-31 22:36:13
 * @Description: file content
 */
import { createStore, combineReducers, applyMiddleware } from 'redux'

import thunk from 'redux-thunk'

import { groupTabsReducer } from './popup/reducers'

const rootReducer = combineReducers({
	groupTabs: groupTabsReducer
})

export type AppState = ReturnType<typeof rootReducer>

export default createStore(rootReducer, applyMiddleware(thunk))
