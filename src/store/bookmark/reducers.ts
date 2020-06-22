/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-30 20:20:28
 * @LastEditTime: 2020-06-22 17:21:08
 * @Description: file content
 */

import {
    BookmarkAction,
    BookmarkTreeNode,
    BOOKMARK_ACTION,
    FaviconUpdItem,
    FaviconUdpAction,
    FAVICON_UDP_ACTION,
    FaviconStorageObj,
    FaviconStorageAction,
    FAVICON_STORAGE_ACTION,
    FaviconStorageItem,
} from './type'

export function BookmarksReducer(state = [] as BookmarkTreeNode[], action: BookmarkAction): BookmarkTreeNode[] {
    const { type, payload } = action
    switch (type) {
        case BOOKMARK_ACTION.INIT:
            return payload as BookmarkTreeNode[]
    }
    return state
}

export function FaviconUdpReducer(state = [] as FaviconUpdItem[], action: FaviconUdpAction): FaviconUpdItem[] {
    const { type, payload } = action
    switch (type) {
        case FAVICON_UDP_ACTION.ADD:
            return [...state, payload as FaviconUpdItem]
    }
    return state
}

export function FaviconStorageReducer(
    state = {} as FaviconStorageObj,
    action: FaviconStorageAction
): FaviconStorageObj {
    const { type, payload } = action
    let newState: FaviconStorageObj
    switch (type) {
        case FAVICON_STORAGE_ACTION.INIT:
            return payload as FaviconStorageObj
        case FAVICON_STORAGE_ACTION.ADD:
            newState = Object.assign({}, state)
            newState[(payload as FaviconStorageItem).key] = (payload as FaviconStorageItem).value
            return newState
    }
    return state
}
