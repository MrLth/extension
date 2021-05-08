/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-22 17:17:23
 * @LastEditTime: 2021-05-08 11:37:11
 * @Description: file content
 */
import { SettingsType, useConcent, NoMap } from 'concent';
import { CtxMSConn, ItemsType } from 'utils/type/concent';
import { EmptyObject } from 'utils/type';
import { FOLDER_TITLE_HEIGHT } from 'utils/const';
import TimeLine from 'utils/animate/TimeLine';
import Animation from 'utils/animate/Animation';
import { ease } from 'utils/animate/timing-function';
import { generateNewKey } from 'utils';
import { BookmarkTreeNode, IdLinkList } from './model/type';

export const initLinkList: IdLinkList = { id: '', next: null }
const moduleName = 'bookmark';
const connect = [] as const;
const initState = () => ({
  clickedFolder: null as BookmarkTreeNode,
  isHidePiledOut: true,
  folderUpdateKey: Infinity,
});

type Module = typeof moduleName
type Conn = ItemsType<typeof connect>
export type State = ReturnType<typeof initState>
type CtxPre = CtxMSConn<EmptyObject, Module, State, Conn>

const setup = (ctx: CtxPre) => {
  const {
    setState, effect, reducer, state,
  } = ctx;

  const common = {
    listHeight: 0,
    timeline: new TimeLine(),
  };
  const dom = {
    list: null as HTMLUListElement,
    wrapper: null as HTMLDivElement,
  };
  const scrollInfo = {
    rafId: 0,
    currentTop: 0,
    targetTop: 0,
    unit: window.innerHeight / 175,
    dynamicSpeed: 0,
    baseSpeed: 30,
    direction: 'down' as 'down' | 'up',
  }

  function rafRun() {
    if (!dom.wrapper) {
      return
    }

    const {
      unit,
      baseSpeed,
      currentTop,
      targetTop,
      direction,
    } = scrollInfo

    if (currentTop !== targetTop) {
      scrollInfo.dynamicSpeed += unit
      const moveHeight = scrollInfo.dynamicSpeed + baseSpeed

      const isDone = direction === 'down'
        ? currentTop >= targetTop
        : currentTop <= targetTop

      // eslint-disable-next-line no-nested-ternary
      const newTop = isDone
        ? targetTop
        : (direction === 'down'
          ? Math.min(targetTop, currentTop + moveHeight)
          : Math.max(targetTop, currentTop - moveHeight))

      scrollInfo.currentTop = newTop
      dom.wrapper.scrollTop = newTop

      scrollInfo.rafId = requestAnimationFrame(rafRun)

      return
    }

    if (scrollInfo.dynamicSpeed > 0) {
      scrollInfo.dynamicSpeed -= scrollInfo.unit * 2
      scrollInfo.rafId = requestAnimationFrame(rafRun)

      return
    }

    scrollInfo.dynamicSpeed = 0
    scrollInfo.rafId = 0
  }

  function updateCallback(newTop: number) {
    // 原生的 scrollTo 加上 smooth 滚动有延迟，不加 smooth 配合 raf 又有严重的性能问题
    dom.wrapper.scrollTop = newTop
  }

  function scrollToAcceleration(newTop: number) {
    scrollInfo.direction = newTop > scrollInfo.currentTop ? 'down' : 'up'
    scrollInfo.targetTop = newTop;
    scrollInfo.dynamicSpeed += scrollInfo.unit
    if (!scrollInfo.rafId) {
      scrollInfo.rafId = requestAnimationFrame(rafRun)
    }
  }

  function scrollToEaseAnimation(newTop: number) {
    const animation = new Animation({
      start: dom.wrapper.scrollTop,
      end: newTop,
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

  // eslint-disable-next-line no-use-before-define
  let scrollToShowParasCache: Parameters<typeof scrollToShow>

  function getFolder(_node: BookmarkTreeNode): BookmarkTreeNode {
    if ('top' in _node) {
      return _node
    }
    if ('parent' in _node) {
      return getFolder(_node.parent)
    }
    return null
  }

  function scrollToShow(e: React.MouseEvent<HTMLLIElement, MouseEvent>, node: BookmarkTreeNode) {
    scrollToShowParasCache = [e, node]
    if (!state.isHidePiledOut) {
      return
    }
    e.stopPropagation();

    const li = e.target as HTMLLIElement;

    const folder = getFolder(node);
    if (folder === null) return;

    const newTop = folder.top - li.getBoundingClientRect().top + FOLDER_TITLE_HEIGHT

    scrollToAcceleration(newTop)
    // scrollToEaseAnimation(newTop)
  }

  let prevFolder: BookmarkTreeNode
  let folderUpdateKey: number

  function updateFolderKey(...folders: BookmarkTreeNode[]) {
    folderUpdateKey = generateNewKey(folderUpdateKey)
    for (let node of folders) {
      while (node && node.id !== '1') {
        node.updateKey = folderUpdateKey
        node = node.parent
      }
    }
  }

  function piledOutShow(node: BookmarkTreeNode) {
    if (!state.isHidePiledOut && state.clickedFolder.id === node.id) {
      updateFolderKey(node)
      setState({
        clickedFolder: node,
        isHidePiledOut: true,
        folderUpdateKey,
      })
      scrollToShow(...scrollToShowParasCache)
    } else {
      updateFolderKey(node, prevFolder)
      prevFolder = node
      setState({
        clickedFolder: node,
        isHidePiledOut: false,
        folderUpdateKey,
      })
    }
  }

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
      reducer.bookmark.updIsRender({ top, bottom });
    },
    scrollToShow,
    piledOutShow,
    openTab: reducer.tab.openTab,
    hidePiledOut() {
      ctx.setState({ isHidePiledOut: true })
    },
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
