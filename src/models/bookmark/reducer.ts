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
const FOLDER_TITLE_HEIGHT = 36

interface InitPayload {
	rootNode: BookmarkTreeNode
	listHeight: number
}
function initBookmarkTree(
	{ rootNode, listHeight }: InitPayload,
	state: BookmarkState
): Partial<BookmarkState> {
	if (rootNode === undefined) return

	const setNodeProps = (node: BookmarkTreeNode, depth: number): number => {
		let height = 0
		if ('children' in node) {
			height += FOLDER_TITLE_HEIGHT
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

	const setNodeTop = (children: BookmarkTreeNode[]): void => {
		if (children.length === 0) return
		children[0].top = 0
		for (let i = 1, len = children.length; i < len; i++) {
			children[i].top = children[i - 1].top + children[i - 1].height
			if ('children' in children[i] === false) {
				children[i].height = LABEL_HEIGHT
			}
		}
	}

	const initIsRender = (children: BookmarkTreeNode[], listHeight: number) => {
		for (const node of children) {
			node.isRender = true
			if (node.top > listHeight) break
		}
	}

	setNodeProps(rootNode, 0)
	setNodeTop(rootNode.children)
	initIsRender(rootNode.children, listHeight)
	// bookmarkTree也是一个文件夹节点，但我们不需要它显示标题
	rootNode.height -= FOLDER_TITLE_HEIGHT
	return { bookmarkTree: rootNode }
}

interface UpdIsRenderPayload {
	top: number
	bottom: number
}
function updIsRender(
	{ top, bottom }: UpdIsRenderPayload,
	state: BookmarkState
) {
	const folders = state.bookmarkTree.folders
	// init时至少会显示两个folder, 既然已经显示了就没有必要再执行了
	if (folders.length < 3) return
	let si = folders.findIndex((v) => v.top > top),
		ei = 0,
		isRefresh = false

	for (let i = si, len = folders.length; i < len; i++) {
		if (folders[i].top > bottom) {
			ei = i
			break
		}
	}

	// 更新需要显示的node的isRender
	for (
		let i = Math.max(si - 1, 0), len = Math.min(ei + 1, folders.length);
		i < len;
		i++
	) {
		if (!folders[i].isRender) {
			folders[i].isRender = true
			isRefresh = true
		}
	}
	// 存在没有被显示的才需要重渲染
	if (isRefresh) return state
}

export default { initBookmarkTree, updIsRender }
