import { EmptyObject } from 'api/type'
import { NoMap, SettingsType, useConcent } from 'concent'
import { HistorySection } from 'models/history/state'
import React, { memo, useEffect } from 'react'
import { CtxDeS } from 'types/concent'
import Domain from './Domain'
import { Settings } from '.'
//#region Import Style
import c from './index.module.scss'
import Label from './Label'
import { HistoryItem } from './api'
//#endregion
//#region Time Ago Init
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en')
//#endregion
const ONE_DAY = 86400000

function timeFormat(timeStamp: number): string {
    const date = new Date(timeStamp)
    const minutes = date.getMinutes()
    let hours = date.getHours()
    let minutesStr = '00'
    if (minutes > 46) {
        hours += 1
    } else if (minutes > 16) {
        minutesStr = '30'
    }
    return String.prototype.padStart.call(hours, 2, '0') + ':' + minutesStr
}
function dayFormat(timeStamp: number): string {
    const date = new Date(new Date(timeStamp).setHours(0, 0, 0, 0))
    const nowDate = new Date(new Date().setHours(0, 0, 0, 0))

    const dateNum = date.valueOf()
    const nowDateNum = nowDate.valueOf()
    if (dateNum === nowDateNum) {
        return '今天'
    } else if (dateNum === nowDateNum - ONE_DAY) {
        return '昨天'
    }

    return String.prototype.padStart.call(date.getMonth() + 1, 2, '0') + '.' +
        String.prototype.padStart.call(date.getDate(), 2, '0') + ' 周' + ['末','一','二','三','四','五','六'][date.getDay()]

}
/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-14 08:40:09
 * @LastEditTime: 2020-10-17 16:58:07
 * @Description: file content
 */
interface Props {
    status: 'loading' | 'completed'
    section: HistorySection
    settings: Settings
}
const initState = () => ({
    refreshCount: 0
})
//#region Type Statement
type State = ReturnType<typeof initState>
type CtxPre = CtxDeS<EmptyObject, State>
//#endregion
const setup = (ctx: CtxPre) => {
    // const visits = new Map()

    // ctx.effect(() => {
    //     for (const label of settings.updQueue) {
    //         chrome.history.getVisits({ url: label.url }, (rst) => {
    //             rst.length > 0 && visits.set(rst[0].id, rst)
    //             console.log('visits', visits)
    //         })
    //     }
    // }, [])

    const settings = {
        updQueue: [] as HistoryItem[],
        visits: new Map<string, chrome.history.VisitItem[]>(),
        refCount: { current: 0 },
        refresh: () => ctx.setState({ refreshCount: ctx.state.refreshCount + 1 })
    }
    return settings
}
//#region Type Statement
export type MySettings = SettingsType<typeof setup>
type Ctx = CtxDeS<EmptyObject, State, MySettings>
//#endregion
const Section = ({ section, settings }: Props) => {
    const ctx = useConcent<EmptyObject, Ctx, NoMap>({ setup, state: initState })
    const { updQueue, visits, refCount, refresh } = ctx.settings

    let prevTimeStr = ''

    useEffect(() => {
        for (const label of updQueue) {
            chrome.history.getVisits({ url: label.url }, (rst) => {

                rst.length > 0 && visits.set(rst[0].id, rst)
                refCount.current--
                if (refCount.current === 0) {
                    refresh()
                }

            })
        }
    }, [section.status])
    // console.log('time', new Date(section.startTime), new Date(section.endTime), section.startTime - section.endTime)
    return (
        <ul className={c['section']} style={{ top: section.top }}>
            <li className={c['date']}>{dayFormat(section.startTime)}</li>
            {
                section.list.map((item) => {
                    const firstLabel = item.list[0]

                    let timeStr = ''
                    if (firstLabel.visitCount > 1) {
                        if (typeof firstLabel.visitTime === 'number') {
                            const list = visits.get(firstLabel.id)
                            if (Array.isArray(list)) {
                                const filter = list.filter(v => v.visitTime >= section.startTime && v.visitTime <= section.endTime)
                                // console.log('filter list', filter, list.length, filter.length === 0 && list.map(v => ([v.visitTime, v.visitTime >= section.startTime && v.visitTime <= section.endTime])), section.startTime, section.endTime)
                                firstLabel.visitTime = list.filter(v => v.visitTime >= section.startTime && v.visitTime <= section.endTime).pop()?.visitTime


                            } else {
                                firstLabel.visitTime = firstLabel.lastVisitTime
                            }
                        } else {
                            updQueue.push(firstLabel)
                            refCount.current++
                            firstLabel.visitTime = firstLabel.lastVisitTime
                        }
                    } else {
                        firstLabel.visitTime = firstLabel.lastVisitTime
                    }
                    if (typeof firstLabel.visitTime === 'number') {
                        timeStr = new Date().valueOf() - firstLabel.visitTime > 1000 * 60 * 60 * 3
                            ? timeFormat(firstLabel.visitTime)
                            : timeAgo.format(firstLabel.visitTime, 'twitter')
                        if (timeStr !== prevTimeStr) {
                            prevTimeStr = timeStr
                        } else {
                            timeStr = ''
                        }
                    }

                    // console.log('timeStr', timeStr)
                    return item.list.length > 1
                        ? <Domain key={item.list[0].lastVisitTime} list={item.list} timeStr={timeStr} settings={settings} />
                        : <Label key={item.list[0].lastVisitTime} item={item.list[0]} timeStr={timeStr} settings={settings} />
                })
            }
        </ul>
    )
}

export default memo(Section)
