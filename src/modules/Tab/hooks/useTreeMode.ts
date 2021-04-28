/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-04-28 17:55:21
 * @LastEditTime: 2021-04-28 23:31:25
 * @Description: file content
 */

import { isNewtab } from 'utils'
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

function useTreeMode(tabs: MyTab[]): [string, MyTab][] {
  const tabMap = new Map<number, MyTab>()

  for (const tab of tabs) {
    tab.openedTabIds = new Set()
    tabMap.set(tab.id, tab)
  }

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

  console.log(copyMap)

  const array = flat(tabMap, copyMap)

  return arrayStructureToString(array)
}

export default useTreeMode
