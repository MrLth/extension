import React, { useEffect } from 'react'
import { NoMap, SettingsType, useConcent } from 'concent'
//#region Type Import
import { EmptyObject } from 'api/type'
import { CtxMSConn, ItemsType } from 'types/concent';
//#endregion
//#region Import Style
import c from './index.module.scss'
import IconFont from 'components/IconFont'
import { Recording } from 'models/record/state'
import RecordList from './RecordList';
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
    const { effect, reducer } = ctx
    effect(() => {
        // 状态初始化，包括从本地读取记录
        reducer.record.init()
        // 页面刷新或关闭时保存记录
        const beforeUnloadListener = () => {
            reducer.record.save(null)
        }
        window.addEventListener('beforeunload', beforeUnloadListener)
        return () => {
            // 组件销毁时触发，实际并没有实现销毁。所以暂时用不到
            // 注意：页面刷新和关闭时不会触发
            window.removeEventListener('beforeunload', beforeUnloadListener)
        }
    }, [])

    return {
        save: () => {
            reducer.record.save(null)
        }
    }
}
//#region Type Statement
type Settings = SettingsType<typeof setup>
type Ctx = CtxMSConn<EmptyObject, Module, State, Conn, Settings>
//#endregion
const Record = () => {
    const { state, settings } = useConcent<EmptyObject, Ctx, NoMap>({ module: moduleName, setup, state: initState, connect })

    return <div className={c['content']}>
        <div className={c['title']}>
            <div>Record</div>
            <div>
                <IconFont type='iconadd' onClick={settings.save}></IconFont>
            </div>
        </div>
        {state.recording.map(v =>
            <RecordList key={v.recordTime.valueOf()} recording={v} />
        )}
    </div>
}

export default Record