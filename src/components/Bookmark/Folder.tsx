import { BookmarkTreeNode } from 'models/bookmark/state'
import React from 'react'
import { Settings } from '.'
import c from './index.module.scss'
import Label from './Label'


interface Props {
    node: BookmarkTreeNode
    settings: Settings
}
const Folder = ({ node ,settings}: Props): JSX.Element => {
    return <ul className={c['folder']} style={node.top ?{ position: 'absolute', top: node.top }:{}}>
        <li className={c['folder-title']}>{node.depth > 1 && node.parent.title + '/' }{node.title}</li>
        {
            node.children.map(v => 'children' in v
                ? <Folder key={v.id} node={v} settings={settings}/>
                : <Label key={v.id} node={v} settings={settings}/>
            )
        }
    </ul>


}

export default Folder