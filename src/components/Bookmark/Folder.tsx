import { BookmarkTreeNode } from 'models/bookmark/state'
import React from 'react'
import c from './index.module.scss'
import Label from './Label'


interface Props {
    node: BookmarkTreeNode
}
const Folder = ({ node }: Props): JSX.Element => {
    return <ul className={c['folder']} style={node.top ?{ position: 'absolute', top: node.top }:{}}>
        <li className={c['folder-title']}>{node.title}</li>
        {
            node.children.map(v => 'children' in v
                ? <Folder key={v.id} node={v} />
                : <Label key={v.id} node={v} />
            )
        }
    </ul>


}

export default Folder