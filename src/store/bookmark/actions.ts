/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-06-19 15:33:43
 * @LastEditTime: 2020-06-22 17:20:31
 * @Description: file content
 */

import {
    BOOKMARK_ACTION,
    BookmarkTreeNode,
    BookmarkAction,
    FaviconUpdItem,
    FaviconUdpAction,
    FAVICON_UDP_ACTION,
    FAVICON_STORAGE_ACTION,
    FaviconStorageItem,
    FaviconStorageAction,
    FaviconStorageObj,
} from './type'

export function bookmarkActionInit(tree: BookmarkTreeNode[]): BookmarkAction {
    return {
        type: BOOKMARK_ACTION.INIT,
        payload: tree,
    }
}

export function faviconUdpActionAdd(item: FaviconUpdItem): FaviconUdpAction {
    return {
        type: FAVICON_UDP_ACTION.ADD,
        payload: item,
    }
}

export function faviconStorageActionAdd(obj: FaviconStorageObj): FaviconStorageAction {
    return {
        type: FAVICON_STORAGE_ACTION.INIT,
        payload: obj,
    }
}
export function faviconStorageActionInit(item: FaviconStorageItem): FaviconStorageAction {
    return {
        type: FAVICON_STORAGE_ACTION.ADD,
        payload: item,
    }
}
