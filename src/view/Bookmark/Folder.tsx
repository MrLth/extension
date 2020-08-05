import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'

import { BookmarkTreeNode, FaviconStorageObj } from '@store/bookmark/type'
import { useForceRender } from 'src/hooks'
import Label from './Label'
import classNames = require('classnames')

import imgFolder from '@img/folder.svg'
import { FaviconUpdDispatch } from '@store/record/type'

const Folder = (props: {
    node: BookmarkTreeNode
    path: string
    faviconStorage: FaviconStorageObj
    faviconUpdDispatch: FaviconUpdDispatch
}): JSX.Element => {
    const { node, path, faviconStorage, faviconUpdDispatch } = props
    const { renderCount, refRenderCount, setRenderCount } = useForceRender()
    useEffect(() => {
        setTimeout(() => {
            setRenderCount(refRenderCount.current + 1)
        }, 0)
    }, [])

    const list = useMemo(() => {
        if (0 != renderCount) {
            return (
                node.children.map((item) =>
                    item.children ?
                        <Folder node={item} path={path + "/" + node.id} faviconStorage={faviconStorage} faviconUpdDispatch={faviconUpdDispatch} />
                        :
                        <Label node={item} faviconStorage={faviconStorage} faviconUpdDispatch={faviconUpdDispatch} />
                )
            )
        }
        return null

    }, [renderCount, node])


    // list && console.log("tree", path + "/" + node.id, node.title);


    const [isExpand, setIsExpand] = useState(false)

    return (
        <li className={classNames('folder', { "expand": isExpand })}  >
            <ul>
                {list}
            </ul>
            <div className="folder-name" onClick={(e) => {
                setIsExpand(!isExpand)
                e.stopPropagation()
            }}>
                <img src={imgFolder} alt="" />
                {node.title}</div>
        </li>
    )
}

export default Folder
