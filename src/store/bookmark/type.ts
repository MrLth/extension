
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



export const enum FAVICON_UDP_ACTION {
	INIT,
	ADD,
	ADDS
}
export type FaviconUdpAction = {
    type: FAVICON_UDP_ACTION
    payload: unknown
}
export interface FaviconUpdItem{
	host:string
	updCb: (...args:unknown[])=>unknown
}


export const enum FAVICON_STORAGE_ACTION {
	INIT,
	ADD,
	ADDS
}
export type FaviconStorageAction = {
    type: FAVICON_STORAGE_ACTION
    payload: unknown
}
export interface FaviconStorageObj{
	[s:string]:string
}
export interface FaviconStorageItem{
	key:string
	value:string
}