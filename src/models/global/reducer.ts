import { WindowSize, ModuleState } from './type'
import { IActionCtxBase as IAC } from 'concent'
import { Tab } from 'utils/type'

/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-09-01 21:04:43
 * @LastEditTime: 2020-09-01 21:47:32
 * @Description: file content
 */

function openTab(url: string, _state: unknown, ctx: IAC) {
    let tabInfo: {
        id: number,
        windowId: number
    } = null
    // 如果标签已经打开，则只需跳转，否则新建标签页打开
    outerFor: for (const tabs of Object.values(ctx.rootState.tab.windowsObj as Record<string | number, Tab[]>)) {
        for (const tab of tabs) {
            if (tab.url === url) {
                tabInfo = { id: tab.id, windowId: tab.windowId }
                break outerFor
            }
        }
    }
    if (tabInfo !== null) {
        chrome.tabs.update(tabInfo.id, { active: true })
        chrome.windows.update(tabInfo.windowId, { focused: true })
    } else {
        window.open(url)
    }
}

export default { openTab }
