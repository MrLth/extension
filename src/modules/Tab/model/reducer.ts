/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-13 17:35:56
 * @LastEditTime: 2021-04-27 20:17:05
 * @Description: file content
 */

import { proxyMethods } from 'utils';
import { IActionCtxBase as IAC } from 'concent';
import { cloneDeep, debounce } from 'lodash-es';
import TabHandler from '../TabHandler'
import tabState from './state';

export type TabState = typeof tabState

function batchUpdate(_: unknown, state: TabState): Partial<TabState> {
  const { tabHandler } = state
  const {
    queue, updIndexWindows, updTimeWindows, windows,
  } = tabHandler;

  updIndexWindows.clear();
  updTimeWindows.clear();

  $debug({
    title: 'tab / batchUpdate before',
    multi: {
      tabHandler: cloneDeep(state.tabHandler),
    },
  });

  // 1. 执行更新任务
  for (const fn of queue) {
    try {
      fn();
    } catch (e) {
      $debug({
        title: 'batchUpdate Error',
        multi: {
          e,
          queue,
          fn,
        },
        color: 4,
      });
    }
  }
  // 2. 清空队列
  queue.length = 0;
  // 3. 更新索引
  for (const [windowId, position] of updIndexWindows.entries()) {
    if (windows.has(windowId)) {
      const { tabs } = windows.get(windowId);
      for (let i = position, len = tabs.length; i < len; i += 1) {
        tabs[i].index = i;
      }
    }
  }

  tabHandler.updateWindowPosition()
  tabHandler.updateAllTabsPosition()

  // 4. 更新窗口修改时间
  for (const windowId of updTimeWindows.values()) {
    if (windows.has(windowId)) {
      TabHandler.regenerateUpdateKey(windows.get(windowId));
    }
  }

  return state;
}

async function init(
  _?: unknown,
  _state?: TabState,
  ctx?: IAC,
): Promise<Partial<TabState>> {
  const [nativeTabs, windowsAttaches] = (await Promise.all([
    new Promise((resolve) => chrome.tabs.query({}, (v) => resolve(v))),
    new Promise((resolve) => chrome.windows.getAll((v) => resolve(v))),
  ])) as [chrome.tabs.Tab[], chrome.windows.Window[]];

  const tabHandler = new TabHandler(nativeTabs, windowsAttaches);

  let proxy = proxyMethods({
    target: tabHandler,
    handler: debounce(() => {
      ctx.dispatch(batchUpdate);
    }),
    proxyKeys: ['push'],
  });

  if (__DEV__) {
    proxy = proxyMethods({
      target: proxy,
      handler: (target, _thisArg, args) => {
        console.log('123')
        $log({ target: target.name, args }, 'batch', 2);
      },
      ignoreKeys: ['push'],
    });
  }

  return { tabHandler: proxy };
}

function openTab(tab: chrome.tabs.Tab | string, state: TabState): void {
  let tabTemp = tab
  if (typeof tabTemp === 'string') {
    for (const v of state.tabHandler.tabMap.values()) {
      if (v.url === tabTemp) {
        tabTemp = v;
        break;
      }
    }
    // 标签未打开就新建标签页
    if (typeof tabTemp === 'string') {
      const url = new URL(tabTemp);
      if (!url) return;
      window.open(url.href);
      return;
    }
  }
  chrome.tabs.update(tabTemp.id, { active: true });
  chrome.windows.update(tabTemp.windowId, { focused: true });
}

export default { init, batchUpdate, openTab };
