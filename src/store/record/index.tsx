/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-06-17 16:06:58
 * @LastEditTime: 2020-06-17 22:48:35
 * @Description: file content
 */
import * as React from 'react'
import { useReducer, createContext} from 'react'
import { RecordContextProps } from './type'
import { UrlsReducer } from './reducers'

export const RecordContext = createContext<RecordContextProps>({ urls: [] })

export const RecordProvider = (props: { children: unknown }): JSX.Element => {
    const { children } = props

    const [urls, dispatch] = useReducer(UrlsReducer, [])

    const value = { urls, dispatch }
    return (
        <RecordContext.Provider value={value}>
            {children}
        </RecordContext.Provider>
    )
}
