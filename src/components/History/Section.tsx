import { EmptyObject } from 'api/type'
import { NoMap, SettingsType, useConcent } from 'concent'
import { HistorySection } from 'models/history/state'
import React, { memo, useEffect, useRef } from 'react'
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
const timeAgoFormat = (n: number): string => timeAgo.format(n, 'twitter')
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
        String.prototype.padStart.call(date.getDate(), 2, '0') + ' 周' + ['末', '一', '二', '三', '四', '五', '六'][date.getDay()]

}
/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-14 08:40:09
 * @LastEditTime: 2020-10-18 16:06:58
 * @Description: file content
 */


const initState = () => ({
    refreshCount: 0
})
//#region Type Statement
type State = ReturnType<typeof initState>
type CtxPre = CtxDeS<EmptyObject, State>
//#endregion
const setup = (ctx: CtxPre) => {
    const updQueue = [] as HistoryItem[]
    let updCount = 0
    const visits = new Map<string, chrome.history.VisitItem[]>()

    const settings = {
        setLabelVisitTime: (label: HistoryItem, section: HistorySection): void => {
            if (label.visitCount === 1) {
                label.visitTime = label.lastVisitTime
                return
            }

            if (label.isAddToQueue === undefined) {
                updQueue.push(label)
                updCount++
                label.isAddToQueue = true
                return
            }

            const list = visits.get(label.id)
            if (list === undefined) return

            const visitTime = list.filter(v => v.visitTime >= section.startTime && v.visitTime <= section.endTime).pop()?.visitTime
            if (visitTime === undefined) return

            label.visitTime = visitTime
        },
        updVisitTime: () => {
            for (const label of updQueue) {
                chrome.history.getVisits({ url: label.url }, (rst) => {
                    rst.length > 0 && visits.set(rst[0].id, rst)
                    updCount--
                    if (updCount === 0) {
                        ctx.setState({ refreshCount: ctx.state.refreshCount + 1 })
                    }
                })
            }
        }

    }
    return settings
}
//#region Type Statement
export type MySettings = SettingsType<typeof setup>
type Ctx = CtxDeS<EmptyObject, State, MySettings>
//#endregion
interface Props {
    status: 'loading' | 'completed'
    section: HistorySection
    endTime: number
    top: number
    settings: Settings
}
const Section = ({ section, settings, top }: Props) => {
    const ctx = useConcent<EmptyObject, Ctx, NoMap>({ setup, state: initState })
    const { updVisitTime, setLabelVisitTime } = ctx.settings
    const { refreshCount } = ctx.state

    const refPrevTimeStr = useRef<string>()
    refPrevTimeStr.current = ''

    useEffect(() => {
        if (section.status === 'completed') {
            updVisitTime()
        }
    }, [section.status])

    return (
        <ul className={c['section']} style={{ top }}>
            <li className={c['date']}>{dayFormat(section.startTime)}</li>
            {
                section.list.map((item) => {

                    const firstLabel = item.list[0]
                    setLabelVisitTime(firstLabel, section)

                    return item.list.length > 1
                        ? <Domain key={firstLabel.id} list={item.list} refreshCount={refreshCount} settings={settings} refPrevTimeStr={refPrevTimeStr} />
                        : <Label key={firstLabel.id} item={item.list[0]} refreshCount={refreshCount} settings={settings} refPrevTimeStr={refPrevTimeStr} />
                })
            }
        </ul>
    )
}

export default memo(Section)
