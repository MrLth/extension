import { BookmarkTreeNode } from 'models/bookmark/state'
import React from 'react'
import c from './index.module.scss'
import defaultIcon from '@img/defaultIcon.svg'

interface Props {
    node: BookmarkTreeNode
}
const Label = ({ node }: Props): JSX.Element => {
    return <li className={c['label']} style={node.top ?{ position: 'absolute', top: node.top }:{}}>
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