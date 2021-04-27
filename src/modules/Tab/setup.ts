/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-22 23:45:29
 * @LastEditTime: 2021-04-27 15:37:50
 * @Description: file content
 */
import { NoMap, SettingsType, useConcent } from 'concent';
import {
  Windows, WindowsAttach, EmptyObject, Tab,
} from 'utils/type';
import { CtxMSConn, ItemsType } from 'utils/type/concent';
import { PopupFrameProps, PopupOption } from 'components/PopupFrame';
import { RecordUrl } from 'modules/Record/model/state';
import { FOLDER_TITLE_HEIGHT, LABEL_HEIGHT } from 'utils/const';
import { TabStatus } from './model/type';

const moduleName = 'tab';
const connect = ['record'] as const;

const initState = () => ({
  popupFrameProps: {
    isShow: false,
    top: 0,
    left: 0,
    options: [] as PopupOption[],
  },
  // windowsObj: {} as Windows,
  windowsAttach: {} as WindowsAttach,
  windowsFiltered: {} as Windows,
  isSearching: false,
  selectedTabs: new Set<Tab>(),
  status: 'normal' as TabStatus,
  dragHoverTop: -1,
});

type Module = typeof moduleName
type Conn = ItemsType<typeof connect>
type State = ReturnType<typeof initState>
type CtxPre = CtxMSConn<EmptyObject, Module, State, Conn>

