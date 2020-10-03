import * as React from 'react'
import { useContext, useEffect, useMemo, useCallback, useState } from 'react'

import { RecordContext } from 'store'
import { debound } from 'api'
import { HistorySortedObj } from './type'
import { sortNativeHistory } from './api'

const History = (): JSX.Element => {

    useEffect(() => {
        const onVisitedListener = (result: chrome.history.HistoryItem) => {
            console.log("visited history item: ", result);
        }
        const onVisitedRemoveListener = (removed: chrome.history.RemovedResult) => {
            console.log('visited removed item:', removed);

        }

        chrome.history.onVisited.addListener(onVisitedListener)
        chrome.history.onVisitRemoved.addListener(onVisitedRemoveListener)
        return () => {
            chrome.history.onVisited.removeListener(onVisitedListener)
            chrome.history.onVisitRemoved.removeListener(onVisitedRemoveListener)

        }
    }, [])


    const [historySortedObj, setHistorySortedObj] = useState<HistorySortedObj>({})
    useEffect(() => {
        chrome.history.search({ text: '' }, (result) => {
            setHistorySortedObj(sortNativeHistory(result))
        })
    }, [])
    return (
        <div>
            {Object.keys(historySortedObj).map((key) => {
                return <ul>{historySortedObj[key].map((item) => {
                    // return <li>{item.title}|{decodeURI(item.url)}</li>
                    return <li>{decodeURI(item.url)}</li>
                })}</ul>
            })}
        </div>
    )
}

export default History
