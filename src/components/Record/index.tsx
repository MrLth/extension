import React from 'react'
import { NoMap, SettingsType, useConcent } from 'concent'
//#region Type Import
import { EmptyObject } from 'api/type'
import { CtxMSConn, ItemsType } from 'types/concent';
//#endregion
//#region Import Style
import c from './index.module.scss'
import IconFont from 'components/IconFont'
import { Recording } from 'models/record/state'
//#endregion

const moduleName = 'record'
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
    return {

    }
}
//#region Type Statement
type Settings = SettingsType<typeof setup>
type Ctx = CtxMSConn<EmptyObject, Module, State, Conn, Settings>
//#endregion
const Record = () => {
    const { state, settings } = useConcent<EmptyObject, Ctx, NoMap>({ module: moduleName, setup, state: initState, connect })

    return <div className={c['content']}>
        {state.recording.map(record =>
            record.urls.map(v => <div key={v.url}>{v.title}</div>)
        )}
    </div>
}

export default Record