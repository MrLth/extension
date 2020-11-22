/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-13 17:35:56
 * @LastEditTime: 2020-11-22 21:04:58
 * @Description: file content
 */
import state, { BookmarkTreeNode } from './state'
export type BookmarkState = typeof state

const LABEL_HEIGHT = 32
const FOLDER_TITLE_HEIGHT = 40

interface InitPayload {
	rootNode: BookmarkTreeNode
	listHeight: number
}
function initBookmarkTree({
	rootNode,
	listHeight,
}: InitPayload): // state: BookmarkState
Partial<BookmarkState> {
	if (rootNode === undefined) return

	const setNodeProps = (node: BookmarkTreeNode, depth: number): number => {
		let height = 0
		node.depth = depth
		if ('children' in node) {
			height += FOLDER_TITLE_HEIGHT
			node.folders = []
			for (const child of node.children) {
				if ('children' in child) {
					node.folders.push(child)
					child.parent = node
				}
				height += setNodeProps(child, depth + 1)
			}
		}else{
			height = LABEL_HEIGHT
		}

		node.height = height
		return height
	}

	const setChildrenTop = (children: BookmarkTreeNode[], top: number): void => {
		for (let i = 0, len = children.length; i < len; i++) {
			const child = children[i]
			const childTop = i === 0 ? top : children[i - 1].top + children[i - 1].height

			child.top = childTop

			if ('children' in child === false) {
				continue
			}

			if (child.folders.length !== 0) {
				setChildrenTop(child.children, childTop + FOLDER_TITLE_HEIGHT)
			}
		}
	}

	const initRenderSate = (children: BookmarkTreeNode[], listHeight: number) => {
		for (const node of children) {
			node.isRender = true
			if (node.top > listHeight) break
		}
	}

	setNodeProps(rootNode, 0)
	setChildrenTop(rootNode.children, 0)
	initRenderSate(rootNode.children, listHeight)
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
): Partial<BookmarkState> {
	const folders = state.bookmarkTree.folders,
		foldersLen = folders.length

	// init时至少会显示两个folder, 既然已经显示了就没有必要再执行了
	if (folders.length < 3) return
	const si = folders.findIndex((v) => v.top >= top)
	let ei = 0,
		isRefresh = false

	if (si === -1) return // 正常情况下，是不存在si===-1的

	for (let i = si; i < foldersLen; i++) {
		ei = i
		if (folders[i].top > bottom) {
			break
		}
	}

	// 更新需要显示的node的isRender
	for (
		let i = Math.max(si - 1, 0), len = Math.min(ei + 1, foldersLen);
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
