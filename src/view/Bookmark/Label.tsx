/*
 * @Author: mrlthf11
 * @LastEditors: mrlthf11
 * @Date: 2020-06-19 16:25:32
 * @LastEditTime: 2020-06-23 12:12:05
 * @Description: file content
 */
import * as React from 'react'
import { BookmarkTreeNode, FaviconStorageObj } from '@store/bookmark/type'
import { useState, useContext, useEffect, memo } from 'react'
import { faviconUdpActionAdd } from '@store/bookmark/actions'
import { FaviconUpdDispatch } from '@store/record/type'
import { RecordContext } from '@store'
import { isLocal } from '@api'



const Label = memo(function Label(props: {
    node: BookmarkTreeNode
    faviconStorage: FaviconStorageObj
    faviconUpdDispatch: FaviconUpdDispatch
}): JSX.Element {
    const { node, faviconUpdDispatch, faviconStorage } = props

    const host = new URL(node.url).host
    const defaultSrc = isLocal(host) ? '' : `https://www.google.com/s2/favicons?domain=${host}`
    const [imgSrc, setImgSrc] = useState(() => faviconStorage[host] || defaultSrc)



    useEffect(() => {
        const src = faviconStorage[host] || defaultSrc
        setImgSrc(src)
    }, [faviconStorage])

    // console.log("---------------------------------Label render", isLocal(host));

    return (
        <li className="label" onClick={(e) => {
            window.location.href.includes("chrome-extension") ?
                window.open(node.url)
                :
                window.location.href = node.url;

            faviconUpdDispatch(faviconUdpActionAdd({
                host,
                updCb: (newSrc: string) => {
                    setImgSrc(newSrc)
                }
            }))
            e.stopPropagation()
        }}>
            <div className="title">
                <img src={imgSrc} alt="" />
                {node.title}
            </div>
            <div className="url">{node.url}</div>
        </li>
    )
})

export default Label
