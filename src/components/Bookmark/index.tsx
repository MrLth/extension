import React from 'react'
import IconFont from 'components/IconFont'
//#region Import Style
import c from './index.module.scss'
//#endregion
import { CtxMSConn, ItemsType } from 'types/concent'
import { EmptyObject } from 'api/type'
import { NoMap, SettingsType, useConcent } from 'concent'
import FolderList from './FolderList'

const moduleName = 'bookmark'
const connect = [] as const
const initState = () => ({
})
//#region Type Statement
type Module = typeof moduleName
type Conn = ItemsType<typeof connect>
type State = ReturnType<typeof initState>
type CtxPre = CtxMSConn<EmptyObject, Module, State, Conn>
//#endregion
const setup = (ctx: CtxPre) => {
    const { effect, reducer } = ctx

    // 初始化获取 bookmarkTree
    effect(() => {
        chrome.bookmarks.getSubTree('1', (rst) => {
            reducer.bookmark.initBookmarkTree(rst[0])
        })
    }, [])
}
//#region Type Statement
export type Settings = SettingsType<typeof setup>
type Ctx = CtxMSConn<EmptyObject, Module, State, Conn, Settings>
//#endregion
const Bookmark = (): JSX.Element => {
    const { state, settings } = useConcent<EmptyObject, Ctx, NoMap>({ module: moduleName, setup, state: initState, connect })

    return <div className={c['content']}>
        <div className={c['title']}>
            <div>History</div>
            <div>
            </div>
        </div>
        <div className={c['list-wrapper']}>
            <FolderList folders={state.bookmarkTree?.folders}/>
            <div className={c['bookmark-list']}></div>
        </div>

    </div>
}

export default Bookmark