/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-20 19:59:04
 * @LastEditTime: 2021-02-21 19:17:07
 * @Description: file content
 */
export interface BookmarkTreeNode extends chrome.bookmarks.BookmarkTreeNode {
  children?: BookmarkTreeNode[],
  folders?: BookmarkTreeNode[],
  depth?: number,
  top?: number,
  height?: number,
  isRender?: boolean,
  parent?: BookmarkTreeNode
}

export default {
  bookmarkTree: null as BookmarkTreeNode,
};
