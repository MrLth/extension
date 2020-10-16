import { EmptyObject } from 'api/type'
import { NoMap, SettingsType, useConcent } from 'concent'
import { HistorySection } from 'models/history/state'
import React, { memo } from 'react'
import { CtxDeS } from 'types/concent'
import Domain from './Domain'
import { Settings } from '.'
//#region Import Style
import c from './index.module.scss'
import Label from './Label'
import { HistoryItem } from './api'
//#endregion

/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-14 08:40:09
 * @LastEditTime: 2020-10-16 16:50:05
 * @Description: file content
 */
interface Props {
    status: 'loading' | 'completed'
    section: HistorySection
    settings: Settings
}
const initState = () => ({
})
//#region Type Statement
type State = ReturnType<typeof initState>
type CtxPre = CtxDeS<EmptyObject, State>
//#endregion
const setup = (ctx: CtxPre) => {
    const visits = new Map()

    ctx.effect(() => {
        for (const label of settings.updQueue) {
            chrome.history.getVisits({ url: label.url }, (rst) => {
                rst.length > 0 && visits.set(rst[0].id, rst)
                console.log('visits', visits)
            })
        }
    })

    const settings = {
        updQueue: [] as HistoryItem[]
    }
    return settings
}
//#region Type Statement
export type MySettings = SettingsType<typeof setup>
type Ctx = CtxDeS<EmptyObject, State, MySettings>
//#endregion
const Section = ({ section, settings }: Props) => {
    const ctx = useConcent<EmptyObject, Ctx, NoMap>({ setup, state: initState })
    const { updQueue } = ctx.settings

    return (
        <ul className={c['section']} style={{ top: section.top }}>
            {
                section.list.map((item) => {
                    const firstLabel = item.list[0]
                    if (typeof firstLabel.visitTime !== 'number') {
                        if (firstLabel.visitCount > 1) {
                            updQueue.push(firstLabel)
                        }
                        firstLabel.visitTime = firstLabel.lastVisitTime
                    }

                    return item.list.length > 1
                        ? <Domain key={item.list[0].lastVisitTime} list={item.list} settings={settings} />
                        : <Label key={item.list[0].lastVisitTime} item={item.list[0]} settings={settings} />
                })
            }
        </ul>
    )
}

export default memo(Section)
