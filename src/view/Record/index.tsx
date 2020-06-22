import * as React from 'react'
import { useContext, useEffect, useMemo, useCallback, useState } from 'react'
import { RecordContext } from '@store'
// import { recordActionInit } from '@store/record/actions'
import { debound } from '@api'
import { RecordUrl } from '@store/record/type'

const Record = (): JSX.Element => {
    const { urls } = useContext(RecordContext)

    const [isSaved, setIsSaved] = useState(false)
    const saveUrlsToStorage = useCallback((debound((state: RecordUrl[]) => {
        chrome.storage.local.set({ urls: state }, () => {
            setIsSaved(true)
        })
    }, 3000)), [])
    useEffect(() => {
        setIsSaved(false)
        saveUrlsToStorage(urls)
    }, [urls])

    const jsxUrls = useMemo(() => {
        return urls.map((item) =>
            <li key={item.url}>
                <div>{item.title}</div>
                <div> {item.url} </div>
            </li>
        )
    }, [urls])


    console.log('🌀 Record Render')
    return (
        <>
            <div>{isSaved ? '已保存' : ''}</div>
            <ul>
                {jsxUrls}
            </ul>
        </>
    )
}

export default Record
