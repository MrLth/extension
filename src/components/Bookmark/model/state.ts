

export interface BookmarkTreeNode extends chrome.bookmarks.BookmarkTreeNode{
	children?:BookmarkTreeNode[],
	folders?: BookmarkTreeNode[],
	depth?:number,
	top?:number,
	height?:number,
	isRender?:boolean,
	parent?:BookmarkTreeNode
}

export default {
	bookmarkTree: null as BookmarkTreeNode
}
