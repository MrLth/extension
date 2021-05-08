/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-05-07 20:11:58
 * @LastEditTime: 2021-05-08 07:49:44
 * @Description: file content
 */

export interface BookmarkTreeNode extends chrome.bookmarks.BookmarkTreeNode {
  children?: BookmarkTreeNode[],
  folders?: BookmarkTreeNode[],
  depth?: number,
  top?: number,
  height?: number,
  isRender?: boolean,
  parent?: BookmarkTreeNode,
  updateKey?: number
}

export interface IdLinkList {
  id: string;
  next: IdLinkList
}
