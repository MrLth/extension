import { memo } from 'react'

import * as React from 'react'

import './index.scss'

import { Tab, CustomProps } from './api/type'
import PopupWindowTab from './PopupWindowTab'
import classNames = require('classnames')
// import classNames = require('classnames')

const PopupWindow = memo(function PopupWindow(props: {
	tabs: Array<Tab & CustomProps>
	windowId: string | number
	openTab: (tab: Tab & CustomProps) => void
	mousedownCb: (startWindow: number, startIndex: number, status: boolean) => void
	mouseupCb: (endWindow: number, endIndex: number) => void
	dragOverCb: (li: HTMLElement, isInsertBefore: boolean, windowId: number, tabIndex: number) => void
	closeWindow:(windowId:number)=>void
	closeTab:(tabId:number)=>void
	hiddenDropDiv:()=>void
	selectWindow: (windowIdKey: string | number)=>void
	attachInfo: chrome.windows.Window
}) {
	const { tabs, openTab, windowId, mousedownCb, mouseupCb, dragOverCb, closeTab, closeWindow, hiddenDropDiv, selectWindow, attachInfo} = props

	// console.log('🌀 Render    ', windowId)


	// console.log("attach Info", attachInfo);

	const tabArr = []

	for (let i = 0; i < tabs.length; i++) {


		let tab = tabs[i]
		let nextTab = i + 1 !== tabs.length && tabs[i + 1]

		const tempArr = []
		const key = tab.id
		const host = tab.userHost
		const favIconUrl = tab.favIconUrl

		if (nextTab.userHost === tab.userHost) {

			do {
				tempArr.push(
					<PopupWindowTab
						tab={tab}
						key={tab.id}
						windowId={windowId}
						index={i}
						openTab={openTab}
						mousedownCb={mousedownCb}
						mouseupCb={mouseupCb}
						dragOverCb={dragOverCb}
						closeTab={closeTab}
						hiddenDropDiv={hiddenDropDiv}
					/>
				)
				i++
				tab = nextTab
				nextTab = i + 1 !== tabs.length && tabs[i + 1]
			} while (nextTab.userHost === tab.userHost && i < tabs.length);

		}

		tempArr.push(
			<PopupWindowTab
				tab={tab}
				key={tab.id}
				windowId={windowId}
				index={i}
				openTab={openTab}
				mousedownCb={mousedownCb}
				mouseupCb={mouseupCb}
				dragOverCb={dragOverCb}
				closeTab={closeTab}
				hiddenDropDiv={hiddenDropDiv}
			/>
		)

		// tabArr.push({ tempArr, key, favIconUrl, host })
		tabArr.push(
			// <div className={classNames({ 'group': tempArr.length > 1 })} key={key}>
			< div className="group" key={key} >
				<div className="title">
					<img src={favIconUrl} />
					{host}
				</div>
				{tempArr}
			</ div>
		)

	}

	// tabArr.sort((a, b) => b.tempArr.length - a.tempArr.length)

	console.log('🌀 Window Render')
	return (
		<ul className={classNames("window", { "focused":attachInfo && attachInfo.focused})}>
			<h2 className="title">{windowId}
				<button onClick={() => { closeWindow(windowId as number)}}>关闭</button>
				<button onClick={() => { selectWindow(windowId)}}>选择</button>
				{attachInfo?.state}
			</h2>
			{
				tabArr
				// tabArr.map(({ tempArr, key, favIconUrl, host }) =>
				// 	<div className="group" key={key}>
				// 		<div className="title">
				// 			<img src={favIconUrl} />
				// 			{host}
				// 		</div>
				// 		{tempArr}
				// 	</div>
				// )
			}
		</ul>
	)
})

export default PopupWindow
