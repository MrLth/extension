import { BookmarkTreeNode } from 'models/bookmark/state'
import React from 'react'
import FolderName from './FolderName'
import c from './index.module.scss'


interface Props {
    folders: BookmarkTreeNode[]
}
const FolderList = ({ folders }: Props): JSX.Element => {
    return <ul className={c['folder-list']}>
        {
            folders?.map(v => <FolderName key={v.id} label={v} />)
        }
    </ul>
}

export default FolderList