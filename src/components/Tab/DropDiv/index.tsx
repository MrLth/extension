import * as React from 'react';
import { useState, memo } from 'react';
import classNames from 'classnames'

import './index.scss';

import { Tab } from 'api/type';

const DropDiv = memo(function DropDiv(props: { isHidden: boolean; dropCb: (dragTab: Tab) => void }) {
	const { isHidden, dropCb } = props
	const [dropDivDragOver, setDropDivDragOver] = useState(false)

	return (
		<div
			id='drop-div'
			className={classNames({ 'drag-over': dropDivDragOver, hide: isHidden })}
			onDragOver={(e) => {
				e.preventDefault()
				setDropDivDragOver(true)
			}}
			onDragLeave={() => {
				setDropDivDragOver(false)
			}}
			onDrop={(e) => {
				e.preventDefault()

				const tab = JSON.parse(e.dataTransfer.getData('text/plain'))
				dropCb(tab)
			}}
		/>
	)
})

export default DropDiv