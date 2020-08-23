import { HistorySortedObj } from "./type";

export function sortNativeHistory(nativeHistory:chrome.history.HistoryItem[]):HistorySortedObj{
    const historySortedObj:HistorySortedObj = {}
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