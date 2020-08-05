import * as React from 'react'
import { useContext, useEffect, useMemo, useCallback, useState } from 'react'

import { RecordContext } from '@store'
import { debound } from '@api'

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
    return (
        <div>
            History component
        </div>
    )
}

export default History
