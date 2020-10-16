/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-14 08:40:09
 * @LastEditTime: 2020-10-16 16:52:29
 * @Description: file content
 */
import React, { memo } from 'react'
//#region Time Ago Init
import TimeAgo from 'javascript-time-ago'
import zh from 'javascript-time-ago/locale/zh'
TimeAgo.addLocale(zh)
const timeAgo = new TimeAgo('zh')
//#endregion
//#region Import Style
import c from './index.module.scss'
//#endregion
import defaultIcon from '@img/defaultIcon.svg'
// import IconFont from 'components/IconFont'
import { Settings } from '.'
import { HistoryItem } from './api'


function dateFormat(timeStamp: number): string {
    const date = new Date(timeStamp)
    const minutes = date.getMinutes()
    let hours = date.getHours()
    let minutesStr = '00'
    if (minutes > 46) {
        hours += 1
    } else if (minutes > 16) {
        minutesStr = '30'
    }
    return hours + ':' + minutesStr
}
interface Props {
    item: HistoryItem
    settings: Settings
}
const Label = ({ item, settings }: Props) => {
    console.log('item.visitTime', item.visitTime);

    return (
        <li className={c['label']}>
            <div
                className={c['unit-tab']}
                onClick={() => settings.openLabel(item.url)}>
                <img
                    src={
                        item.url !== ''
                            ? `chrome://favicon/size/18@2x/${item.url}`
                            : defaultIcon
                    }
                />
                {item.title}
            </div>
            <div className={c['time']}>
                {
                    new Date().valueOf() - item.visitTime > 1000 * 60 * 60 * 3
                        ? dateFormat(item.lastVisitTime)
                        : timeAgo.format(item.lastVisitTime)
                    /* {} */

                }
            </div>
        </li>

    )

}

export default memo(Label)
