import { BookmarkTreeNode } from 'components/Bookmark/model/state'
import React from 'react'
import c from './index.module.scss'
import defaultIcon from '@img/defaultIcon.svg'
import { Settings } from '.'

interface Props {
    node: BookmarkTreeNode
    settings: Settings
}
const Label = ({ node, settings }: Props): JSX.Element => {
    return <li
        className={c['label']}
        style={node.depth === 1 ? { position: 'absolute', top: node.top } : {}}
        onClick={() => settings.openTab(node.url)}
    >
        <div className={c['unit-tab']}>
            <img
                src={
                    node.url !== ''
                        ? `chrome://favicon/size/18@2x/${node.url}`
                        : defaultIcon
                }
            />
            {node.title === '' ? node.url : node.title}
        </div>
    </li>
}

export default Label