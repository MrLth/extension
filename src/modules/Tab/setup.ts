/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-02-22 23:45:29
 * @LastEditTime: 2021-02-22 23:57:32
 * @Description: file content
 */
import { SettingsType } from 'concent';
import {
  Windows, WindowsAttach, EmptyObject,
} from 'utils/type';
import { CtxMSConn, ItemsType } from 'utils/concent';
import { PopupFrameProps, PopupOption } from '../PopupFrame';

export const moduleName = 'tab';
export const connect = ['record'] as const;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const initState = () => ({
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
});

type Module = typeof moduleName
type Conn = ItemsType<typeof connect>
type State = ReturnType<typeof initState>
type CtxPre = CtxMSConn<EmptyObject, Module, State, Conn>

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const setup = (ctx: CtxPre) => {
  const {
    setState, state, effect, reducer,
  } = ctx;
  // const { record } = ctx.connectedState

  const common = {
    isEventSleep: false,
  };

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
    openTab: reducer.tab.openTab,
    // popupFrame
    updPopupFrameProps: (obj: PopupFrameProps) => {
      setState({ popupFrameProps: obj });
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
    recordSelectedTab: () => {
      // const selectedTabs = [] as Array<RecordUrl>
      // Object.values(state.windowsObj).map((tabs) => {
      //     tabs.map((tab) => {
      //         tab.userSelected &&
      //             selectedTabs.push({
      //                 url: tab.url,
      //                 title: tab.title,
      //                 host: tab.userHost,
      //                 route: tab.userRoute,
      //                 para: tab.userPara
      //             })
      //     })
      // })

      // FIXME:
      // recordDispatch(recordActionAdds(selectedTabs))
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
    discardTab: () => {
      // chrome.tabs.discard(tabId, (tab) => {
      //     if (!tab) return

      //     handleTabs.queue.push((windows) => {
      //         return ht.updTab(windows, windowId, ht.splitUrl(tab), tabId)
      //     })
      //     handleTabs.fn()
      // })
    },
    // #endregion
    // #region 测试
    recordAllTab: () => {
      // const newRecording: Recording = {
      //     urls: [],
      //     recordTime: new Date()
      // }

      // Object.values(state.windowsObj).forEach((tabs) => {
      //     // concat不会改变原数组，所以这里使用push
      //     Array.prototype.push.apply(newRecording.urls, tabs.map(v => ({
      //         title: v.title,
      //         url: v.url
      //     })))
      // })

      // ctx.reducer.record.addRecord(newRecording)
    },
    // #endregion
  };
};

export type Settings = SettingsType<typeof setup>
export type Ctx = CtxMSConn<EmptyObject, Module, State, Conn, Settings>
