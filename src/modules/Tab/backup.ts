// /*
//  * @Author: mrlthf11
//  * @LastEditors: mrlthf11
//  * @Date: 2020-06-07 21:58:08
//  * @LastEditTime: 2021-02-22 00:01:00
//  * @Description: file content
//  */

// import {
//   Windows, WindowsAttach, Tab, SelectObj,
// } from 'utils/type';

// const windowsA: Windows = {};
// const windowsB: Windows = {};
// let oldWindows: Windows;

// let updateWindowQueueObj: Record<string | number, number> = {};
// function setUpdateWindowStartIndex(key: string | number, index: number) {
//   if (key in updateWindowQueueObj) {
//     updateWindowQueueObj[key] = Math.min(updateWindowQueueObj[key], index);
//   } else {
//     updateWindowQueueObj[key] = index;
//   }
// }
// const transit: Record<number, Tab> = {};

// function getSelectWindows(obj: Windows, selectObj: SelectObj): string[] {
//   const { startWindow, endWindow } = selectObj;

//   const windowKeys = Object.keys(obj);
//   const [start, end] = [
//     windowKeys.indexOf(`${startWindow}`),
//     windowKeys.indexOf(`${endWindow}`),
//   ].sort();

//   return windowKeys.slice(start, end + 1);
// }
// function getSortSelectObj(
//   selectWindows: string[],
//   selectObj: SelectObj,
// ): SelectObj {
//   let {
//     startIndex, endIndex, startWindow, endWindow,
//   } = selectObj;

//   let isReverse = false;
//   if (selectWindows[0] != `${startWindow}`) {
//     isReverse = true;
//     [startWindow, endWindow, startIndex, endIndex] = [
//       endWindow,
//       startWindow,
//       endIndex,
//       startIndex,
//     ];
//   } else if (startWindow == endWindow && startIndex > endIndex) {
//     isReverse = true;
//     [startIndex, endIndex] = [endIndex, startIndex];
//   }

//   return {
//     startWindow,
//     endWindow,
//     startIndex,
//     endIndex,
//     status: selectObj.status,
//     isReverse,
//   };
// }
// function createNewObj(obj: Windows, selectObj: SelectObj): [Windows, boolean] {
//   const selectWindows = getSelectWindows(obj, selectObj);
//   const {
//     status,
//     startWindow,
//     startIndex,
//     endWindow,
//     endIndex,
//     isReverse,
//   } = selectObj;

//   const newObj: Windows = { ...obj };
//   selectWindows.map((key: keyof typeof obj) => {
//     newObj[key] = [...newObj[key]];
//     newObj[key].map((tab, i) => {
//       if (
//         (`${startWindow}` == key && i < startIndex)
//         || (`${endWindow}` == key && i > endIndex)
//       ) return;

//       if (status != tab.userSelected) newObj[key][i] = { ...tab, userSelected: status };
//     });
//   });

//   return [newObj, isReverse];
// }

// function getSameTabs(oldWindow: Tab[], newWindow: Tab[]) {
//   const props = ['url', 'title', 'index', 'id', 'active'];
//   const sameTabs: Tab[] = [];

//   newWindow.map((tab, i) => {
//     if (!Array.isArray(oldWindow[i])) return;

//     const rst = props.every(
//       (prop: keyof typeof tab) => tab[prop] === oldWindow[i][prop],
//     );

//     if (rst) {
//       sameTabs.push(oldWindow[i]);
//     }
//   });

//   return sameTabs;
// }

