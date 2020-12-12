import React from 'react'

import folderSvg from '@img/folder.svg'
import folderOpenSvg from '@img/folder-open.svg'
import { BookmarkTreeNode } from 'models/bookmark/state'
import { Settings } from '.'
//#region 样式绑定
import c from './index.module.scss'
import { moduleClassnames } from 'utils'
const cn = moduleClassnames.bind(null, c)
//#endregion

import { SUB_NODE_PADDING_UNIT } from 'utils/const'

interface Props {
    node: BookmarkTreeNode
    settings: Settings
}
const FolderName = ({ node, settings }: Props): JSX.Element => {
    return node.folders.length > 0
        ? <>
            <li
                className={cn('folder-name', 'open')}
                style={{ paddingLeft: node.depth * SUB_NODE_PADDING_UNIT }}
                onMouseEnter={(e) => settings.scrollToShow(e, node)}
            >
                <img src={folderOpenSvg} />
                {node.title}
            </li>
            {
                node.folders.map(v => <FolderName key={v.id} node={v} settings={settings} />)
            }
        </>
        : <li
            className={c['folder-name']}
            style={{ paddingLeft: node.depth * SUB_NODE_PADDING_UNIT }}
            onMouseEnter={(e) => settings.scrollToShow(e, node)}
        >
            <img src={folderSvg} />
            {node.title}
        </li>
}

export default FolderName