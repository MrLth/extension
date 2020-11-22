import React from 'react'
import IconFont from 'components/IconFont'
import _ from 'lodash'

//#region Import Style
import c from './index.module.scss'
//#endregion
import { CtxMSConn, ItemsType } from 'types/concent'
import { EmptyObject } from 'api/type'
import { NoMap, SettingsType, useConcent } from 'concent'
import FolderNameList from './FolderNameList'
import BookmarkList from './BookmarkList'
import { BookmarkTreeNode } from 'models/bookmark/state'

const CARD_TITLE_HEIGHT = 45
const CARD_TITLE_OFFSET = 6

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

    const common = {
        listHeight: 0
    }
    const dom = {
        list: null as HTMLUListElement,
        wrapper: null as HTMLDivElement
    }

    // 初始化获取 bookmarkTree
    effect(() => {
        chrome.bookmarks.getSubTree('1', (rst) => {
            reducer.bookmark.initBookmarkTree({ rootNode: rst[0], listHeight: common.listHeight })
        })
    }, [])

    const settings = {
        refList: {
            set current(v: HTMLUListElement) {
                dom.wrapper = v.parentElement as HTMLDivElement
                common.listHeight = dom.wrapper.clientHeight
                dom.list = v
            },
            get current() {
                return dom.list
            }
        },
        scrollCb(e: React.UIEvent<HTMLDivElement, UIEvent>) {
            e.stopPropagation()
            const top = dom.wrapper.scrollTop
            const bottom = top + common.listHeight
            console.log('scrollCb')
            reducer.bookmark.updIsRender({ top, bottom })
        },
        scrollToShow(e: React.MouseEvent<HTMLLIElement, MouseEvent>, node: BookmarkTreeNode) {
            e.stopPropagation()

            const li = e.target as HTMLLIElement

            const getFolder = (node: BookmarkTreeNode): BookmarkTreeNode =>
                'top' in node
                    ? node
                    : 'parent' in node
                        ? getFolder(node.parent)
                        : null

            const folder = getFolder(node)
            if (folder === null) return


            dom.wrapper.scrollTo({
                top: folder.top - li.getBoundingClientRect().top + CARD_TITLE_HEIGHT + 40,
            })
        },
        openTab: reducer.$$global.openTab
    }

    return settings
}
//#region Type Statement
export type Settings = SettingsType<typeof setup>
type Ctx = CtxMSConn<EmptyObject, Module, State, Conn, Settings>
//#endregion
const Bookmark = (): JSX.Element => {
    const { state, settings } = useConcent<EmptyObject, Ctx, NoMap>({ module: moduleName, setup, state: initState, connect })

    console.log('BookMark rendered')
    return <div className={c['content']}>
        <div className={c['title']}>
            <div>BOOKMARK</div>
            <div>
            </div>
        </div>
        <div className={c['list-wrapper']}>
            <FolderNameList folders={state.bookmarkTree?.folders} settings={settings} />
            <BookmarkList ref={settings.refList} rootNode={state.bookmarkTree} settings={settings} />
        </div>
    </div>
}

export default Bookmark