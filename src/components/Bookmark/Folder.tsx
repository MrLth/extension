import { BookmarkTreeNode } from 'components/Bookmark/model/state'
import React from 'react'
import { Settings } from '.'
import c from './index.module.scss'
import Label from './Label'

const assembleTitle = (node: BookmarkTreeNode): string => {
    return node.depth > 1 ? node.title + ' < ' + assembleTitle(node.parent) : node.title
}

interface Props {
    node: BookmarkTreeNode
    settings: Settings
}
const Folder = ({ node, settings }: Props): JSX.Element => {
    return <ul className={c['folder']} style={node.depth === 1 ? { position: 'absolute', top: node.top } : {}}>
        <li className={c['folder-title']}>{assembleTitle(node)}</li>
        {
            node.children.map(v => 'children' in v
                ? <Folder key={v.id} node={v} settings={settings} />
                : <Label key={v.id} node={v} settings={settings} />
            )
        }
    </ul>


}

export default Folder