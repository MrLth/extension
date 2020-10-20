import { BookmarkTreeNode } from 'models/bookmark/state'
import React from 'react'
import Folder from './Folder'
import c from './index.module.scss'


interface Props {
    folders: BookmarkTreeNode[]
}
const FolderList = ({ folders }: Props): JSX.Element => {
    return <div className={c['folder-list']}>
        {
            folders?.map(v => <Folder label={v} />)
        }
    </div>
}

export default FolderList