import * as React from 'react';
import { useState, memo} from 'react';
import classNames = require('classnames');

import './index.scss';

import { Tab, CustomProps } from './api/type';

const DropDiv = memo(function DropDiv(props: { isHidden: boolean; dropCb: (dragTab: Tab & CustomProps) => void }) {
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