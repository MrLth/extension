/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2021-04-29 14:31:01
 * @LastEditTime: 2021-04-29 16:11:22
 * @Description: file content
 */

const openerIdMap = new Map<number, number>()

chrome.runtime.onStartup.addListener(() => {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.openerTabId) {
        openerIdMap.set(tab.id, tab.openerTabId)
      }
    }
  })
})

chrome.tabs.onCreated.addListener((tab) => {
  if (tab.openerTabId) {
    openerIdMap.set(tab.id, tab.openerTabId)
  }
});
chrome.tabs.onRemoved.addListener((tabId) => {
  openerIdMap.delete(tabId)
});

window.openerIdMap = openerIdMap
