/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-22 17:17:23
 * @LastEditTime: 2021-02-23 10:06:17
 * @Description: file content
 */
import { SettingsType } from 'concent';
import { CtxMSConn, ItemsType } from 'utils/type/concent';
import { EmptyObject } from 'utils/type';
import { CARD_TITLE_HEIGHT, FOLDER_TITLE_HEIGHT } from 'utils/const';
import { BookmarkTreeNode } from './model/state';

export const moduleName = 'bookmark';
export const connect = [] as const;
export const initState = (): Record<string, unknown> => ({});

type Module = typeof moduleName
type Conn = ItemsType<typeof connect>
type State = ReturnType<typeof initState>
type CtxPre = CtxMSConn<EmptyObject, Module, State, Conn>

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const setup = (ctx: CtxPre) => {
  const { effect, reducer } = ctx;

  const common = {
    listHeight: 0,
  };
  const dom = {
    list: null as HTMLUListElement,
    wrapper: null as HTMLDivElement,
  };

  // 初始化获取 bookmarkTree
  effect(() => {
    chrome.bookmarks.getSubTree('1', (rst) => {
      reducer.bookmark.initBookmarkTree({ rootNode: rst[0], listHeight: common.listHeight });
    });
  }, []);

  const settings = {
    refList: {
      set current(v: HTMLUListElement) {
        if (!v) return
        dom.wrapper = v.parentElement as HTMLDivElement;
        common.listHeight = dom.wrapper.clientHeight;
        dom.list = v;
      },
      get current() {
        return dom.list;
      },
    },
    scrollCb(e: React.UIEvent<HTMLDivElement, UIEvent>) {
      e.stopPropagation();
      const top = dom.wrapper.scrollTop;
      const bottom = top + common.listHeight;
      // console.log('scrollCb')
      reducer.bookmark.updIsRender({ top, bottom });
    },
    scrollToShow(e: React.MouseEvent<HTMLLIElement, MouseEvent>, node: BookmarkTreeNode) {
      e.stopPropagation();

      const li = e.target as HTMLLIElement;

      const getFolder = (_node: BookmarkTreeNode): BookmarkTreeNode => {
        if ('top' in _node) {
          return _node
        }
        if ('parent' in _node) {
          return getFolder(_node.parent)
        }
        return null
      };

      const folder = getFolder(node);
      if (folder === null) return;

      dom.wrapper.scrollTo({
        top: folder.top - li.getBoundingClientRect().top + CARD_TITLE_HEIGHT + FOLDER_TITLE_HEIGHT,
      });
    },
    openTab: reducer.tab.openTab,
  };

  return settings;
};

export type Settings = SettingsType<typeof setup>
export type Ctx = CtxMSConn<EmptyObject, Module, State, Conn, Settings>

export default setup
