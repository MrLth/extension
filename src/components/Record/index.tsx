import React from 'react'
import { NoMap, SettingsType, useConcent } from 'concent'
//#region Type Import
import { EmptyObject } from 'utils/type'
import { CtxMSConn, ItemsType } from 'utils/concent';
//#endregion
//#region Import Style
import c from './index.module.scss'
import IconFont from 'components/IconFont'
import RecordList from './RecordList';
import md5 from 'md5'
//#endregion
//#region Time Ago Init
import TimeAgo from 'javascript-time-ago'
import zh from 'javascript-time-ago/locale/zh'
TimeAgo.addLocale(zh)
const timeAgo = new TimeAgo('zh')
//#endregion

const moduleName = 'record'
const connect = ['tab'] as const
//#region Type Defined
interface TimeUpdItem {
    timeFormatted: string,
    setTimeFormatted: React.Dispatch<React.SetStateAction<string>>,
    recordTime: Date
}
//#endregion
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

    // 数据初始化
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

    // 时间更新
    effect(() => {
        let timerId: number
        const updRecordTimeFormatted = () => {
            timerId = window.setTimeout(() => {
                updRecordTimeFormatted()
                for (const v of settings.timeUpdQueue) {
                    const timeFormatted = timeAgo.format(v.recordTime)
                    if (timeFormatted !== v.timeFormatted) {
                        v.setTimeFormatted(timeFormatted)
                        v.timeFormatted = timeFormatted
                    }
                }
            }, 10000)
        }
        updRecordTimeFormatted()
        return () => {
            clearTimeout(timerId)
        }
    })
    const settings = {
        closeLabel: reducer.record.closeLabel,
        closeRecord: reducer.record.closeRecord,
        openLabel: reducer.tab.openTab,
        timeUpdQueue: [] as TimeUpdItem[],
        timeAgo,
        c() {
            const recording = ctx.state.recording.map(v => {
                const obj: {
                    urls: string
                    recordTime: number
                    lastEditTime?: number
                } = { urls: md5(JSON.stringify(v.urls)), recordTime: +v.recordTime }
                if (v.lastEditTime) {
                    obj.lastEditTime = +v.lastEditTime
                }
                return obj
            })
            // console.log(JSON.stringify(ctx.state.recording.map(v => ({ ...v, recordTime: +v.recordTime }))))

            // http://www.baidu.com
            fetch('http://47.93.37.191:3333/check', {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ recording }),
            }).then(v => v.json()).then(v => {

                if (v.isSuccess) {
                    console.log('v', v)
                    if (v.upload.length > 0) {
                        const updList = ctx.state.recording.filter(r => v.upload.includes(+r.recordTime)).map(r => ({ ...r, recordTime: +r.recordTime }))
                        console.log('updList', updList)

                        fetch('http://47.93.37.191:3333/update', {
                            method: 'post',
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify({ updList }),
                        }).then(v => v.json()).then(v => {
                            console.log('update,', v)
                        })
                    }

                    reducer.record.updRecord(v.download)
                }
                console.log('fetch', v)
            })
            console.log(recording)
        }

    }

    return settings
}
//#region Type Statement
export type Settings = SettingsType<typeof setup>
type Ctx = CtxMSConn<EmptyObject, Module, State, Conn, Settings>
//#endregion
const Record = (): JSX.Element => {
    const { state, settings } = useConcent<EmptyObject, Ctx, NoMap>({ module: moduleName, setup, state: initState, connect })

    return <div className={c['content']}>
        <div className={c['title']}>
            <div>RECORD</div>
            <div>
                <IconFont type='iconshuaxin' onClick={settings.c}></IconFont>
            </div>
        </div>
        <div className={c['list']}>
            {state.recording.map((v, i) =>
                <RecordList
                    key={v.recordTime.valueOf()}
                    recordingIndex={i}
                    recording={v}
                    settings={settings}
                />
            )}
        </div>
    </div>
}

export default Record