// const ht = {
//   createNewWindows(windows: Windows): Windows {
//     const windowsC = windows !== windowsA ? windowsA : windowsB;
//     for (const key in windowsC) {
//       delete windowsC[key];
//     }
//     return Object.assign(windowsC, windows);
//   },
//   referOldWindows(windows: Windows): void {
//     oldWindows = windows;
//   },
//   dereferOldWindows(): void {
//     oldWindows = null;
//   },
//   createNewWindow(windows: Windows, key: keyof typeof windows): Tab[] {
//     if (windows[key]) {
//       if (windows[key] === oldWindows[key]) {
//         windows[key] = [...windows[key]];
//       }
//     } else windows[key] = [];
//     return windows[key];
//   },
//   addTab(
//     windows: Windows,
//     windowKey: keyof typeof windows,
//     tab: Tab,
//     tabIndex = -1,
//   ): Windows {
//     const newWindow = ht.createNewWindow(windows, windowKey);
//     if (tabIndex === -1) newWindow.push(tab);
//     else newWindow.splice(tabIndex, 0, tab);
//     return windows;
//   },
//   updTab(
//     windows: Windows,
//     windowKey: keyof typeof windows,
//     tab: Tab,
//     tabId: number,
//   ): Windows {
//     // const newWindows = createNewWindows(windows)
//     const newWindow = ht.createNewWindow(windows, windowKey);
//     const tabIndex = newWindow.findIndex((tab) => tab.id === tabId);
//     if (tabIndex === -1) newWindow.push(tab);
//     else newWindow[tabIndex] = tab;

//     tab.active && ht.avtiveTab(windows, windowKey, tabId, false);

//     return windows;
//   },
//   removeTab(
//     windows: Windows,
//     windowKey: keyof typeof windows,
//     tabId: number,
//   ): Windows {
//     const newWindow = ht.createNewWindow(windows, windowKey);
//     const tabIndex = newWindow.findIndex((tab) => tab.id === tabId);
//     if (tabIndex != -1) newWindow.splice(tabIndex, 1);

//     setUpdateWindowStartIndex(windowKey, tabIndex);

//     return windows;
//   },
//   removeWindow(windows: Windows, windowKey: keyof typeof windows): Windows {
//     delete windows[windowKey];
//     return windows;
//   },
//   moveTab(
//     windows: Windows,
//     windowKey: keyof typeof windows,
//     form: number,
//     to: number,
//   ): Windows {
//     const newWindow = ht.createNewWindow(windows, windowKey);

//     const [transit] = newWindow.splice(form, 1);
//     newWindow.splice(to, 0, transit);

//     setUpdateWindowStartIndex(windowKey, Math.min(form, to));
//     return windows;
//   },
//   batchUpdTabIndex(windows: Windows): Windows {
//     Object.keys(updateWindowQueueObj).map((windowKey) => {
//       ht.updTabIndex(windows, windowKey, false, updateWindowQueueObj[windowKey]);
//     });
//     updateWindowQueueObj = {};
//     return windows;
//   },
//   updTabIndex(
//     windows: Windows,
//     windowKey: keyof typeof windows,
//     isNewWindow = true,
//     startIndex = 0,
//   ): Windows {
//     let tabs: Tab[];
//     if (isNewWindow) {
//       tabs = ht.createNewWindow(windows, windowKey);
//     } else tabs = windows[windowKey];

//     for (let i = startIndex, len = tabs.length; i < len; i++) {
//       tabs[i].index = i;
//     }

//     return windows;
//   },
//   avtiveTab(
//     windows: Windows,
//     windowKey: keyof typeof windows,
//     tabId: number,
//     isNewWindow = true,
//   ): Windows {
//     let tabs: Tab[];

//     if (isNewWindow) {
//       // windows = createNewWindows(windows)
//       tabs = ht.createNewWindow(windows, windowKey);
//     } else tabs = windows[windowKey];

//     const oldIndex = tabs.findIndex((tab) => tab.active);
//     const index = tabs.findIndex((tab) => tab.id === tabId);
//     tabs[oldIndex] = { ...tabs[oldIndex], active: false };
//     tabs[index] = { ...tabs[index], active: true };

//     return windows;
//   },
//   detachTab(
//     windows: Windows,
//     windowKey: keyof typeof windows,
//     tabId: number,
//     index: number,
//   ): Windows {
//     const newWindow = ht.createNewWindow(windows, windowKey);

//     transit[tabId] = newWindow.splice(index, 1)[0];

//     if (newWindow.length === 0) {
//       ht.removeWindow(windows, windowKey);
//     } else setUpdateWindowStartIndex(windowKey, index);

