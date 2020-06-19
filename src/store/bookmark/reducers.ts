/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-05-30 20:20:28
 * @LastEditTime: 2020-06-17 23:23:08
 * @Description: file content
 */

import { BookmarkAction, BookmarkTreeNode, BOOKMARK_ACTION } from "./type"

export function BookmarksReducer(state = [] as BookmarkTreeNode[], action: BookmarkAction): BookmarkTreeNode[] {
    const { type, payload } = action
    
    switch (type) {
        case BOOKMARK_ACTION.INIT:
            return payload as BookmarkTreeNode[]
            
    }
    return state
}