const setup = (ctx: CtxPre) => {
  const {
    setState, state, effect, reducer,
  } = ctx;

  const common = {
    isEventSleep: false,
    selectedStartTab: null as Tab,
  };

  function computedTabTop(tab: Tab, windowId?: number): number {
    const { windows } = state.tabHandler

    let windowCount = 0
    let tabCount = 0

    for (const [_windowId, windowObj] of windows) {
      windowCount += 1
      if (windowId === _windowId) {
        break;
      }
      if (tab && _windowId === tab.windowId) {
        tabCount += tab.index + 1
        break;
      }
      tabCount += windowObj.tabs.length;
    }

    return windowCount * FOLDER_TITLE_HEIGHT + tabCount * LABEL_HEIGHT
  }

  effect(() => {
    reducer.tab.init(null);
  }, []);
  // 绑定[ window & tab ]更新事件
  effect(() => {
    const onCreated = (tab: chrome.tabs.Tab) => {
      if (common.isEventSleep) return;
      state.tabHandler?.createTab(tab);
    };
    const onUpdated = (
      _tabId: number,
      _changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab,
    ) => {
      if (common.isEventSleep) return;
      state.tabHandler?.updateTab(tab);
    };
    const onRemoved = (
      tabId: number,
      { windowId, isWindowClosing }: chrome.tabs.TabRemoveInfo,
    ) => {
      if (common.isEventSleep) return;
      state.tabHandler?.removeTab({ tabId, windowId, isWindowClosing });
    };
    const onMoved = (
      tabId: number,
      { windowId, fromIndex, toIndex }: chrome.tabs.TabMoveInfo,
    ) => {
      if (common.isEventSleep) return;
      state.tabHandler?.moveTab({
        tabId, windowId, fromIndex, toIndex,
      });
    };
    const onActivated = ({ tabId, windowId }: chrome.tabs.TabActiveInfo) => {
      if (common.isEventSleep) return;
      state.tabHandler?.activeTab({ tabId, windowId });
    };
    const onDetached = (
      tabId: number,
      { oldWindowId: windowId, oldPosition: position }: chrome.tabs.TabDetachInfo,
    ) => {
      if (common.isEventSleep) return;
      state.tabHandler?.detachTab({ tabId, windowId, position });
    };
    const onAttached = (
      tabId: number,
      { newWindowId: windowId, newPosition: position }: chrome.tabs.TabAttachInfo,
    ) => {
      if (common.isEventSleep) return;
      state.tabHandler?.attachTab({ tabId, windowId, position });
    };
    // #region 事件绑定
    chrome.tabs.onCreated.addListener(onCreated);
    chrome.tabs.onUpdated.addListener(onUpdated);
    chrome.tabs.onRemoved.addListener(onRemoved);
    chrome.tabs.onMoved.addListener(onMoved);
    chrome.tabs.onActivated.addListener(onActivated);
    chrome.tabs.onDetached.addListener(onDetached);
    chrome.tabs.onAttached.addListener(onAttached);
    // #endregion
    // #region 事件解绑
    return () => {
      chrome.tabs.onCreated.removeListener(onCreated);
      chrome.tabs.onUpdated.removeListener(onUpdated);
      chrome.tabs.onRemoved.removeListener(onRemoved);
      chrome.tabs.onMoved.removeListener(onMoved);
      chrome.tabs.onActivated.removeListener(onActivated);
      chrome.tabs.onDetached.removeListener(onDetached);
      chrome.tabs.onAttached.removeListener(onAttached);
    };
    // #endregion
  }, []);
  // 绑定[ windowsAttach ]更新事件
  effect(() => {
    const onCreated = (attach: chrome.windows.Window) => {
      if (common.isEventSleep) return;
      state.tabHandler?.createWindow(attach);
    };
    const onRemoved = (windowId: number) => {
      if (common.isEventSleep) return;
      state.tabHandler?.removeWindow(windowId);
    };
    const onFocusChanged = (windowId: number) => {
      if (common.isEventSleep) return;
      state.tabHandler?.changeFocusWindow(windowId);
    };
    chrome.windows.onCreated.addListener(onCreated);
    chrome.windows.onRemoved.addListener(onRemoved);
    chrome.windows.onFocusChanged.addListener(onFocusChanged);
    return () => {
      chrome.windows.onCreated.removeListener(onCreated);
      chrome.windows.onRemoved.removeListener(onRemoved);
      chrome.windows.onFocusChanged.removeListener(onFocusChanged);
    };
  }, []);

  return {
    closeTab: (tabId: number) => {
      chrome.tabs.remove(tabId);
    },
    openTab: (tab: Tab) => {
      if (state.status === 'selected') {
        common.selectedStartTab = null
        setState({ selectedTabs: new Set<Tab>(), status: 'normal' })
      } else {
        reducer.tab.openTab(tab)
      }
    },
    // popupFrame
    updPopupFrameProps: (obj: PopupFrameProps) => {
      setState({ popupFrameProps: { ...state.popupFrameProps, ...obj } });
    },
    printWindowAttach: () => {
      console.log('window Attach', state.windowsAttach);
    },
    updateWindowAttach: () => {
      // windowsAttach.upd()
    },
    changeWindowAttach: (windowId: number, updateInfo: chrome.windows.UpdateInfo, isCb = true) => {
      if (isCb) {
        chrome.windows.update(windowId, updateInfo, (windowAttach) => {
          const newObj = { ...state.windowsAttach };
          newObj[windowAttach.id] = windowAttach;

          setState({ windowAttach: newObj });
        });
      } else chrome.windows.update(windowId, updateInfo);
    },
    // #region 全局按钮
    createWindow: () => {
      chrome.windows.create();
    },

    // #endregion
    // #region 窗口按钮
    closeWindow: (windowId: number) => {
      chrome.windows.remove(windowId);
    },
    // #endregion

    // #region 标签按钮
    duplicateTab: (tabId: number) => {
      chrome.tabs.duplicate(tabId);
    },
    recordTab: (tab: Tab) => {
      const urls: RecordUrl[] = state.selectedTabs.size === 0 || !state.selectedTabs.has(tab)
        ? [{
          title: tab.title,
          url: tab.url,
        }]
        : [...state.selectedTabs.values()].map((t) => ({
          title: t.title,
          url: t.url,
        }))

      reducer.record.addRecord({
        urls,
        recordTime: new Date(),
      })

      common.selectedStartTab = null
      setState({
        selectedTabs: new Set<Tab>(),
        status: 'normal',
        popupFrameProps: {
          ...state.popupFrameProps,
          isShow: false,
        },
      })
    },
    recordWindow: (windowId: number) => {
      const { tabs } = state.tabHandler.windows.get(windowId)
      reducer.record.addRecord({
        urls: tabs.map((t) => ({
          title: t.title,
          url: t.url,
        })),
        recordTime: new Date(),
      })
    },
    selectTab: (tab: Tab) => {
      if (state.selectedTabs.size > 0) {
        if (common.selectedStartTab) {
          // get selected tabs
          const { windows } = state.tabHandler

          let startTab = common.selectedStartTab
          let endTab = tab
          let valve = false
          const selectedTabs = new Set<Tab>()

          if (startTab.windowId === endTab.windowId) {
            const { tabs } = windows.get(endTab.windowId)

            let startTabIndex = tabs.findIndex((t) => t.id === startTab.id)
            let endTabIndex = tabs.findIndex((t) => t.id === endTab.id)

            if (startTabIndex > endTabIndex) {
              [startTabIndex, endTabIndex] = [endTabIndex, startTabIndex]
            }

            for (let i = startTabIndex, end = endTabIndex + 1; i < end; i += 1) {
              selectedTabs.add(tabs[i])
            }

            $log({ selectedTabs }, 'single')
          } else {
            const orderWindowIds = [...windows.keys()]
            let startWindowIndex = orderWindowIds.findIndex(
              (id) => id === startTab.windowId,
            )
            let endWindowIndex = orderWindowIds.findIndex(
              (id) => id === endTab.windowId,
            )

            if (startWindowIndex > endWindowIndex) {
              [startWindowIndex, endWindowIndex, startTab, endTab] = [
                endWindowIndex, startWindowIndex, endTab, startTab,
              ];
            }

            const selectedWindowIds = orderWindowIds.slice(startWindowIndex + 1, endWindowIndex)

            const startWindowTabs = windows.get(startTab.windowId).tabs
            const endWindowTabs = windows.get(endTab.windowId).tabs

            valve = false
            for (const t of startWindowTabs) {
              if (valve) {
                selectedTabs.add(t)
              } else if (t.id === startTab.id) {
                selectedTabs.add(t)
                valve = true
              }
            }
            $log({ selectedTabs })

            for (const wId of selectedWindowIds) {
              for (const t of windows.get(wId).tabs) {
                selectedTabs.add(t)
              }
            }
            $log({
              selectedTabs, selectedWindowIds, startWindowIndex, endWindowIndex,
            })

            for (const t of endWindowTabs) {
              selectedTabs.add(t)
              if (t.id === endTab.id) {
                break
              }
            }
            $log({ selectedTabs }, 'multi')
          }
          common.selectedStartTab = null
          setState({ selectedTabs })
        } else {
          const selectedTabs = new Set(state.selectedTabs)
          if (selectedTabs.has(tab)) {
            selectedTabs.delete(tab)
          } else {
            selectedTabs.add(tab)
          }
          setState({ selectedTabs })
        }
      } else {
        common.selectedStartTab = tab
        setState({ selectedTabs: new Set([tab]), status: 'selected' })
      }
    },
    isSelected: (tab: Tab) => state.selectedTabs.has(tab),
    // #endregion

    // #region 拖动
    updateDragHoverTop(tab: Tab, windowId?: number) {
      setState({ dragHoverTop: computedTabTop(tab, windowId) })
    },
    handleDrop(sourceTabId: number, targetProps: Pick<Tab, 'index' | 'windowId'>) {
      // eslint-disable-next-line no-param-reassign
      targetProps.index += 1

      chrome.tabs.move(sourceTabId, targetProps, () => {
        setState({ dragHoverTop: -1 })
      })
    },
    hideDragHover() {
      setState({ dragHoverTop: -1 })
    },
  };
};

export type Settings = SettingsType<typeof setup>
type Ctx = CtxMSConn<EmptyObject, Module, State, Conn, Settings>

const registerOptions = {
  module: moduleName,
  connect,
  state: initState,
  setup,
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default () => useConcent<EmptyObject, Ctx, NoMap>(registerOptions)
