/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-14 08:40:09
 * @LastEditTime: 2020-10-14 14:28:03
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

interface Props {
    item: chrome.history.HistoryItem
    settings: Settings
}
const Label = ({ item, settings }: Props) => {
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
                {timeAgo.format(item.lastVisitTime)}
            </div>
        </li>

    )

}

export default memo(Label)
