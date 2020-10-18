/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-14 08:40:09
 * @LastEditTime: 2020-10-18 14:40:47
 * @Description: file content
 */
import React, { memo } from 'react'
//#region Import Style
import c from './index.module.scss'
//#endregion
import circleSvg from '@img/circle.svg'
// import IconFont from 'components/IconFont'
import { Settings } from '.'

interface Props {
    item: chrome.history.HistoryItem
    settings: Settings
}
const LabelNoFavIcon = ({ item, settings }: Props) => {
    return (
        <li className={c['label']}>
            <div
                className={c['unit-tab']}
                onClick={() => settings.openLabel(item.url)}>
                <img src={circleSvg}/>
                {item.title === '' ? item.url : item.title}
            </div>
        </li>

    )

}

export default memo(LabelNoFavIcon)
