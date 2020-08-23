import * as React from 'react'
import { useEffect, useMemo, useState, useCallback, useRef } from 'react'

import { BookmarkTreeNode, FaviconStorageObj } from '@store/bookmark/type'
import { useForceRender } from 'src/hooks'
import Label from './Label'
import classNames = require('classnames')

import imgFolder from '@img/folder.svg'
import { FaviconUpdDispatch } from '@store/record/type'
import { throttle } from '@api'

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

    const [ulLeft, setUlLeft] = useState('300px')

    const onMouseMoveListener = useCallback((e: React.MouseEvent) => {
        if (e.pageX < lastPageX.current) {
            setUlLeft(e.pageX + 40 + 'px')
            lastPageX.current = e.pageX
        }
    }, [])
    const onMouseLeaveListener = useCallback(() => {
        lastPageX.current = 300
    }, [])

    const lastPageX = useRef(300)

    return (
        <li className={classNames('folder', { "expand": isExpand })}
            onMouseMove={onMouseMoveListener}
            onMouseLeave={onMouseLeaveListener}
        >
            <ul style={{ left: ulLeft }}>
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
