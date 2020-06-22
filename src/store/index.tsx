/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-06-17 16:06:58
 * @LastEditTime: 2020-06-22 17:22:12
 * @Description: file content
 */
import * as React from 'react'
import { useReducer, createContext} from 'react'
import { RecordContextProps } from './record/type'
import { UrlsReducer } from './record/reducers'
import { FaviconUdpReducer, FaviconStorageReducer } from './bookmark/reducers'

export const RecordContext = createContext<RecordContextProps>({})

export const RecordProvider = (props: { children: unknown }): JSX.Element => {
    const { children } = props

    const [urls, dispatch] = useReducer(UrlsReducer, [])
    const [faviconUpd, faviconUpdDispatch] = useReducer(FaviconUdpReducer, [])
    const [faviconStorage, faviconStorageDispatch] = useReducer(FaviconStorageReducer, {})

    const value = { urls, dispatch, faviconUpd,faviconUpdDispatch, faviconStorage, faviconStorageDispatch }
    return (
        <RecordContext.Provider value={value}>
            {children}
        </RecordContext.Provider>
    )
}
