import React, { forwardRef } from 'react'
import { BookmarkTreeNode } from 'models/bookmark/state'
import c from './index.module.scss'
import Folder from './Folder'
import Label from './Label'
import { Settings } from '.'
import { EmptyObject } from 'api/type'
import { CtxDeS } from 'types/concent'
import { NoMap, SettingsType, useConcent } from 'concent'

const initState = () => ({
})
//#region Type Statement
type State = ReturnType<typeof initState>
type CtxPre = CtxDeS<EmptyObject, State>
//#endregion
const setup = (ctx: CtxPre) => {

}
//#region Type Statement
export type MySettings = SettingsType<typeof setup>
type Ctx = CtxDeS<EmptyObject, State, MySettings>
//#endregion
interface Props {
    rootNode: BookmarkTreeNode
    settings: Settings
}
const BookmarkList = ({ rootNode, settings }: Props, ref: React.Ref<HTMLUListElement>): JSX.Element => {

    return <div
        className={c['bookmark-wrapper']}
        onScroll={settings.scrollCb}
    >
        <ul
            ref={ref}
            className={c['bookmark-list']}
            style={{ height: rootNode?.height ?? 0 }}
        >
            {
                rootNode?.children.map(v => 'children' in v
                    ? v.isRender ? <Folder key={v.id} node={v} settings={settings}/> : null
                    : <Label key={v.id} node={v} settings={settings}/>)
            }
        </ul>
    </div>
}

export default forwardRef(BookmarkList)