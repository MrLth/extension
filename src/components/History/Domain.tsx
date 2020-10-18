import { Settings } from '.'
import React, { memo, useMemo } from 'react'
//#region Import Style
import c from './index.module.scss'
//#endregion
import Label from './Label'

import LabelNoFavIcon from './LabelNoFavIcon'
import { Fn } from 'api/type'
import { HistoryItem } from './api'

/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-10-14 08:40:09
 * @LastEditTime: 2020-10-18 10:52:32
 * @Description: file content
 */
interface Props {
	list: HistoryItem[]
	refreshCount: number
	settings: Settings
	refPrevTimeStr: React.MutableRefObject<string>
}
const Domain = ({ list, settings, refreshCount, refPrevTimeStr }: Props) => {

	const jsxList = useMemo(() => {
		const jsxList = []
		for (let i = 1, len = list.length; i < len; i++) {
			const v = list[i]
			jsxList.push(<LabelNoFavIcon key={v.id} item={v} settings={settings} />)
		}
		return jsxList
	}, [list])


	return (
		<ul className={c['domain']} >
			<Label key={list[0].id} item={list[0]} refreshCount={refreshCount} settings={settings} refPrevTimeStr={refPrevTimeStr} />
			{jsxList}
		</ul>
	)
}

export default memo(Domain)
