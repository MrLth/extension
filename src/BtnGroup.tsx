import { memo } from 'react'

import * as React from 'react'

import './index.scss'
import { CustomProps, Tab } from './api/type'


const BtnGroup = memo(function BtnGroup(props: {
	createWindow: () => void
	createWindowOnDropCb: (dragTab: Tab & CustomProps) => void
}) {
	const { createWindow, createWindowOnDropCb } = props
	return (
		<div>
			<input type="text" placeholder="搜索" />
			<button
				onClick={createWindow}
				onDragOver={(e) => {
					e.preventDefault()
				}}
				onDrop={(e) => {
					e.preventDefault()
					const tab = JSON.parse(e.dataTransfer.getData('text/plain'))
					createWindowOnDropCb(tab)

				}}
			>新窗口</button>
			<button>删除</button>
			<button>记录</button>
			<button>记录并删除</button>
			<button>分组</button>
		</div>
	)
})

export default BtnGroup