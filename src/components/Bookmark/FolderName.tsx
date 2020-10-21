import React from 'react'
import c from './index.module.scss'

import folderSvg from '@img/folder.svg'
import { BookmarkTreeNode } from 'models/bookmark/state'

interface Props{
    label: BookmarkTreeNode
}
const FolderName = ({label}:Props): JSX.Element => {
    return <li className={c['folder-name']}>
        <img src={folderSvg}/>
        {label.title}
    </li>
}

export default FolderName