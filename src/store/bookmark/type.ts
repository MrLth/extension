
export const enum BOOKMARK_ACTION {
	INIT,
	ADD,
	ADDS
}

export type BookmarkAction = {
    type: BOOKMARK_ACTION 
    payload: unknown
}

export type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode
