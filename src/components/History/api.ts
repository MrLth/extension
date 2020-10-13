/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-09 16:09:49
 * @LastEditTime: 2020-10-13 17:27:03
 * @Description: file content
 */
export interface HistoryObj{
    [s:string]:chrome.history.HistoryItem[]
}
export function sortNativeHistory(nativeHistory:chrome.history.HistoryItem[]):HistoryObj{
    const historySortedObj:HistoryObj = {}
    nativeHistory.map((item)=>{
        try{

            const url = new URL(item.url)

            if (historySortedObj[url.host])
                historySortedObj[url.host].push(item)
            else
                historySortedObj[url.host] = [item]
        }catch(e){
            console.error("sortNativeHistory error", e);
        }

    })

    return historySortedObj
}