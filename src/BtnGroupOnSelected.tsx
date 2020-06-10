import { memo } from 'react'

import * as React from 'react'

import './index.scss'
// import { CustomProps, Tab } from './api/type'


const BtnGroupOnSelected = memo(function BtnGroupOnSelected(props: {
    cancelSelected:()=>void
}) {
    const { cancelSelected } = props
    return (
        <div>
            <button onClick={cancelSelected}>取消选择</button>
        </div>
    )
})

export default BtnGroupOnSelected