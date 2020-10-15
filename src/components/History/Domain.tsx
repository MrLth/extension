import { Settings } from '.'
import React, { memo } from 'react'
//#region Import Style
import c from './index.module.scss'
//#endregion
import Label from './Label'

import LabelNoFavIcon from './LabelNoFavIcon'

/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-14 08:40:09
 * @LastEditTime: 2020-10-14 14:26:24
 * @Description: file content
 */
interface Props {
	domain: string
	list: chrome.history.HistoryItem[]
	settings: Settings
}
const Domain = ({ domain, list, settings }: Props) => {

	let v = list[0]
	const jsxList = [<Label key={v.id} item={v} settings={settings} />]
	for (let i = 1, len = list.length; i < len; i++) {
		v = list[i]
		jsxList.push(<LabelNoFavIcon key={v.id} item={v} settings={settings}/>)
	}


	return (<li className={c['domain']}>
		{/* {
			list.length > 1
			&& <div className={c['domain-title']}>
				<div className={c['domain-name']}>{domain}</div>
				<div>{timeAgo.format(list[0].lastVisitTime)}</div>
			</div>
		} */}
		<ul>
			{jsxList}
		</ul>
	</li>
	)
}

export default memo(Domain)
