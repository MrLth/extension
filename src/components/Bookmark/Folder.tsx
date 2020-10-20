import React from 'react'
import c from './index.module.scss'

import folderSvg from '@img/folder.svg'
import { BookmarkTreeNode } from 'models/bookmark/state'

interface Props{
    label: BookmarkTreeNode
}
const Folder = ({label}:Props): JSX.Element => {
    return <div>
        <img src={folderSvg}/>
        {label.title}
    </div>
}

export default Folder