import { Settings } from '.'
import React, { memo } from 'react'
//#region Import Style
import c from './index.module.scss'
//#endregion
import Label from './Label'

import LabelNoFavIcon from './LabelNoFavIcon'
import { Fn } from 'api/type'

/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-14 08:40:09
 * @LastEditTime: 2020-10-16 16:49:21
 * @Description: file content
 */
interface Props {
	list: chrome.history.HistoryItem[]
	settings: Settings
}
const Domain = ({ list, settings }: Props) => {

	let v = list[0]
	const jsxList = [<Label key={v.id} item={v} settings={settings} />]
	for (let i = 1, len = list.length; i < len; i++) {
		v = list[i]
		jsxList.push(<LabelNoFavIcon key={v.id} item={v} settings={settings} />)
	}


	return (
		<ul className={c['domain']} >
			{ jsxList}
		</ul>
	)
}

export default memo(Domain)
