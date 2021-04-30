/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-04-28 17:55:21
 * @LastEditTime: 2021-04-30 07:54:24
 * @Description: file content
 */

import { isFunction } from 'lodash-es'
import { isNewtab } from 'utils'
import { Fn } from 'utils/type'
import { MyTab } from '../model/type'

function flat(
  tabMap: Map<number, MyTab>,
  tabs: MyTab[] | Map<number, MyTab>,
  deep: boolean[] = [],
): [boolean[], MyTab][] {
  if (tabs instanceof Map) {
    // eslint-disable-next-line no-param-reassign
    tabs = [...tabs.values()]
  }

  const array = [] as [boolean[], MyTab][]
  for (const tab of tabs) {
    array.push([deep, tab])
    $log({ tab, tabs })
    const tabIds = tab.openedTabIds ? [...tab.openedTabIds] : []

    if (tabIds.length) {
      const len = tabIds.length - 1
      const subTabs = tabIds.slice(0, len)
      if (subTabs.length) {
        array.push(...flat(tabMap, subTabs.map((tabId) => tabMap.get(tabId)), [...deep, true]))
      }
      array.push(...flat(tabMap, [tabMap.get(tabIds[len])], [...deep, false]))
    }
  }

  return array
}

function arrayStructureToString(array: [boolean[], MyTab][]): [string, MyTab][] {
  const rstArray = [] as [string, MyTab][]
  for (const [treeStructure, tab] of array) {
    let str = ''
    const len = treeStructure.length
    if (len) {
      for (let i = 0; i < len - 1; i += 1) {
        str += treeStructure[i] ? '┃' : ' '
      }
      str += treeStructure[len - 1] ? '┣' : '┗'
    }
    rstArray.push([str, tab])
  }
  return rstArray
}

function generateMap(tabs: MyTab[], tabMap: Map<number, MyTab>): Map<number, MyTab> {
  const copyMap = new Map(tabMap)
  for (const tab of tabs) {
    if (tab.openerTabId && !isNewtab(tab.url)) {
      const openerTab = tabMap.get(tab.openerTabId)
      if (openerTab && !isNewtab(openerTab.url)) {
        openerTab.openedTabIds.add(tab.id)
        copyMap.delete(tab.id)
      }
    }
  }
  return copyMap
}

function addTabId(
  tabMap: Map<number, MyTab>,
  openerTab: MyTab,
  tab: MyTab,
  addCb?: Fn,
): void {
  if (!isNewtab(openerTab.url) && !isNewtab(tab.url)) {
    openerTab.openedTabIds.add(tab.id)
    if (isFunction(addCb)) {
      addCb()
    }
  }
}

function findOpener(tabMap: Map<number, MyTab>, tab: MyTab, prevTab: MyTab): MyTab | false {
  while (prevTab.openerTabId) {
    const tempTab = tabMap.get(prevTab.openerTabId)
    if (!tempTab || !tempTab.openedTabIds.has(prevTab.id)) {
      return false
    }

    if (tab.openerTabId === prevTab.openerTabId) {
      return tabMap.get(prevTab.openerTabId)
    }

    // eslint-disable-next-line no-param-reassign
    prevTab = tempTab
  }
  return false
}

function generateMapByOrder(
  tabs: MyTab[],
  tabMap: Map<number, MyTab>,
): Map<number, MyTab> {
  const copyMap = new Map(tabMap)

  for (let i = 0; i < tabs.length; i += 1) {
    const tab = tabs[i];
    const prevTab = tabs[i - 1]

    if (prevTab && tab.openerTabId) {
      const addCb = () => {
        copyMap.delete(tab.id)
      }
      if (tab.openerTabId === prevTab.id) {
        addTabId(tabMap, prevTab, tab, addCb)
      } else {
        const opener = findOpener(tabMap, tab, prevTab)
        if (opener) {
          addTabId(tabMap, opener, tab, addCb)
        }
      }
    }
  }

  return copyMap
}

function useTreeMode(tabs: MyTab[]): [string, MyTab][] {
  const tabMap = new Map<number, MyTab>()

  for (const tab of tabs) {
    tab.openedTabIds = new Set()
    tabMap.set(tab.id, tab)
  }

  const copyMap = generateMapByOrder(tabs, tabMap)

  const array = flat(tabMap, copyMap)
  const string = arrayStructureToString(array)
  $log({ copyMap, array, string })

  return string
}

export default useTreeMode
