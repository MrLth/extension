/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-13 17:35:56
 * @LastEditTime: 2020-10-18 14:33:59
 * @Description: file content
 */
import state, { BookmarkTreeNode } from './state'
export type BookmarkState = typeof state

const LABEL_HEIGHT = 32

function initBookmarkTree(
	bookmarkTree: BookmarkTreeNode,
	state: BookmarkState
): Partial<BookmarkState> {
	if (bookmarkTree === undefined) return

	const setNodeProps = (node: BookmarkTreeNode, depth: number): number => {
		let height = 0
		if ('children' in node) {
			node.folders = []
			node.depth = depth
			for (const child of node.children) {
				if ('children' in child) {
					node.folders.push(child)
					child.parent = node
					height += setNodeProps(child, depth + 1)
				} else {
					height += LABEL_HEIGHT
				}
			}
			node.height = height
			return height
		}

		return LABEL_HEIGHT // 正常情况下，永远也不会被执行
	}

	const setFolderTop = (folders: BookmarkTreeNode[]): void => {
		if (folders.length === 0) return
		folders[0].top = 0
		for (let i = 1, len = folders.length; i < len; i++) {
			folders[i].top = folders[i - 1].top + folders[i - 1].height
		}
	}

	setNodeProps(bookmarkTree, 0)
	setFolderTop(bookmarkTree.folders)
	console.table(bookmarkTree.folders)
	return { bookmarkTree }
}

export default { initBookmarkTree }
