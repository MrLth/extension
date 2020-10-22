import { BookmarkTreeNode } from 'models/bookmark/state'
import React from 'react'
import { Settings } from '.'
import FolderName from './FolderName'
import c from './index.module.scss'


interface Props {
    folders: BookmarkTreeNode[]
    settings: Settings
}
const FolderList = ({ folders,settings }: Props): JSX.Element => {
    return <ul className={c['folder-list']}>
        {
            folders?.map(v => <FolderName key={v.id} node={v} settings={settings} />)
        }
    </ul>
}

export default FolderList