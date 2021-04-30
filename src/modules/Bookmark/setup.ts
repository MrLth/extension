/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-22 17:17:23
 * @LastEditTime: 2021-04-30 15:28:45
 * @Description: file content
 */
import { SettingsType, useConcent, NoMap } from 'concent';
import { CtxMSConn, ItemsType } from 'utils/type/concent';
import { EmptyObject } from 'utils/type';
import { FOLDER_TITLE_HEIGHT } from 'utils/const';
import TimeLine from 'utils/animate/TimeLine';
import Animation from 'utils/animate/Animation';
import { ease } from 'utils/animate/timing-function';
import { BookmarkTreeNode } from './model/state';

const moduleName = 'bookmark';
const connect = [] as const;
const initState = () => ({});

type Module = typeof moduleName
type Conn = ItemsType<typeof connect>
type State = ReturnType<typeof initState>
type CtxPre = CtxMSConn<EmptyObject, Module, State, Conn>

const setup = (ctx: CtxPre) => {
  const { effect, reducer } = ctx;

  const common = {
    listHeight: 0,
    timeline: new TimeLine(),
  };
  const dom = {
    list: null as HTMLUListElement,
    wrapper: null as HTMLDivElement,
  };

  function updateCallback(newTop: number) {
    // 原生的 scrollTo 加上 smooth 滚动有延迟，不加 smooth 配合 raf 又有严重的性能问题
    dom.wrapper.scrollTop = newTop
  }

  function scrollTo(target: HTMLElement, top: number) {
    const animation = new Animation({
      start: target.scrollTop,
      end: top,
      duration: 100,
      timingFunction: ease,
      updateCallback,
    })

    common.timeline
      .reset()
      .add(animation)
      .start()
  }

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
        common.listHeight = dom.wrapper.clientHeight || window.innerHeight;
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

      scrollTo(dom.wrapper, folder.top - li.getBoundingClientRect().top + FOLDER_TITLE_HEIGHT)
    },
    openTab: reducer.tab.openTab,
  };

  return settings;
};

export type Settings = SettingsType<typeof setup>
type Ctx = CtxMSConn<EmptyObject, Module, State, Conn, Settings>

const registerOptions = {
  module: moduleName,
  setup,
  state: initState,
  connect,
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default () => useConcent<EmptyObject, Ctx, NoMap>(registerOptions)