//     return windows;
//   },
//   attachTab(
//     windows: Windows,
//     windowKey: keyof typeof windows,
//     tabId: number,
//     index: number,
//   ): Windows {
//     const newWindow = ht.createNewWindow(windows, windowKey);

//     Object.assign(transit[tabId], { windowId: windowKey });

//     newWindow.splice(index, 0, transit[tabId]);
//     delete transit[tabId];

//     ht.avtiveTab(windows, windowKey, index, false);

//     setUpdateWindowStartIndex(windowKey, index);
//     return windows;
//   },
//   selectTabs(obj: Windows, selectObj: SelectObj): [Windows, boolean] {
//     const selectWindows = getSelectWindows(obj, selectObj);
//     const sortSelectObj = getSortSelectObj(selectWindows, selectObj);

//     return createNewObj(obj, sortSelectObj);
//   },
//   getSelectedTab(windows: Windows): [number[], string[]] {
//     const selectTabsId: number[] = [];
//     const selectTabsFaviconsUrl: string[] = [];
//     Object.keys(windows).map((key: keyof typeof windows) => {
//       windows[key].map((tab) => {
//         if (tab.userSelected) {
//           selectTabsId.push(tab.id);
//           selectTabsFaviconsUrl.push(tab.favIconUrl);
//         }
//       });
//     });
//     return [selectTabsId, selectTabsFaviconsUrl];
//   },
//   isHaveTabSelected(windows: Windows): boolean {
//     return (
//       Object.keys(windows).findIndex((key: keyof typeof windows) => (
//         windows[key].findIndex((tab) => tab.userSelected)
//         != -1
//       ))
//       != -1
//     );
//   },
//   groupTabsByWindowId(tabs: Tab[]): Windows {
//     const rst: Windows = {};
//     tabs.map((tab) => {
//       ht.splitUrl(tab);
//       rst[tab.windowId] = rst[tab.windowId] || [];
//       rst[tab.windowId].push(tab);
//     });
//     return rst;
//   },
//   groupWindowsByWindowId(windows: chrome.windows.Window[]): WindowsAttach {
//     const rst: WindowsAttach = {};
//     windows.map((window) => {
//       rst[window.id] = window;
//     });
//     return rst;
//   },
//   splitUrl(tab: Tab): Tab {
//     const urlReg = /^(http(?:s)?|chrome.*):\/\/(.*?)\/([^\?]*)(\?.*)?/;
//     const url = tab.url || tab.pendingUrl;
//     // const urlRst = new URL(url)
//     const regRst = urlReg.exec(url);

//     // try{
//     // tab.userProtocol = urlRst.protocol
//     // tab.userHost = urlRst.host
//     // tab.userRoute = urlRst.pathname
//     // tab.userPara = urlRst.search
//     // }caches(e){

//     // }

//     if (regRst) {
//       tab.userProtocol = regRst[1];
//       tab.userHost = regRst[2];
//       tab.userRoute = regRst[3];
//       tab.userPara = regRst[4];
//     } else {
//       console.log('splitURL', url, tab);
//     }

//     return tab;
//   },
//   minimalUpdate(oldObj: Windows, newObj: Windows): Windows {
//     for (const key in newObj) {
//       if (!Array.isArray(newObj[key])) return;

//       const sameTabs = getSameTabs(oldObj[key], newObj[key]);

//       if (sameTabs.length === newObj[key].length) {
//         newObj[key] = oldObj[key];
//       } else {
//         sameTabs.forEach((tab) => (newObj[key][tab.index] = tab));
//       }
//     }
//     return newObj;
//   },
//   searchTab(windows: Windows, text: string): Windows {
//     const newWindows: Windows = {};
//     for (const key in windows) {
//       const tabs: Tab[] = [];
//       windows[key].map((tab) => {
//         if (
//           tab.url.toUpperCase().includes(text)
//           || tab.title.toUpperCase().includes(text)
//         ) {
//           tabs.push(tab);
//         }
//       });
//       if (tabs.length != 0) newWindows[key] = tabs;
//     }
//     return newWindows;
//   },
// };

// export default ht;
